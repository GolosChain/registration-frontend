import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { B, Title, SubTitle, Footer, Button } from './Common';
import QuestionBlock from './QuestionBlock';

const OneWord = styled(B)`
    white-space: nowrap;
`;

const QuestionBlockStyled = styled(QuestionBlock)`
    margin-bottom: 24px;
`;

export default class Step2 extends PureComponent {
    componentDidMount() {
        window.app.on('phoneChanged', this._onPhoneChange);
    }

    componentWillUnmount() {
        window.app.off('phoneChanged', this._onPhoneChange);
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
                            code: (
                                <OneWord>{window.app.getSecretCode()}</OneWord>
                            ),
                            phone: (
                                <OneWord>
                                    {window.app.getVerificationPhoneNumber()}
                                </OneWord>
                            ),
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
