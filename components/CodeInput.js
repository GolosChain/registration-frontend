import React, { PureComponent, createRef } from 'react';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';

import keyCodes from '../app/keyCodes';

const LENGTH = 4;

export const Root = styled.div`
    display: flex;
    justify-content: center;
`;

const Cell = styled.input`
    width: 40px;
    height: 40px;
    margin: 0 10px;
    border: 1px solid #e1e1e1;
    border-radius: 6px;
    text-align: center;
`;

@injectIntl
export default class CodeInput extends PureComponent {
    state = {
        cells: Array.from({ length: LENGTH }).map(() => ''),
    };

    cells = Array.from({ length: LENGTH }).map(createRef);

    onChange(e, pos) {
        const value = e.target.value.trim();

        if (value) {
            // clone
            const cells = Array.from(this.state.cells);

            const chars = value.split('');

            for (let i = 0; i < chars.length && i + pos < LENGTH; i++) {
                cells[i + pos] = chars[i] || '';
            }

            this.setState(
                {
                    cells,
                },
                () => {
                    const nextPos = pos + 1;

                    if (nextPos < LENGTH) {
                        this.cells[nextPos].current.focus();
                    }
                }
            );

            this.props.onChange(cells.join(''));
        }
    }

    onKeyDown(e, i) {
        if (e.which === keyCodes.BACKSPACE && i > 0) {
            const cells = Array.from(this.state.cells);

            if (cells[i].trim()) {
                cells[i] = '';
            } else {
                cells[i - 1] = '';
            }

            this.setState({
                cells,
            });

            this.props.onChange(cells.join(''));

            this.cells[i - 1].current.focus();

            e.preventDefault();
        }
    }

    render() {
        const { className } = this.props;
        const { cells } = this.state;

        return (
            <Root className={className}>
                {Array.from({ length: LENGTH }).map((_, i) => (
                    <Cell
                        key={i}
                        innerRef={this.cells[i]}
                        autoFocus={i === 0}
                        value={cells[i]}
                        onKeyDown={e => this.onKeyDown(e, i)}
                        onChange={e => this.onChange(e, i)}
                    />
                ))}
            </Root>
        );
    }
}
