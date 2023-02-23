import {GameModelInterface} from "../../model/game/game.model.interface";
import {GameMapModelInterface} from "../../model/game-map/game-map.model.interface";
import {UserConnectionToken} from "../../model/room/room.model.interface";
import {PlayerModelInterface} from "../../model/player/player.model.interface";

export type LoopData = {
	room: string,
	game: GameModelInterface,
	map: GameMapModelInterface,
	Players: {
		[key: UserConnectionToken]: PlayerModelInterface
	}
}


export interface GameLoopControllerInterface {
	addRoom(room: string): void
	removeRoom(room: string): void
}
