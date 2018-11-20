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
                    <script
                        type="text/javascript"
                        dangerouslySetInnerHTML={{
                            __html:
                                '(function(e,a){if(!a.__SV){var b=window;try{var c,l,i,j=b.location,g=j.hash;c=function(a,b){return(l=a.match(RegExp(b+"=([^&]*)")))?l[1]:null};g&&c(g,"state")&&(i=JSON.parse(decodeURIComponent(c(g,"state"))),"mpeditor"===i.action&&(b.sessionStorage.setItem("_mpcehash",g),history.replaceState(i.desiredHash||"",e.title,j.pathname+j.search)))}catch(m){}var k,h;window.mixpanel=a;a._i=[];a.init=function(b,c,f){function e(b,a){var c=a.split(".");2==c.length&&(b=b[c[0]],a=c[1]);b[a]=function(){b.push([a].concat(Array.prototype.slice.call(arguments,0)))}}var d=a;"undefined"!==typeof f?d=a[f]=[]:f="mixpanel";d.people=d.people||[];d.toString=function(b){var a="mixpanel";"mixpanel"!==f&&(a+="."+f);b||(a+=" (stub)");return a};d.people.toString=function(){return d.toString(1)+".people (stub)"};k="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");for(h=0;h<k.length;h++)e(d,k[h]);a._i.push([b,c,f])};a.__SV=1.2;b=e.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js";c=e.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c)}})(document,window.mixpanel||[]);mixpanel.init("4b97a46af3344345d09c3a162062e4f1");',
                        }}
                    />
                    <script
                        async
                        defer
                        src="//cdnjs.cloudflare.com/ajax/libs/jspdf/1.4.1/jspdf.min.js"
                        crossOrigin="anonymous"
                    />
                </Head>
                <body>
                    <Main locale={locale} />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `window.GLS_GATE_CONNECT='${process.env
                                .GLS_GATE_CONNECT || 'wss://gate.golos.io/'}'`,
                        }}
                    />
                    <NextScript />
                </body>
            </html>
        );
    }
}
