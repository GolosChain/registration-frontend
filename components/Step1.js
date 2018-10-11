import React, { PureComponent } from 'react';
import styled from 'styled-components';
import golos from 'golos-js';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Title, SubTitle, Input, Footer, Button } from './Common';
import { Field, FieldLabel, FieldInput, Link } from './Common';
import PhoneInput from './PhoneInput';
import Select from './Select';
import debounce from 'lodash/debounce';
import phoneCodes from '../app/phoneCodes.json';
import Loader from './Loader';
import Captcha from './Captcha';
import { phoneCodesToSelectItems } from '../utils/phoneCodes';

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
    margin: 14px 0 24px;
    text-align: center;
    font-size: 14px;
    font-weight: 300;
    letter-spacing: 0.3px;
    color: #393636;
`;

const InputWrapper = styled.div`
    position: relative;
`;

const InputStatus = styled.div`
    position: absolute;
    top: 8px;
    right: 8px;
`;

const Red = styled.span`
    color: #f00;
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

const Required = props => (
    <span title={props.title}>
        (<Red>*</Red>)
    </span>
);

@injectIntl
export default class Step1 extends PureComponent {
    state = {
        accountName: '',
        accountNameChecking: false,
        accountNameVacant: null,
        accountNameError: null,
        accountNameErrorText: null,
        accountNameTempErrorText: null,
        email: '',
        emailError: null,
        emailErrorText: null,
        phone: '',
        phoneError: null,
        phoneErrorText: null,
        codeIndex: phoneCodes.list.findIndex(p => p.default),
        lock: false,
    };

    componentWillUnmount() {
        this._checkNameExistenceLazy.cancel();
        clearTimeout(this._tempNameErrorTimeout);
    }

    render() {
        const { intl } = this.props;

        const {
            accountName,
            accountNameChecking,
            accountNameVacant,
            accountNameError,
            accountNameErrorText,
            accountNameTempErrorText,
            email,
            emailError,
            emailErrorText,
            codeIndex,
            phone,
            phoneError,
            phoneErrorText,
            errorText,
            lock,
        } = this.state;

        let accountStatus = null;

        if (accountNameChecking) {
            accountStatus = <Loader thickness={1.5} />;
        } else if (accountNameVacant && !accountNameError) {
            accountStatus = <Check />;
        }

        const nameError = accountNameError || accountNameVacant === false;
        const code = phoneCodes.list[codeIndex].code;

        return (
            <>
                <Title>
                    <FormattedMessage id="step1.title" />
                </Title>
                <SubTitle>
                    <FormattedMessage id="step1.subTitle" />
                </SubTitle>
                <Field>
                    <FieldLabel>
                        <FormattedMessage id="step1.accountNameLabel" />{' '}
                        <Required title={intl.messages.required} />
                    </FieldLabel>
                    <FieldInput>
                        <InputWrapper>
                            <Input
                                disabled={lock}
                                autoFocus
                                error={nameError}
                                value={accountName}
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                                placeholder={
                                    intl.messages[
                                        'step1.accountNamePlaceholder'
                                    ]
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
                                <FormattedMessage
                                    id={accountNameTempErrorText}
                                />
                            </FieldError>
                        ) : null}
                    </FieldInput>
                </Field>
                <Field>
                    <FieldLabel>
                        <FormattedMessage id="step1.emailLabel" />{' '}
                        <Required title={intl.messages.required} />
                    </FieldLabel>
                    <FieldInput>
                        <Input
                            disabled={lock}
                            placeholder={
                                intl.messages['step1.emailPlaceholder']
                            }
                            type="email"
                            value={email}
                            error={emailError}
                            autoCorrect="off"
                            autoCapitalize="off"
                            checkSpell="false"
                            onChange={this._onEmailChange}
                            onBlur={this._onEmailBlur}
                        />
                        {emailErrorText ? (
                            <FieldError>
                                <FormattedMessage id={emailErrorText} />
                            </FieldError>
                        ) : null}
                    </FieldInput>
                </Field>
                <Field>
                    <FieldLabel>
                        <FormattedMessage id="step1.phoneCodeLabel" />
                    </FieldLabel>
                    <FieldInput>
                        <Select
                            disabled={lock}
                            value={codeIndex}
                            items={phoneCodesToSelectItems()}
                            onChange={this._onCodeChange}
                        />
                    </FieldInput>
                </Field>
                <Field>
                    <FieldLabel>
                        <FormattedMessage id="step1.phoneLabel" />{' '}
                        <Required title={intl.messages.required} />
                    </FieldLabel>
                    <FieldInput>
                        <PhoneInput
                            disabled={lock}
                            code={`+${code}`}
                            error={phoneError}
                            value={phone}
                            autoCorrect="off"
                            autoCapitalize="off"
                            checkSpell="false"
                            onChange={this._onPhoneChange}
                            onBlur={this._onPhoneBlur}
                        />
                        {phoneErrorText ? (
                            <FieldError>
                                <FormattedMessage id={phoneErrorText} />
                            </FieldError>
                        ) : null}
                    </FieldInput>
                </Field>
                <CaptchaBlock>
                    <Captcha ref="captcha" />
                </CaptchaBlock>
                <Footer>
                    <Button disabled={lock} onClick={this._onOkClick}>
                        <FormattedMessage id="step1.continue" />
                    </Button>
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

        if (value !== accountName) {
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
                    this.setState({
                        accountNameChecking: true,
                    });
                    this._checkNameExistenceLazy();
                } else {
                    this.setState({
                        accountNameChecking: false,
                    });
                    this._checkNameExistenceLazy.cancel();
                }

                if (this._accountNameBlur) {
                    this._validateAccountName();
                }
            }
        );
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
        } else if (name.length < 4) {
            error = true;
            errorText = 'step1.rules.tooShort';
        } else if (name.length > 16) {
            error = true;
            errorText = 'step1.rules.tooLong';
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

        if (error) {
            newState.accountNameTempErrorText = null;
        }

        this.setState(newState);
    }

    _onAccountNameBlur = () => {
        this._accountNameBlur = true;
        this._validateAccountName();
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
