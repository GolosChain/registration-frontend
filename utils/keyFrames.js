import { keyframes } from 'styled-components';

export const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

export const fromRight = keyframes`
    from {
        opacity: 0;
        transform: translate(600px, 0);
    }
    to {
        opacity: 1;
        transform: translate(0, 0);
    }
`;

export const toLeft = keyframes`
    from {
        opacity: 1;
        transform: translate(0, 0);
    }
    to {
        opacity: 0;
        transform: translate(-600px, 0);
    }
`;
