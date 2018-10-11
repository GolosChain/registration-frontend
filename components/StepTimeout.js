import React, { PureComponent } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { Title, SubTitle, Footer, Button } from './Common';

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
        width: 180px;
        margin-bottom: 30px;
    }
`;

@injectIntl
export default class StepFinal extends PureComponent {
    render() {
        const { intl } = this.props;

        return (
            <Root>
                <MobileImg src="/images/step_error.svg" />
                <Title>
                    <FormattedMessage id="stepTimeout.title" />
                </Title>
                <SubTitle>
                    <FormattedMessage id="stepTimeout.subTitle" />
                </SubTitle>
                <Footer>
                    <Button onClick={this._onOkClick}>
                        {intl.messages['stepTimeout.go']}
                    </Button>
                </Footer>
            </Root>
        );
    }

    _onOkClick = () => {
        window.app.resetRegistration();
    };
}
