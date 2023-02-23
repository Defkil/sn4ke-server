import {RoomPlayer, ScoreType} from "../room/room.controller.interface";

export interface MsgCoderControllerInterface {
	encodeScores(scores: ScoreType[]): Uint8Array
	encodeJoinData(scores: ScoreType[], players: RoomPlayer[]): Uint8Array
	encodePlayer(player: {name: string, colorId: number}): Uint8Array
}
