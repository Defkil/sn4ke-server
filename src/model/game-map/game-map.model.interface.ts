import {RoomCode} from "../room/room.model.interface";

export enum FieldType {
	EMPTY = 'empty',
	PLAYER = 'player',
	POWERUP = 'powerup'
}

export type GameFieldPlayerIndex = number
export type GameFieldPowerUpIndex = number


export type GameFieldElement = {
	type: FieldType.EMPTY
} | {
	type: FieldType.PLAYER
	data: GameFieldPlayerIndex
} | {
	type: FieldType.POWERUP
	data: GameFieldPowerUpIndex
}


export interface GameMapModelHandlerInterface {
	getMaps(rooms: RoomCode[]): {
		[key: RoomCode]: GameMapModelInterface
	}
	generateMaps(rooms: {
					 width: number,
					 height: number,
					 room: RoomCode
				 }[]): void
}

export type GameMapModelCreate = {
	width: number,
	height: number,
	room: RoomCode
}

export interface GameMapModelInterface extends GameMapModelCreate {
	map: GameFieldElement[][]
}
