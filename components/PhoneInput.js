import React from 'react';
import styled from 'styled-components';

const Root = styled.div`
    position: relative;
    display: flex;
    height: 32px;
    padding: 0 14px;
    border-radius: 6px;
    border: 1px solid #e1e1e1;
    font-size: 14px;
    color: #333;
    background: #fff;
`;

const Code = styled.div`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    height: 100%;
    padding-right: 4px;
    color: #444;
`;

const Highlight = styled.div`
    display: none;
`;

const Input = styled.input`
    flex-grow: 1;
    border: none;
    height: 100%;
    outline: none;
    background: none;
    
    &:focus +${Highlight} {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        outline: #3b99fc auto 5px;
        outline-offset: -2px;
        pointer-events: none;
    }
    
    &::placeholder {
        font-weight: 300;
        color: #aaa;
    }
`;

export default function PhoneInput(props) {
    return (
        <Root>
            <Code>{props.code}</Code>
            <Input
                placeholder="(925)1234567"
                value={props.value}
                onChange={e => props.onChange(e.target.value.replace(/[^\d ()-]+/g, ''))}
            />
            <Highlight />
        </Root>
    );
}
