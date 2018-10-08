import styled from 'styled-components';
import is from 'styled-is';

export const B = styled.b`
    font-weight: 700;
    white-space: nowrap;
    color: #333;
`;

export const Title = styled.h1`
    margin: 18px 0 22px;
    font-size: 34px;
    font-weight: 700;
    letter-spacing: 0.52px;
    color: #393636;
    text-align: center;
`;

export const SubTitle = styled.div`
    margin: 24px 0;
    line-height: 28px;
    font-size: 17px;
    font-weight: 300;
    color: #959595;
    text-align: center;
`;

export const Footer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
`;

export const Button = styled.button.attrs({ type: 'button' })`
    height: 34px;
    padding: 8px 28px;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #fff;
    background: #3684ff;
    cursor: pointer;

    &[disabled] {
        cursor: default;
        cursor: not-allowed;
        background: #89cbff;
    }
`;

export const Dots = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
`;

export const Dot = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin: 0 5px;
    background: ${props => (props.active ? '#3684ff' : '#e1e1e1')};
`;

export const Field = styled.label`
    display: block;
    margin: 24px 0;
`;

export const FieldLabel = styled.div`
    margin-bottom: 14px;
    line-height: 1.4em;
    font-size: 14px;
    font-weight: 300;
    color: #393636;

    @media (max-width: 500px) {
        font-size: 16px;
    }
`;

export const FieldInput = styled.div``;

export const Input = styled.input`
    display: block;
    width: 100%;
    height: 32px;
    padding: 0 14px;
    border: 1px solid #e1e1e1;
    border-radius: 6px;
    color: #333;
    background: #fff;

    ${is('blue')`
        color: #2879ff;
    `};

    ${is('error')`
        border-color: red;
        
        &:focus {
            border-color: #e1e1e1;
        }
    `};

    &::placeholder {
        line-height: 20px;
        font-weight: 300;
        color: #aaa;
    }
`;

export const Link = styled.a`
    color: #2879ff;
`;

export const PseudoLink = styled.a`
    border-bottom: 1px dotted #3684ff;
    color: #3684ff;
    cursor: pointer;
`;
