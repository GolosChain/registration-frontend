import React, { PureComponent } from 'react';
import styled from 'styled-components';

const CAPTCHA_SITE_KEY = '6Lef7W0UAAAAAGzvOltqH7Ydeyae6MP3z55l03fB';

const Root = styled.div`
    height: 78px;
    margin-right: -3px;
    margin-bottom: -2px;
`;

export default class Captcha extends PureComponent {
    componentDidMount() {
        this._checkCaptcha();
    }

    componentWillUnmount() {
        clearTimeout(this._captchaTimeout);
    }

    render() {
        return (
            <Root>
                <div ref="captcha" />
            </Root>
        );
    }

    _checkCaptcha = () => {
        if (window.grecaptcha && grecaptcha.render) {
            clearTimeout(this._captchaTimeout);
            grecaptcha.render(this.refs.captcha, {
                sitekey: CAPTCHA_SITE_KEY,
            });
        } else {
            this._captchaTimeout = setTimeout(this._checkCaptcha, 50);
        }
    };

    getCode() {
        const input = this.refs.captcha.querySelector(
            '[name="g-recaptcha-response"]'
        );

        if (input && input.value) {
            return input.value;
        }

        return null;
    }
}
