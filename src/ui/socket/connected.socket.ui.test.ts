import {ServerToolsInterface} from "../../tools/server/server.tools.interface";
import {
	RoomControllerInterface,
	RoomNotFoundError,
	SessionNotFoundError
} from "../../controller/room/room.controller.interface";
import {ValidatorControllerInterface} from "../../controller/validator/validator.controller.interface";
import {Container} from "inversify";
import {ServerToolsMock} from "../../tools/server/server.tools.mock";
import {RoomControllerMock} from "../../controller/room/room.controller.mock";
import {ValidatorControllerMock} from "../../controller/validator/validator.controller.mock";
import TYPES from "../../inversify.types";
import {MsgCoderControllerInterface} from "../../controller/msg-coder/msg-coder.controller.interface";
import {MsgCoderControllerMock} from "../../controller/msg-coder/msg-coder.controller.mock";
import {ConnectedSocketUi} from "./connected.socket.ui";

describe('ConnectedSocketUi', () => {
	let server: jest.Mocked<ServerToolsInterface>;
	let roomController: jest.Mocked<RoomControllerInterface>;
	let validatorController: jest.Mocked<ValidatorControllerInterface>;
	let msgCoderController: jest.Mocked<MsgCoderControllerInterface>;
	let ui: ConnectedSocketUi;

	beforeEach(() => {
		let container = new Container()
		container = ServerToolsMock(container)
		container = RoomControllerMock(container)
		container = ValidatorControllerMock(container)
		container = MsgCoderControllerMock(container)
		container.bind(TYPES.UI).to(ConnectedSocketUi);

		server = container.get(TYPES.TOOLS.SERVER);
		roomController = container.get(TYPES.CONTROLLER.ROOM);
		validatorController = container.get(TYPES.CONTROLLER.VALIDATOR);
		msgCoderController = container.get(TYPES.CONTROLLER.MSG_CODER);
		ui = container.get(TYPES.UI);
	});

	it('if room code is missing should call acceptConnection with false and error message', async () => {
		await ui.mount();
		const routeHandler = (server.socket.addHandler as any).mock.calls[0][1];
		const acceptConnection = jest.fn();
		await routeHandler({
			acceptConnection: acceptConnection,
		} as any);
		expect(acceptConnection).toHaveBeenCalledWith(false, RoomNotFoundError.message);
	})

	it('if room code is invalid should call acceptConnection with false and error message', async () => {
		await ui.mount();
		const routeHandler = (server.socket.addHandler as any).mock.calls[0][1];
		const acceptConnection = jest.fn();
		await routeHandler({
			acceptConnection: acceptConnection,
			roomCode: 'ABC',
		} as any);
		expect(acceptConnection).toHaveBeenCalledWith(false, RoomNotFoundError.message);
	})

	it('if room code is valid should call acceptConnection with true and no error message', async () => {
		validatorController.roomCode.mockReturnValue(true);
		await ui.mount();
		const routeHandler = (server.socket.addHandler as any).mock.calls[0][1];
		const acceptConnection = jest.fn();
		await routeHandler({
			acceptConnection: acceptConnection,
			roomCode: 'ABC',
		} as any);
		expect(acceptConnection).toHaveBeenCalledWith(true);
	})

	it('if room code is valid and room controller throws RoomNotFoundError should call acceptConnection with false and error message', async () => {
		validatorController.roomCode.mockReturnValue(true);
		roomController.connect.mockRejectedValue(new RoomNotFoundError());
		await ui.mount();
		const routeHandler = (server.socket.addHandler as any).mock.calls[0][1];
		const acceptConnection = jest.fn();
		await routeHandler({
			acceptConnection: acceptConnection,
			roomCode: 'ABC',
		} as any);
		expect(acceptConnection).toHaveBeenCalledWith(false, RoomNotFoundError.message);
	})

	it('if room code is valid and room controller throws SessionNotFoundError should call acceptConnection with false and error message', async () => {
		validatorController.roomCode.mockReturnValue(true);
		roomController.connect.mockRejectedValue(new SessionNotFoundError());
		await ui.mount();
		const routeHandler = (server.socket.addHandler as any).mock.calls[0][1];
		const acceptConnection = jest.fn();
		await routeHandler({
			acceptConnection: acceptConnection,
			roomCode: 'ABC',
		} as any);
		expect(acceptConnection).toHaveBeenCalledWith(false, SessionNotFoundError.message);
	})

});
