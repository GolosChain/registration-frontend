import React, { PureComponent } from 'react';
import styled from 'styled-components';
import golos from 'golos-js';
import { FormattedMessage, injectIntl } from 'react-intl';
import debounce from 'lodash/debounce';

import phoneCodes from '../../app/phoneCodes.json';
import { Title, Input, Footer, Button, Field, Link } from '../Common';
import AccountNameInput from '../AccountNameInput';
import Loader from '../Loader';
import Captcha from '../Captcha';
import PhoneBlock from '../PhoneBlock';
import Hint from '../Hint';

const MIN_HINT_TIME = 3000;

export const FieldDiv = styled.div`
    position: relative;
    margin: 20px 0;
`;

const FieldError = styled.div`
    margin-top: 10px;
    line-height: 1.4em;
    font-size: 12px;
    font-weight: 300;
    color: #f00;
`;

const TotalError = styled.div`
    margin-top: 10px;
    font-size: 14px;
    font-weight: 300;
    color: #f00;
`;

const Comment = styled.div`
    margin: 14px 0 19px;
    text-align: center;
    font-size: 12px;
    color: #959595;
`;

const ButtonStyled = styled(Button)`
    min-width: 210px;
`;

const InputWrapper = styled.div`
    position: relative;
`;

const InputStatus = styled.div`
    position: absolute;
    top: 12px;
    right: 12px;
`;

const Check = styled.div`
    width: 16px;
    height: 16px;
    background: url('/images/check.svg') no-repeat center;
`;

const CaptchaBlock = styled(Field)`
    display: flex;
    justify-content: center;
`;

@injectIntl
export default class Step1 extends PureComponent {
    state = {
        accountName: '',
        accountNameHint: false,
        accountNameChecking: false,
        accountNameVacant: null,
        accountNameError: null,
        accountNameErrorText: null,
        accountNameTempErrorText: null,
        email: '',
        emailError: null,
        emailErrorText: null,
        phone: '',
        phoneHint: false,
        phoneError: null,
        phoneErrorText: null,
        codeIndex: phoneCodes.list.findIndex(p => p.default),
        lock: false,
    };

    componentWillUnmount() {
        this._checkNameExistenceLazy.cancel();
        clearTimeout(this._tempNameErrorTimeout);
    }

    renderAccountNameBlock() {
        const { intl } = this.props;

        const {
            accountName,
            accountNameHint,
            accountNameError,
            accountNameChecking,
            accountNameVacant,
            accountNameErrorText,
            accountNameTempErrorText,
            lock,
        } = this.state;

        let accountStatus = null;

        if (!accountNameError) {
            if (accountNameChecking) {
                accountStatus = <Loader thickness={1.5} />;
            } else if (accountNameVacant && !accountNameError) {
                accountStatus = <Check />;
            }
        }

        const nameError = accountNameError || accountNameVacant === false;

        return (
            <Field>
                <InputWrapper>
                    {accountNameHint ? <Hint textId="step1.loginHint" /> : null}
                    <AccountNameInput
                        autoFocus
                        disabled={lock}
                        error={nameError}
                        value={accountName}
                        placeholder={
                            intl.messages['step1.accountNamePlaceholder']
                        }
                        onChange={this._onAccountNameChange}
                        onBlur={this._onAccountNameBlur}
                    />
                    {accountStatus ? (
                        <InputStatus>{accountStatus}</InputStatus>
                    ) : null}
                </InputWrapper>
                {accountNameErrorText ? (
                    <FieldError>
                        <FormattedMessage id={accountNameErrorText} />
                    </FieldError>
                ) : accountNameVacant === false ? (
                    <FieldError>
                        <FormattedMessage id="step1.error.nameExists" />
                    </FieldError>
                ) : accountNameTempErrorText ? (
                    <FieldError>
                        <FormattedMessage id={accountNameTempErrorText} />
                    </FieldError>
                ) : null}
            </Field>
        );
    }

    renderPhoneBlock() {
        const {
            codeIndex,
            phone,
            phoneHint,
            phoneError,
            phoneErrorText,
            lock,
        } = this.state;

        return (
            <FieldDiv>
                {phoneHint ? <Hint textId="step1.phoneHint" /> : null}
                <PhoneBlock
                    disabled={lock}
                    codeIndex={codeIndex}
                    onCodeChange={this._onCodeChange}
                    phone={phone}
                    phoneError={phoneError}
                    onPhoneChange={this._onPhoneChange}
                    onPhoneFocus={this._onPhoneFocus}
                    onPhoneBlur={this._onPhoneBlur}
                />
                {phoneErrorText ? (
                    <FieldError>
                        <FormattedMessage id={phoneErrorText} />
                    </FieldError>
                ) : null}
            </FieldDiv>
        );
    }

