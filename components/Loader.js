import styled, { keyframes } from 'styled-components';
import is from 'styled-is';

const rotateAnimation = keyframes`
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(1turn);
    }
`;

const Root = styled.div`
    width: 16px;
    height: 16px;
    border: ${props => props.thickness || 1}px solid #8a8a8a;
    border-radius: 50%;
    border-right-color: transparent;
    border-top-color: transparent;
    animation: ${rotateAnimation} 625ms infinite linear;
    pointer-events: none;

    ${is('big')`
        width: 100px;
        height: 100px;
    `};
`;

export default function Loader(props) {
    return <Root {...props} />;
}
