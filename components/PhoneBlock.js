import React, { PureComponent } from 'react';
import styled from 'styled-components';
import is from 'styled-is';

import { UP, DOWN } from '../utils/keyCodes';
import { isMobile } from '../utils/browser';
import { Input, focusStyle, inputTransitions } from './Common';
import { phoneCodesToSelectItems } from '../utils/phoneCodes';
import SelectList from './SelectList';

const Root = styled.div`
    position: relative;
`;

const Highlight = styled.div`
    display: block;
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border: 1px solid #e1e1e1;
    border-radius: 6px;
    pointer-events: none;
    ${inputTransitions};

    ${is('focus')`
        ${focusStyle};        
    `};
`;

const SelectBlock = styled.label`
    position: relative;
    display: flex;
    width: 84px;
    height: 40px;
    padding-left: 14px;
    padding-right: 10px;
    border-radius: 6px;
    border: 1px solid transparent;
    background: #fff;
    cursor: pointer;
    transition: width 0.3s ease-in;
    will-change: width;
    z-index: 1;

    ${is('wide')`
        width: 100%;
    `};

    &:focus ${Highlight} {
        ${focusStyle};
    }
`;

const SelectWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    overflow: hidden;
`;

const InnerSelect = styled.select`
    height: 40px;
    cursor: pointer;
    outline: none !important;
    box-shadow: none !important;
    -webkit-appearance: none;
`;

const InputLike = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    user-select: none;
`;

const Code = styled.div`
    height: 38px;
    line-height: 38px;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 14px;
    color: #333;

    @media (max-width: 500px) {
        font-size: 15px;
    }
`;

const ValueLabel = styled.div`
    position: absolute;
    top: 0;
    left: 89px;
    height: 38px;
    line-height: 38px;
    white-space: nowrap;
    font-size: 14px;
    font-weight: bold;

    @media (max-width: 500px) {
        font-size: 15px;
    }
`;

const Chevron = styled.div`
    position: absolute;
    top: 0;
    left: 60px;
    width: 10px;
    height: 38px;
    background: url('/images/chevron.svg') no-repeat center;
    transform: rotate(0.5turn);
    transition: transform 0.3s;
    will-change: transform;

    ${is('open')`
        transform: rotate(1turn);
    `};
`;

const PhoneInputWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 100px;
    right: 0;
    bottom: 0;
`;

export default class PhoneBlock extends PureComponent {
    state = {
        focus: false,
        open: false,
        isMobile: true,
    };

    componentDidMount() {
        this.setState({
            isMobile: isMobile(),
        });
    }

    onSelectClick = e => {
        const { isMobile } = this.state;

        if (!isMobile) {
            e.preventDefault();

            if (!this._closeTs || Date.now() - 300 > this._closeTs) {
                this.setState({
                    open: true,
                });
            }
        }
    };

    onFocus = () => {
        this.setState({
            focus: true,
        });
    };

    onBlur = () => {
        this.setState({
            focus: false,
        });
    };

    onCodeChange = e => {
        this.props.onCodeChange(e.target.value);
    };

    onListCodeChange = codeIndex => {
        this.props.onCodeChange(codeIndex);
    };

    onPhoneChange = e => {
        this.props.onPhoneChange(e.target.value.replace(/[^\d ()-]+/g, ''));
    };

    onListClose = () => {
        this.setState({
            open: false,
        });
        this._closeTs = Date.now();
    };

    onPseudoSelectKeyDown = e => {
        const { open } = this.state;
        const which = e.which;

        if (!open && (which === UP || which === DOWN)) {
            this.setState({
                open: true,
            });
        }
    };

    renderSelect() {
        const { codeIndex } = this.props;
        const { focus, isMobile, open } = this.state;

        const items = phoneCodesToSelectItems();

        const selected = items.find(item => item.value == codeIndex);

        const wide = !isMobile && open;

        return (
            <>
                <SelectBlock
                    wide={wide}
                    tabIndex={isMobile ? '-1' : '0'}
                    onKeyDown={this.onPseudoSelectKeyDown}
                    onClick={this.onSelectClick}
                >
                    <InputLike>
                        <Code>{selected ? `+${selected.code}` : null}</Code>
                        <Chevron open={open} />
                        {selected && wide ? (
                            <ValueLabel>{selected.label}</ValueLabel>
                        ) : null}
                    </InputLike>
                    {isMobile ? (
                        <SelectWrapper>
                            <InnerSelect
                                value={codeIndex}
                                onFocus={this.onFocus}
                                onBlur={this.onBlur}
                                onChange={this.onCodeChange}
                            >
                                {items.map(item => (
                                    <option key={item.value} value={item.value}>
                                        {item.label
                                            ? `+${item.code} ${item.label}`
                                            : null}
                                    </option>
                                ))}
                            </InnerSelect>
                        </SelectWrapper>
                    ) : null}
                    <Highlight focus={focus} />
                </SelectBlock>
                {!isMobile && open ? (
                    <SelectList
                        items={items}
                        onClose={this.onListClose}
                        onChange={this.onListCodeChange}
                    />
                ) : null}
            </>
        );
    }

    renderInput() {
        const { disabled, phone, phoneError, onPhoneBlur } = this.props;

        return (
            <PhoneInputWrapper>
                <Input
                    error={phoneError}
                    disabled={disabled}
                    placeholder="xxxxxxxxx"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    value={phone}
                    onChange={this.onPhoneChange}
                    onBlur={onPhoneBlur}
                />
            </PhoneInputWrapper>
        );
    }

    render() {
        const { className } = this.props;

        return (
            <Root className={className}>
                {this.renderSelect()}
                {this.renderInput()}
            </Root>
        );
    }
}
