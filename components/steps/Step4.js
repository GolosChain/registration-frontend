import React, { PureComponent, createRef } from 'react';
import styled from 'styled-components';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Title, Input, Footer, Button, Link } from '../Common';
import Checkbox from '../Checkbox';
import { generateRandomString } from '../../utils/random';
import generatePdf from '../../utils/pdf';

const PASSWORD_LENGTH = 52;

const CheckboxField = styled.label`
    display: flex;
    user-select: none;
`;

const CheckboxText = styled.div`
    line-height: 1.33em;
    font-size: 13px;
    color: #393636;

    @media (max-width: 500px) {
        line-height: 20px;
        font-size: 15px;
    }
`;

const Rules = styled.div`
    padding: 16px 20px;
    border: 1px solid #e1e1e1;
    border-bottom: none;
    border-radius: 6px 6px 0 0;
    line-height: 1.4em;
    font-size: 14px;
    font-weight: 300;
    color: #393636;
`;

const AnswerTitle = styled.div`
    margin-top: 14px;
    font-weight: bold;
`;

const AnswerList = styled.ol`
    margin: 9px 0 0;
    line-height: 1.3em;
    font-size: 14px;
    font-weight: 300;
    color: #393636;
`;

const Li = styled.li`
    display: flex;
    font-weight: 300;
    font-size: 14px;
    color: #393636;
    margin-bottom: 6px;

    &:last-child {
        margin-bottom: 0;
    }
`;

const Number = styled.div`
    width: 16px;
    margin-left: -4px;
    margin-right: 5px;
    text-align: center;
    flex-shrink: 0;
    font-weight: 700;
    color: #2879ff;
`;

const Checkboxes = styled.div`
    margin: 26px 0 22px;
`;

const ErrorBlock = styled.div`
    margin-top: 18px;
    text-align: center;
    font-size: 14px;
    font-weight: 300;
    color: #f00;
`;

const TextBlock = styled.div``;

const Caution = styled.span`
    font-weight: bold;
    color: #fc5d16;
`;

const Text = styled.span``;

const PasswordWrapper = styled.div`
    position: relative;
`;

const PasswordInput = styled(Input)`
    padding-right: 64px;
    border-radius: 0 0 6px 6px;
`;

const CopyButton = styled.button.attrs({ type: 'button' })`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    top: 1px;
    right: 1px;
    bottom: 1px;
    border-radius: 0 0 5px 0;
    background: #e1e1e1;
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover {
        background: #ccc;
    }
`;

const CopyIcon = styled.div`
    width: 20px;
    height: 20px;
    background: url('/images/copy.svg') no-repeat;
`;

@injectIntl
export default class Step3 extends PureComponent {
    state = {
        password: 'P' + generateRandomString(PASSWORD_LENGTH - 1),
        agreed: false,
        errorText: null,
        lock: false,
    };

    password = createRef();

    render() {
        const { intl } = this.props;
        const { password, errorText, lock } = this.state;

        return (
            <>
                <Title>
                    <FormattedMessage id="step4.title" />
                </Title>
                <Rules>
                    <TextBlock>
                        <Caution>
                            <FormattedMessage id="step3.warning" />
                        </Caution>{' '}
                        <Text>
                            <FormattedMessage id="step4.text" />
                        </Text>
                    </TextBlock>
                    <AnswerTitle>
                        <FormattedMessage id="step4.answerTitle" />
                    </AnswerTitle>
                    <AnswerList>{this._renderAnswers()}</AnswerList>
                </Rules>
                <PasswordWrapper>
                    <PasswordInput
                        innerRef={this.password}
                        gray
                        readOnly
                        value={password}
                        onFocus={this._onPasswordFocus}
                    />
                    {document.execCommand ? (
                        <CopyButton
                            title={intl.messages['step4.copy']}
                            onClick={this.onCopyClick}
                        >
                            <CopyIcon />
                        </CopyButton>
                    ) : null}
                </PasswordWrapper>
                {this.renderCheckboxesBlock()}
                <Footer>
                    <Button disabled={lock} onClick={this._onOkClick}>
                        <FormattedMessage id="step4.create" />
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

    renderCheckboxesBlock() {
        const { intl } = this.props;
        const { lock, agreed } = this.state;

        return (
            <Checkboxes>
                <CheckboxField>
                    <Checkbox
                        disabled={lock}
                        value={agreed}
                        onChange={this._onCheckChange}
                    >
                        <CheckboxText>
                            {linkify(intl.messages['step4.terms'])}
                        </CheckboxText>
                    </Checkbox>
                </CheckboxField>
            </Checkboxes>
        );
    }

    _renderAnswers() {
        const { intl } = this.props;

        const lines = [];

        for (let i = 1; ; ++i) {
            const message = intl.messages[`step4.qa2.answer${i}`];

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

    _onCheckChange = value => {
        this.setState({
            agreed: value,
        });
    };

    _onPasswordFocus = e => {
        try {
            e.target.setSelectionRange(0, 100);
        } catch (err) {}
    };

    _onOkClick = async () => {
        const { intl } = this.props;
        const { password, agreed } = this.state;

        let isError = false;
        let errorText = null;

        if (!password) {
            isError = true;
            errorText = intl.messages['step4.error.createPassword'];
        } else if (!agreed) {
            isError = true;
            errorText = intl.messages['step4.error.checkAll'];
        }

        if (isError) {
            this._showError(errorText || 'Error');
            return;
        }

        this.setState({
            errorText: null,
            lock: true,
        });

        try {
            const error = await window.app.finishRegistration(password);

            if (error) {
                this.setState({ lock: false });
                this._showError(
                    `${intl.messages.error}: ${error.code} ${error.message}`
                );
            } else {
                this.downloadPdf();
            }
        } catch (err) {
            this.setState({ lock: false });
            this._showError(`${intl.messages.error}: ${err}`);
        }
    };

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

    downloadPdf = () => {
        generatePdf(window.app.getAccountName(), this.state.password);
    };

    onCopyClick = e => {
        e.preventDefault();

        this.password.current.select();
        document.execCommand('copy');
    };
}

function linkify(message) {
    const parts = [];

    message.replace(/\[(.+)\]/, (all, match, index) => {
        parts.push(message.substr(0, index));
        parts.push(
            <Link
                key="link"
                href="https://golos.io/ru--konfidenczialxnostx/@golos/politika-konfidencialnosti"
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
