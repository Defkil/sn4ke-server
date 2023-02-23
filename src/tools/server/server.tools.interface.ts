import {Request, Response} from "express";
import {UserConnectionToken} from "../../model/room/room.model.interface";
import {SocketId} from "./server.tools";
import {EventEmitterCoreToolsInterface} from "../event-emitter/event-emitter.tools.interface";

export interface ServerToolsInterface {
	socket: EventEmitterCoreToolsInterface<ServerToolsEventEmitter>
	start: () => Promise<void>
	setup: () => Promise<void>
	wsBroadcast(room: string, event: string, data: any): void
	post<Params>(path: string, callback: (req: Request<Params>, res: Response) => void): Promise<void>
	wsEmitToToken(token: UserConnectionToken, event: string, data: any): void
}

export interface ServerToolsEventEmitter {
	playerJoined: {
		token: UserConnectionToken,
		room: string,
		acceptConnection: (isAccepted: boolean, errorMsg?: string) => void,
	},
	startGame: {
		token: UserConnectionToken,
	}
}
