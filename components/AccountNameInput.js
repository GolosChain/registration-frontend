import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Input } from './Common';

const Wrapper = styled.div`
    position: relative;
`;

const InputStyled = styled(Input)`
    position: relative;
    padding-left: 56px;
    background: transparent;
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
    line-height: 38px;
    background: #e1e1e1;

    &::after {
        content: '@';
        font-size: 14px;
        color: #aaa;
    }
`;

export default class AccountNameInput extends PureComponent {
    render() {
        return (
            <Wrapper>
                <Sign />
                <InputStyled
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    {...this.props}
                />
            </Wrapper>
        );
    }
}
