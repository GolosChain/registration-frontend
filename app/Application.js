import golos from 'golos-js';
import GateConnect from './GateConnect';
import EventEmitter from '../utils/EventEmitter';
import phoneCodes from './phoneCodes.json';

const REG_KEY = 'golos.registration';

export const STRATEGIES = {
    SMS_FROM_USER: 'smsFromUser',
    SMS_TO_USER: 'smsToUser',
};

export default class Application extends EventEmitter {
    constructor(root) {
        super();

        this._root = root;
        this._conn = new GateConnect();

        this._conn.connect();

        this._conn.addEventHandler('registration.phoneVerified', () => {
            this._root.goTo('4');
        });

        window.app = this;
    }

    _clear() {
        this._strategy = null;
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
            codeIndex: this._codeIndex,
            code: this._code,
            phone: this._phone,
        };
    }

    passwordRulesAgreed() {
        this._passwordRulesAccepted = true;
        this._saveRegData();
        this._root.goTo('4');
    }

    async updatePhone({ code, phone, captcha }) {
        const response = await this._conn.request('registration.changePhone', {
            user: this._accountName,
            phone: `${code}${phone}`,
            captcha,
        });

        if (response.error) {
            console.error(response.error);

            if (response.error.code === 404) {
                this._clear();
                this._root.goTo('timeout');
                return;
            }

            throw response.error;
        }

        this._code = code;
        this._phone = phone;

        this._saveRegData();

        if (this._strategy === STRATEGIES.SMS_FROM_USER) {
            this._startWaitVerification();
        } else if (this._strategy === STRATEGIES.SMS_TO_USER) {
            this.setNextResendTs(response.result.nextSmsRetry);
        }

        this.emit('phoneChanged');

        this._root.closeChangePhoneDialog();

        if (this._strategy === STRATEGIES.SMS_FROM_USER) {
            this._root.goTo('2');
        }
    }

    async init() {
        let savedData = null;

        try {
            const json = localStorage.getItem(REG_KEY);

            if (json) {
                savedData = JSON.parse(json);
            }
        } catch (err) {}

        if (savedData) {
            try {
                const params = {
                    user: savedData.accountName,
                    phone: `${savedData.code}${savedData.phone}`,
                };

                const response = await this._conn.request(
                    'registration.getState',
                    params
                );

                if (response.error) {
                    throw response.error;
                }

                const result = response.result;

                switch (result.currentState) {
                    case 'verify':
                        this._strategy = result.strategy;
                        this._accountName = savedData.accountName;
                        this._code = savedData.code;
                        this._codeIndex = savedData.codeIndex;
                        this._phone = savedData.phone;
                        this._secret = savedData.secret;
                        this._passwordRulesAccepted = null;

                        switch (this._strategy) {
                            case STRATEGIES.SMS_FROM_USER:
                                this._startWaitVerification();
                                this._root.goTo('2');
                                break;
                            case STRATEGIES.SMS_TO_USER:
                                this.setNextResendTs(result.nextSmsRetry);
                                this._root.goTo('enter-code');
                                break;
                            default:
                                throw new Error('STRATEGY');
                        }
                        break;
                    case 'toBlockChain':
                        this._accountName = savedData.accountName;
                        this._code = savedData.code;
                        this._codeIndex = savedData.codeIndex;
                        this._phone = savedData.phone;
                        this._secret = null;
                        this._passwordRulesAccepted =
                            savedData.passwordRulesAccepted;

                        this._root.goTo('4');
                        break;
                    default:
                        this._clear();
                        this._root.goTo('1');
                }
            } catch (err) {
                console.error(err);
                this._clear();
                this._root.goTo('1');
            }
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

        const result = response.result;

        this._strategy = null;
        this._accountName = data.accountName;
        this._code = data.code;
        this._codeIndex = data.codeIndex;
        this._phone = data.phone;

        // if redirect to another state
        if (result.currentState) {
            if (result.currentState === 'toBlockChain') {
                this._saveRegData();
                this._root.goTo('4');
            }
            return;
        }

        this._strategy = result.strategy;

        switch (result.strategy) {
            case STRATEGIES.SMS_FROM_USER:
                this._secret = generateRandomCode();
                this._saveRegData();
                this._root.goTo('2');
                this._startWaitVerification();
                break;
            case STRATEGIES.SMS_TO_USER:
                this._saveRegData();
                this.setNextResendTs(result.nextSmsRetry);
                this._root.goTo('enter-code');
                break;
            default:
                throw new Error('STRATEGY');
        }

        return null;
    }

    setNextResendTs(ts) {
        this._nextResendTs = ts;
        this.emit('resendTsChanged');
    }

    getStrategy() {
        return this._strategy;
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

    getNextResendSmsTimestamp() {
        return this._nextResendTs;
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

    async codeEntered(code) {
        const response = await this._conn.request('registration.verify', {
            user: this._accountName,
            code,
        });

        if (response.error) {
            console.error(response.error);

            if (response.error.code === 404) {
                this._clear();
                this._root.goTo('timeout');
                return;
            }

            throw response.error;
        }

        this._root.goTo('4');
    }

    async resendSms() {
        const response = await this._conn.request(
            'registration.resendSmsCode',
            {
                user: this._accountName,
            }
        );

        if (response.error) {
            if (response.error.code === 404) {
                this._clear();
                this._root.goTo('timeout');
                return;
            }

            return response.error;
        }

        this.setNextResendTs(response.result.nextSmsRetry);
    }
}

function generateRandomCode() {
    let code = null;

    do {
        code = Math.floor(10000 * Math.random()).toString();
    } while (code.length !== 4);

    return code;
}
