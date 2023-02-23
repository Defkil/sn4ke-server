import {GameMapControllerInterface} from "./game-map.controller.interface";
import {inject, injectable} from "inversify";
import TYPES from "../../inversify.types";
import {GameMapModelHandlerInterface, GameMapModelInterface} from "../../model/game-map/game-map.model.interface";
import {RoomCode} from "../../model/room/room.model.interface";


export const PLAYER_COUNT_TO_MAP = new Map<number, {
	width: number,
	height: number
}>([
	[1, {
		width: 10,
		height: 10
	}],
	[2, {
		width: 10,
		height: 10
	}],
	[3, {
		width: 10,
		height: 10
	}],
])
@injectable()
export class GameMapController implements GameMapControllerInterface {
	constructor(@inject(TYPES.MODEL.GAME_MAP) private gameMapModelHandler: GameMapModelHandlerInterface,) {
	}

	generateMaps(rooms: {
		playerCount: number, room: RoomCode
	}[]) {
		this.gameMapModelHandler.generateMaps(rooms.map(room => {
			const map = PLAYER_COUNT_TO_MAP.get(room.playerCount)
			if (!map) {
				throw new Error(`No map for player count ${room.playerCount}`)
			}
			return {
				room: room.room,
				width: map.width,
				height: map.height
			}
		}))
	}

	getMaps(rooms: RoomCode[]): {
		[key: RoomCode]: GameMapModelInterface
	} {
		return this.gameMapModelHandler.getMaps(rooms)
	}


}
