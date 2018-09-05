import React, { PureComponent } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Title, SubTitle, Footer, Button } from './Common';

class StepFinal extends PureComponent {
    render() {
        const { intl } = this.props;

        return (
            <>
                <Title>
                    <FormattedMessage id="stepFinal.title" />
                </Title>
                <SubTitle>
                    <FormattedMessage id="stepFinal.subTitle" />
                </SubTitle>
                <Footer>
                    <a href="https://golos.io/">
                        <Button>{intl.messages['stepFinal.go']}</Button>
                    </a>
                </Footer>
            </>
        );
    }
}

export default injectIntl(StepFinal);
