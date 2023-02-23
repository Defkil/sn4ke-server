import {RoomCode, UserConnectionToken} from "../../model/room/room.model.interface";
import {GameModelInterface, GameStatus} from "../../model/game/game.model.interface";

/**
 * Game controller interface
 *
 * handles state of the game
 * @module Controller
 */
export interface GameControllerInterface {
	/**
	 * Start a new game
	 * @param room Room code
	 */
	start(room: RoomCode): void

	/**
	 * Add a player to the game
	 * @param room Room code
	 * @param name Player name
	 */
	addPlayer(room: string, name: string): {
		token: UserConnectionToken, name: string, colorId: number,
	}
	getRooms(rooms: RoomCode[]):  {
		[key: RoomCode]: GameModelInterface
	}
	setStatus(room: string, status: GameStatus): void
}
