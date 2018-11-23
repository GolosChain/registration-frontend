import React, { PureComponent, createRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button } from './Common';
import phoneCodes from '../app/phoneCodes.json';
import PhoneBlock from './PhoneBlock';
import Captcha from './Captcha';
import { STRATEGIES } from '../app/Application';

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

export const Root = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    z-index: 10;
    animation: ${fadeIn} 0.25s;
`;

export const Bg = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(50, 50, 50, 0.7);
`;

const DialogWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    padding: 40px 0;
`;

const Dialog = styled.div`
    position: relative;
    flex-basis: 290px;
    padding: 28px;
    border-radius: 8px;
    background: #fff;

    @media (max-width: 500px) {
        width: 100%;
        border-radius: 0;
    }
`;

const Header = styled.div`
    padding-top: 4px;
    text-align: center;
    font-size: 24px;
    font-weight: 700;
`;

const Wrapper = styled.div`
    margin: 30px 0;
`;

const Footer = styled.div`
    display: flex;
    justify-content: center;
`;

const ErrorBlock = styled.div`
    margin: 20px 0;
    color: #f00;
`;

const CaptchaWrapper = styled.div`
    margin: 30px 0;
`;

@injectIntl
export default class ChangePhoneDialog extends PureComponent {
    constructor(props) {
        super(props);

        const { code, phone, codeIndex } = window.app.getPhoneData();

        this.state = {
            codeIndex:
                codeIndex || phoneCodes.list.findIndex(c => c.code === code),
            phone,
            errorText: null,
            withCaptcha: window.app.getStrategy() === STRATEGIES.SMS_TO_USER,
        };
    }

    captcha = createRef();

    componentDidMount() {
        document.body.style.overflowY = 'hidden';
    }

    componentWillUnmount() {
        document.body.style.overflowY = 'auto';
    }

    render() {
        const { codeIndex, phone, errorText, withCaptcha } = this.state;

        return (
            <Root>
                <Bg onClick={this._onCloseClick} />
                <DialogWrapper>
                    <Dialog>
                        <Header>
                            <FormattedMessage id="change_phone" />
                        </Header>
                        <Wrapper>
                            <PhoneBlock
                                codeIndex={codeIndex}
                                onCodeChange={this._onCodeChange}
                                phone={phone}
                                onPhoneChange={this._onPhoneChange}
                            />
                        </Wrapper>
                        {withCaptcha ? (
                            <CaptchaWrapper>
                                <Captcha ref={this.captcha} />
                            </CaptchaWrapper>
                        ) : null}
                        {errorText ? (
                            <ErrorBlock>{errorText}</ErrorBlock>
                        ) : null}
                        <Footer>
                            <Button onClick={this._onOkClick}>
                                <FormattedMessage id="step2_change.ok" />
                            </Button>
                        </Footer>
                    </Dialog>
                </DialogWrapper>
            </Root>
        );
    }

    _onCloseClick = () => {
        this.props.onClose();
    };

    _onCodeChange = value => {
        if (value === '') {
            return;
        }

        this.setState({
            codeIndex: value,
        });
    };

    _onPhoneChange = phone => {
        this.setState({
            phone,
        });
    };

    _onOkClick = async () => {
        const { intl } = this.props;
        const { codeIndex, phone, withCaptcha } = this.state;

        const code = phoneCodes.list[codeIndex].code;

        const params = {
            code,
            phone,
        };

        if (withCaptcha) {
            const captchaCode = this.captcha.current.getCode();

            if (!captchaCode) {
                this.setState({
                    errorText: 'Captcha error',
                });
                return;
            }

            params.captcha = captchaCode;
        }

        try {
            await window.app.updatePhone(params);
        } catch (err) {
            if (err && err.message === 'Phone already registered.') {
                this.setState({
                    errorText: intl.messages['step2_change.phoneExists'],
                });
            } else {
                this.setState({
                    errorText: (err && err.message) || 'Error',
                });
            }
        }
    };
}
