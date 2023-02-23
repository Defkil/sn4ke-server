import {ServerToolsInterface} from "../../tools/server/server.tools.interface";
import {RoomControllerInterface} from "../../controller/room/room.controller.interface";
import {ValidatorControllerInterface} from "../../controller/validator/validator.controller.interface";

import {StatusCode} from 'status-code-enum'
import {CreateRoomRestUi} from "./create-room.rest.ui";
import {Container} from "inversify";
import {ServerToolsMock} from "../../tools/server/server.tools.mock";
import TYPES from "../../inversify.types";
import {RoomControllerMock} from "../../controller/room/room.controller.mock";
import {ValidatorControllerMock} from "../../controller/validator/validator.controller.mock";

describe('CreateRoomRestUi', () => {
	let server: jest.Mocked<ServerToolsInterface>;
	let roomController: jest.Mocked<RoomControllerInterface>;
	let validatorController: jest.Mocked<ValidatorControllerInterface>;
	let ui: CreateRoomRestUi;
	let req: any
	let res: any

	const testData = {
		token: 'test-token',
		roomCode: 'test-code',
	}
	beforeEach(() => {
		let container = new Container()
		container = ServerToolsMock(container)
		container = RoomControllerMock(container)
		container = ValidatorControllerMock(container)
		container.bind(TYPES.UI).to(CreateRoomRestUi);

		server = container.get(TYPES.TOOLS.SERVER);
		roomController = container.get(TYPES.CONTROLLER.ROOM);
		validatorController = container.get(TYPES.CONTROLLER.VALIDATOR);
		ui = container.get(TYPES.UI);

		req = {
			body: {
				name: 'test-name',
				isPlayer: true,
			},
		};
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
	});

	it('creates a room with a name if the request is from a player', async () => {
		roomController.create.mockResolvedValue(testData);
		validatorController.nickname.mockReturnValue(true);
		await ui.mount();
		const routeHandler = server.post.mock.calls[0][1];
		await routeHandler(req as any, res as any);
		expect(validatorController.nickname).toHaveBeenCalledWith('test-name');
		expect(roomController.create).toHaveBeenCalledWith('test-name');
		expect(res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(res.send).toHaveBeenCalledWith(testData);
	});

	it('returns a Bad Request status if the request does not include a name as player', async () => {
		req.body.name = '';
		await ui.mount();
		const routeHandler = server.post.mock.calls[0][1];
		await routeHandler(req as any, res as any);
		expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorBadRequest);
		expect(res.send).toHaveBeenCalledWith('Invalid name');
	});
	it('returns a Bad Request status if the nickname is not valid', async () => {
		validatorController.nickname.mockReturnValue(false);
		await ui.mount();
		const routeHandler = server.post.mock.calls[0][1];
		await routeHandler(req as any, res as any);
		expect(validatorController.nickname).toHaveBeenCalledWith('test-name');
		expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorBadRequest);
		expect(res.send).toHaveBeenCalledWith('Invalid name');
	});

	it('returns an Internal Server Error status if creating the room fails', async () => {
		validatorController.nickname.mockReturnValue(true);
		roomController.create.mockRejectedValue(new Error('test error'));
		await ui.mount();
		const routeHandler = server.post.mock.calls[0][1];
		await routeHandler(req as any, res as any);
		expect(validatorController.nickname).toHaveBeenCalledWith('test-name');
		expect(roomController.create).toHaveBeenCalledWith('test-name');
		expect(res.status).toHaveBeenCalledWith(StatusCode.ServerErrorInternal);
		expect(res.send).toHaveBeenCalledWith('Internal server error');
	});

	it('is no name and isPlayer is false, it wont return a name, only a room code a connection token', async () => {
		req.body.isPlayer = false;
		req.body.name = '';
		roomController.create.mockResolvedValue(testData);
		await ui.mount();
		const routeHandler = server.post.mock.calls[0][1];
		await routeHandler(req as any, res as any);
		expect(validatorController.nickname).not.toHaveBeenCalled();
		expect(roomController.create).toHaveBeenCalledWith();
		expect(res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(res.send).toHaveBeenCalledWith(testData);
	})
});
