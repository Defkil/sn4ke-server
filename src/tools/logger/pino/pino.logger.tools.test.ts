import {PinoLoggerTools} from "./pino.logger.tools";
describe('PinoLoggerTools', () => {
	it('should log messages with the correct levels', () => {
		const logger = new PinoLoggerTools();

		const traceSpy = jest.spyOn(logger['logger'], 'trace');
		const debugSpy = jest.spyOn(logger['logger'], 'debug');
		const infoSpy = jest.spyOn(logger['logger'], 'info');
		const warnSpy = jest.spyOn(logger['logger'], 'warn');
		const errorSpy = jest.spyOn(logger['logger'], 'error');
		const fatalSpy = jest.spyOn(logger['logger'], 'error');

		const traceMessage = 'This is a trace message';
		const debugMessage = 'This is a debug message';
		const infoMessage = 'This is an info message';
		const warnMessage = 'This is a warn message';
		const errorMessage = 'This is an error message';
		const fatalMessage = 'This is a fatal message';

		logger.trace(traceMessage);
		logger.debug(debugMessage);
		logger.info(infoMessage);
		logger.warn(warnMessage);
		logger.error(errorMessage);
		logger.fatal(fatalMessage);

		expect(traceSpy).toHaveBeenCalledWith(traceMessage);
		expect(debugSpy).toHaveBeenCalledWith(debugMessage);
		expect(infoSpy).toHaveBeenCalledWith(infoMessage);
		expect(warnSpy).toHaveBeenCalledWith(warnMessage);
		expect(errorSpy).toHaveBeenCalledWith(errorMessage);
		expect(fatalSpy).toHaveBeenCalledWith(fatalMessage);
	});

	it('should return a child logger', () => {
		const logger = new PinoLoggerTools();
		const child: any = logger.child({ foo: 'bar' });

		expect(child).toHaveProperty('trace');
		expect(child).toHaveProperty('debug');
		expect(child).toHaveProperty('info');
		expect(child).toHaveProperty('warn');
		expect(child).toHaveProperty('error');
		expect(child).toHaveProperty('fatal');
		expect(child).toHaveProperty('child');
	});
});
