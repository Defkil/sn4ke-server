import {ServerToolsInterface} from "../../tools/server/server.tools.interface";
import {RoomControllerInterface} from "../../controller/room/room.controller.interface";
import {ValidatorControllerInterface} from "../../controller/validator/validator.controller.interface";
import {StatusCode} from 'status-code-enum';
import TYPES from "../../inversify.types";
import {IsSessionActiveRestUi} from "./is-session-active.rest.ui";
import {Container} from "inversify";
import {ServerToolsMock} from "../../tools/server/server.tools.mock";
import {RoomControllerMock} from "../../controller/room/room.controller.mock";
import {ValidatorControllerMock} from "../../controller/validator/validator.controller.mock";

describe('IsSessionActiveRestUi', () => {
	let server: jest.Mocked<ServerToolsInterface>;
	let roomController: jest.Mocked<RoomControllerInterface>;
	let validatorController: jest.Mocked<ValidatorControllerInterface>;
	let ui: IsSessionActiveRestUi;
	let req: any;
	let res: any;

	beforeEach(() => {
		let container = new Container()
		container = ServerToolsMock(container)
		container = RoomControllerMock(container)
		container = ValidatorControllerMock(container)
		container.bind(TYPES.UI).to(IsSessionActiveRestUi);

		server = container.get(TYPES.TOOLS.SERVER);
		roomController = container.get(TYPES.CONTROLLER.ROOM);
		validatorController = container.get(TYPES.CONTROLLER.VALIDATOR);
		ui = container.get(TYPES.UI);

		req = {
			body: {
				roomCode: 'test-room-code',
				token: 'test-user-token',
			},
		};
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
	});

	it('should return a 400 Bad Request response if the room code is invalid', async () => {
		validatorController.roomCode.mockReturnValue(false);
		await ui.mount();
		await server.post.mock.calls[0][1](req, res);
		expect(validatorController.roomCode).toBeCalledWith('test-room-code');
		expect(res.status).toBeCalledWith(StatusCode.ClientErrorBadRequest);
		expect(res.send).toBeCalledWith('Invalid room code');
	});

	it('should return a 400 Bad Request response if the user token is invalid', async () => {
		validatorController.roomCode.mockReturnValue(true);
		validatorController.uuid.mockReturnValue(false);
		await ui.mount();
		await server.post.mock.calls[0][1](req, res);
		expect(validatorController.uuid).toBeCalledWith('test-user-token');
		expect(res.status).toBeCalledWith(StatusCode.ClientErrorBadRequest);
		expect(res.send).toBeCalledWith('Invalid user token');
	});

	it('should return a 200 OK response with a boolean indicating if the session is active', async () => {
		validatorController.roomCode.mockReturnValue(true);
		validatorController.uuid.mockReturnValue(true);
		roomController.isSessionActive.mockReturnValue(Promise.resolve(true));
		await ui.mount();
		await server.post.mock.calls[0][1](req, res);
		expect(roomController.isSessionActive).toBeCalledWith('test-room-code', 'test-user-token');
		expect(res.status).toBeCalledWith(StatusCode.SuccessOK);
		expect(res.send).toBeCalledWith(true);
	});

	it('should return a 500 Internal Server Error response if an error occurs during the request', async () => {
		roomController.isSessionActive.mockImplementation(() => {
			throw new Error('Error during request');
		});
		validatorController.roomCode.mockReturnValue(true);
		validatorController.uuid.mockReturnValue(true);
		await ui.mount();
		await server.post.mock.calls[0][1](req, res);
		expect(validatorController.roomCode).toBeCalledWith('test-room-code');
		expect(validatorController.uuid).toBeCalledWith('test-user-token');
		expect(roomController.isSessionActive).toBeCalledWith('test-room-code', 'test-user-token');
		expect(res.status).toBeCalledWith(StatusCode.ServerErrorInternal);
		expect(res.send).toBeCalledWith('Internal server error');
	});
});

