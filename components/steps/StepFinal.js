import React, { PureComponent } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { Title, SubTitle, Footer, Button } from '../Common';

const Root = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media (max-width: 800px) {
        padding-top: 40px;
    }
`;

const MobileImg = styled.img`
    display: none;

    @media (max-width: 800px) {
        display: block;
        margin-top: 20px;
    }
`;

@injectIntl
export default class StepFinal extends PureComponent {
    render() {
        const { intl } = this.props;

        return (
            <Root>
                <Title>
                    <FormattedMessage
                        id="stepFinal.title"
                        values={{
                            username: process.browser
                                ? window.app.getAccountName()
                                : null,
                        }}
                    />
                </Title>
                <SubTitle>
                    <FormattedMessage id="stepFinal.subTitle" />
                </SubTitle>
                <Footer>
                    <a href="https://golos.io/welcome">
                        <Button>{intl.messages['stepFinal.go']}</Button>
                    </a>
                </Footer>
                <MobileImg src="/images/step_4.svg" />
            </Root>
        );
    }
}
