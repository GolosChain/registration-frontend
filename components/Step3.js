import React, { PureComponent } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import { Title, Input, Footer, Button } from './Common';
import { Field, FieldLabel, FieldInput, Link } from './Common';
import CollapsingBlock from './CollapsingBlock';
import { Answer, Root as QABlock } from './QuestionBlock';
import Checkbox from './Checkbox';
import { generateRandomString } from '../utils/random';

const PASSWORD_LENGTH = 52;

const CheckboxField = styled.label`
    display: flex;
    align-items: center;
    height: 44px;
    user-select: none;
`;

const CheckboxText = styled.div`
    line-height: 14px;
    font-size: 12px;
    font-weight: 300;
    color: #959595;
`;

const CollapsingBlockStyled = styled(CollapsingBlock)`
    border-bottom: 1px solid #e1e1e1;

    &:last-child {
        border-bottom: none;
    }
`;

const AnswerList = styled(Answer)`
    cursor: initial;
`;

const Li = styled.li`
    display: flex;
    font-weight: 300;
    font-size: 14px;
    color: #757575;
    margin-bottom: 14px;

    &:last-child {
        margin-bottom: 0;
    }
`;

const Number = styled.div`
    width: 16px;
    margin-left: -4px;
    margin-right: 8px;
    text-align: center;
    flex-shrink: 0;
    font-weight: 700;
    color: #2879ff;
`;

const Checkboxes = styled.div`
    margin-bottom: 20px;
`;

const ButtonPanel = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 18px 0;
`;

const Description = styled.div`
    margin-top: 12px;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.4em;
    text-align: center;
    color: #959595;
`;

const Code = styled.code`
    font-family: Monospaced, monospace;
    color: #333;
`;

const InputPassword2 = styled(Input)`
    ${is('pass')`
        border-color: #11b506;            
        background: #ecffd0;
    `};
`;

const ErrorBlock = styled.div`
    margin-top: 18px;
    text-align: center;
    font-size: 14px;
    font-weight: 300;
    color: #f00;
`;

export default class Step3 extends PureComponent {
    state = {
        password: '',
        password2: '',
        rules: new Set(),
        errorText: null,
    };

    render() {
        const { password, password2, rules, errorText } = this.state;

        const rulesList = this._getRulesList();

        return (
            <>
                <Title>Сохранить пароль</Title>
                <QABlock>
                    <CollapsingBlockStyled
                        title={'Важно! Мы не храненим пароли'}
                        initialCollapsed
                    >
                        <Answer>
                            Мы не храним пароли и не сможем восстановить ваш
                            пароль, если он будет утерян. Поэтому обязательно
                            сохраните сгенерированный для вас пароль в текстовом
                            файле или сделайте копию в менеджере паролей. А еще
                            лучше, распечатайте его.
                        </Answer>
                    </CollapsingBlockStyled>
                    <CollapsingBlockStyled
                        title={'Правила хранения пароля'}
                        initialCollapsed
                    >
                        <AnswerList>
                            <ol>
                                <Li>
                                    <Number>1</Number>
                                    Не теряйте свой пароль.
                                </Li>
                                <Li>
                                    <Number>2</Number>
                                    Не теряйте свой пароль.
                                </Li>
                                <Li>
                                    <Number>3</Number>
                                    Мы не можем восстановить Ваш пароль.
                                </Li>
                                <Li>
                                    <Number>4</Number>
                                    Если Вы можете запомнить свой пароль, значит
                                    он не безопасен.
                                </Li>
                                <Li>
                                    <Number>5</Number>
                                    Используйте только сгенерированные случайным
                                    образом пароли.
                                </Li>
                                <Li>
                                    <Number>6</Number>
                                    Никому не говорите свой пароль.
                                </Li>
                                <Li>
                                    <Number>7</Number>
                                    Всегда надежно храните свой пароль.
                                </Li>
                            </ol>
                        </AnswerList>
                    </CollapsingBlockStyled>
                </QABlock>
                <ButtonPanel>
                    <Button onClick={this._onGenerateClick}>
                        Сгенерировать пароль
                    </Button>
                    <Description>
                        Пароль будет сгенерирован с помощью браузерного API{' '}
                        <Code>crypto.getRandomValues()</Code>.
                    </Description>
                </ButtonPanel>
                <Field>
                    <FieldLabel readOnly>Сгенерированный пароль</FieldLabel>
                    <FieldInput>
                        <Input
                            blue
                            readOnly
                            value={password}
                            innerRef={this._onPasswordRef}
                            onFocus={this._onPasswordFocus}
                        />
                    </FieldInput>
                </Field>
                <Field>
                    <FieldLabel>Введите сгенерированный пароль</FieldLabel>
                    <FieldInput>
                        <InputPassword2
                            type="password"
                            pass={password && password === password2}
                            value={password2}
                            onChange={this._onPassword2Change}
                        />
                    </FieldInput>
                </Field>
                <Checkboxes>
                    {rulesList.map(rule => (
                        <CheckboxField key={rule.id}>
                            <Checkbox
                                value={rules.has(rule.id)}
                                onChange={value =>
                                    this._onCheckChange(rule.id, value)
                                }
                            >
                                <CheckboxText>{rule.content}</CheckboxText>
                            </Checkbox>
                        </CheckboxField>
                    ))}
                </Checkboxes>
                <Footer>
                    <Button onClick={this._onOkClick}>Создать аккаунт</Button>
                    {errorText ? <ErrorBlock>{errorText}</ErrorBlock> : null}
                </Footer>
            </>
        );
    }

    _getRulesList() {
        return [
            {
                id: 'recovery',
                content: (
                    <>
                        Я прочитал и согласен с{' '}
                        <Link
                            href="/ru--konfidenczialxnostx/@golos/politika-konfidencialnosti"
                            target="_blank"
                        >
                            Условиями пользования
                        </Link>
                    </>
                ),
            },
            {
                id: 'safe',
                content: <>Я надежно сохранил сгенерированный пароль.</>,
            },
            {
                id: 'terms',
                content: (
                    <>
                        Я понимаю, что Golos.io не может восстановить потерянные
                        пароли.
                    </>
                ),
            },
        ];
    }

    _onGenerateClick = () => {
        this.setState(
            {
                password: generateRandomString(PASSWORD_LENGTH),
            },
            () => {
                this._passwordInput.focus();
            }
        );
    };

    _onPassword2Change = e => {
        this.setState({
            password2: e.target.value,
        });
    };

    _onCheckChange = (ruleId, value) => {
        const rules = new Set(this.state.rules);

        if (value) {
            rules.add(ruleId);
        } else {
            rules.delete(ruleId);
        }

        this.setState({
            rules,
        });
    };

    _onPasswordRef = el => {
        this._passwordInput = el;
    };

    _onPasswordFocus = e => {
        try {
            e.target.setSelectionRange(0, 100);
        } catch (err) {}
    };

    _onOkClick = () => {
        const { password, password2, rules } = this.state;

        let errorText = null;

        if (!password || password.length !== PASSWORD_LENGTH) {
            errorText = 'Создайте пароль';
        } else if (password !== password2) {
            errorText = 'Пароли не совпадают';
        } else if (rules.size < this._getRulesList().length) {
            errorText = 'Вы должны подтвердить все пункты.';
        }

        if (errorText) {
            this.setState({
                errorText,
            });
            return;
        }

        this.setState({
            errorText: null,
        });

        alert('START REGISTRATION');
    };
}
