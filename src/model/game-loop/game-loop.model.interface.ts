import {RoomCode} from "../room/room.model.interface";


export interface GameLoopModelHandlerInterface {
	create: (room: RoomCode) => void
	destroy(room: RoomCode): void
	areRoomsEmpty: () => boolean
	getAllRoomCodes(): RoomCode[]
}


export interface GameLoopModelInterface  {
	room: RoomCode
}
