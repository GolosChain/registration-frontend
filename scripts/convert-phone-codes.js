const fs = require('fs');

const FILE = './app/phoneCodes.json';

const file = fs.readFileSync(FILE, 'utf-8');

const data = JSON.parse(file);

for (let item of data.list) {
    const match = item.label.match(/^\+\d+ (.+)$/);

    item.label = match[1];

    console.log(item.label);
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');
