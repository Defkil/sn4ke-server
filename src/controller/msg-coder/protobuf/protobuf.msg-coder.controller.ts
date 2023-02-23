import {injectable} from 'inversify';
import {MsgCoderControllerInterface} from '../msg-coder.controller.interface';
import {load, Root, Type} from 'protobufjs';
import {ScoreType} from "../../room/room.controller.interface";
import {PlayerModelInterface} from "../../../model/player/player.model.interface";

type LookupsListName = string

const LookupsList: {name: LookupsListName, handler: string}[] = [
	{name: "Scores", handler: "snake.Scores"},
	{name: "JoinData", handler: "snake.JoinData"},
	{name: "Player", handler: "snake.Player"},
]

@injectable()
export class ProtobufMsgCoderController implements MsgCoderControllerInterface {
	lookups = new Map<string, Type>();
	constructor() {
		load(__dirname + "/server.proto", (err, root) => {
			if (err)
				throw err;
			if (!root)
				throw Error("Root is null");

			LookupsList.forEach(lookup => {
				const type = root.lookupType(lookup.handler);
				if (!type)
					throw Error("Type not found");
				this.lookups.set(lookup.name, type);
			})
		});
	}


	encodeScores(scores: ScoreType[]): Uint8Array {
		return this.encodeMessage(scores, "Scores");
	}

	encodeJoinData(scores: ScoreType[], players: PlayerModelInterface[]) {
		return this.encodeMessage({scores, players}, "JoinData");
	}

	encodePlayer(player: {name: string, colorId: number}) {
		return this.encodeMessage(player, "Player");
	}

	private encodeMessage(encodeData: any, type: LookupsListName) {
		const typeHandler = this.lookups.get(type);
		if (!typeHandler)
			throw Error("Type not found");
		const message = typeHandler.create(encodeData);
		return typeHandler.encode(message).finish();
	}

}
