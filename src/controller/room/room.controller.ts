import {inject, injectable} from "inversify";
import {
	MaxPlayersReachedError,
	RoomControllerInterface,
	RoomNotFoundError, RoomPlayer, RoomPlayerScore,
	ScoreType,
	SessionNotFoundError
} from "./room.controller.interface";
import TYPES from "../../inversify.types";
import {
	RoomModelHandlerInterface,
	RoomModelInterface,
	UserConnectionToken,
} from "../../model/room/room.model.interface";
import * as crypto from "crypto";
import {PlayerModelHandlerInterface, PlayerModelInterface} from "../../model/player/player.model.interface";
import {PlayerControllerInterface} from "../player/player.controller.interface";
import {CodeGeneratorControllerInterface} from "../code-generator/code-generator.controller.interface";
import {DotenvToolsInterface} from "../../tools/dotenv/dotenv.tools.interface";
import {ServerToolsInterface} from "../../tools/server/server.tools.interface";
import {MsgCoderControllerInterface} from "../msg-coder/msg-coder.controller.interface";
import {GameControllerInterface} from "../game/game.controller.interface";
import {GameLoopControllerInterface} from "../game-loop/game-loop.controller.interface";
const ROOM_CODE_LENGTH = 3;



@injectable()
export class RoomController implements RoomControllerInterface {
	constructor(
		@inject(TYPES.MODEL.ROOM) private roomModelFactory: RoomModelHandlerInterface,
		@inject(TYPES.CONTROLLER.PLAYER) private playerController: PlayerControllerInterface,
		@inject(TYPES.CONTROLLER.CODE_GENERATOR) private codeGeneratorController: CodeGeneratorControllerInterface,
		@inject(TYPES.TOOLS.DOTENV) protected env: DotenvToolsInterface,
		@inject(TYPES.TOOLS.SERVER) private server: ServerToolsInterface,
		@inject(TYPES.CONTROLLER.MSG_CODER) private msgCoderController: MsgCoderControllerInterface,
		@inject(TYPES.CONTROLLER.GAME) private gameController: GameControllerInterface,

		@inject(TYPES.CONTROLLER.GAME_LOOP) private gameLoopController: GameLoopControllerInterface,
	) {}
	async create(name?: string): Promise<{token: UserConnectionToken, roomCode: string, name?: string, colorId?: number}> {
		const roomCode = this.codeGeneratorController.roomCode(Object.keys(this.roomModelFactory.allRoomCodes()))
		this.roomModelFactory.create(roomCode)
		const response = {
			roomCode,
			...await this.join(roomCode, name, true)
		}

		return response
	}
	async join(roomCode: string, name?: string, roomExist = false): Promise<{token: UserConnectionToken, name?: string, colorId?: number}> {
		if (!roomExist && !this.roomModelFactory.existRoom(roomCode)) {
			throw new RoomNotFoundError()
		}
		const isPlayer = !!name

		let resName: string | undefined
		let colorId: number | undefined
		let token: string

		if (!!name) {
			const createdGamePlayer = this.gameController.addPlayer(roomCode, name)
			resName = createdGamePlayer.name
			colorId = createdGamePlayer.colorId
			token = createdGamePlayer.token
		} else {
			token = crypto.randomUUID() //todo move to controller
		}

		this.roomModelFactory.addConnection(roomCode, token, isPlayer)

		return {
			token: token,
			name: resName,
			colorId: colorId
		}
	}

	async isSessionActive(roomCode: string, token: UserConnectionToken): Promise<boolean> {
		return this.roomModelFactory.isTokenInRoom(roomCode, token)
	}

	async connect(roomCode: string, token: UserConnectionToken) {
		const room = this.roomModelFactory.getRoom(roomCode)
		if (!room) {
			throw new RoomNotFoundError()
		}
		const isPlayer = this.roomModelFactory.isTokenPlayer(roomCode, token)
		if (isPlayer) {
			const player = this.playerController.getBaseInfo(roomCode, token)
			if (Object.keys(room.players).length === 1) {
				// setup room
				this.gameController.start(roomCode)
				this.gameLoopController.addRoom(roomCode)
			} else if (!player.connected) {
				this.server.wsBroadcast(roomCode, 'PlayerJoined', this.msgCoderController.encodePlayer(player))
				this.roomModelFactory.setConnected(roomCode, token, isPlayer)
			}
		}
		const playerInfo = this.playerController.getPlayersInfo(roomCode)

		const scores: ScoreType[] = []
		const players: RoomPlayer[] = []

		for (const player of playerInfo) {
			scores.push({
				name: player.name,
				score: player.score,
			})
			players.push({
				name: player.name,
				colorId: player.colorId
			})
		}

		return {
			scores: scores,
			players: players
		}
	}
}
