import {RoomCode} from "../../model/room/room.model.interface";
import {GameMapModelInterface} from "../../model/game-map/game-map.model.interface";

export interface GameMapControllerInterface {
	generateMaps(rooms: {
		playerCount: number,
		room: RoomCode
	}[]): void
	getMaps(rooms: RoomCode[]): {
		[key: RoomCode]: GameMapModelInterface
	}
}
