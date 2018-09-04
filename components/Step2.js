import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { Title, SubTitle, Footer, Button } from './Common';
import QuestionBlock from './QuestionBlock';

const QuestionBlockStyled = styled(QuestionBlock)`
    margin-bottom: 24px;
`;

const B = styled.b`
    font-weight: 700;
    color: #333;
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
                    <FormattedMessage
                        id="step2.subTitle"
                        values={{
                            code: <B>{this._code}</B>,
                            phone: <B>+46769438807</B>,
                        }}
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
