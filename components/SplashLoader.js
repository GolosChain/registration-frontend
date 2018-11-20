import styled, { keyframes } from 'styled-components';

import Loader from './Loader';

const fadeAnimation = keyframes`
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
`;

const Root = styled.div`
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
    opacity: 0;
    animation: ${fadeAnimation} 1s forwards;
    animation-delay: 0.5s;
    z-index: 1000;
`;

export default function SplashLoader() {
    return (
        <Root>
            <Loader big thickness={6} />
        </Root>
    );
}
