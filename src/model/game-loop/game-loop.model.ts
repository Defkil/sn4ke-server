import {injectable} from "inversify";
import {RoomCode} from "../room/room.model.interface";
import {GameLoopModelHandlerInterface, GameLoopModelInterface} from "./game-loop.model.interface";

class GameLoopModel implements GameLoopModelInterface {
	constructor(
		public room: RoomCode
	) {
	}
}

@injectable()
export class GameLoopModelHandler implements GameLoopModelHandlerInterface {
	game: {
		[key: string]: GameLoopModel
	} = {}
	create(room: RoomCode): void {
		this.game[room] = new GameLoopModel(room)
	}
	destroy(room: RoomCode): void {
		delete this.game[room]
	}
	areRoomsEmpty(): boolean {
		return Object.keys(this.game).length === 0
	}

	getAllRoomCodes(): RoomCode[] {
		return Object.keys(this.game) as RoomCode[]
	}
}
