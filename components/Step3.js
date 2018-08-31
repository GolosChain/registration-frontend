import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Title, Input, Footer, Button } from './Common';
import { Field, FieldLabel, FieldInput, Link } from './Common';
import CollapsingBlock from './CollapsingBlock';
import { Answer, Root as QABlock } from './QuestionBlock';
import Checkbox from './Checkbox';

const CheckboxField = styled.label`
    display: flex;
    align-items: center;
    height: 44px;
    cursor: pointer !important;
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

export default class Step3 extends PureComponent {
    state = {
        rules: new Set(),
    };

    render() {
        const { rules } = this.state;

        const rulesList = [
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
                <Field>
                    <FieldLabel>Сгенерированный пароль</FieldLabel>
                    <FieldInput>
                        <Input blue />
                    </FieldInput>
                </Field>
                <Field>
                    <FieldLabel>Введите сгенерированный пароль</FieldLabel>
                    <FieldInput>
                        <Input type="password" />
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
                    <Button>Создать аккаунт</Button>
                </Footer>
            </>
        );
    }

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
}
