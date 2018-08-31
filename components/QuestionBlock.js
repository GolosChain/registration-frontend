import React, { PureComponent } from 'react';
import styled from 'styled-components';
import CollapsingBlock from './CollapsingBlock';

export const Root = styled.div`
    border: 1px solid #e1e1e1;
    border-radius: 6px;
`;

export const Text = styled.div`
    padding: 20px;
    line-height: 20px;
    font-size: 14px;
    font-weight: 300;
    letter-spacing: 0.5px;
    color: #959595;
`;

const CollapsingBlockStyled = styled(CollapsingBlock)`
    border-top: 1px solid #e1e1e1; 
`;

export const Answer = styled.div`
    padding: 4px 20px 20px;
    line-height: 1.4em;
    font-size: 14px;
    font-weight: 300;
    color: #959595;
`;

export default class QuestionBlock extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <Root className={className}>
                <Text>
                    Golos.io заинтересован в регистрации настоящих людей, а не
                    роботов. Именно поэтому мы просим отправить нам SMS на
                    указанный номер. Это система двойной проверки.
                </Text>
                <CollapsingBlockStyled
                    title={'Сколько это будет стоить?'}
                    initialCollapsed
                >
                    <Answer>Это будет стоить тебе ровно ничего.</Answer>
                </CollapsingBlockStyled>
                <CollapsingBlockStyled
                    title={'Я неверно ввел номер, что делать?'}
                    initialCollapsed
                >
                    <Answer>
                        Ты ровно ничего не можешь с этим сделать, смирись.
                    </Answer>
                </CollapsingBlockStyled>
            </Root>
        );
    }
}
