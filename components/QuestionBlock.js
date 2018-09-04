import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { injectIntl, FormattedMessage } from 'react-intl';
import CollapsingBlock from './CollapsingBlock';

export const Root = styled.div`
    border: 1px solid #e1e1e1;
    border-radius: 6px;
`;

export const Text = styled.div`
    padding: 16px 20px;
    line-height: 20px;
    font-size: 14px;
    font-weight: 300;
    letter-spacing: 0.5px;
    color: #959595;

    @media (max-width: 500px) {
        font-size: 16px;
    }
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

    @media (max-width: 500px) {
        font-size: 16px;
    }
`;

class QuestionBlock extends PureComponent {
    render() {
        const { intl } = this.props;
        const { className } = this.props;

        return (
            <Root className={className}>
                <Text>
                    <FormattedMessage id="step2.text" />
                </Text>
                <CollapsingBlockStyled
                    title={intl.messages['step2.quest1.quest']}
                    initialCollapsed
                >
                    <Answer>
                        <FormattedMessage id="step2.quest1.answer" />
                    </Answer>
                </CollapsingBlockStyled>
                <CollapsingBlockStyled
                    title={intl.messages['step2.quest2.quest']}
                    initialCollapsed
                >
                    <Answer>
                        <FormattedMessage id="step2.quest2.answer" />
                    </Answer>
                </CollapsingBlockStyled>
            </Root>
        );
    }
}

export default injectIntl(QuestionBlock);
