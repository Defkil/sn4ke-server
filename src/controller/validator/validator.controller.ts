import {injectable} from "inversify";
import {ValidatorControllerInterface} from "./validator.controller.interface";
import {NICKNAME, ROOM} from "./validator.controller.config.json";

@injectable()
export class ValidatorController implements ValidatorControllerInterface {
	nickname(name: unknown): boolean {
		if (typeof name !== 'string'){
			return false
		}
		if (name.length < NICKNAME.MIN_LENGTH) {
			return false
		}
		if (name.length > NICKNAME.MAX_LENGTH) {
			return false
		}
		return true
	}
	uuid(uuid: unknown): boolean {
		if (typeof uuid !== 'string'){
			return false
		}
		const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
		if (!regex.test(uuid)) {
			return false
		}
		return true
	}

	roomCode(code: unknown): boolean {
		if (typeof code !== 'string'){
			return false
		}
		console.log(code.length);
		if (code.length !== ROOM.LENGTH) {
			return false
		}
		return true
	}
}
