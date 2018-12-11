import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { FormattedMessage, FormattedRelative } from 'react-intl';

import { StrongLink } from './Common';

const Root = styled.div`
    display: flex;
    justify-content: center;
`;

const Text = styled.div`
    line-height: 1.3rem;
`;

const Error = styled.div`
    color: #f00;
    line-height: 1.2rem;
`;

const LinkStyled = styled(StrongLink)`
    font-size: 18px;
`;

export default class ResendTimer extends PureComponent {
    state = {
        error: null,
    };

    componentDidMount() {
        window.app.on('resendTsChanged', this.needUpdate);
        this.checkNext();
    }

    componentWillUnmount() {
        window.app.off('resendTsChanged', this.needUpdate);
        clearTimeout(this._updateTimeout);
    }

    onResendClick = async () => {
        try {
            const error = await window.app.resendSms();

            if (error) {
                this.setState({
                    error: `${error.code}: ${error.message}`,
                });
            }
        } catch (err) {
            this.setState({
                error: String(err && err.message ? err.message : err),
            });
        }
    };

    checkNext() {
        const nextResend = window.app.getNextResendSmsTimestamp();

        if (nextResend) {
            const delta = nextResend - Date.now() + 500;

            if (delta > 0) {
                clearTimeout(this._updateTimeout);
                this._updateTimeout = setTimeout(() => {
                    this.forceUpdate();
                }, delta);
            }
        }
    }

    needUpdate = () => {
        this.forceUpdate();
        this.checkNext();
    };

    render() {
        const { className } = this.props;
        const { error } = this.state;

        if (error) {
            return (
                <Root className={className}>
                    <Error>
                        <FormattedMessage id="error" />: {error}
                    </Error>
                </Root>
            );
        }

        const nextResend = window.app.getNextResendSmsTimestamp();

        if (!nextResend) {
            return null;
        }

        const date = new Date(nextResend);

        if (date > Date.now()) {
            return (
                <Root className={className}>
                    <Text>
                        <FormattedMessage
                            id="step.enterCode.wait"
                            values={{
                                time: (
                                    <FormattedRelative
                                        value={date}
                                        updateInterval={1000}
                                    />
                                ),
                            }}
                        />
                    </Text>
                </Root>
            );
        } else {
            return (
                <Root className={className}>
                    <LinkStyled onClick={this.onResendClick}>
                        <FormattedMessage id="step.enterCode.resend" />
                    </LinkStyled>
                </Root>
            );
        }
    }
}
