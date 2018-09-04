const path = require('path');
const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');

const nextApp = next({
    dev: process.env.NODE_ENV !== 'production',
});

const handle = nextApp.getRequestHandler();

nextApp
    .prepare()
    .then(() => {
        const server = express();

        server.use(express.static(path.join(__dirname, '../public')));

        server.use(cookieParser());

        server.get('*', (req, res) => handle(req, res));

        server.listen(3000, err => {
            if (err) {
                throw err;
            }

            console.log('> Ready on http://localhost:3000');
        });
    })
    .catch(err => {
        console.error(err.stack);
        process.exit(1);
    });
