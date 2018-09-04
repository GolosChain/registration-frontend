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

        const address = {
            host: process.env.GLS_GATE_HOST || '0.0.0.0',
            port: process.env.GLS_GATE_PORT || '3000',
        };

        server.listen(address, err => {
            if (err) {
                throw err;
            }

            console.log(`> Listen on ${address.host}:${address.port}`);
        });
    })
    .catch(err => {
        console.error(err.stack);
        process.exit(1);
    });
