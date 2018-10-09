import React, { Component } from 'react';
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
        border-color: #f00;
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
        font-size: 15px;
    }
`;

const Highlight = styled.div`
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    outline: #3b99fc auto 5px;
    outline-offset: -2px;
    pointer-events: none;
`;

const InputWrapper = styled.div`
    position: relative;
    flex-grow: 1;
    height: 100%;
`;

const Input = styled.input`
    display: block;
    width: 100%;
    height: 100%;
    border: none;
    outline: none !important;
    background: none;
`;

const Placeholder = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 14px;
    font-weight: 300;
    color: #aaa;
    user-select: none;
    pointer-events: none;

    @media (max-width: 500px) {
        font-size: 15px;
    }
`;

export default class PhoneInput extends Component {
    state = {
        focus: false,
    };

    render() {
        const { value, error, code } = this.props;
        const { focus } = this.state;

        return (
            <Root error={error && !focus}>
                <Code>{code}</Code>
                <InputWrapper>
                    <Input
                        value={value}
                        onBlur={this._onBlur}
                        onFocus={this._onFocus}
                        onChange={this._onChange}
                    />
                    {value ? null : <Placeholder>(123) 123 45-67</Placeholder>}
                </InputWrapper>
                {focus ? <Highlight /> : null}
            </Root>
        );
    }

    _onFocus = () => {
        this.setState({
            focus: true,
        });

        if (this.props.onFocus) {
            this.props.onFocus();
        }
    };

    _onBlur = () => {
        this.setState({
            focus: false,
        });

        if (this.props.onBlur) {
            this.props.onBlur();
        }
    };

    _onChange = e => {
        this.props.onChange(
            e.target.value.replace(/[^\d ()-]+/g, '').replace(/^0+/, '')
        );
    };
}
