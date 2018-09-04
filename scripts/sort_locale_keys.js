const fs = require('fs');

const fileName = process.argv[2];

if (!fileName) {
    console.error('Specify file name');
    return;
}

const json = fs.readFileSync(fileName, 'utf-8');

const locale = JSON.parse(json);
const sorted = {};

for (let key of Object.keys(locale).sort()) {
    sorted[key] = locale[key];
}

fs.writeFileSync(fileName, JSON.stringify(sorted, null, 2));
