/**
 * Room code to identify a room
 */
export type RoomCode = string;
/**
 * Token to identify a user
 */
export type UserConnectionToken = string


/**
 * Room state
 */
export enum RoomState {
	EMPTY = 'empty',
	STARTED = 'started',
	SCOREBOARD = 'scoreboard',
	COUNTDOWN = 'countdown',
}

export interface RoomModelHandlerInterface {
	isTokenInRoom(roomCode: string, token: UserConnectionToken): boolean
	create: (code: RoomCode) => void
	allRoomCodes(): string[]
	getRoom(roomCode: string): RoomModelInterface | null
	isTokenPlayer(roomCode: string, token: UserConnectionToken): boolean
	addConnection(roomCode: string, token: UserConnectionToken, isPlayer?: boolean): void
	setConnected(roomCode: string, token: UserConnectionToken, isPlayer?: boolean): void
	existRoom(roomCode: RoomCode): boolean
}

export interface RoomModelInterface {
	code: RoomCode;
	players: {
		[key: UserConnectionToken]: Connection
	}
	state: RoomState
	screens:{
		[key: UserConnectionToken]: Connection
	}
}

export type Connection = {
	token: UserConnectionToken,
	connected: boolean
}
