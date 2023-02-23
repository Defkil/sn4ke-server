import {ServerToolsInterface} from "../../tools/server/server.tools.interface";
import {RoomControllerInterface} from "../../controller/room/room.controller.interface";
import {ValidatorControllerInterface} from "../../controller/validator/validator.controller.interface";
import {Container} from "inversify";
import {ServerToolsMock} from "../../tools/server/server.tools.mock";
import {RoomControllerMock} from "../../controller/room/room.controller.mock";
import {ValidatorControllerMock} from "../../controller/validator/validator.controller.mock";
import TYPES from "../../inversify.types";
import {JoinRoomRestUi} from "./join-room.rest.ui";

describe('JoinRoomRestUi', () => {
	let server: jest.Mocked<ServerToolsInterface>;
	let roomController: jest.Mocked<RoomControllerInterface>;
	let validatorController: jest.Mocked<ValidatorControllerInterface>;
	let ui: JoinRoomRestUi;
	let req: any
	let res: any

	beforeEach(() => {
		let container = new Container()
		container = ServerToolsMock(container)
		container = RoomControllerMock(container)
		container = ValidatorControllerMock(container)
		container.bind(TYPES.UI).to(JoinRoomRestUi);

		server = container.get(TYPES.TOOLS.SERVER);
		roomController = container.get(TYPES.CONTROLLER.ROOM);
		validatorController = container.get(TYPES.CONTROLLER.VALIDATOR);
		ui = container.get(TYPES.UI);

		req = {
			body: {
				name: 'test-name', isPlayer: true, roomCode: 'ABC'
			},
		};
		res = {
			status: jest.fn().mockReturnThis(), send: jest.fn(),
		};
	});

	it('should return 400 bad request when room code is missing', async () => {
		req.body = {
			isPlayer: true,
		};
		await ui.mount();
		const routeHandler = server.post.mock.calls[0][1];
		await routeHandler(req as any, res as any);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.send).toHaveBeenCalledWith('Missing room code');
	});

	it('should return 400 bad request when name is missing', async () => {
		req.body = {
			isPlayer: true, roomCode: 'ABC'
		};
		await ui.mount();
		const routeHandler = server.post.mock.calls[0][1];
		await routeHandler(req as any, res as any);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.send).toHaveBeenCalledWith('Missing name');
	});

	it('should return 400 bad request when isPlayer is missing', async () => {
		req.body = {
			name: 'test-name', roomCode: 'ABC'
		};
		await ui.mount();
		const routeHandler = server.post.mock.calls[0][1];
		await routeHandler(req as any, res as any);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.send).toHaveBeenCalledWith('Missing player status');
	})

	it('should return 500 internal server error when room controller throws', async () => {
		roomController.join.mockRejectedValue('test-error');
		await ui.mount();
		const routeHandler = server.post.mock.calls[0][1];
		await routeHandler(req as any, res as any);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.send).toHaveBeenCalledWith('Internal server error');
	})

	it('join as player should return 200 ok with token and name', async () => {
		const data = {
			token: 'test-token', name: 'test-name', colorId: 1
		}
		roomController.join.mockResolvedValue(data);
		req.body = {
			name: data.name, isPlayer: true, roomCode: 'ABC'
		};
		await ui.mount();
		const routeHandler = server.post.mock.calls[0][1];
		await routeHandler(req as any, res as any);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith({
			token: 'test-token', name: 'test-name', colorId: 1
		})
	})

	it('join as screen should return 200 ok with only a token', async () => {
		const data = {
			token: 'test-token'
		}
		roomController.join.mockResolvedValue(data);
		req.body = {
			isPlayer: false, roomCode: 'ABC'
		}
		await ui.mount();
		const routeHandler = server.post.mock.calls[0][1];
		await routeHandler(req as any, res as any);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith({
			token: data.token
		})
	})
})

