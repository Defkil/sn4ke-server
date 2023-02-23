import {Container} from "inversify";
import TYPES from "../../inversify.types";

export function MsgCoderControllerMock(container: Container): Container {
	container.bind(TYPES.CONTROLLER.MSG_CODER).toConstantValue({
		encodeScores: jest.fn(),
		encodeJoinData: jest.fn(),
		encodePlayer: jest.fn(),
	})
	return container;
}
