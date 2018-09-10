import React from 'react';
import styled from 'styled-components';

const Root = styled.div`
    position: relative;
    height: 32px;
    padding-left: 14px;
    padding-right: 10px;
    border-radius: 6px;
    border: 1px solid #e1e1e1;
    background: #fff;
    cursor: pointer;
`;

const Highlight = styled.div`
    display: none;
`;

const InnerSelect = styled.select`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    bottom: 0;
    opacity: 0;
    cursor: pointer;

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
`;

const InputLike = styled.div`
    display: flex;
    height: 100%;
`;

const InputValue = styled.div`
    flex-grow: 1;
    line-height: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    color: #333;

    @media (max-width: 500px) {
        font-size: 16px;
    }
`;

const Chevron = styled.div`
    width: 10px;
    background: url('images/chevron.svg') no-repeat center;
    transform: rotate(0.5turn);
`;

export default function Select(props) {
    const selected = props.items.find(item => item.value == props.value);

    let text = null;

    if (selected) {
        text = selected.label;
    }

    return (
        <Root className={props.className}>
            <InputLike>
                <InputValue>{text}</InputValue>
                <Chevron />
            </InputLike>
            <InnerSelect value={props.value} onChange={e => props.onChange(e.target.value)}>
                {props.items.map(item => (
                    <option key={item.value} value={item.value}>
                        {item.label}
                    </option>
                ))}
            </InnerSelect>
            <Highlight />
        </Root>
    );
}
