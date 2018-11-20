import React, { Component, createRef } from 'react';
import styled from 'styled-components';
import is from 'styled-is';

import { ENTER, ESCAPE, UP, DOWN } from '../utils/keyCodes';

const Root = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    border-radius: 8px;
    padding-top: 40px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
`;

const List = styled.ul`
    max-height: 400px;
    max-height: 50vh;
    padding: 0;
    margin: 0;
    border-radius: 0 0 8px 8px;
    background: #fff;
    overflow: auto;
    overflow-x: hidden;
    cursor: pointer;
`;

const Line = styled.li`
    display: flex;
    list-style: none;
    padding: 12px 16px;
    white-space: nowrap;
    font-size: 14px;
    color: #363636;
    user-select: none;

    &:hover {
        background: #eee;
    }

    ${is('selected')`
        background: #ddd !important;
    `};
`;

const Splitter = styled.div`
    height: 18px;
`;

const Code = styled.div`
    flex: 0 0;
    flex-basis: 74px;
`;

const Label = styled.div`
    flex: 1;
    font-weight: bold;
`;

export default class SelectList extends Component {
    state = {
        selected: null,
    };

    root = createRef();
    list = createRef();
    _inputText = '';

    componentDidMount() {
        this._timeout = setTimeout(() => {
            window.addEventListener('keydown', this.onKeyDown);
            window.addEventListener('mousedown', this.onMouseDown);
            window.addEventListener('click', this.onMouseDown);
        }, 100);
    }

    componentWillUnmount() {
        clearTimeout(this._timeout);
        clearTimeout(this._searchTimeout);
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('mousedown', this.onMouseDown);
        window.removeEventListener('click', this.onMouseDown);
    }

    onKeyDown = e => {
        if (e.altKey || e.ctrlKey || e.metaKey) {
            return;
        }

        const { items } = this.props;
        const { selected } = this.state;

        switch (e.which) {
            case ENTER:
                e.preventDefault();
                if (selected != null) {
                    this.props.onChange(selected);
                    this.props.onClose();
                }
                break;
            case ESCAPE:
                e.preventDefault();
                this.props.onClose();
                break;
            case UP: {
                e.preventDefault();
                let newSelected;

                if (selected != null) {
                    const index = items.findIndex(
                        item => item.value === selected
                    );

                    if (index > 0) {
                        newSelected = items[index - 1].value;
                    }
                }

                if (!newSelected) {
                    newSelected = items[0].value;
                }

                this.setState({
                    selected: newSelected,
                });
                break;
            }
            case DOWN: {
                e.preventDefault();
                let newSelected;

                if (selected != null) {
                    const index = items.findIndex(
                        item => item.value === selected
                    );

                    if (index !== -1 && index < items.length - 1) {
                        newSelected = items[index + 1].value;
                    }
                }

                if (!newSelected) {
                    newSelected = items[0].value;
                }

                this.setState({
                    selected: newSelected,
                });
                break;
            }
            default:
                if (e.key) {
                    this._inputText += e.key.trim().toLowerCase();

                    this.findByText();

                    this._searchTimeout = setTimeout(() => {
                        this._inputText = '';
                    }, 2000);
                }
        }
    };

    onMouseDown = e => {
        if (this.root) {
            if (!this.root.current.contains(e.target)) {
                this.props.onClose();
            }
        }
    };

    onItemClick = value => {
        this.props.onChange(value);
        this.props.onClose();
    };

    findByText() {
        if (this._inputText) {
            const { items } = this.props;

            for (let item of items) {
                if (item.label.toLowerCase().startsWith(this._inputText)) {
                    this.setState({
                        selected: item.value,
                    });

                    const element = this.list.current.querySelector(
                        `[data-value="${item.value}"]`
                    );

                    if (element) {
                        if (element.scrollIntoViewIfNeeded) {
                            element.scrollIntoViewIfNeeded();
                        } else if (element.scrollIntoView) {
                            element.scrollIntoView();
                        }
                    }
                    break;
                }
            }
        }
    }

    render() {
        const { items } = this.props;
        const { selected } = this.state;

        return (
            <Root innerRef={this.root}>
                <List innerRef={this.list}>
                    {items.map(
                        item =>
                            item.label ? (
                                <Line
                                    key={item.value}
                                    selected={
                                        selected != null &&
                                        selected === item.value
                                    }
                                    data-value={item.value.toString()}
                                    onClick={() => this.onItemClick(item.value)}
                                >
                                    <Code>+{item.code}</Code>
                                    <Label>{item.label}</Label>
                                </Line>
                            ) : (
                                <Splitter key="split" />
                            )
                    )}
                </List>
            </Root>
        );
    }
}
