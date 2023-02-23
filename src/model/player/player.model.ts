import {injectable} from "inversify";
import {
	PlayerModelCreate,
	PlayerModelHandlerInterface,
	PlayerModelInterface, UserInputs
} from "./player.model.interface";
import {RoomCode, UserConnectionToken} from "../room/room.model.interface";
import {SessionNotFoundError} from "../../controller/room/room.controller.interface";
import {SnakeData} from "../../controller/player/player.controller.interface";

class PlayerModel implements PlayerModelInterface {
	score: number = 0;
	connected: boolean = false;
	//todo add color schema
	constructor(
		public token: UserConnectionToken,
		public roomCode: RoomCode,
		public name: string,
		public colorId: number,
	) {}
	activePowerUpIndex = -1;
	head: {
		x: number,
		y: number,
	} = {
		x: -1,
		y: -1,
	}
	snake: {
		x: number,
		y: number,
	}[] = [];
	length = this.snake.length;
	alive = false;
	direction = -1;
	userInput = UserInputs.EMPTY;

}

@injectable()
export class PlayerModelHandler implements PlayerModelHandlerInterface {
	private socketToRoom: Map<UserConnectionToken, RoomCode> = new Map()
	player: {
		[key: RoomCode]: {
			[key: UserConnectionToken]: PlayerModelInterface
		}
	} = {}
	create(params: PlayerModelCreate): void {
		if (!this.player[params.roomCode]) {
			this.player[params.roomCode] = {}
		}
		this.player[params.roomCode][params.token] = new PlayerModel(
			params.token,
			params.roomCode,
			params.name,
			params.colorId,
		)
		this.socketToRoom.set(params.token, params.roomCode)
	}

	getRoomFromPlayer(token: UserConnectionToken): RoomCode {
		const room = this.socketToRoom.get(token)
		if (!room) {
			throw new SessionNotFoundError()
		}
		return room
	}

	getPlayerDataInRoom<T extends (keyof PlayerModelInterface)[]>(
		roomCode: RoomCode,
	): Pick<PlayerModelInterface, T[number]>[] {
		if (!this.player[roomCode]) {
			return []
		}
		return Object.values(this.player[roomCode])
	}

	getPlayerData<T extends (keyof PlayerModelInterface)[]>(
		roomCode: RoomCode,
		token: UserConnectionToken,
	): Pick<PlayerModelInterface, T[number]> {
		return this.player[roomCode][token]
	}

	getPlayers(roomCode: RoomCode[]){
		const playersModel: {
			[key: RoomCode]: {
				[key: UserConnectionToken]: PlayerModelInterface
			}
		} = {}
		roomCode.forEach((roomCode) => {
			if (!this.player[roomCode]) {
				throw new SessionNotFoundError()
			}
			playersModel[roomCode] = this.player[roomCode]
		} )
		return playersModel
	}
	getPlayerCounts(rooms: RoomCode[]) {
		const playerCount: {
			[key: RoomCode]: number
		} = {}
		rooms.forEach((roomCode) => {
			if (!this.player[roomCode]) {
				playerCount[roomCode] = 0
			} else {
				playerCount[roomCode] = Object.keys(this.player[roomCode]).length
			}
		})
		return playerCount
	}
	setupPlayers(roomCode: RoomCode, data: SnakeData[]) {
		if (!this.player[roomCode]) {
			throw new SessionNotFoundError()
		}
		const tokens = Object.keys(this.player[roomCode])
		for (let i = 0; i < data.length; i++) {
			const token = tokens[i]
			Object.assign(this.player[roomCode][token], data[i], {
				alive: true,
			})
		}
	}
}
