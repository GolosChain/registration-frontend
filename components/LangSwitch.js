import React, { PureComponent } from 'react';
import styled from 'styled-components';
import is from 'styled-is';

const LANGS = ['en', 'ru', 'ua'];

const Root = styled.div`
    position: fixed;
    top: 50px;
    right: 50px;
    cursor: pointer;
    z-index: 1;

    @media (max-width: 800px) {
        position: absolute;
        top: 20px;
        right: 12px;
    }
`;

const Current = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 34px;
    text-transform: uppercase;
    color: #393636;
    user-select: none;
    z-index: 1;
`;

const Chevron = styled.div`
    position: absolute;
    top: 15px;
    right: 8px;
    border: 3px solid transparent;
    border-top-color: #363636;

    ${is('open')`
        top: 11px;
        border-top-color: transparent;
        border-bottom-color: #363636;
    `};
`;

const List = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    top: -4px;
    left: 0;
    right: 0;
    padding: 38px 0 4px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;

    ${is('open')`
        opacity: 1;
        pointer-events: initial;
    `};
`;

const ListItem = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 34px;
    font-weight: 500;
    text-transform: uppercase;
    color: #959595;
    cursor: pointer;
    user-select: none;

    &:hover {
        color: #333;
    }
`;

export default class LangSwitch extends PureComponent {
    state = {
        open: false,
    };

    componentWillUnmount() {
        window.removeEventListener('click', this._onAwayClick);
    }

    render() {
        const { lang } = this.props;
        const { open } = this.state;

        const availableLangs = LANGS.filter(l => l !== lang);

        return (
            <Root innerRef={this._onRef}>
                <Current onClick={this._onOpenClick}>
                    {lang}
                    <Chevron open={open} />
                </Current>
                <List open={open}>
                    {availableLangs.map(lang => (
                        <ListItem
                            key={lang}
                            onClick={() => this.props.onChange(lang)}
                        >
                            {lang}
                        </ListItem>
                    ))}
                </List>
            </Root>
        );
    }

    _onRef = el => {
        this._root = el;
    };

    _onOpenClick = () => {
        this._toggle(!this.state.open);
    };

    _onAwayClick = e => {
        if (!this._root.contains(e.target)) {
            this._toggle(false);
        }
    };

    _toggle(show) {
        if (show) {
            window.addEventListener('click', this._onAwayClick);
        } else {
            window.removeEventListener('click', this._onAwayClick);
        }

        this.setState({
            open: show,
        });
    }
}
