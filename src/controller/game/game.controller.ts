import {GameControllerInterface} from "./game.controller.interface";
import {inject, injectable} from "inversify";
import TYPES from "../../inversify.types";
import {PlayerControllerInterface} from "../player/player.controller.interface";
import {RoomCode, UserConnectionToken} from "../../model/room/room.model.interface";
import crypto from "crypto";
import {GameModelHandlerInterface, GameModelInterface, GameStatus} from "../../model/game/game.model.interface";
import {ServerToolsInterface} from "../../tools/server/server.tools.interface";

/**
 * @module ControllerImpl
 * @implements {GameControllerInterface}
 */
@injectable()
export class GameController implements GameControllerInterface {
	constructor(
		@inject(TYPES.MODEL.GAME) private gameModel: GameModelHandlerInterface,
		@inject(TYPES.CONTROLLER.PLAYER) private playerController: PlayerControllerInterface,
		@inject(TYPES.TOOLS.SERVER) private serverTools: ServerToolsInterface
	) {
		this.serverTools.socket.addHandler('startGame', (data) => {
			const roomCode = this.playerController.getRoomFromPlayer(data.token)
			const roomStatus = this.gameModel.getStatus(roomCode)
			if(roomStatus === GameStatus.WAITING) {
				this.gameModel.setStatus(roomCode, GameStatus.INIT)
			} else {
				//todo log weird behaviour
			}
		})
	}

	start(room: string): void {
		this.gameModel.create(room)
		// add game to game loop
	}

	destroy(room: string): void {
		// remove game from game loop
	}

	addPlayer(room: string, name: string): {
		token: UserConnectionToken, name: string, colorId: number,
	} {
		const colorId = this.playerController.getFreeColorId(room)
		const resName = this.playerController.getFreeName(room, name)
		const token = crypto.randomUUID() // todo move to controller
		this.playerController.create({
			roomCode: room, token, name: resName, colorId,
		})
		return {
			token, name: resName, colorId,
		}
	}

	getRooms(rooms: RoomCode[]): {
		[key: RoomCode]: GameModelInterface
	} {
		return this.gameModel.getRooms(rooms)
	}

	setStatus(room: string, status: GameStatus) {
		this.gameModel.setStatus(room, status)
	}
}
