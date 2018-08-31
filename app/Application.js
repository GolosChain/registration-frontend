import GateConnect from './GateConnect';

export default class Application {
    constructor() {
        this._conn = new GateConnect();

        this._conn.connect();

        window.app = this;
    }
}
