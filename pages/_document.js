import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import styles from '../utils/styles';

const LOCALES = ['en', 'ru', 'ua', 'uk'];

const TITLE_TRANSLATIONS = {
    en: 'Golos.io Registration',
    ru: 'Golos.io Регистрация',
    ua: 'Golos.io Реєстрація',
};

function getLanguage(headers) {
    try {
        const languagePriority = headers['accept-language'];

        const priorityList = languagePriority.split(',');

        for (let langString of priorityList) {
            const match = langString.match(/^\w+/);

            if (match && LOCALES.includes(match[0])) {
                if (match[0] === 'uk') {
                    return 'ua';
                } else {
                    return match[0];
                }
            }
        }
    } catch (err) {}
}

export default class MyDocument extends Document {
    static getInitialProps({ renderPage, req, res }) {
        res.header('X-Frame-Options', 'SAMEORIGIN');

        const cookieLang = req.cookies['gls.lang'];

        let locale;

        if (LOCALES.includes(cookieLang)) {
            locale = cookieLang;
        } else {
            locale = getLanguage(req.headers);
        }

        if (!locale) {
            locale = 'en';
        }

        const sheet = new ServerStyleSheet();
        const page = renderPage(App => props =>
            sheet.collectStyles(<App {...props} locale={locale} />)
        );
        const styleTags = sheet.getStyleElement();

        return {
            ...page,
            styleTags,
            locale,
        };
    }

    render() {
        const { locale } = this.props;

        return (
            <html lang={locale}>
                <Head>
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
                    />
                    <title>{TITLE_TRANSLATIONS[locale]}</title>
                    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                    <style
                        dangerouslySetInnerHTML={{
                            __html: styles,
                        }}
                    />
                    {this.props.styleTags}
                    <script
                        async
                        defer
                        src="https://www.google.com/recaptcha/api.js?render=explicit"
                    />
                </Head>
                <body>
                    <Main locale={locale} />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `window.GLS_GATE_CONNECT='${
                                process.env.GLS_GATE_CONNECT
                            }'`,
                        }}
                    />
                    <NextScript />
                </body>
            </html>
        );
    }
}