    renderEmailBlock() {
        const { intl } = this.props;

        const { email, emailError, emailErrorText, lock } = this.state;

        return (
            <Field>
                <Input
                    disabled={lock}
                    placeholder={intl.messages['step1.emailPlaceholder']}
                    type="email"
                    value={email}
                    error={emailError}
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    onChange={this._onEmailChange}
                    onBlur={this._onEmailBlur}
                />
                {emailErrorText ? (
                    <FieldError>
                        <FormattedMessage id={emailErrorText} />
                    </FieldError>
                ) : null}
            </Field>
        );
    }

    render() {
        const { errorText, lock } = this.state;

        return (
            <>
                <Title>
                    <FormattedMessage id="step1.title" />
                </Title>
                {this.renderAccountNameBlock()}
                {this.renderPhoneBlock()}
                {this.renderEmailBlock()}
                <CaptchaBlock>
                    <Captcha ref="captcha" />
                </CaptchaBlock>
                <Footer>
                    <ButtonStyled disabled={lock} onClick={this._onOkClick}>
                        <FormattedMessage id="step1.continue" />
                    </ButtonStyled>
                </Footer>
                {errorText ? (
                    <TotalError innerRef={el => (this._errorEl = el)}>
                        <FormattedMessage id={errorText} />
                    </TotalError>
                ) : null}
                <Comment>
                    <FormattedMessage id="step1.alreadyHaveAccount" />{' '}
                    <Link href="https://golos.io/login">
                        <FormattedMessage id="step1.login" />
                    </Link>
                </Comment>
            </>
        );
    }

    _onAccountNameChange = e => {
        const value = e.target.value;

        const accountName = value.toLowerCase().replace(/[^a-z0-9.-]+/g, '');

        if (value.toLowerCase() !== accountName) {
            this.setState({
                accountNameTempErrorText: 'step1.rules.containsOnly',
            });

            clearTimeout(this._tempNameErrorTimeout);
            this._tempNameErrorTimeout = setTimeout(() => {
                this.setState({
                    accountNameTempErrorText: null,
                });
            }, 5000);
        }

        this.setState(
            {
                accountName,
            },
            () => {
                if (this._isAccountNameValid(accountName)) {
                    this._checkNameExistenceLazy();
                } else {
                    this.setState({
                        accountNameChecking: false,
                        accountNameVacant: null,
                    });
                    this._checkNameExistenceLazy.cancel();
                }

                if (this._accountNameBlur) {
                    this._validateAccountName();
                }
            }
        );

        if (!this._accountNameBlur) {
            this.showAccountHint();
        }
    };

    __validateAccountName(accountName) {
        let error = null;
        let errorText = null;

        const name = accountName.trim();

        if (!name) {
            error = true;
        } else if (/[^a-z0-9.-]/.test(name)) {
            error = true;
            errorText = 'step1.rules.containsOnly';
        } else if (/^[^a-z]/.test(name)) {
            error = true;
            errorText = 'step1.rules.startsWithChar';
        } else if (name.length < 3) {
            error = true;
            errorText = 'step1.rules.tooShort';
        } else if (name.length > 16) {
            error = true;
            errorText = 'step1.rules.tooLong';
        } else {
            const validationError = golos.utils.validateAccountName(
                accountName
            );

            if (validationError) {
                error = true;

                switch (validationError) {
                    case 'Account name should start with a letter.':
                        errorText = 'step1.rules.nameLetter';
                        break;
                    case 'Account name should have only letters, digits, or dashes.':
                        errorText = 'step1.rules.containsOnly';
                        break;
                    case 'Account name should have only one dash in a row.':
                        errorText = 'step1.rules.nameDash';
                        break;
                    case 'Account name should end with a letter or digit.':
                        errorText = 'step1.rules.nameEnd';
                        break;
                    case 'Account name should be longer':
                        errorText = 'step1.rules.tooShort';
                        break;
                    case 'Each account segment should start with a letter.':
                        errorText = 'step1.rules.segmentLetter';
                        break;
                    case 'Each account segment should have only letters, digits, or dashes.':
                        errorText = 'step1.rules.segmentContains';
                        break;
                    case 'Each account segment should have only one dash in a row.':
                        errorText = 'step1.rules.segmentDash';
                        break;
                    case 'Each account segment should end with a letter or digit.':
                        errorText = 'step1.rules.segmentEnd';
                        break;
                    case 'Each account segment should be longer':
                        errorText = 'step1.rules.segmentLonger';
                        break;
                    default:
                        errorText = validationError;
                }
            }
        }

        return {
            error,
            errorText,
        };
    }

    _isAccountNameValid(accountName) {
        return this.__validateAccountName(accountName).error == null;
    }

    _validateAccountName() {
        const { accountName } = this.state;

        const { error, errorText } = this.__validateAccountName(accountName);

        const newState = {
            accountNameError: error,
            accountNameErrorText: errorText,
        };

        if (errorText) {
            newState.accountNameTempErrorText = null;
        }

        this.setState(newState);
    }

    _onAccountNameBlur = () => {
        this._accountNameBlur = true;
        this._validateAccountName();

        if (this.state.accountNameHint) {
            const timePassed = Date.now() - this.hintShowTs;

            if (timePassed > MIN_HINT_TIME) {
                this.hideAccountHint();
            } else {
                setTimeout(this.hideAccountHint, MIN_HINT_TIME - timePassed);
            }
        }
    };

