import {DotenvToolsInterface} from "../dotenv/dotenv.tools.interface";
import {ServerTools} from "./server.tools";
import {Container} from "inversify";
import TYPES from "../../inversify.types";

describe('ServerTools', () => {
	let serverTools: ServerTools;

	beforeEach(() => {
		const container = new Container();
		container.bind(TYPES.TOOLS.DOTENV).toConstantValue({
			SERVER_PORT: 'test-port',
		} as jest.Mocked<DotenvToolsInterface>);
		let loggerMock = {
			debug: jest.fn(),
			info: jest.fn(),
			child: Function
		}
		loggerMock.child = jest.fn().mockReturnValue({
			debug: loggerMock.debug,
			info: loggerMock.info,
		})
		container.bind(TYPES.TOOLS.LOGGER).toConstantValue({

			debug: jest.fn(),
			info: jest.fn(),
			child: jest.fn().mockReturnValue({
				debug: jest.fn(),
				info: jest.fn(),
			}),
		});
		container.bind(TYPES.TOOLS.EVENT_EMITTER).toConstantValue({
			on: jest.fn(),
			create: jest.fn(),
		});
		container.bind(TYPES.TOOLS.SERVER).to(ServerTools);

		serverTools = container.get(TYPES.TOOLS.SERVER);
	});

	describe('post', () => {
		it('should call the express post method with the correct parameters', async () => {
			const spy = jest.spyOn(serverTools['serverExpress'], 'post').mockImplementation(jest.fn());

			await serverTools.post('test-path', jest.fn());

			expect(spy).toHaveBeenCalledWith('test-path', expect.any(Function));
		});
	});

	describe('start', () => {
		it('should call the listen method of the http server with the correct parameters if PhusionPassenger is undefined', async () => {
			const spy = jest.spyOn(serverTools['serverHttp'], 'listen').mockImplementation(jest.fn());
			(global as any).PhusionPassenger = undefined;

			await serverTools.start();

			expect(spy).toHaveBeenCalledWith({"host": "127.0.0.1", "port": "test-port"})
		});

		it('should call the listen method of the http server with the correct parameters if PhusionPassenger is defined', async () => {
			const spy = jest.spyOn(serverTools['serverHttp'], 'listen').mockImplementation(jest.fn());
			(global as any).PhusionPassenger = {
				configuration: {
					getPassengerSocket: jest.fn().mockReturnValue('test-socket')
				}
			};

			await serverTools.start();

			expect(spy).toHaveBeenCalledWith({
				host: '127.0.0.1',
				path: 'passenger'
			})
		});
	});

	describe('setup', () => {
		it('should call the use method of the express server with the correct parameters', async () => {
			const spy = jest.spyOn(serverTools['serverExpress'], 'use').mockImplementation(jest.fn());

			await serverTools.setup();

			expect(spy).toEqual(expect.any(Function));
		});

		it('should call the on method of the socket.io server with the correct parameters', async () => {
			const spy = jest.spyOn(serverTools['serverIo'], 'on').mockImplementation(jest.fn());

			await serverTools.setup();

			expect(spy).toHaveBeenCalledWith('connection', expect.any(Function));
		});

	});
});
