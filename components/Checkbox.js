import React from 'react';
import styled from 'styled-components';

const Root = styled.div`
    display: flex;
    align-items: center;
`;

const Img = styled.img`
    width: 18px;
    height: 18px;
    margin-right: 12px;
    flex-shrink: 0;
    cursor: pointer;
`;

const Input = styled.input`
    width: 0;
    opacity: 0;

    &:focus + ${Img} {
        outline: #3b99fc auto 5px;
        outline-offset: -2px;
    }
`;

const Text = styled.div``;

const Preload = styled.img`
    display: none;
`;

export default function Checkbox(props) {
    return (
        <Root>
            <Input
                disabled={props.disabled}
                type="checkbox"
                onChange={() => props.onChange(!props.value)}
            />
            {props.value ? (
                <Img src="/images/checkbox_on.svg" />
            ) : (
                <Img src="/images/checkbox_off.svg" />
            )}
            <Text>{props.children}</Text>
            <Preload src="/images/checkbox_on.svg" />
            <Preload src="/images/checkbox_off.svg" />
        </Root>
    );
}