    showAccountHint = () => {
        this.hintShowTs = Date.now();
        this.setState({
            accountNameHint: true,
        });
    };

    hideAccountHint = () => {
        this.setState({
            accountNameHint: false,
        });
    };

    showPhoneHint = () => {
        this.phoneHintShowTs = Date.now();
        this.setState({
            phoneHint: true,
        });
    };

    hidePhoneHint = () => {
        this.setState({
            phoneHint: false,
        });
    };

    _onEmailChange = e => {
        this.setState(
            {
                email: e.target.value,
                errorText: null,
            },
            () => {
                if (this._emailBlur) {
                    this._onEmailBlur();
                }
            }
        );
    };

    _onEmailBlur = () => {
        this._emailBlur = true;
        this._validateEmail();
    };

    _validateEmail = () => {
        let error = null;
        let errorText = null;

        const email = this.state.email.trim();

        if (!email) {
            error = true;
        } else if (!/^[^@/:]+@[^@/:]+\.[^@/:]+$/.test(email)) {
            error = true;
            errorText = 'step1.rules.invalidEmail';
        }

        this.setState({
            emailError: error,
            emailErrorText: errorText,
        });
    };

    _onOkClick = () => {
        const { intl } = this.props;

        this._validateAccountName();
        this._validateEmail();
        this._validatePhone();

        this.setState({
            lock: true,
        });

        setTimeout(async () => {
            const {
                accountName,
                accountNameError,
                accountNameVacant,
                email,
                emailError,
                codeIndex,
                phone,
                phoneError,
            } = this.state;

            if (accountNameError || emailError || phoneError) {
                this._accountNameBlur = true;
                this._emailBlur = true;
                this._phoneBlur = true;

                this.setState({ lock: false });
                this._showError('step1.error.fillAllFields');
                return;
            }

            if (!accountNameVacant) {
                this.setState({ lock: false });
                this._showError('step1.error.nameExists');
                return;
            }

            const captchaCode = this.refs.captcha.getCode();

            if (!captchaCode) {
                this.setState({ lock: false });
                this._showError('step1.error.captcha');
                return;
            }

            try {
                const result = await window.app.firstStep({
                    accountName,
                    email,
                    codeIndex,
                    code: phoneCodes.list[codeIndex].code,
                    phone: phone.replace(/[^0-9]+/g, ''),
                    captchaCode,
                });

                if (result && result.error) {
                    this.setState({
                        lock: false,
                    });

                    if (result.error.message === 'Phone already registered.') {
                        this.setState({
                            phoneError: true,
                            phoneErrorText: 'step1.phoneInRegistration',
                        });
                    } else {
                        this._showError(
                            `${intl.messages['wrong']}: ${result.error.message}`
                        );
                    }

                    grecaptcha.reset();
                }
            } catch (err) {
                console.error(err);

                this.setState({ lock: false });
                this._showError(`${intl.messages['wrong']}: ${err.message}`);

                grecaptcha.reset();
            }
        }, 10);
    };

    _onPhoneChange = phone => {
        this.setState(
            {
                phone,
                errorText: null,
            },
            () => {
                if (this._phoneBlur) {
                    this._validatePhone();
                }
            }
        );
    };

    _onPhoneFocus = () => {
        if (!this._phoneBlur) {
            this.showPhoneHint();
        }
    };

    _onCodeChange = value => {
        if (value === '') {
            return;
        }

        this.setState({
            codeIndex: Number(value),
        });
    };

    _onPhoneBlur = () => {
        this._phoneBlur = true;
        this._validatePhone();

        if (this.state.phoneHint) {
            const timePassed = Date.now() - this.phoneHintShowTs;

            if (timePassed > MIN_HINT_TIME) {
                this.hidePhoneHint();
            } else {
                setTimeout(this.hidePhoneHint, MIN_HINT_TIME - timePassed);
            }
        }
    };

    _validatePhone() {
        let error = null;
        let errorText = null;

        const phone = this.state.phone.trim();

        if (!phone) {
            error = true;
        }

        this.setState({
            phoneError: error,
            phoneErrorText: errorText,
        });
    }

    _checkNameExistenceLazy = debounce(async () => {
        const { accountName } = this.state;

        this.setState({
            accountNameChecking: true,
        });

        const [result] = await golos.api.lookupAccountNamesAsync([accountName]);

        this.setState({
            accountNameVacant: Boolean(!result),
            accountNameChecking: accountName !== this.state.accountName,
        });
    }, 200);

    _showError(errorText) {
        this.setState(
            {
                errorText,
            },
            () => {
                if (this._errorEl.scrollIntoViewIfNeeded) {
                    this._errorEl.scrollIntoViewIfNeeded();
                } else if (this._errorEl.scrollIntoView) {
                    this._errorEl.scrollIntoView();
                }
            }
        );
    }
}
