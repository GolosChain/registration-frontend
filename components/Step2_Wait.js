import React, { PureComponent } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import styled, { keyframes } from 'styled-components';
import { B, PseudoLink } from './Common';
import { formatPhone } from '../utils/phone';

const Root = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media (max-width: 800px) {
        padding-top: 60px;
    }
`;

const Title = styled.div`
    margin-bottom: 14px;
    line-height: 1.4em;
    text-align: center;
    font-weight: 300;
    font-size: 17px;
    color: #333;
`;

const steppedRotation = keyframes`
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(1turn);
    }
`;

const Loader = styled.div`
    display: inline-block;
    width: 64px;
    height: 64px;
    margin-bottom: 40px;
    background: url('/images/spin.svg') no-repeat;
    animation: ${steppedRotation} 0.8s steps(8) infinite;
`;

const MobileImg = styled.img`
    display: none;

    @media (max-width: 800px) {
        display: block;
        margin-top: 40px;
    }
`;

const Footer = styled.div`
    text-align: center;
    margin-top: 6px;
    line-height: 1.4em;
    font-size: 13px;
    color: #959595;
`;

@injectIntl
export default class Step2_Wait extends PureComponent {
    render() {
        const { intl } = this.props;

        return (
            <Root>
                <Loader />
                <Title>
                    <FormattedMessage id="step2_wait.title" />
                </Title>
                <Footer>
                    <FormattedMessage
                        id="step2.quest2.answer"
                        values={{
                            phone: <B>+{formatPhone(window.app.getPhone())}</B>,
                            change: (
                                <PseudoLink onClick={this._onChangePhoneClick}>
                                    {intl.messages['step2.quest2.change']}
                                </PseudoLink>
                            ),
                        }}
                    />
                </Footer>
                <MobileImg src="/images/step_2.svg" />
            </Root>
        );
    }

    _onChangePhoneClick = () => {
        window.app.openChangePhoneDialog();
    };
}
