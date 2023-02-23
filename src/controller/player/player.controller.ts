import {inject, injectable} from "inversify";
import {PlayerControllerInterface} from "./player.controller.interface";
import TYPES from "../../inversify.types";
import {
	PlayerModelCreate,
	PlayerModelHandlerInterface,
	PlayerModelInterface
} from "../../model/player/player.model.interface";
import {RoomCode, UserConnectionToken} from "../../model/room/room.model.interface";
import {DotenvToolsInterface} from "../../tools/dotenv/dotenv.tools.interface";
import {getSnakePositions} from "./player.generate-positions";

@injectable()
export class PlayerController implements PlayerControllerInterface {
	constructor(
		@inject(TYPES.MODEL.PLAYER) private playerModelFactory: PlayerModelHandlerInterface,
		@inject(TYPES.TOOLS.DOTENV) protected env: DotenvToolsInterface,
	) {
	}

	create(params: PlayerModelCreate) {
		return this.playerModelFactory.create(params)
	}
	getBaseInfo(roomCode: RoomCode, token: UserConnectionToken): {
		name: string,
		colorId: number,
		connected: boolean,
	} {
		return this.playerModelFactory.getPlayerData<['name', 'colorId', 'connected']>(roomCode, token)
	}

	MAX_COLOR_ID = Number(this.env.GAME_MAX_PLAYERS) - 1
	getFreeColorId(roomCode: RoomCode): number {
		const players = this.playerModelFactory.getPlayerDataInRoom<['colorId']>(roomCode)
		const usedColorIds = players.map(player => player.colorId)
		for (let i = 0; i < this.MAX_COLOR_ID; i++) {
			if (!usedColorIds.includes(i)) {
				return i
			}
		}
		throw new Error('No free color id')
	}

	getFreeName(roomCode: RoomCode, name: string): string {
		const players = this.playerModelFactory.getPlayerDataInRoom<['name']>(roomCode)
		const usedNames = players.map(player => player.name)
		if (!usedNames.includes(name)) {
			return name
		}
		let i = 1
		while (true) {
			const newName = `${name} ${i}`
			if (!usedNames.includes(newName)) {
				return newName
			}
			i++
		}
	}

	getPlayersInfo(roomCode: RoomCode) {
		return this.playerModelFactory.getPlayerDataInRoom<['name', 'colorId', 'score']>(roomCode)
	}
	getPlayers(roomCode: RoomCode[]){
		return this.playerModelFactory.getPlayers(roomCode)
	}

	getRoomFromPlayer(token: UserConnectionToken): RoomCode {
		return this.playerModelFactory.getRoomFromPlayer(token)
	}

	setupPlayers(rooms: RoomCode[]) {
		const playerCounts = this.playerModelFactory.getPlayerCounts(rooms)
		const snakePositions = getSnakePositions(rooms.map(room => {
			return {
				room,
				playerCount: playerCounts[room],
			}
		}))
		for (const room of rooms) {
			this.playerModelFactory.setupPlayers(room, snakePositions[room])
		}
	}
}
