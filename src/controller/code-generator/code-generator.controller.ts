import {injectable} from "inversify";
import crypto from "crypto";
import {CodeGeneratorControllerInterface} from "./code-generator.controller.interface";
const ROOM_CODE_LENGTH = 3;
// create only typedoc minum comment for this class

/**
 * @module ControllerImpl
 * @implements {CodeGeneratorControllerInterface}
 */
@injectable()
export class CodeGeneratorController implements CodeGeneratorControllerInterface {
	roomCode(occupiedCodes: string[]): string {
		const roomCode = Math.random().toString(20).slice(2, ROOM_CODE_LENGTH + 2).toUpperCase()
		if (occupiedCodes.includes(roomCode)) {
			return this.roomCode(occupiedCodes)
		}
		return roomCode
	}
	uuid() {
		return crypto.randomUUID()
	}
}
