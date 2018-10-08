import React, { PureComponent } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import styled, { keyframes } from 'styled-components';
import { B, Link, PseudoLink } from './Common';
import { formatPhone } from '../utils/phone';
import phoneCodes from '../app/phoneCodes';

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

const Part = styled.div`
    text-align: center;
    margin: 6px 0 13px;
    line-height: 1.5em;
    font-size: 14px;
    color: #999;
`;

const LinkStyled = styled(Link)`
    white-space: nowrap;
`;

@injectIntl
export default class Step2_Wait extends PureComponent {
    render() {
        const { intl } = this.props;

        const { phone, codeIndex, secret } = window.app.getRegInfo();

        const verificationPhone = phoneCodes[codeIndex].verificationPhone;

        return (
            <Root>
                <Loader />
                <Title>
                    <FormattedMessage id="step2_wait.title" />
                </Title>
                <Part>
                    <FormattedMessage
                        id="step2.quest2.answer"
                        values={{
                            phone: <B>+{formatPhone(phone)}</B>,
                            change: (
                                <PseudoLink onClick={this._onChangePhoneClick}>
                                    {intl.messages['step2.quest2.change']}
                                </PseudoLink>
                            ),
                        }}
                    />
                </Part>
                <Part>
                    <FormattedMessage
                        id="step2.quest3.answer"
                        values={{
                            code: <B>{secret}</B>,
                            phone: <B>{verificationPhone}</B>,
                            mail: (
                                <LinkStyled href="mailto:support@golos.io">
                                    {intl.messages['step2.quest3.mail']}
                                </LinkStyled>
                            ),
                            support: (
                                <LinkStyled
                                    target="_blank"
                                    href={
                                        intl.messages['step2.quest3.supportUrl']
                                    }
                                >
                                    {intl.messages['step2.quest3.support']}
                                </LinkStyled>
                            ),
                            newline: <br />,
                        }}
                    />
                </Part>
                <MobileImg src="/images/step_2.svg" />
            </Root>
        );
    }

    _onChangePhoneClick = () => {
        window.app.openChangePhoneDialog();
    };
}
