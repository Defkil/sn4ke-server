import TYPES from "../../inversify.types";
import {Container} from "inversify";

export function RoomControllerMock(container: Container): Container {
	container.bind(TYPES.CONTROLLER.ROOM).toConstantValue({
		create: jest.fn(),
		isSessionActive: jest.fn(),
		join: jest.fn(),
		connect: jest.fn(),
	});
	return container;
}
