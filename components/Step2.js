import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Title, SubTitle, Dots, Dot, Footer, Button } from './Common';
import QuestionBlock from './QuestionBlock';

const B = styled.b`
    font-weight: 700;
    color: #333;
`;

const QuestionBlockStyled = styled(QuestionBlock)`
    margin-bottom: 24px;
`;

export default class Step2 extends PureComponent {
    render() {
        return (
            <>
                <Title>Верификация</Title>
                <SubTitle>
                    Для подтверждения вашего номера телефона, пожалуйста,
                    отправьте SMS с текстом: <B>F96TY4</B> на номер{' '}
                    <B>+46769438807</B>
                </SubTitle>
                <QuestionBlockStyled />
                <Footer>
                    <Button onClick={this._onOkClick}>Я отправил смс</Button>
                </Footer>
            </>
        );
    }

    _onOkClick = () => {
        this.props.onStepChange('2_wait');
    };
}
