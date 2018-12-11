import React, { PureComponent } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import { Input } from './Common';

const Wrapper = styled.div`
    position: relative;
`;

const Sign = styled.div`
    position: absolute;
    width: 39px;
    height: 38px;
    top: 1px;
    bottom: 1px;
    left: 1px;
    border-radius: 5px 0 0 5px;
    text-align: center;
    line-height: 36px;
    color: #aaa;
    background: #e1e1e1;

    &::after {
        content: '@';
        font-size: 14px;
    }

    ${is('error')`
        color: #fff !important;
        background: #fc5d16 !important;
    `};
`;

const InputStyled = styled(Input)`
    position: relative;
    padding-left: 56px;
    background: transparent;

    &:focus + ${Sign} {
        color: #fff;
        background: #3684ff;
    }
`;

export default class AccountNameInput extends PureComponent {
    render() {
        return (
            <Wrapper>
                <InputStyled
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    {...this.props}
                />
                <Sign error={this.props.error} />
            </Wrapper>
        );
    }
}
