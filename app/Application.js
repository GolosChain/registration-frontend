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

    _clear() {
        this._accountName = null;
        this._code = null;
        this._codeIndex = null;
        this._phone = null;
        this._secret = null;
        this._passwordRulesAccepted = null;

        localStorage.removeItem(REG_KEY);
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

    getRegInfo() {
        return {
            codeIndex: this._codeIndex,
            secret: this._secret,
            phone: this.getPhone(),
        };
    }

    getPhoneData() {
        return {
            code: this._code,
            phone: this._phone,
        };
    }

    passwordRulesAgreed() {
        this._passwordRulesAccepted = true;
        this._saveRegData();
        this._root.goTo('4');
    }

    async updatePhone({ code, phone }) {
        const data = await this._conn.request('registration.changePhone', {
            user: this._accountName,
            phone: `${code}${phone}`,
        });

        if (data.error) {
            console.error(data.error);

            if (data.error.code === 404) {
                this._clear();
                this._root.goTo('timeout');
                return;
            }

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
                            this._clear();
                            this._root.goTo('1');
                            break;
                        case 'verify':
                            this._accountName = savedData.accountName;
                            this._code = savedData.code;
                            this._codeIndex = savedData.codeIndex;
                            this._phone = savedData.phone;
                            this._secret = savedData.secret;
                            this._passwordRulesAccepted = null;
                            this._startWaitVerification();
                            this._root.goTo('2');
                            break;
                        case 'toBlockChain':
                            this._accountName = savedData.accountName;
                            this._code = savedData.code;
                            this._codeIndex = savedData.codeIndex;
                            this._phone = savedData.phone;
                            this._secret = null;
                            this._passwordRulesAccepted =
                                savedData.passwordRulesAccepted;

                            if (savedData.passwordRulesAccepted) {
                                this._root.goTo('4');
                            } else {
                                this._root.goTo('3');
                            }

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
            this._codeIndex = data.codeIndex;
            this._phone = data.phone;

            if (response.result.currentState === 'toBlockChain') {
                this._saveRegData();
                this._root.goTo('3');
            } else {
                this._secret = generateRandomCode();
                this._saveRegData();
                this._root.goTo('2');
                this._startWaitVerification();
            }

            return null;
        }
    }

    _saveRegData() {
        localStorage.setItem(
            REG_KEY,
            JSON.stringify({
                accountName: this._accountName,
                code: this._code,
                codeIndex: this._codeIndex,
                phone: this._phone,
                secret: this._secret,
                passwordRulesAccepted: this._passwordRulesAccepted,
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
            console.error(response.error);

            if (response.error.code === 404) {
                this._clear();
                this._root.goTo('timeout');
                return;
            }

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
        for (let country of phoneCodes.list) {
            if (country.code === this._code) {
                if (country.verificationOverrides) {
                    for (let override of country.verificationOverrides) {
                        if (
                            Array.from(override.startsWith).some(startWith =>
                                this._phone.startsWith(startWith)
                            )
                        ) {
                            return override.verificationPhone;
                        }
                    }
                }

                if (country.verificationPhone) {
                    return country.verificationPhone;
                }
                break;
            }
        }

        return phoneCodes.defaultVerificationPhone;
    }

    getSecretCode() {
        if (!this._secret) {
            this._secret = generateRandomCode();
        }

        return this._secret;
    }

    resetRegistration() {
        this._clear();
        this._root.goTo('1');
    }

    _startWaitVerification() {
        this._conn.request('registration.subscribeOnSmsGet', {
            user: this._accountName,
            phone: `${this._code}${this._phone}`,
        });
    }
}

function generateRandomCode() {
    let code = null;

    do {
        code = Math.floor(10000 * Math.random()).toString();
    } while (code.length !== 4);

    return code;
}
