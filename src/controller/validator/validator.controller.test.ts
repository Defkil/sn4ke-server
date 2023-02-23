import {ValidatorController} from './validator.controller';

describe('ValidatorController', () => {
	let validatorController: ValidatorController;

	beforeEach(() => {
		validatorController = new ValidatorController();
	});

	describe('nickname', () => {
		it('should return false if name is not a string', () => {
			const name = 123;
			expect(validatorController.nickname(name)).toBe(false);
		});

		it('should return false if name length is less than minimum length', () => {
			const name = 'ab';
			expect(validatorController.nickname(name)).toBe(false);
		});

		it('should return false if name length is greater than maximum length', () => {
			const name = 'abcdefghijklmnopqrstuvwxyz';
			expect(validatorController.nickname(name)).toBe(false);
		});

		it('should return true if name length is between minimum and maximum length and is a string', () => {
			const name = 'abc';
			expect(validatorController.nickname(name)).toBe(true);
		});
	});

	describe('uuid', () => {
		it('should return false if uuid is not a string', () => {
			const uuid = 123;
			expect(validatorController.uuid(uuid)).toBe(false);
		});

		it('should return false if uuid does not match the expected pattern', () => {
			const uuid = '12345678-1234-1234-1234-1234567890ab';
			expect(validatorController.uuid(uuid)).toBe(false);
		});

		it('should return true if uuid matches the expected pattern and is a string', () => {
			const uuid = '831f01a7-3eef-42e1-9425-0a6c7fd5482b';
			expect(validatorController.uuid(uuid)).toBe(true);
		});
	});

	describe('roomCode', () => {
		it('should return false if roomCode is not a string', () => {
			const roomCode = 123;
			expect(validatorController.roomCode(roomCode)).toBe(false);
		});
		it('should return false if roomCode length is not equal to the expected length', () => {
			const roomCode = '123456';
			expect(validatorController.roomCode(roomCode)).toBe(false);
		});

		it('should return true if roomCode length is equal to the expected length and is a string', () => {
			const roomCode = '123';
			expect(validatorController.roomCode(roomCode)).toBe(true);
		});
	});
});
