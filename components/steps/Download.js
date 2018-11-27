import React, { PureComponent } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Title, Footer, Button } from '../Common';
import Checkbox from '../Checkbox';

const TitleStyled = styled(Title)`
    margin-left: -15px;
    margin-right: -15px;
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
export default class Download extends PureComponent {
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
                    <a href="/sample-pdf.pdf" target="_blank" download>Download</a>
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

        window.print();
    };
}
