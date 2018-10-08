import React, { PureComponent } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Title, Footer, Button } from './Common';
import Checkbox from './Checkbox';

const TitleStyled = styled(Title)`
    margin-left: -15px;
    margin-right: -15px;
`;

const Warning = styled.div`
    padding: 18px 20px;
    margin: 0 -4px;
    border: 1px solid #fc5d16;
    border-radius: 6px;
    line-height: 1.4em;
    font-size: 14px;
    font-weight: 300;
    color: #393636;
`;

const Red = styled.span`
    font-weight: bold;
    color: #fc5d16;
`;

const CheckboxField = styled.label`
    display: flex;
    align-items: center;
    height: 44px;
    margin: 20px 0 25px;
    user-select: none;
`;

const CheckboxText = styled.div`
    line-height: 1.4em;
    font-size: 14px;
    font-weight: 300;
    color: #393636;

    @media (max-width: 500px) {
        line-height: 20px;
        font-size: 15px;
    }
`;

const Error = styled.div`
    margin-bottom: 28px;
    font-size: 14px;
    font-weight: 300;
    color: #f00;
`;

const ButtonStyled = styled(Button)`
    ${is('blocked')`
        cursor: default;
        cursor: not-allowed;
        background: #89cbff;
    `};
`;

@injectIntl
export default class Step3 extends PureComponent {
    state = {
        error: false,
        isAgree: false,
    };

    render() {
        const { intl } = this.props;
        const { isAgree, error } = this.state;

        return (
            <>
                <TitleStyled>
                    <FormattedMessage id="step3.title" />
                </TitleStyled>
                <Warning>
                    <Red>
                        <FormattedMessage id="step3.warning" />
                    </Red>{' '}
                    <FormattedMessage id="step3.warningText" />
                </Warning>
                <CheckboxField>
                    <Checkbox
                        value={isAgree}
                        innerRef={this._onCheckboxRef}
                        onChange={value => this._onCheckChange(value)}
                    >
                        <CheckboxText>
                            {intl.messages['step3.term']}
                        </CheckboxText>
                    </Checkbox>
                </CheckboxField>
                {error ? (
                    <Error>
                        <FormattedMessage id="step2_wait.error" />
                    </Error>
                ) : null}
                <Footer>
                    <ButtonStyled blocked={!isAgree} onClick={this._onOkClick}>
                        {intl.messages['step3.generate']}
                    </ButtonStyled>
                </Footer>
            </>
        );
    }

    _onCheckboxRef = el => {
        this._checkbox = el;
    };

    _onCheckChange = checked => {
        this.setState({
            isAgree: checked,
        });
    };

    _onOkClick = async () => {
        const { isAgree } = this.state;

        if (!isAgree) {
            this._checkbox.focus();
            this.setState({
                error: true,
            });
            return;
        }

        window.app.passwordRulesAgreed();
    };
}
