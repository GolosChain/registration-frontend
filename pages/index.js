import React, { PureComponent } from 'react';
import styled, { injectGlobal, keyframes } from 'styled-components';
import is from 'styled-is';
import '../utils/styles-reset';
import { Dot, Dots } from '../components/Common';
import Step1 from '../components/Step1';
import Step2 from '../components/Step2';
import Step2_Wait from '../components/Step2_Wait';
import Step3 from '../components/Step3';

const ANIMATION_DURATION = 250;

const Steps = {
    '1': {
        Comp: Step1,
        img: 1,
    },
    '2': {
        Comp: Step2,
        img: 2,
    },
    '2_wait': {
        Comp: Step2_Wait,
        img: 2,
        hideDots: true,
    },
    '3': {
        Comp: Step3,
        img: 3,
    },
};

injectGlobal`
html, body, #__next {
  height: 100%;
}

@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,700');
`;

const fadeIn = keyframes`
    from {
        opacity: 0;  
    }
    to {
        opacity: 1;
    }
`;

const fromRight = keyframes`
    from {
        opacity: 0;
        transform: translate(600px, 0);
    }
    to {
        opacity: 1;
        transform: translate(0, 0);
    }
`;

const toLeft = keyframes`
    from {
        opacity: 1;
        transform: translate(0, 0);
    }
    to {
        opacity: 0;
        transform: translate(-600px, 0);
    }
`;

const Root = styled.div`
    height: 100%;
    opacity: 0;
    animation: ${fadeIn} 0.4s forwards;
    animation-delay: 0.1s;
`;

const Header = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 0;
    display: flex;
    justify-content: center;
    z-index: 1;
`;

const Logo = styled.a`
    display: block;
    width: 134px;
    height: 57px;
    margin-top: 40px;
    background: url('images/logo.svg') center no-repeat;
    background-size: 114px 37px;
    z-index: 1;
`;

const Panels = styled.div`
    display: flex;
    justify-content: center;
    min-height: 100%;
`;

const Panel = styled.div`
    display: flex;
    flex-grow: 1;
    flex-basis: 100px;
    justify-content: center;
    align-items: center;
    max-width: 640px;
`;

const Column = styled.div`
    width: 328px;
    padding: 16px 0;

    ${is('fadeIn')`
        animation: ${fromRight} ${ANIMATION_DURATION}ms ease-out;
    `};

    ${is('fadeOut')`
        animation: ${toLeft} ${ANIMATION_DURATION}ms ease-in;
    `};
`;

const SideImage = styled.div`
    width: 431px;
    height: 426px;
    background: url('images/step_${props => props.step}.svg') no-repeat center;
    opacity: ${props => props.opacity};
    transition: opacity ${ANIMATION_DURATION}ms;
`;

const RightPanel = styled.div`
    position: fixed;
    display: flex;
    align-items: center;
    top: 0;
    right: 0;
    bottom: 0;
    width: 50%;
    background: #f9f9f9;
`;

const ImageWrapper = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 640px;
`;

export default class Index extends PureComponent {
    state = {
        step: '1',
        fadeIn: false,
        fadeOut: false,
    };

    render() {
        const { step, fadeIn, fadeOut } = this.state;

        const { Comp, img, hideDots } = Steps[step];

        return (
            <Root>
                <Header>
                    <Logo href="/" />
                </Header>
                <Panels>
                    <Panel>
                        <Column fadeIn={fadeIn} fadeOut={fadeOut}>
                            <Comp onStepChange={this._onStepChange} />
                            {hideDots ? null : (
                                <Dots>
                                    <Dot active={img === 1} />
                                    <Dot active={img === 2} />
                                    <Dot active={img === 3} />
                                </Dots>
                            )}
                        </Column>
                    </Panel>
                    <Panel />
                    <RightPanel>
                        <ImageWrapper>
                            <SideImage step={img} opacity={fadeOut ? 0 : 1} />
                        </ImageWrapper>
                    </RightPanel>
                </Panels>
            </Root>
        );
    }

    _onStepChange = step => {
        this.setState({
            fadeOut: true,
        });

        setTimeout(() => {
            this.setState({
                step,
                fadeOut: false,
                fadeIn: true,
            });

            setTimeout(() => {
                this.setState({
                    fadeIn: false,
                });
            }, ANIMATION_DURATION);
        }, ANIMATION_DURATION);
    };
}
