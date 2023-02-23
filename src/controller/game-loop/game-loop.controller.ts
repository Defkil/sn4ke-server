import {GameLoopControllerInterface, LoopData} from "./game-loop.controller.interface";
import {inject, injectable} from "inversify";
import TYPES from "../../inversify.types";
import {GameLoopModelHandlerInterface} from "../../model/game-loop/game-loop.model.interface";
import {GameControllerInterface} from "../game/game.controller.interface";
import {GameMapControllerInterface} from "../game-map/game-map.controller.interface";
import {PlayerControllerInterface} from "../player/player.controller.interface";
import {GameModelInterface, GameStatus} from "../../model/game/game.model.interface";
import {ServerToolsInterface} from "../../tools/server/server.tools.interface";

@injectable()
export class GameLoopController implements GameLoopControllerInterface {
	private interval: NodeJS.Timeout | null = null

	private active: boolean = false


	constructor(
		@inject(TYPES.MODEL.GAME_LOOP) private gameLoopModel: GameLoopModelHandlerInterface,
		@inject(TYPES.CONTROLLER.GAME) private gameController: GameControllerInterface,
		@inject(TYPES.CONTROLLER.GAME_MAP) private gameMapController: GameMapControllerInterface,
		@inject(TYPES.CONTROLLER.PLAYER) private playerController: PlayerControllerInterface,
		@inject(TYPES.TOOLS.SERVER) private serverTools: ServerToolsInterface,
	) {}

	addRoom(room: string): void {
		if(!this.active) {
			this.active = true
			this.startGameLoop()
		}
		this.gameLoopModel.create(room)
	}

	removeRoom(room: string): void {
		this.gameLoopModel.destroy(room)
		if(this.gameLoopModel.areRoomsEmpty()) {
			this.active = false
			this.stopGameLoop()
		}
	}

	private startGameLoop() {
		this.interval = setInterval(() => {
			this.gameLoop()
		}, 500)
		this.gameLoop()
	}

	private stopGameLoop() {
		if(this.interval) {
			clearInterval(this.interval)
		}
	}

	private sendStatus(roomCode: string, status: GameStatus) {
		this.serverTools.wsBroadcast(roomCode, 'status', status)
	}
	private gameLoop() {
		const activeRoomCodes = this.gameLoopModel.getAllRoomCodes()
		const games = this.gameController.getRooms(activeRoomCodes)
		const maps = this.gameMapController.getMaps(activeRoomCodes)
		const players = this.playerController.getPlayers(activeRoomCodes)

		const stepsLoopData: {
			[key in GameStatus]?: LoopData[]
		} = {}

		for (let i = 0; i < activeRoomCodes.length; i++) {
			const roomCode = activeRoomCodes[i]
			const game = games[roomCode]
			let step = stepsLoopData[game.gameStatus]
			if (!step) {
				step = []
			}
			step.push({
				room: roomCode,
				game: game,
				map: maps[roomCode],
				Players: players[roomCode]
			})
			stepsLoopData[game.gameStatus] = step
		}


		for (const key in stepsLoopData) {
			const gameStatus = key as unknown as GameStatus
			const step = stepsLoopData[gameStatus]
			if(step) {
				this.sendStatus(step[0].room, gameStatus)
				this.stepsHandler[gameStatus](step)
			}
		}
	}


	private stepsHandler: {
		[key in GameStatus]: (data: LoopData[]) => void
	} = {
		[GameStatus.INIT]: (data: LoopData[]) => {
			this.gameMapController.generateMaps(data.map(d => {
				return {
					room: d.room,
					playerCount: Object.keys(d.Players).length
				}
			}))
			for (let i = 0; i < data.length; i++) {
				this.gameController.setStatus(data[i].room, GameStatus.COUNTDOWN_5)
			}
		},
		[GameStatus.COUNTDOWN_5]: (data: LoopData[]) => {
			this.playerController.setupPlayers(data.map(d => d.room))
			this.countdown(data.map(d => d.game), GameStatus.COUNTDOWN_5, GameStatus.COUNTDOWN_4)
		},
		[GameStatus.COUNTDOWN_4]: (data: LoopData[]) => {
			// set powerups
			this.countdown(data.map(d => d.game), GameStatus.COUNTDOWN_4, GameStatus.COUNTDOWN_3)
		},
		[GameStatus.COUNTDOWN_3]: (data: LoopData[]) => {
			// connect players and powerups with map
			this.countdown(data.map(d => d.game), GameStatus.COUNTDOWN_3, GameStatus.COUNTDOWN_2)
		},
		[GameStatus.COUNTDOWN_2]: (data: LoopData[]) => {
			// send map to client
			this.countdown(data.map(d => d.game), GameStatus.COUNTDOWN_2, GameStatus.COUNTDOWN_1)
		},
		[GameStatus.COUNTDOWN_1]: (data: LoopData[]) => this.countdown(data.map(d => d.game), GameStatus.COUNTDOWN_1, GameStatus.COUNTDOWN_5),
		[GameStatus.PLAYING]: (data: LoopData[]) => {},
		[GameStatus.WAITING]: () => {},

	}

	private countdown(game: GameModelInterface[], enumCountdown: GameStatus, enumNext: GameStatus) {
		for (let i = 0; i < game.length; i++) {
			const room = game[i].room
			setTimeout(() => {
				this.gameController.setStatus(room, enumNext)
			}, 1000)
		}
	}

}
