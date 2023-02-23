import {EventEmitter, EventEmitterTools} from './event-emitter.tools';

describe('EventEmitter', () => {
	describe('constructor', () => {
		it('should initialize handlers object', () => {
			const emitter = new EventEmitter<{ testEvent: string }>();
			expect(emitter['handlers']).toEqual({});
		});
	});

	describe('emit', () => {
		it('should call all handlers for the event', () => {
			const emitter = new EventEmitter<{ testEvent: string }>();
			const testValue = 'test value';
			const handler1 = jest.fn();
			const handler2 = jest.fn();
			emitter.addHandler('testEvent', handler1);
			emitter.addHandler('testEvent', handler2);
			emitter.emit('testEvent', testValue);
			expect(handler1).toHaveBeenCalledWith(testValue);
			expect(handler2).toHaveBeenCalledWith(testValue);
		});

		it('should do nothing if no handlers are registered for the event', () => {
			const emitter = new EventEmitter<{ testEvent: string }>();
			emitter.emit('testEvent', 'test value');
		});
	});

	describe('addHandler', () => {
		it('should add handler for the event', () => {
			const emitter = new EventEmitter<{ testEvent: string }>();
			const handler = jest.fn();
			emitter.addHandler('testEvent', handler);
			emitter.emit('testEvent', 'test value');
			expect(handler).toHaveBeenCalled();
		});

		it('should not add duplicate handlers for the same event', () => {
			const emitter = new EventEmitter<{ testEvent: string }>();
			const handler = jest.fn();
			emitter.addHandler('testEvent', handler);
			emitter.addHandler('testEvent', handler);
			emitter.emit('testEvent', 'test value');
			expect(handler).toHaveBeenCalledTimes(1);
		});
	});

	describe('removeHandler', () => {
		it('should remove handler for the event', () => {
			const emitter = new EventEmitter<{ testEvent: string }>();
			const handler = jest.fn();
			emitter.addHandler('testEvent', handler);
			emitter.removeHandler('testEvent', handler);
			emitter.emit('testEvent', 'test value');
			expect(handler).not.toHaveBeenCalled();
		});

		it('should do nothing if no handlers are registered for the event', () => {
			const emitter = new EventEmitter<{ testEvent: string }>();
			const handler = jest.fn();
			emitter.removeHandler('testEvent', handler);
			expect(emitter['handlers']).not.toHaveProperty('testEvent');
		});
	});

	describe('EventEmitterTools', () => {
		it('should create a new instance of EventEmitter', () => {
			const eventEmitterTools = new EventEmitterTools();
			const eventEmitter = eventEmitterTools.create<{ testEvent: string }>();
			expect(eventEmitter).toBeInstanceOf(EventEmitter);
		});
	});5
});
