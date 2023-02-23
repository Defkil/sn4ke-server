import {RoomCode} from "../room/room.model.interface";

export enum GameStatus {
	INIT,
	PLAYING,
	WAITING,
	COUNTDOWN_5,
	COUNTDOWN_4,
	COUNTDOWN_3,
	COUNTDOWN_2,
	COUNTDOWN_1,
}

export interface GameModelHandlerInterface {
	create: (room: RoomCode) => void
	getRooms(rooms: RoomCode[]): {
		[key: RoomCode]: GameModelInterface
	}
	getStatus(room: RoomCode): GameStatus
	setStatus(room: RoomCode, status: GameStatus): void
}


export interface GameModelInterface  {
	gameStatus: GameStatus
	room: RoomCode
}
