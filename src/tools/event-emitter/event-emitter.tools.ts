import {EventEmitterCoreToolsInterface, EventEmitterToolsInterface} from "./event-emitter.tools.interface";
import {injectable} from "inversify";

export class EventEmitter<T> implements EventEmitterCoreToolsInterface<T> {
	private readonly handlers: { [eventName in keyof T]?: ((value: T[eventName]) => void)[] }

	constructor() {
		this.handlers = {}
	}

	emit<K extends keyof T>(event: K, value: T[K]): void {
		this.handlers[event]?.forEach(h => h(value));
	}

	addHandler<K extends keyof T>(event: K, handler: (value: T[K]) => void): void {
		const handlers = this.handlers[event];
		if (handlers) {
			if (!handlers.includes(handler)) {
				handlers.push(handler);
			}
		} else {
			this.handlers[event] = [handler];
		}
	}

	removeHandler<K extends keyof T>(event: K, handler: (value: T[K]) => void): void {
		const handlers = this.handlers[event];
		if (handlers) {
			const index = handlers.indexOf(handler);
			if (index !== -1) {
				handlers.splice(index, 1);
			}
		}
	}
}

@injectable()
export class EventEmitterTools implements EventEmitterToolsInterface {
	create<T>() : EventEmitterCoreToolsInterface<T> {
		return new EventEmitter<T>()
	}
}
