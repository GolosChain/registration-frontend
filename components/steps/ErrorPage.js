import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { injectIntl, FormattedMessage } from 'react-intl';

const VERTICAL_VIEW_BREAK_POINT = 945;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    margin: 0 auto;
    color: #393636;
`;

const Info = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-basis: 280px;
    margin: 20px 0;

    @media (max-width: ${VERTICAL_VIEW_BREAK_POINT}px) and (min-height: 420px) {
        align-items: center;
        flex-basis: auto;
    }
`;

const InfoTitle = styled.div`
    margin-bottom: 30px;
    font-size: 34px;
    font-weight: 900;
    line-height: 1.21;
    letter-spacing: 0.4px;

    @media (max-width: ${VERTICAL_VIEW_BREAK_POINT}px) {
        margin-bottom: 10px;
    }

    @media (max-width: 570px) and (max-height: 340px) {
        font-size: 24px;
    }
`;

const InfoText = styled.div`
    line-height: 1.38;
    font-size: 16px;
    letter-spacing: -0.3px;

    @media (max-width: ${VERTICAL_VIEW_BREAK_POINT}px) and (min-height: 420px) {
        text-align: center;
    }

    @media (max-width: 570px) and (max-height: 340px) {
        font-size: 14px;
    }
`;

const TryReloadText = styled(InfoText)`
    margin-top: 30px;
    color: #959595;

    @media (max-width: ${VERTICAL_VIEW_BREAK_POINT}px) {
        margin-top: 10px;
    }
`;

const ReloadBlock = styled.div``;

const ReloadButton = styled.button`
    display: flex;
    align-items: center;
    padding: 8px 18px;
    margin-top: 50px;
    border-radius: 100px;
    text-transform: uppercase;
    line-height: 1.5;
    font-size: 12px;
    font-weight: bold;
    color: #fff;
    background-color: #2879ff;
    transition: background-color 0.15s;
    cursor: pointer;

    &:hover {
        background: #0e69ff;
    }

    @media (max-width: ${VERTICAL_VIEW_BREAK_POINT}px) {
        margin-top: 20px;
    }
`;

const ReloadIcon = styled.img.attrs({ src: '/images/reload.svg' })`
    width: 14px;
    height: 14px;
    margin-right: 8px;
`;

const WrapperLink = styled.a`
    text-decoration: underline;
    font-size: 12px;
    color: #959595;
`;

const Links = styled.div`
    display: flex;
    margin-top: 65px;

    @media (max-width: ${VERTICAL_VIEW_BREAK_POINT}px) {
        margin-top: 20px;
    }
`;

const Img = styled.img.attrs({ src: '/images/step_help.svg' })`
    display: none;

    @media (max-width: 800px) {
        display: block;
        width: 90%;
        margin-top: 20px;
    }
`;

@injectIntl
export default class ErrorPage extends PureComponent {
    reloadPage = () => {
        window.location.reload();
    };

    render() {
        const { intl } = this.props;

        return (
            <Wrapper>
                <Info>
                    <InfoTitle>
                        <FormattedMessage id="step.error.oops" />
                    </InfoTitle>
                    <InfoText>
                        <FormattedMessage id="step.error.text" />
                    </InfoText>
                    <TryReloadText>
                        <FormattedMessage id="step.error.tryReloadText" />
                    </TryReloadText>
                    <ReloadBlock>
                        <ReloadButton onClick={this.reloadPage}>
                            <ReloadIcon />
                            <FormattedMessage id="step.error.reload" />
                        </ReloadButton>
                    </ReloadBlock>
                    <Links>
                        <WrapperLink
                            href={intl.messages['step.error.linkToSupport']}
                            target="_blank"
                            rel="noopener norefferer"
                        >
                            <FormattedMessage id="step.error.writeToSupport" />
                        </WrapperLink>
                    </Links>
                    <Img />
                </Info>
            </Wrapper>
        );
    }
}
