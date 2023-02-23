export interface ValidatorControllerInterface {
	nickname(name: unknown): boolean
	uuid(uuid: unknown): boolean
	roomCode(uuid: unknown): boolean
}
