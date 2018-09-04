import golos from 'golos-js';
import GateConnect from './GateConnect';

const REG_KEY = 'golos.registration';

export default class Application {
    constructor(root) {
        this._root = root;
        this._conn = new GateConnect();

        this._conn.connect();

        window.app = this;
    }

    getGateConnect() {
        return this._conn;
    }

    async init() {
        try {
            const json = localStorage.getItem(REG_KEY);

            if (json) {
                const savedData = JSON.parse(json);

                if (savedData) {
                    const data = await this._conn.request(
                        'registration.getState',
                        {
                            user: savedData.accountName,
                            phone: savedData.phone,
                        }
                    );

                    if (data.error) {
                        throw data.error;
                    }

                    switch (data.result.currentState) {
                        case 'firstStep':
                            this._accountName = null;
                            this._root.goTo('1');
                            break;
                        case 'verify':
                            this._accountName = savedData.accountName;
                            this._root.goTo('2');
                            break;
                        case 'toBlockChain':
                            this._accountName = savedData.accountName;
                            this._root.goTo('3');
                            break;
                    }
                }
            }
        } catch (err) {
            console.error(err);
            this._root.goTo('1');
        }
    }

    async firstStep(data) {
        const response = await this._conn.request('registration.firstStep', {
            user: data.accountName,
            mail: data.email,
            phone: data.phone,
            captcha: data.captchaCode,
        });

        if (response.error) {
            return response;
        }

        if (response.result) {
            localStorage.setItem(
                REG_KEY,
                JSON.stringify({
                    accountName: data.accountName,
                    phone: data.phone,
                })
            );

            this._accountName = data.accountName;
            this._root.goTo('2');

            this._conn.request('registration.subscribeOnSmsGet', {
                user: data.accountName,
                phone: data.phone,
            });

            this._conn.addEventHandler('registration.phoneVerified', data => {
                console.log('registration.phoneVerified', data);
                this._root.goTo('3');
            });

            return null;
        }
    }

    async finishRegistration(password) {
        const keys = golos.auth.generateKeys(this._accountName, password, [
            'owner',
            'active',
            'posting',
            'memo',
        ]);

        const response = await this._conn.request('registration.toBlockChain', {
            user: this._accountName,
            ...keys,
        });

        console.log('registration.toBlockChain response:', response);

        if (response.error) {
            return response.error;
        }

        if (response.result && response.result.status === 'OK') {
            localStorage.removeItem(REG_KEY);
        }
    }
}
