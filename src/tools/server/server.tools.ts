import {ServerToolsEventEmitter, ServerToolsInterface} from "./server.tools.interface";
import {inject, injectable} from "inversify";
import {Server, Socket} from "socket.io";
import TYPES from "../../inversify.types";
import {DotenvToolsInterface} from "../dotenv/dotenv.tools.interface";
import {EventEmitterToolsInterface} from "../event-emitter/event-emitter.tools.interface";
import {LoggerToolsInterface} from "../logger/logger.tools.interface";
import {UserConnectionToken} from "../../model/room/room.model.interface";
import {ServerToolsExpress} from "./server.tools.express";
import {SessionNotFoundError} from "../../controller/room/room.controller.interface";

export type SocketId = string

@injectable()
export class ServerTools extends ServerToolsExpress implements ServerToolsInterface {
	socket = this.EventEmitter.create<ServerToolsEventEmitter>();
	private serverIo = new Server(this.serverHttp, {
		cors: {
			origin: '*'
		}
	});

	constructor(
		@inject(TYPES.TOOLS.DOTENV) env: DotenvToolsInterface,
		@inject(TYPES.TOOLS.EVENT_EMITTER) private EventEmitter: EventEmitterToolsInterface,
		@inject(TYPES.TOOLS.LOGGER) logger: LoggerToolsInterface,
	) {
		super(env, logger)
		this.logger = logger.child({class: 'ServerTools'})
	}

	async setup(): Promise<void> {
		await super.setup()
		this.serverIo.on('connection', (socket) => {
			this.socketConnected(socket)
			this.socketListeners(socket)
			socket.on('disconnect', () => {
				this.socketDisconnected(socket)
			})
		})
		this.logger.info(`Server setup done`)
	}

	private socketListeners(socket: Socket) {
		socket.on('StartGame', () => {
			const token = this.socketIdToToken.get(socket.id)
			if (!token) {
				// todo error handler
				return
			}
			this.socket.emit('startGame', {token})
		})
	}

	private tokensToSocketIds: Map<UserConnectionToken, SocketId> = new Map();
	private socketIdToToken: Map<SocketId, UserConnectionToken> = new Map();

	wsEmitToToken(token: UserConnectionToken, event: string, data: any) {
		const socketId = this.tokensToSocketIds.get(token);
		if (!socketId) {
			throw new SessionNotFoundError();
		}
		this.serverIo.to(socketId).emit(event, data);
	}
	wsBroadcast(room: string, event: string, data: any) {
		this.serverIo.to(room).emit(event, data);
	}

	private socketDisconnected(socket: Socket) {
		const matchingEntry = this.socketIdToToken.get(socket.id);
		if (matchingEntry) {
			this.socketIdToToken.delete(socket.id);
			this.tokensToSocketIds.delete(matchingEntry);
		} else {
			this.logger.warn(`Could not find token for socket ${socket.id}`);
		}
	}

	private socketConnected(socket: Socket) {
		const parseQueryAndReportError = (query: any, errorMessage: string): string | null => {
			if (!query) {
				socket.emit('error', errorMessage);
				return null;
			}
			return query;
		}

		const token = parseQueryAndReportError(socket.handshake.query.token, 'No token provided');
		const room = parseQueryAndReportError(socket.handshake.query.room, 'No room provided');

		if (!token || !room) {
			return;
		}

		const acceptConnectionHandler = (isAccepted: boolean, errorMsg?: string) => {
			if (isAccepted) {
				console.log('juhu');
				console.log(room);
				this.tokensToSocketIds.set(token, socket.id);
				this.socketIdToToken.set(socket.id, token);
				socket.join(room);
				socket.emit('acceptedConnection');
			} else {
				socket.emit('error', 'Connection refused: ' + errorMsg);
			}
		}

		this.socket.emit('playerJoined', {
			token,
			room,
			acceptConnection: acceptConnectionHandler
		});
	}
}
