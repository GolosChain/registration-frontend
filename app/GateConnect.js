export default class GateConnect {
    constructor() {
        this._retry = 0;
        this._lastRequestId = 0;
        this._waits = new Map();
        this._queue = [];
        this._eventHandlers = new Map();
    }

    connect() {
        const address = window.GLS_GATE_CONNECT;

        if (!address) {
            console.error('GLS_GATE_CONNECT not specified');
            alert('ERROR');
            return;
        }

        const ws = new WebSocket(address);

        ws.addEventListener('open', () => {
            this._open = true;

            for (let item of this._queue) {
                this._request(item);
            }

            this._queue = [];
        });

        ws.addEventListener('error', err => {
            console.error(err);
            this._onFail();
        });

        ws.addEventListener('close', () => {
            this._onFail();
        });

        ws.addEventListener('message', this._onMessage);

        this._ws = ws;
    }

    _onMessage = e => {
        const data = JSON.parse(e.data);

        if (data.method) {
            const callbacks = this._eventHandlers.get(data.method);

            if (callbacks) {
                for (let callback of callbacks) {
                    try {
                        callback(data);
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
        }

        const wait = this._waits.get(data.id);

        if (wait) {
            this._waits.delete(data.id);

            wait.resolve({
                error: data.error,
                result: data.result,
            });
        }
    };

    request(apiName, params) {
        return new Promise((resolve, reject) => {
            if (!this._open) {
                this._queue.push({
                    apiName,
                    params,
                    resolve,
                    reject,
                });
                return;
            }

            this._request({ apiName, params, resolve, reject });
        });
    }

    _request({ apiName, params, resolve, reject }) {
        const requestId = ++this._lastRequestId;

        this._waits.set(requestId, {
            resolve,
            reject,
        });

        this._ws.send(
            JSON.stringify({
                jsonrpc: '2.0',
                id: requestId,
                method: apiName,
                params,
            })
        );
    }

    _mockServerRequest(apiName, params) {
        console.log(apiName, params);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    status: 'OK',
                });
            }, 1000);
        });
    }

    _onFail() {
        if (this._ws) {
            this._open = false;
            this._ws = null;

            for (let [, { reject }] of this._waits) {
                reject(new Error('Connection is broken'));
            }

            this._waits.clear();

            for (let { reject } of this._queue) {
                reject(new Error('Connection is broken'));
            }

            this._queue = [];

            this._retry++;

            setTimeout(() => {
                console.log('Gate socket reconnect');
                this.connect();
            }, 500 + Math.floor(1000 * Math.random()) * Math.log2(2 + this._retry));
        }
    }

    addEventHandler(eventName, callback) {
        let callbacks = this._eventHandlers.get(eventName);

        if (!callbacks) {
            callbacks = [];
            this._eventHandlers.set(eventName, callbacks);
        }

        callbacks.push(callback);
    }
}
