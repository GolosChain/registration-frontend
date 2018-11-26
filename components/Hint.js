import React from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import { fadeIn } from '../utils/keyFrames';

const Root = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 100%;
    padding: 17px;
    margin-bottom: 14px;
    border-radius: 6px;
    font-size: 12px;
    line-height: 1.33;
    text-align: center;
    color: #757575;
    background: #fff;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
    animation: ${fadeIn} 0.30s;
    user-select: none;

    &::after {
        position: absolute;
        content: '';
        left: 50%;
        bottom: 0;
        width: 10px;
        height: 10px;
        margin: 0 0 -5px -5px;
        box-shadow: 3px 3px 3px 0 rgba(0, 0, 0, 0.07);
        background: #fff;
        transform: rotate(45deg);
    }
`;

export default function({ textId }) {
    return (
        <Root>
            <FormattedMessage id={textId} />
        </Root>
    );
}
