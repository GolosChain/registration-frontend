import React, { PureComponent, createRef } from 'react';
import styled from 'styled-components';
import { FormattedMessage, injectIntl } from 'react-intl';

import { B, Title, Footer, Button } from '../Common';
import CodeInput from '../CodeInput';
import ResendTimer from '../ResendTimer';

const OneWord = styled(B)`
    white-space: nowrap;
`;

const ChangeLink = styled.span`
    white-space: nowrap;
    color: #2879ff;
    text-decoration: underline;
    cursor: pointer;
    user-select: none;
`;

const Text = styled.div`
    line-height: 26px;
    font-size: 18px;
    text-align: center;
    color: #393636;
`;

const CodeInputStyled = styled(CodeInput)`
    margin-top: 40px;
`;

const ResendTimerStyled = styled(ResendTimer)`
    margin: 30px 0 40px;
`;

const ErrorBlock = styled.div`
    padding: 20px 0;
    text-align: center;
    color: #f00;
`;

@injectIntl
export default class EnterCode extends PureComponent {
    state = {
        lock: 0,
        code: null,
        isValid: false,
        errorMessage: null,
    };

    button = createRef();
    isFirstFill = true;

    componentDidMount() {
        window.app.on('phoneChanged', this.onPhoneChange);
    }

    componentWillUnmount() {
        this.unmount = true;
        window.app.off('phoneChanged', this.onPhoneChange);
    }

    async continue(silent = false) {
        await window.app.codeEntered(this.state.code, silent);
    }

    onPhoneChange = () => {
        this.forceUpdate();
    };

    onOkClick = async () => {
        this.setState({
            lock: this.state.lock + 1,
            errorMessage: null,
        });

        try {
            await this.continue();
        } catch (err) {
            this.setState({
                errorMessage: err.message,
            });
        }

        if (!this.unmount) {
            this.setState({
                lock: Math.max(0, this.state.lock - 1),
            });
        }
    };

    onChangePhoneClick = () => {
        window.app.openChangePhoneDialog();
    };

    onCodeChange = code => {
        const isValid = code.length === 4;

        this.setState(
            {
                lock: 0,
                code,
                isValid,
                errorMessage: null,
            },
            async () => {
                if (isValid && this.isFirstFill) {
                    this.isFirstFill = false;
                    this.button.current.focus();
                }

                if (isValid) {
                    try {
                        await this.continue(true);
                    } catch (err) {}
                }
            }
        );
    };

    processError(errorMessage) {
        const { intl } = this.props;

        if (errorMessage === 'Forbidden') {
            return intl.messages['step.enterCode.wrongCode'];
        }

        return errorMessage;
    }

    render() {
        const { intl } = this.props;
        const { isValid, errorMessage, lock } = this.state;

        return (
            <>
                <Title>
                    <FormattedMessage id="step.enterCode.title" />
                </Title>
                <Text>
                    <FormattedMessage
                        id="step.enterCode.text"
                        values={{
                            phone: <OneWord>+{window.app.getPhone()}</OneWord>,
                            change: (
                                <ChangeLink onClick={this.onChangePhoneClick}>
                                    {intl.messages['step.enterCode.change']}
                                </ChangeLink>
                            ),
                        }}
                    />
                </Text>
                <ResendTimerStyled />
                <CodeInputStyled onChange={this.onCodeChange} />
                <ErrorBlock>
                    {errorMessage ? (
                        <>
                            <FormattedMessage id="error" />:{' '}
                            {this.processError(errorMessage)}
                        </>
                    ) : null}
                </ErrorBlock>
                <Footer>
                    <Button
                        innerRef={this.button}
                        disabled={!isValid || lock}
                        onClick={this.onOkClick}
                    >
                        <FormattedMessage id="step.enterCode.ok" />
                    </Button>
                </Footer>
            </>
        );
    }
}
