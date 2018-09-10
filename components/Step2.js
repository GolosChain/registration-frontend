import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { B, Title, SubTitle, Footer, Button } from './Common';
import QuestionBlock from './QuestionBlock';

const QuestionBlockStyled = styled(QuestionBlock)`
    margin-bottom: 24px;
`;

export default class Step2 extends PureComponent {
    _code = generateRandomCode();

    componentDidMount() {
        window.app.on('phoneChange', this._onPhoneChange);
    }

    componentWillUnmount() {
        window.app.off('phoneChange', this._onPhoneChange);
    }

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
                <QuestionBlockStyled
                    phone={window.app.getPhone()}
                    onChangeClick={this._onChangePhoneClick}
                />
                <Footer>
                    <Button onClick={this._onOkClick}>
                        <FormattedMessage id="step2.ok" />
                    </Button>
                </Footer>
            </>
        );
    }

    _onPhoneChange = () => {
        this.forceUpdate();
    };

    _onOkClick = () => {
        this.props.onStepChange('2_wait');
    };

    _onChangePhoneClick = () => {
        window.app.openChangePhoneDialog();
    };
}

function generateRandomCode() {
    let code = null;

    do {
        code = Math.floor(10000 * Math.random()).toString();
    } while (code.length !== 4);

    return code;
}
