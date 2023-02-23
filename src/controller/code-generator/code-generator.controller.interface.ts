/**
 * Generates random codes
 * @module Controller
 */
export interface CodeGeneratorControllerInterface {
	/**
	 * generates a random room code
	 * @param occupiedCodes
	 */
	roomCode(occupiedCodes: string[]): string;

	/**
	 * generates a random uuid
	 * @returns {string}
	 */
	uuid(): string;
}
