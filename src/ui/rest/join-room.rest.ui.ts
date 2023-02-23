import {inject, injectable} from "inversify";
import {UiInterface} from "../ui.interface";
import TYPES from "../../inversify.types";
import {ServerToolsInterface} from "../../tools/server/server.tools.interface";
import {RoomControllerInterface} from "../../controller/room/room.controller.interface";
import {UserConnectionToken} from "../../model/room/room.model.interface";
import {StatusCode} from "status-code-enum";

@injectable()
export class JoinRoomRestUi implements UiInterface {
	constructor(
		@inject(TYPES.TOOLS.SERVER) private server: ServerToolsInterface,
		@inject(TYPES.CONTROLLER.ROOM) private roomController: RoomControllerInterface
	) {
	}
	async mount() {
		await this.server.post<{name?: string, isPlayer: boolean, roomCode: string}>('/join-room', async (req, res) => {
			try {
				const {name, isPlayer, roomCode} = req.body
				if (isPlayer === undefined) {
					res.status(StatusCode.ClientErrorBadRequest).send('Missing player status')
					return
				}
				if (!roomCode) {
					res.status(StatusCode.ClientErrorBadRequest).send('Missing room code')
					return
				}
				if (isPlayer && !name) {
					res.status(StatusCode.ClientErrorBadRequest).send('Missing name')
					return
				}
				let data: {token: UserConnectionToken, name?: string}
				if (isPlayer) {
					data = await this.roomController.join(roomCode, name)
				} else {
					data = await this.roomController.join(roomCode)
				}
				res.status(StatusCode.SuccessOK).send(data)
			} catch (e) {
				res.status(StatusCode.ServerErrorInternal).send('Internal server error')
			}
		})
	}
}
