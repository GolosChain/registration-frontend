import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Title, SubTitle, Input, Footer, Button } from './Common';
import { Field, FieldLabel, FieldInput, Link } from './Common';
import PhoneInput from './PhoneInput';
import Select from './Select';

const Comment = styled.div`
    margin: 14px 0 24px;
    text-align: center;
    font-size: 14px;
    color: #999;
`;

export default class Step1 extends PureComponent {
    state = {
        code: 7,
        phone: '',
    };

    render() {
        const { code, phone } = this.state;

        return (
            <>
                <Title>Регистрация</Title>
                <SubTitle>
                    Пишите, фотографируете, комментируйте и получайте награду за
                    любое действие.
                </SubTitle>
                <Field>
                    <FieldLabel>Имя</FieldLabel>
                    <FieldInput>
                        <Input />
                    </FieldInput>
                </Field>
                <Field>
                    <FieldLabel>Электронная почта</FieldLabel>
                    <FieldInput>
                        <Input placeholder="golos@gmail.com" />
                    </FieldInput>
                </Field>
                <Field>
                    <FieldLabel>Выберите из списка код страны</FieldLabel>
                    <FieldInput>
                        <Select
                            value={code}
                            items={[
                                {
                                    value: '1',
                                    label: 'USA (+1)',
                                },
                                {
                                    value: '7',
                                    label: 'Russia (+7)',
                                },
                                {
                                    value: '385',
                                    label: 'Belarus (+385)',
                                },
                            ]}
                            onChange={this._onCodeChange}
                        />
                    </FieldInput>
                </Field>
                <Field>
                    <FieldLabel>Введите номер вашего телефона</FieldLabel>
                    <FieldInput>
                        <PhoneInput
                            code={`+${code}`}
                            value={phone}
                            onChange={this._onPhoneChange}
                        />
                    </FieldInput>
                </Field>
                <Footer>
                    <Button onClick={this._onOkClick}>Продолжить</Button>
                </Footer>
                <Comment>
                    У вас уже есть аккаунт?{' '}
                    <Link href="https://golos.io/">Войти в систему</Link>
                </Comment>
            </>
        );
    }

    _onOkClick = () => {
        this.props.onStepChange('2');
    };

    _onPhoneChange = phone => {
        this.setState({
            phone,
        });
    };

    _onCodeChange = e => {
        this.setState({
            code: Number(e.target.value),
        });
    };
}
