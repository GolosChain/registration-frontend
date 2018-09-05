import React, { PureComponent } from 'react';
import styled, { keyframes } from 'styled-components';
import is from 'styled-is';
import { IntlProvider, addLocaleData } from 'react-intl';
import { Dot, Dots } from '../components/Common';
import Step1 from '../components/Step1';
import Step2 from '../components/Step2';
import Step2_Wait from '../components/Step2_Wait';
import Step3 from '../components/Step3';
import StepFinal from '../components/StepFinal';
import Application from '../app/Application';
import LangSwitch from '../components/LangSwitch';

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
    'final': {
        Comp: StepFinal,
        img: 4,
        hideDots: true,
    }
};

const locales = {
    en: require('../locales/en.json'),
    ru: require('../locales/ru.json'),
    ua: require('../locales/ua.json'),
};

addLocaleData(require('react-intl/locale-data/ru'));
addLocaleData(require('react-intl/locale-data/uk'));

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

    @media screen and (max-width: 800px) {
        position: absolute;
    }
`;

const Logo = styled.a`
    display: block;
    width: 134px;
    height: 57px;
    margin-top: 40px;
    background: url('images/logo.svg') center no-repeat;
    background-size: 114px 37px;
    z-index: 1;

    @media screen and (max-width: 800px) {
        margin-top: 20px;
    }
`;

const Panels = styled.div`
    display: flex;
    justify-content: center;
    min-height: 100%;

    @media screen and (max-width: 800px) {
        padding-top: 70px;
    }
`;

const Panel = styled.div`
    display: flex;
    flex-grow: 1;
    flex-basis: 100px;
    justify-content: center;
    align-items: center;
    max-width: 640px;

    @media screen and (max-width: 800px) {
        align-items: flex-start;

        &:nth-child(2) {
            display: none;
        }
    }
`;

const Column = styled.div`
    width: 328px;
    padding: 30px 0;

    @media screen and (max-width: 800px) {
        padding: 6px 0 10px;
    }

    ${is('fadeIn')`
        animation: ${fromRight} ${ANIMATION_DURATION}ms ease-out;
    `};

    ${is('fadeOut')`
        animation: ${toLeft} ${ANIMATION_DURATION}ms ease-in forwards;
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

    @media screen and (max-width: 800px) {
        display: none;
    }
`;

const ImageWrapper = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 640px;
`;

export default class Index extends PureComponent {
    _nextStep = null;

    state = {
        locale: getLocale(this.props),
        step: '1',
        fadeIn: false,
        fadeOut: false,
    };

    componentDidMount() {
        const app = new Application(this);

        app.init().catch(err => {
            console.error(err);
        });
    }

    render() {
        const { step, fadeIn, fadeOut, locale } = this.state;

        const { Comp, img, hideDots } = Steps[step];

        let messages;

        if (locale === 'en') {
            messages = locales.en;
        } else {
            messages = { ...locales.en, ...locales[locale] };
        }

        return (
            <IntlProvider
                key={locale}
                locale={locale === 'ua' ? 'uk' : locale}
                messages={messages}
            >
                <Root>
                    <Header>
                        <Logo href="/" />
                    </Header>
                    <LangSwitch lang={locale} onChange={this._onLangChange} />
                    <Panels>
                        <Panel>
                            <Column
                                key={step}
                                fadeIn={fadeIn}
                                fadeOut={fadeOut}
                            >
                                <Comp onStepChange={this._onStepChange} />
                                {hideDots ? null : (
                                    <Dots title={`Шаг: ${img}/3`}>
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
                                <SideImage
                                    step={img}
                                    opacity={fadeOut ? 0 : 1}
                                />
                            </ImageWrapper>
                        </RightPanel>
                    </Panels>
                </Root>
            </IntlProvider>
        );
    }

    _onStepChange = step => {
        this._nextStep = step;

        clearTimeout(this._stepTimeout1);
        clearTimeout(this._stepTimeout2);

        this.setState({
            fadeOut: true,
        });

        this._stepTimeout1 = setTimeout(() => {
            this.setState({
                step,
                fadeOut: false,
                fadeIn: true,
            });

            (document.scrollingElement || document.body).scrollTop = 0;

            this._nextStep = null;

            this._stepTimeout2 = setTimeout(() => {
                this.setState({
                    fadeIn: false,
                });
            }, ANIMATION_DURATION);
        }, ANIMATION_DURATION);
    };

    goTo(step) {
        if (this._nextStep) {
            if (this._nextStep === step) {
                return;
            }
        } else if (this.state.step === step) {
            return;
        }

        this._onStepChange(step);
    }

    _onLangChange = lang => {
        document.cookie = `gls.lang=${lang}; expires=Tue, 01 Jan 2030 00:00:00 GMT`;

        this.setState({
            locale: lang,
        });
    };
}

function getLocale(props) {
    let locale;

    if (process.browser) {
        locale = document.querySelector('html').getAttribute('lang');
    } else {
        locale = props.locale;
    }

    if (!locale) {
        locale = 'en';
    }

    return locale;
}
