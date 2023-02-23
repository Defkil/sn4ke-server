import {UiInterface} from "../ui.interface";
import {inject, injectable} from "inversify";
import TYPES from "../../inversify.types";
import {ServerToolsInterface} from "../../tools/server/server.tools.interface";
import {RoomControllerInterface} from "../../controller/room/room.controller.interface";
import { StatusCode } from 'status-code-enum'
import {UserConnectionToken} from "../../model/room/room.model.interface";
import {ValidatorControllerInterface} from "../../controller/validator/validator.controller.interface";

@injectable()
export class CreateRoomRestUi implements UiInterface {
	constructor(
		@inject(TYPES.TOOLS.SERVER) private server: ServerToolsInterface,
		@inject(TYPES.CONTROLLER.ROOM) private roomController: RoomControllerInterface,
		@inject(TYPES.CONTROLLER.VALIDATOR) private validatorController: ValidatorControllerInterface,
	) {
	}
	async mount() {
		await this.server.post<{name?: string, isPlayer: boolean}>('/create-room', async (req, res) => {
			try {
				let data: {token: UserConnectionToken, roomCode: string, name?: string}
				if (req.body.isPlayer) {
					if (!this.validatorController.nickname(req.body.name)) {
						res.status(StatusCode.ClientErrorBadRequest).send('Invalid name')
						return
					}
					data = await this.roomController.create(req.body.name)
				} else {
					data = await this.roomController.create()
				}
				res.status(StatusCode.SuccessOK).send(data)
			} catch (e) {
				console.log(e);
				res.status(StatusCode.ServerErrorInternal).send('Internal server error')
			}
		})
	}
}
