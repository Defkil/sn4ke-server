import {RoomCode, UserConnectionToken} from "../room/room.model.interface";
import {Direction, SnakeData} from "../../controller/player/player.controller.interface";

export enum UserInputs {
	EMPTY = 0,
	UP = 1,
	DOWN = 2,
	LEFT = 3,
	RIGHT = 4,
	ACTION = 5,
}

export interface PlayerModelHandlerInterface {
	create: (params: PlayerModelCreate) => void

	getPlayerData<T extends (keyof PlayerModelInterface)[]>(
		roomCode: RoomCode,
		token: UserConnectionToken,
	): Pick<PlayerModelInterface, T[number]>

	getPlayerDataInRoom<T extends (keyof PlayerModelInterface)[]>(
		roomCode: RoomCode,
	): Pick<PlayerModelInterface, T[number]>[]

	getPlayers(roomCode: RoomCode[]): {
		[key: RoomCode]: {
			[key: UserConnectionToken]: PlayerModelInterface
		}
	}
	getRoomFromPlayer(token: UserConnectionToken): RoomCode
	getPlayerCounts(rooms: RoomCode[]): {
		[key: RoomCode]: number
	}
	setupPlayers(roomCode: RoomCode, data: SnakeData[]): void
}

export type PlayerModelCreate = {
	token: UserConnectionToken,
	roomCode: RoomCode
	name: string,
	colorId: number,
}

export interface PlayerModelInterface extends PlayerModelCreate {
	score: number;
	connected: boolean;
	length: number,
	activePowerUpIndex: number,
	head: {
		x: number,
		y: number,
	}
	alive: boolean,
	direction: Direction,
	userInput: UserInputs,
	snake: { x: number, y: number }[]
}

