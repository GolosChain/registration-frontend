import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

const LOCALES = ['en', 'ru'];

const TITLE_TRANSLATIONS = {
    en: 'Golos.io Registration',
    ru: 'Golos.io Регистрация',
};

function getLanguage(headers) {
    try {
        const languagePriority = headers['accept-language'];

        const priorityList = languagePriority.split(',');

        for (let langString of priorityList) {
            const match = langString.match(/^\w+/);

            if (match && LOCALES.includes(match[0])) {
                return match[0];
            }
        }
    } catch (err) {}
}

export default class MyDocument extends Document {
    static getInitialProps({ renderPage, req }) {
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
                    {this.props.styleTags}
                    <script
                        async
                        defer
                        src="https://www.google.com/recaptcha/api.js?render=explicit"
                    />
                </Head>
                <body>
                    <Main locale={locale} />
                    <NextScript />
                </body>
            </html>
        );
    }
}
