export default class GateConnect {
    constructor() {
        this._lastRequestId = 0;
        this._waits = new Map();
    }

    connect() {
        const ws = new WebSocket('ws://95.216.153.236:8080');

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

        console.log(data);
    };

    request(apiName, params) {
        return this._mockServerRequest(apiName, params);

        return new Promise((resolve, reject) => {
            const requestId = ++this._lastRequestId;

            this._waits.set(requestId, {
                resolve,
                reject,
            });

            this._ws.send(
                JSON.stringify({
                    jsonrpc: '2.0',
                    method: apiName,
                    params,
                })
            );
        });
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
            this._ws = null;

            for (let [, { reject }] of this._waits) {
                reject(new Error('Connection is broken'));
            }

            window.location.reload();
        }
    }
}
