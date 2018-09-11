export default class EventEmitter {
    constructor() {
        this._eventHandlers = new Map();
    }

    emit(eventName, data) {
        const callbacks = this._eventHandlers.get(eventName);

        if (callbacks) {
            for (let callback of callbacks) {
                callback(data, eventName);
            }
        }
    }

    on(eventName, callback) {
        let callbacks = this._eventHandlers.get(eventName);

        if (!callbacks) {
            callbacks = [];
            this._eventHandlers.set(eventName, callbacks);
        }

        if (!callbacks.includes(callback)) {
            callbacks.push(callback);
        }
    }

    off(eventName, callback) {
        const callbacks = this._eventHandlers.get(eventName);

        if (callbacks) {
            this._eventHandlers.set(
                eventName,
                callbacks.filter(c => c !== callback)
            );
        }
    }
}
