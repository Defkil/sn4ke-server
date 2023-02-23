import {Container} from "inversify";
import TYPES from "../../inversify.types";
import {ServerToolsInterface} from "./server.tools.interface";




export function ServerToolsMock(container: Container): Container {
	container.bind(TYPES.TOOLS.SERVER).toConstantValue({
		post: jest.fn() as any,
		socket: {
			addHandler: jest.fn(),
		},
	} as unknown as jest.Mocked<ServerToolsInterface>);
	return container;
}
