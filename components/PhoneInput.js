import React from 'react';
import styled from 'styled-components';
import is from 'styled-is';

const Root = styled.div`
    position: relative;
    display: flex;
    height: 32px;
    padding-left: 14px;
    border-radius: 6px;
    border: 1px solid #e1e1e1;
    color: #333;
    background: #fff;

    ${is('error')`
        border-color: red;
    `};
`;

const Code = styled.div`
    display: flex;
    align-items: center;
    font-size: 14px;
    flex-shrink: 0;
    height: 100%;
    padding-right: 3px;
    color: #444;
    user-select: none;

    @media (max-width: 500px) {
        font-size: 16px;
    }
`;

const Highlight = styled.div`
    display: none;
`;

const Input = styled.input`
    flex-grow: 1;
    height: 100%;
    border: none;
    outline: none !important;
    background: none;

    &:focus + ${Highlight} {
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
        line-height: 20px;
        font-weight: 300;
        color: #aaa;
    }
`;

export default function PhoneInput(props) {
    return (
        <Root error={props.error}>
            <Code>{props.code}</Code>
            <Input
                placeholder="(925)1234567"
                value={props.value}
                onBlur={props.onBlur}
                onFocus={props.onFocus}
                onChange={e =>
                    props.onChange(
                        e.target.value
                            .replace(/[^\d ()-]+/g, '')
                            .replace(/^0+/, '')
                    )
                }
            />
            <Highlight />
        </Root>
    );
}
