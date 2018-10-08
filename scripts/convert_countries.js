const fs = require('fs');
const path = require('path');

const countries = fs
    .readFileSync(path.join(__dirname, 'countries.txt'), 'utf-8')
    .split('\n')
    .filter(line => line && !line.startsWith('//'));

const DEFAULT_VERIFICATION_PHONE = '+1 (256) 358-7178';

const DEFAULT = 'Russia';

const customVerificationPhones = {
    Russia: '+7 (916) 930-63-59',
    Kazakhstan: '+7 (777) 007-69-77',
    Belarus: '+375 (29) 230-87-70',
    Ukraine: '+380 (93) 177-77-72',
};

const topCodes = new Set([
    'United States',
    'Russia',
    'Belarus',
    'Lithuania',
    'Ukraine',
    'Kazakhstan',
]);

const topData = [];
const data = [];

for (let country of countries) {
    if (country) {
        const { title, code } = parseCountry(country);

        const list = topCodes.has(title) ? topData : data;

        let verificationPhone;

        if (customVerificationPhones[title]) {
            verificationPhone = customVerificationPhones[title];
        }

        list.push({
            code,
            label: country,
            default: DEFAULT === title ? true : undefined,
            verificationPhone,
        });
    }
}

function parseCountry(country) {
    const match = country.match(/^(.+) \(\+(\d+)\)$/);

    return {
        title: match[1],
        code: parseInt(match[2], 10),
    };
}

function byCode(a, b) {
    return a.code - b.code;
}

fs.writeFileSync(
    path.join(__dirname, '../app/phoneCodes.json'),
    JSON.stringify(
        {
            defaultVerificationPhone: DEFAULT_VERIFICATION_PHONE,
            list: topData.sort(byCode).concat(data),
            topCount: topData.length,
        },
        null,
        2
    ) + '\n'
);
