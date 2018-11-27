import React from 'react';
import styled from 'styled-components';
import { focusStyle } from './Common';

const Root = styled.div`
    display: flex;
`;

const Img = styled.img`
    width: 18px;
    height: 18px;
    margin: 2px 12px 0 0;
    border-radius: 2px;
    flex-shrink: 0;
    cursor: pointer;
`;

const Input = styled.input`
    width: 0;
    opacity: 0;

    &:focus + ${Img} {
        ${focusStyle};
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
                innerRef={props.innerRef}
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
