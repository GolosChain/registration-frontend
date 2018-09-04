import React, { PureComponent } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import { injectIntl, FormattedMessage } from 'react-intl';
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
    margin: 24px 0;
`;

const Description = styled.div`
    margin-top: 14px;
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

class Step3 extends PureComponent {
    state = {
        password: '',
        password2: '',
        rules: new Set(),
        errorText: null,
        lock: false,
    };

    render() {
        const { intl } = this.props;
        const { password, password2, rules, errorText, lock } = this.state;

        const rulesList = this._getRulesList();

        return (
            <>
                <Title>
                    <FormattedMessage id="step3.title" />
                </Title>
                <QABlock>
                    <CollapsingBlockStyled
                        title={intl.messages['step3.qa1.title']}
                        initialCollapsed
                    >
                        <Answer>
                            <FormattedMessage id="step3.qa1.answer" />
                        </Answer>
                    </CollapsingBlockStyled>
                    <CollapsingBlockStyled
                        title={intl.messages['step3.qa2.title']}
                        initialCollapsed
                    >
                        <AnswerList>
                            <ol>{this._renderAnswers()}</ol>
                        </AnswerList>
                    </CollapsingBlockStyled>
                </QABlock>
                <ButtonPanel>
                    <Button disabled={lock} onClick={this._onGenerateClick}>
                        {intl.messages['step3.generate']}
                    </Button>
                    <Description>
                        <FormattedMessage id="step3.generateHint" />
                    </Description>
                </ButtonPanel>
                <Field>
                    <FieldLabel readOnly>
                        <FormattedMessage id="step3.passwordLabel" />
                    </FieldLabel>
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
                    <FieldLabel>
                        <FormattedMessage id="step3.password2Label" />
                    </FieldLabel>
                    <FieldInput>
                        <InputPassword2
                            type="password"
                            disabled={lock}
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
                                disabled={lock}
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
                    <Button disabled={lock} onClick={this._onOkClick}>
                        <FormattedMessage id="step3.create" />
                    </Button>
                    {errorText ? (
                        <ErrorBlock innerRef={el => (this._errorEl = el)}>
                            {errorText}
                        </ErrorBlock>
                    ) : null}
                </Footer>
            </>
        );
    }

    _renderAnswers() {
        const { intl } = this.props;

        const lines = [];

        for (let i = 1; ; ++i) {
            const message = intl.messages[`step3.qa2.answer${i}`];

            if (!message) {
                break;
            }

            lines.push(
                <Li key={i}>
                    <Number>{i}</Number>
                    {message}
                </Li>
            );
        }

        return lines;
    }

    _getRulesList() {
        const { intl } = this.props;

        return [
            {
                id: 'recovery',
                content: linkify(intl.messages['step3.term1']),
            },
            {
                id: 'safe',
                content: intl.messages['step3.term2'],
            },
            {
                id: 'terms',
                content: intl.messages['step3.term3'],
            },
        ];
    }

    _onGenerateClick = () => {
        this.setState(
            {
                password: 'P' + generateRandomString(PASSWORD_LENGTH - 1),
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

    _onOkClick = async () => {
        const { intl } = this.props;
        const { password, password2, rules } = this.state;

        let errorText = null;

        if (!password) {
            errorText = intl.messages['step3.error.createPassword'];
        } else if (password !== password2) {
            errorText = intl.messages['step3.error.passwordsNotEqual'];
        } else if (rules.size < this._getRulesList().length) {
            errorText = intl.messages['step3.error.checkAll'];
        }

        if (errorText) {
            this._showError(errorText);
            return;
        }

        this.setState({
            errorText: null,
        });

        this.setState({
            lock: true,
        });

        try {
            const error = await window.app.finishRegistration(password);

            if (error) {
                this.setState({
                    lock: false,
                });
                this._showError(
                    `${intl.messages.error}: ${error.code} ${error.message}`
                );
            } else {
                location.href = 'https://golos.io/';
            }
        } catch (err) {
            this.setState({
                lock: false,
            });
            this._showError(`: ${err}`);
        }
    };

    _showError(errorText) {
        this.setState(
            {
                errorText,
            },
            () => {
                this._errorEl.scrollIntoViewIfNeeded();
            }
        );
    }
}

function linkify(message) {
    const parts = [];

    message.replace(/\[(.+)\]/, (all, match, index) => {
        parts.push(message.substr(0, index));
        parts.push(
            <Link
                key="link"
                href="/ru--konfidenczialxnostx/@golos/politika-konfidencialnosti"
                tabIndex="-1"
                target="_blank"
            >
                {match}
            </Link>
        );
        parts.push(message.substr(index + all.length, message.length));
    });

    return parts;
}

export default injectIntl(Step3);
