import {inject, injectable} from "inversify";
import {UiInterface} from "../ui.interface";
import TYPES from "../../inversify.types";
import {ServerToolsInterface} from "../../tools/server/server.tools.interface";
import {
	RoomControllerInterface, RoomNotFoundError, SessionNotFoundError
} from "../../controller/room/room.controller.interface";
import {ValidatorControllerInterface} from "../../controller/validator/validator.controller.interface";
import {MsgCoderControllerInterface} from "../../controller/msg-coder/msg-coder.controller.interface";

@injectable()
export class ConnectedSocketUi implements UiInterface {
	constructor(
		@inject(TYPES.TOOLS.SERVER) private server: ServerToolsInterface,
		@inject(TYPES.CONTROLLER.ROOM) private roomController: RoomControllerInterface,
		@inject(TYPES.CONTROLLER.VALIDATOR) private validatorController: ValidatorControllerInterface,
		@inject(TYPES.CONTROLLER.MSG_CODER) private msgCoderController: MsgCoderControllerInterface,
		) {
	}

	mount() {
		this.server.socket.addHandler('playerJoined', async (socket) => {
			const room = socket.room
			const token = socket.token

			const invalidToken = () => socket.acceptConnection(false, SessionNotFoundError.message)
			const invalidRoomCode = () => socket.acceptConnection(false, RoomNotFoundError.message)
			const serverError = () => socket.acceptConnection(false, 'Internal server error')

			if (!this.validatorController.roomCode(room)) {
				invalidRoomCode()
				return
			}

			try {
				const res = await this.roomController.connect(room, token)
				socket.acceptConnection(true)
				this.server.wsEmitToToken(token, 'JoinData', this.msgCoderController.encodeJoinData(res.scores, res.players))
			} catch (e) {
				if (e instanceof RoomNotFoundError) {
					invalidRoomCode()
					return
				}
				if (e instanceof SessionNotFoundError) {
					invalidToken()
					return
				}
				serverError()
			}
		})
	}
}
