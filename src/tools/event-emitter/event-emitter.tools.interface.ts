export interface EventEmitterCoreToolsInterface<T> {
	emit<K extends keyof T>(event: K, value: T[K]): void;
	addHandler<K extends keyof T>(event: K, handler: (value: T[K]) => void): void;
	removeHandler<K extends keyof T>(event: K, handler: (value: T[K]) => void): void;
}

export interface EventEmitterToolsInterface {
	create<T>() : EventEmitterCoreToolsInterface<T>
}

