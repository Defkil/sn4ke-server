
import {PlayerModelCreate, PlayerModelInterface} from "../../model/player/player.model.interface";
import {RoomCode, UserConnectionToken} from "../../model/room/room.model.interface";
import {RoomPlayerScore} from "../room/room.controller.interface";

export interface PlayerControllerInterface {
	create(params: PlayerModelCreate): void
	getBaseInfo(roomCode: RoomCode, token: UserConnectionToken): {
		name: string,
		colorId: number,
		connected: boolean,
	}
	getPlayersInfo(roomCode: RoomCode): RoomPlayerScore[]
	getFreeColorId(roomCode: RoomCode): number
	getFreeName(roomCode: RoomCode, name: string): string

	getPlayers(roomCode: RoomCode[]): {
		[key: RoomCode]: {
			[key: UserConnectionToken]: PlayerModelInterface
		}
	}
	getRoomFromPlayer(token: UserConnectionToken): RoomCode
	setupPlayers(rooms: RoomCode[]): void
}

export enum Direction {
	LEFT = 0,
	RIGHT = 1,
	UP = 2,
	DOWN = 3,
}
export enum ConnectionCommand {
	LEFT = Direction.LEFT,
	RIGHT = Direction.RIGHT,
	UP = Direction.UP,
	DOWN = Direction.DOWN,
	ACTION = 4,
}

export type SnakeData = {
	head:  { x: number, y: number },
	direction: Direction,
	snake: { x: number, y: number }[]
}
