import {inject, injectable} from "inversify";
import {UiInterface} from "../ui.interface";
import TYPES from "../../inversify.types";
import {ServerToolsInterface} from "../../tools/server/server.tools.interface";
import {RoomControllerInterface} from "../../controller/room/room.controller.interface";
import {UserConnectionToken} from "../../model/room/room.model.interface";
import {StatusCode} from "status-code-enum";
import {ValidatorControllerInterface} from "../../controller/validator/validator.controller.interface";

@injectable()
export class IsSessionActiveRestUi implements UiInterface {
	constructor(
		@inject(TYPES.TOOLS.SERVER) private server: ServerToolsInterface,
		@inject(TYPES.CONTROLLER.ROOM) private roomController: RoomControllerInterface,
		@inject(TYPES.CONTROLLER.VALIDATOR) private validatorController: ValidatorControllerInterface,
	) {
	}
	async mount() {
		await this.server.post<{roomCode: string, token: UserConnectionToken}>('/is-session-active', async (req, res) => {
			try {
				if (!this.validatorController.roomCode(req.body.roomCode)) {
					res.status(StatusCode.ClientErrorBadRequest).send('Invalid room code')
					return
				}
				if (!this.validatorController.uuid(req.body.token)) {
					res.status(StatusCode.ClientErrorBadRequest).send('Invalid user token')
					return
				}
				const isActive = await this.roomController.isSessionActive(req.body.roomCode, req.body.token)
				res.status(StatusCode.SuccessOK).send(isActive)
			} catch (e) {
				console.log(e);
				res.status(StatusCode.ServerErrorInternal).send('Internal server error')
			}
		})
	}
}
