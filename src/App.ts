import {inject, injectable, multiInject} from 'inversify'
import TYPES from "./inversify.types";
import {ServerToolsInterface} from "./tools/server/server.tools.interface";
import {UiInterface} from "./ui/ui.interface";
import {LoggerToolsInterface} from "./tools/logger/logger.tools.interface";

export interface AppInterface {
	start: () => Promise<void>
	setup: () => void
}

@injectable()
export class App implements AppInterface {
  constructor (
	  @inject(TYPES.TOOLS.SERVER) private server: ServerToolsInterface,
	  @inject(TYPES.TOOLS.LOGGER) private logger: LoggerToolsInterface,

	  @multiInject(TYPES.UI) private uis: UiInterface[]
  ) {
  }

  async setup (): Promise<void> {
	  await this.server.setup()
	  this.mountUi()
  }
  async start (): Promise<void> {
	  await this.server.start()
	  console.log('start');
  }

	private mountUi() {
		this.uis.forEach(ui => {
			ui.mount()
		})
	}
}

