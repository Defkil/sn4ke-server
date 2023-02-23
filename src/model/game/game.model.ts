import {injectable} from "inversify";
import {GameModelHandlerInterface, GameModelInterface, GameStatus} from "./game.model.interface";
import {RoomCode} from "../room/room.model.interface";
import {RoomNotFoundError} from "../../controller/room/room.controller.interface";

class GameModel implements GameModelInterface {
	gameStatus: GameStatus = GameStatus.WAITING
	constructor(
		public room: RoomCode
	) {
	}
}

@injectable()
export class GameModelHandler implements GameModelHandlerInterface {
	game: {
		[key: RoomCode]: GameModel
	} = {}
	create(room: RoomCode): void {
		this.game[room] = new GameModel(room)
	}
	getRooms(rooms: RoomCode[]): {
		[key: string]: GameModel
	} {
		const roomModels: { [key: string]: GameModel } = {};
		for (const room of rooms) {
			if (this.game[room]) {
				roomModels[room] = this.game[room];
			}
		}
		return roomModels;
	}
	setStatus(room: RoomCode, status: GameStatus): void {
		const game = this.game[room]
		if (!game) {
			throw new RoomNotFoundError()
		}
		game.gameStatus = status
	}
	getStatus(room: RoomCode): GameStatus {
		const game = this.game[room]
		if (!game) {
			throw new RoomNotFoundError()
		}
		return game.gameStatus
	}
}
