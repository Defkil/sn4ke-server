import {Container} from 'inversify'
import TYPES from "./inversify.types";
import {App, AppInterface} from "./App";
import {LoggerToolsInterface} from "./tools/logger/logger.tools.interface";
import {PinoLoggerTools} from "./tools/logger/pino/pino.logger.tools";
import {ServerToolsInterface} from "./tools/server/server.tools.interface";
import {ServerTools} from "./tools/server/server.tools";
import {DotenvToolsInterface} from "./tools/dotenv/dotenv.tools.interface";
import {DotenvTools} from "./tools/dotenv/dotenv.tools";
import {EventEmitterTools} from "./tools/event-emitter/event-emitter.tools";
import {EventEmitterToolsInterface} from "./tools/event-emitter/event-emitter.tools.interface";
import {UiInterface} from "./ui/ui.interface";
import {CreateRoomRestUi} from "./ui/rest/create-room.rest.ui";
import {RoomController} from "./controller/room/room.controller";
import {RoomControllerInterface} from "./controller/room/room.controller.interface";
import {RoomModelHandlerInterface} from "./model/room/room.model.interface";
import {RoomModelHandler} from "./model/room/room.model";
import {PlayerModelHandler} from "./model/player/player.model";
import {PlayerModelHandlerInterface} from "./model/player/player.model.interface";
import {PlayerControllerInterface} from "./controller/player/player.controller.interface";
import {PlayerController} from "./controller/player/player.controller";
import {ValidatorController} from "./controller/validator/validator.controller";
import {ValidatorControllerInterface} from "./controller/validator/validator.controller.interface";
import {IsSessionActiveRestUi} from "./ui/rest/is-session-active.rest.ui";
import {CodeGeneratorController} from "./controller/code-generator/code-generator.controller";
import {CodeGeneratorControllerInterface} from "./controller/code-generator/code-generator.controller.interface";
import {JoinRoomRestUi} from "./ui/rest/join-room.rest.ui";
import {MsgCoderControllerInterface} from "./controller/msg-coder/msg-coder.controller.interface";
import {ProtobufMsgCoderController} from "./controller/msg-coder/protobuf/protobuf.msg-coder.controller";
import {ConnectedSocketUi} from "./ui/socket/connected.socket.ui";
import {GameController} from "./controller/game/game.controller";
import {GameControllerInterface} from "./controller/game/game.controller.interface";
import {GameMapModelHandler} from "./model/game-map/game-map.model";
import {GameMapModelHandlerInterface} from "./model/game-map/game-map.model.interface";
import {GameMapController} from "./controller/game-map/game-map.controller";
import {GameMapControllerInterface} from "./controller/game-map/game-map.controller.interface";
import {GameLoopController} from "./controller/game-loop/game-loop.controller";
import {GameLoopControllerInterface} from "./controller/game-loop/game-loop.controller.interface";
import {GameLoopModelHandlerInterface} from "./model/game-loop/game-loop.model.interface";
import {GameLoopModelHandler} from "./model/game-loop/game-loop.model";
import {GameModelHandler} from "./model/game/game.model";
import {GameModelHandlerInterface} from "./model/game/game.model.interface";

const container = new Container()

// dotenv
container.bind<DotenvToolsInterface>(TYPES.TOOLS.DOTENV).toConstantValue(DotenvTools)

// core
container.bind<AppInterface>(TYPES.APP).to(App).inSingletonScope()
container.bind<LoggerToolsInterface>(TYPES.TOOLS.LOGGER).to(PinoLoggerTools).inSingletonScope()
container.bind<ServerToolsInterface>(TYPES.TOOLS.SERVER).to(ServerTools).inSingletonScope()
container.bind<EventEmitterToolsInterface>(TYPES.TOOLS.EVENT_EMITTER).to(EventEmitterTools)

// ui
container.bind<UiInterface>(TYPES.UI).to(CreateRoomRestUi)
container.bind<UiInterface>(TYPES.UI).to(IsSessionActiveRestUi)
container.bind<UiInterface>(TYPES.UI).to(JoinRoomRestUi)
container.bind<UiInterface>(TYPES.UI).to(ConnectedSocketUi)

// controller
container.bind<RoomControllerInterface>(TYPES.CONTROLLER.ROOM).to(RoomController)
container.bind<PlayerControllerInterface>(TYPES.CONTROLLER.PLAYER).to(PlayerController)
container.bind<ValidatorControllerInterface>(TYPES.CONTROLLER.VALIDATOR).to(ValidatorController)
container.bind<CodeGeneratorControllerInterface>(TYPES.CONTROLLER.CODE_GENERATOR).to(CodeGeneratorController)
container.bind<MsgCoderControllerInterface>(TYPES.CONTROLLER.MSG_CODER).to(ProtobufMsgCoderController)
container.bind<GameControllerInterface>(TYPES.CONTROLLER.GAME).to(GameController).inSingletonScope()
container.bind<GameMapControllerInterface>(TYPES.CONTROLLER.GAME_MAP).to(GameMapController)
container.bind<GameLoopControllerInterface>(TYPES.CONTROLLER.GAME_LOOP).to(GameLoopController)

// model
container.bind<RoomModelHandlerInterface>(TYPES.MODEL.ROOM).to(RoomModelHandler).inSingletonScope()
container.bind<PlayerModelHandlerInterface>(TYPES.MODEL.PLAYER).to(PlayerModelHandler).inSingletonScope()
container.bind<GameModelHandlerInterface>(TYPES.MODEL.GAME).to(GameModelHandler).inSingletonScope()
container.bind<GameMapModelHandlerInterface>(TYPES.MODEL.GAME_MAP).to(GameMapModelHandler).inSingletonScope()
container.bind<GameLoopModelHandlerInterface>(TYPES.MODEL.GAME_LOOP).to(GameLoopModelHandler).inSingletonScope()
export { container }
