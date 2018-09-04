import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { Title, SubTitle, Footer, Button } from './Common';
import QuestionBlock from './QuestionBlock';

const QuestionBlockStyled = styled(QuestionBlock)`
    margin-bottom: 24px;
`;

export default class Step2 extends PureComponent {
    _code = generateRandomCode();

    render() {
        return (
            <>
                <Title>
                    <FormattedMessage id="step2.title" />
                </Title>
                <SubTitle>
                    <FormattedHTMLMessage
                        id="step2.subTitle"
                        values={{ code: this._code, phone: '+46769438807' }}
                    />
                </SubTitle>
                <QuestionBlockStyled />
                <Footer>
                    <Button onClick={this._onOkClick}>
                        <FormattedMessage id="step2.ok" />
                    </Button>
                </Footer>
            </>
        );
    }

    _onOkClick = () => {
        this.props.onStepChange('2_wait');
    };
}

function generateRandomCode() {
    let code = null;

    do {
        code = Math.floor(10000 * Math.random()).toString();
    } while (code.length !== 4);

    return code;
}
