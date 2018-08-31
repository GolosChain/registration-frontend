import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Title, SubTitle, Input, Footer, Button } from './Common';
import { Field, FieldLabel, FieldInput, Link } from './Common';
import PhoneInput from './PhoneInput';
import Select from './Select';
import phoneCodes from '../app/phoneCodes.json';

const FieldError = styled.div`
    margin-top: 10px;
    font-size: 12px;
    font-weight: 300;
    color: red;
`;

const TotalError = styled.div`
    margin-top: 10px;
    font-size: 14px;
    font-weight: 300;
    color: red;
`;

const Comment = styled.div`
    margin: 14px 0 24px;
    text-align: center;
    font-size: 14px;
    font-weight: 300;
    letter-spacing: 0.3px;
    color: #999;
`;

const Red = styled.span`
    color: #f00;
`;

const Required = () => (
    <span title="Необходимое поле">
        (<Red>*</Red>)
    </span>
);

export default class Step1 extends PureComponent {
    state = {
        accountName: '',
        accountNameError: null,
        accountNameText: null,
        email: '',
        emailError: null,
        emailErrorText: null,
        phone: '',
        phoneError: null,
        phoneErrorText: null,
        code: 7,
    };

    render() {
        const {
            accountName,
            accountNameError,
            accountNameErrorText,
            email,
            emailError,
            emailErrorText,
            code,
            phone,
            phoneError,
            errorText,
        } = this.state;

        return (
            <>
                <Title>Регистрация</Title>
                <SubTitle>
                    Пишите, фотографируете, комментируйте и получайте награду за
                    любое действие.
                </SubTitle>
                <Field>
                    <FieldLabel>
                        Имя аккаунта <Required />
                    </FieldLabel>
                    <FieldInput>
                        <Input
                            autoFocus
                            error={accountNameError}
                            value={accountName}
                            autoCorrect="off"
                            autoapitalize="off"
                            checkSpell="false"
                            onChange={this._onAccountNameChange}
                            onBlur={this._onAccountNameBlur}
                        />
                        {accountNameErrorText ? (
                            <FieldError>{accountNameErrorText}</FieldError>
                        ) : null}
                    </FieldInput>
                </Field>
                <Field>
                    <FieldLabel>
                        Электронная почта <Required />
                    </FieldLabel>
                    <FieldInput>
                        <Input
                            placeholder="golos@gmail.com"
                            type="email"
                            value={email}
                            error={emailError}
                            autoCorrect="off"
                            autoapitalize="off"
                            checkSpell="false"
                            onChange={this._onEmailChange}
                            onBlur={this._onEmailBlur}
                        />
                        {emailErrorText ? (
                            <FieldError>{emailErrorText}</FieldError>
                        ) : null}
                    </FieldInput>
                </Field>
                <Field>
                    <FieldLabel>Выберите из списка код страны</FieldLabel>
                    <FieldInput>
                        <Select
                            value={code}
                            items={phoneCodes}
                            onChange={this._onCodeChange}
                        />
                    </FieldInput>
                </Field>
                <Field>
                    <FieldLabel>
                        Введите номер вашего телефона <Required />
                    </FieldLabel>
                    <FieldInput>
                        <PhoneInput
                            code={`+${code}`}
                            error={phoneError}
                            value={phone}
                            autoCorrect="off"
                            autoapitalize="off"
                            checkSpell="false"
                            onChange={this._onPhoneChange}
                            onBlur={this._onPhoneBlur}
                        />
                    </FieldInput>
                </Field>
                <Footer>
                    <Button onClick={this._onOkClick}>Продолжить</Button>
                </Footer>
                {errorText ? <TotalError>{errorText}</TotalError> : null}
                <Comment>
                    У вас уже есть аккаунт?{' '}
                    <Link href="https://golos.io/">Войти в систему</Link>
                </Comment>
            </>
        );
    }

    _onAccountNameChange = e => {
        this.setState(
            {
                accountName: e.target.value.toLowerCase(),
            },
            () => {
                if (this._accountNameBlur) {
                    this._validateAccountName();
                }
            }
        );
    };

    _validateAccountName() {
        const { accountName } = this.state;

        let error = null;
        let errorText = null;

        const name = accountName.trim();

        if (!name) {
            error = true;
        } else if (/^[^a-z]/.test(name)) {
            error = true;
            errorText = 'Ник должен начинаться с буквы';
        } else if (!/^[a-z0-9]+$/.test(name)) {
            error = true;
            errorText = 'Ник может содержать только английские буквы и цифры';
        } else if (name.length < 6) {
            error = true;
            errorText = 'Слишком короткое имя (минимум 8 символов)';
        }

        this.setState({
            accountNameError: error,
            accountNameErrorText: errorText,
        });
    }

    _onAccountNameBlur = () => {
        this._accountNameBlur = true;
        this._validateAccountName();
    };

    _onEmailChange = e => {
        this.setState(
            {
                email: e.target.value,
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
            errorText = 'Введите корректный адрес электронной почты';
        }

        this.setState({
            emailError: error,
            emailErrorText: errorText,
        });
    };

    _onOkClick = () => {
        this._validateAccountName();
        this._validateEmail();
        this._validatePhone();

        setTimeout(() => {
            const {
                accountName,
                accountNameError,
                email,
                emailError,
                phone,
                phoneError,
            } = this.state;

            if (accountNameError || emailError || phoneError) {
                this._accountNameBlur = true;
                this._emailBlur = true;
                this._phoneBlur = true;

                // this.setState({
                //     errorText: 'Заполните все поля',
                // });
                // return;
            }

            this.props.onStepChange('2');
        }, 10);
    };

    _onPhoneChange = phone => {
        this.setState(
            {
                phone,
            },
            () => {
                if (this._phoneBlur) {
                    this._validatePhone();
                }
            }
        );
    };

    _onCodeChange = e => {
        this.setState({
            code: Number(e.target.value),
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
}
