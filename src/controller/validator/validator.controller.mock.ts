import TYPES from "../../inversify.types";
import {Container} from "inversify";

export function ValidatorControllerMock(container: Container): Container {
	container.bind(TYPES.CONTROLLER.VALIDATOR).toConstantValue({
		nickname: jest.fn(),
		uuid: jest.fn(),
		roomCode: jest.fn(),
	});
	return container;
}
