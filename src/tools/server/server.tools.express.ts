import express, {Express, Request, Response} from "express";
import {createServer} from "http";
import {LoggerToolsInterface} from "../logger/logger.tools.interface";
import {inject, injectable} from "inversify";
import TYPES from "../../inversify.types";
import {DotenvToolsInterface} from "../dotenv/dotenv.tools.interface";
import cors from "cors";
declare const PhusionPassenger: any;

@injectable()
export class ServerToolsExpress {
	protected serverExpress: Express = express()
	protected serverHttp = createServer(this.serverExpress);

	logger: LoggerToolsInterface

	constructor(
		@inject(TYPES.TOOLS.DOTENV) protected env: DotenvToolsInterface,
		@inject(TYPES.TOOLS.LOGGER) logger: LoggerToolsInterface,
	) {
		this.logger = logger.child({class: 'ServerToolsExpress'})
	}

	async start(): Promise<void> {
		if (typeof (PhusionPassenger) !== 'undefined') {
			this.serverHttp.listen({ path: 'passenger', host: '127.0.0.1' })
			this.logger.info(`Server listening on path passenger`)
		} else {
			this.serverHttp.listen({
				port: this.env.SERVER_PORT,
				host: this.env.SERVER_HOST || '127.0.0.1'
			})
			this.logger.info(`Server listening on port ${this.env.SERVER_PORT}`)
		}
	}
	async post<Params>(path: string, callback: (req: Request<Params>, res: Response) => void): Promise<void> {
		this.serverExpress.post<Params>(path, callback);
		this.logger.debug(`Server post ${path} registered`)
	}

	async setup(): Promise<void> {
		this.serverExpress.use(express.json());
		this.serverExpress.use(cors({
			origin: '*'
		}));
	}

}
