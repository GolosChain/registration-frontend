import React, { PureComponent } from 'react';
import styled, { keyframes } from 'styled-components';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Field, FieldLabel, FieldInput, Button } from './Common';
import Select from './Select';
import phoneCodes from '../app/phoneCodes';
import PhoneInput from './PhoneInput';

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
    width: 400px;
    padding: 28px;
    border-radius: 8px;
    background: #fff;
`;

const Header = styled.div`
    padding: 4px 0 24px 0;
    text-align: center;
    font-size: 24px;
    font-weight: 700;
`;

const Footer = styled.div`
    display: flex;
    justify-content: center;
`;

const ErrorBlock = styled.div`
    padding-top: 10px;
    color: #f00;
`;

class ChangePhoneDialog extends PureComponent {
    constructor() {
        super();

        const { code, phone } = window.app.getPhoneData();

        this.state = {
            code,
            phone,
            errorText: null,
        };
    }

    componentDidMount() {
        document.body.style.overflowY = 'hidden';
    }

    componentWillUnmount() {
        document.body.style.overflowY = 'auto';
    }

    render() {
        const { code, phone, errorText } = this.state;

        return (
            <Root>
                <Bg onClick={this._onCloseClick} />
                <DialogWrapper>
                    <Dialog>
                        <Header>Сменить номер</Header>
                        <FieldLabel>
                            <FormattedMessage id="step1.phoneCodeLabel" />
                        </FieldLabel>
                        <FieldInput>
                            <Select
                                value={code}
                                items={phoneCodes}
                                onChange={this._onCodeChange}
                            />
                        </FieldInput>
                        <Field>
                            <FieldLabel>
                                <FormattedMessage id="step1.phoneLabel" />{' '}
                            </FieldLabel>
                            <FieldInput>
                                <PhoneInput
                                    code={`+${code}`}
                                    value={phone}
                                    autoCorrect="off"
                                    autoapitalize="off"
                                    checkSpell="false"
                                    onChange={this._onPhoneChange}
                                />
                            </FieldInput>
                        </Field>
                        <Footer>
                            <Button onClick={this._onOkClick}>
                                <FormattedMessage id="step2_change.ok" />
                            </Button>
                        </Footer>
                        {errorText ? (
                            <ErrorBlock>{errorText}</ErrorBlock>
                        ) : null}
                    </Dialog>
                </DialogWrapper>
            </Root>
        );
    }

    _onCloseClick = () => {
        this.props.onClose();
    };

    _onCodeChange = code => {
        this.setState({
            code,
        });
    };

    _onPhoneChange = phone => {
        this.setState({
            phone,
        });
    };

    _onOkClick = async () => {
        const { code, phone } = this.state;

        try {
            await window.app.updatePhone({ code, phone });
        } catch (err) {
            this.setState({
                errorText: err.message,
            });
        }
    };
}

export default injectIntl(ChangePhoneDialog);
