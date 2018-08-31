import React, { PureComponent } from 'react';
import styled, { keyframes } from 'styled-components';

const Root = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Title = styled.div`
    margin-bottom: 14px;
    line-height: 1.4em;
    text-align: center;
    font-weight: 300;
    font-size: 17px;
    color: #333;
`;

const SubTitle = styled.div`
    text-align: center;
    font-size: 13px;
    font-weight: 300;
    color: #959595;
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
    width: 64px;
    height: 64px;
    margin-bottom: 40px;
    background: url('images/spin.svg') no-repeat;
    animation: ${steppedRotation} 1s steps(8) infinite;
`;

export default class Step2_Wait extends PureComponent {
    componentDidMount() {
        setTimeout(() => {
            this.props.onStepChange('3');
        }, 1000);
    }

    render() {
        return (
            <Root>
                <Loader />
                <Title>Дождитесь подтверждения вашего номера телефона.</Title>
                <SubTitle>Процесс может занять несколько минут.</SubTitle>
            </Root>
        );
    }
}
