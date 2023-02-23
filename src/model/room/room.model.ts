import {injectable} from "inversify";
import {
	Connection, RoomCode, RoomModelHandlerInterface, RoomModelInterface, RoomState, UserConnectionToken
} from "./room.model.interface";
import {RoomNotFoundError, SessionNotFoundError} from "../../controller/room/room.controller.interface";

class RoomModel implements RoomModelInterface {
	players: { [key: UserConnectionToken]: Connection } = {}
	screens: { [key: UserConnectionToken]: Connection } = {}
	state: RoomState = RoomState.EMPTY
	constructor(public code: RoomCode) { }
}

@injectable()
export class RoomModelHandler implements RoomModelHandlerInterface {

	rooms: {
		[key: RoomCode]: RoomModelInterface
	} = {}

	constructor() {
	}

	existRoom(roomCode: RoomCode): boolean {
		return !!this.rooms[roomCode]
	}

	create(roomCode: UserConnectionToken) {
		this.rooms[roomCode] = new RoomModel(roomCode)
	}

	allRoomCodes(): string[] {
		return Object.keys(this.rooms)
	}

	getRoom(roomCode: string): RoomModelInterface | null {
		const room = this.rooms[roomCode]
		if (!room) {
			return null
		}
		return room
	}

	isTokenPlayer(roomCode: string, token: UserConnectionToken): boolean {
		const room = this.getRoom(roomCode)
		if (!room) {
			throw new RoomNotFoundError()
		}
		return !!room.players[token]
	}
	isTokenScreen(roomCode: string, token: UserConnectionToken): boolean {
		const room = this.getRoom(roomCode)
		if (!room) {
			throw new RoomNotFoundError()
		}
		return !!room.screens[token]
	}

	isTokenInRoom(roomCode: string, token: UserConnectionToken): boolean {
		return this.isTokenPlayer(roomCode, token) || this.isTokenScreen(roomCode, token)
	}

	addConnection(roomCode: string, token: UserConnectionToken, isPlayer: boolean) {
		const room = this.getRoom(roomCode)
		if (!room) {
			throw new RoomNotFoundError()
		}
		if (isPlayer) {
			room.players[token] = { token, connected: false }
		} else {
			room.screens[token] = { token, connected: false }
		}
	}
	setConnected(roomCode: string, token: UserConnectionToken, isPlayer?: boolean) {
		if (!isPlayer) {
			isPlayer = this.isTokenPlayer(roomCode, token)
		}
		const room = this.getRoom(roomCode)
		if (!room) {
			throw new RoomNotFoundError()
		}
		if (isPlayer) {
			if (!room.players[token]) {
				throw new SessionNotFoundError()
			}
			room.players[token].connected = true
		} else {
			if (!room.screens[token]) {
				throw new SessionNotFoundError()
			}
			room.screens[token].connected = true
		}
	}
}

