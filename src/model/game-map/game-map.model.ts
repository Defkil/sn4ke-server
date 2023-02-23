import {
	FieldType, GameFieldElement, GameMapModelCreate, GameMapModelHandlerInterface, GameMapModelInterface
} from "./game-map.model.interface";
import {injectable} from "inversify";
import {RoomCode} from "../room/room.model.interface";

class GameMapModel implements GameMapModelInterface {

	constructor(public width: number, public height: number, public room: RoomCode, public map: GameFieldElement[][]) {
	}

}

@injectable()
export class GameMapModelHandler implements GameMapModelHandlerInterface {
	maps: {
		[key: RoomCode]: GameMapModelInterface
	} = {}
	getMaps(rooms: RoomCode[]): {
		[key: RoomCode]: GameMapModelInterface
	} {
		const maps: { [key: RoomCode]: GameMapModelInterface } = {};
		for (const room of rooms) {
			if (this.maps[room]) {
				maps[room] = this.maps[room];
			}
		}
		return maps;
	}
	cachedEmptyMaps: {
		//width and height
		[key: string]: GameFieldElement[][]
	} = {}
	generateMaps(rooms: {
		width: number,
		height: number,
		room: RoomCode
	}[]) {
		for (const room of rooms) {
			const key = `${room.width}:${room.height}`
			if (!this.cachedEmptyMaps[key]) {
				this.cachedEmptyMaps[key] = this.generateEmptyMap(room.width, room.height)
			}
			this.maps[room.room] = new GameMapModel(room.width, room.height, room.room, this.cachedEmptyMaps[key])
		}
	}

	private generateEmptyMap(width: number, height: number): GameFieldElement[][] {
		const map: GameFieldElement[][] = [];
		for (let i = 0; i < height; i++) {
			map[i] = [];
			for (let j = 0; j < width; j++) {
				map[i][j] = {
					type: FieldType.EMPTY,
				};
			}
		}
		return map;
	}
}
