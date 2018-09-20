import golos from 'golos-js';
import GateConnect from './GateConnect';
import EventEmitter from '../utils/EventEmitter';
import phoneCodes from './phoneCodes.json';

const REG_KEY = 'golos.registration';

export default class Application extends EventEmitter {
    constructor(root) {
        super();

        this._root = root;
        this._conn = new GateConnect();

        this._conn.connect();

        this._conn.addEventHandler('registration.phoneVerified', () => {
            this._root.goTo('3');
        });

        window.app = this;
    }

    getGateConnect() {
        return this._conn;
    }

    getAccountName() {
        return this._accountName;
    }

    getPhone() {
        return `${this._code}${this._phone}`;
    }

    getPhoneData() {
        return {
            code: this._code,
            phone: this._phone,
        };
    }

    async updatePhone({ code, phone }) {
        const data = await this._conn.request('registration.changePhone', {
            user: this._accountName,
            phone: `${code}${phone}`,
        });

        if (data.error) {
            console.error(data.error);
            throw data.error;
        }

        this._code = code;
        this._phone = phone;

        this._saveRegData();

        this._startWaitVerification();

        this.emit('phoneChanged');

        this._root.closeChangePhoneDialog();
        this._root.goTo('2');
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
                            phone: `${savedData.code}${savedData.phone}`,
                        }
                    );

                    if (data.error) {
                        throw data.error;
                    }

                    switch (data.result.currentState) {
                        case 'firstStep':
                            this._accountName = null;
                            this._code = null;
                            this._phone = null;
                            this._secret = null;
                            this._root.goTo('1');
                            break;
                        case 'verify':
                            this._accountName = savedData.accountName;
                            this._code = savedData.code;
                            this._phone = savedData.phone;
                            this._secret = savedData.secret;
                            this._startWaitVerification();
                            this._root.goTo('2');
                            break;
                        case 'toBlockChain':
                            this._accountName = savedData.accountName;
                            this._code = savedData.code;
                            this._phone = savedData.phone;
                            this._secret = null;
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
            phone: `${data.code}${data.phone}`,
            captcha: data.captchaCode,
        });

        if (response.error) {
            return response;
        }

        if (response.result) {
            this._accountName = data.accountName;
            this._code = data.code;
            this._phone = data.phone;
            this._secret = generateRandomCode();

            this._saveRegData();

            this._root.goTo('2');

            this._startWaitVerification();
            return null;
        }
    }

    _saveRegData() {
        localStorage.setItem(
            REG_KEY,
            JSON.stringify({
                accountName: this._accountName,
                code: this._code,
                phone: this._phone,
                secret: this._secret,
            })
        );
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

        if (response.error) {
            return response.error;
        }

        if (response.result && response.result.status === 'OK') {
            localStorage.removeItem(REG_KEY);
            this._root.goTo('final');
        } else {
            return {
                code: -1,
                message: 'Error',
            };
        }
    }

    openChangePhoneDialog() {
        this._root.showChangePhoneDialog();
    }

    getVerificationPhoneNumber() {
        for (let country of phoneCodes) {
            if (country.code === this._code) {
                return country.verificationPhone;
            }
        }
    }

    getSecretCode() {
        if (!this._secret) {
            this._secret = generateRandomCode();
        }

        return this._secret;
    }

    _startWaitVerification() {
        this._conn.request('registration.subscribeOnSmsGet', {
            user: this._accountName,
            phone: `${this._code}${this._phone}`,
        });

        // this._verificationInterval = setInterval(async () => {
        //     const data = await this._conn.request('registration.getState', {
        //         user: this._accountName,
        //         phone: `${this._code}${this._phone}`,
        //     });
        //
        //     if (data.error) {
        //         console.error(data.error);
        //         return;
        //     }
        //
        //     switch (data.result.currentState) {
        //         case 'firstStep':
        //             this._root.goTo('1');
        //             this._accountName = null;
        //             this.code = null;
        //             this._phone = null;
        //             break;
        //         case 'toBlockChain':
        //             clearInterval(this._verificationInterval);
        //             this._root.goTo('3');
        //             break;
        //     }
        // }, 2000);
    }
}

function generateRandomCode() {
    let code = null;

    do {
        code = Math.floor(10000 * Math.random()).toString();
    } while (code.length !== 4);

    return code;
}
