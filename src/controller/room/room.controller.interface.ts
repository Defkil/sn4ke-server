import {UserConnectionToken} from "../../model/room/room.model.interface";

export type RoomPlayer = {
	name: string,
	colorId: number,
}


export type RoomPlayerScore = RoomPlayer & {
	score: number,
}

export interface RoomControllerInterface {
	create: (name?: string) => Promise<{token: UserConnectionToken, roomCode: string, name?: string, colorId?: number}>
	isSessionActive(roomCode: string, token: UserConnectionToken): Promise<boolean>
	join(roomCode: string, name?: string): Promise<{token: UserConnectionToken, name?: string, colorId?: number}>
	connect(roomCode: string, token: UserConnectionToken): Promise<{scores: ScoreType[], players: RoomPlayer[]}>
}

export interface ScoreType {
	score: number;
	name: string;
}
export class RoomNotFoundError extends Error {
	static readonly message = 'Room not found';
	constructor() {
		super(RoomNotFoundError.message);
		Object.setPrototypeOf(this, RoomNotFoundError.prototype);
	}
}

export class SessionNotFoundError extends Error {
	static readonly message = 'User not found';
	constructor() {
		super(SessionNotFoundError.message);
		Object.setPrototypeOf(this, SessionNotFoundError.prototype);
	}
}

export class MaxPlayersReachedError extends Error {
	static readonly message = 'Max players reached';
	constructor() {
		super(MaxPlayersReachedError.message);
		Object.setPrototypeOf(this, MaxPlayersReachedError.prototype);
	}
}
