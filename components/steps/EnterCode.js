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
    margin: 40px 0;
`;

const ResendTimerStyled = styled(ResendTimer)`
    margin: 30px 0 40px;
`;

@injectIntl
export default class EnterCode extends PureComponent {
    state = {
        code: null,
        isValid: false,
    };

    button = createRef();

    componentDidMount() {
        window.app.on('phoneChanged', this.onPhoneChange);
    }

    componentWillUnmount() {
        window.app.off('phoneChanged', this.onPhoneChange);
    }

    onPhoneChange = () => {
        this.forceUpdate();
    };

    onOkClick = () => {
        window.app.codeEntered(this.state.code);
    };

    onChangePhoneClick = () => {
        window.app.openChangePhoneDialog();
    };

    onCodeChange = code => {
        const isValid = code.length === 4;

        this.setState(
            {
                code,
                isValid,
            },
            () => {
                if (isValid) {
                    this.button.current.focus();
                }
            }
        );
    };

    render() {
        const { intl } = this.props;
        const { isValid } = this.state;

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
                <Footer>
                    <Button
                        innerRef={this.button}
                        disabled={!isValid}
                        onClick={this.onOkClick}
                    >
                        <FormattedMessage id="step.enterCode.ok" />
                    </Button>
                </Footer>
            </>
        );
    }
}
