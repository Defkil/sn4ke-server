import {injectable} from "inversify";
import {Logger, pino} from 'pino'
import {LoggerToolsInterface} from "../logger.tools.interface";
@injectable()
export class PinoLoggerTools implements LoggerToolsInterface {
    private logger: Logger
    constructor() {
        this.logger = pino({
			enabled: true,
			transport: {
				target: 'pino-pretty'
			},
		})
    }

    trace(msg: string | object) { this.logger.trace(msg) }
    debug(msg: string | object) { this.logger.debug(msg) }
    info(msg: string | object) { this.logger.info(msg) }
    warn(msg: string | object) { this.logger.warn(msg) }
    error(msg: string | object) { this.logger.error(msg) }
    fatal(msg: string | object) { this.logger.error(msg) }

    child(mergingObject: any): LoggerToolsInterface {
        return this.logger.child(mergingObject)
    }
}
