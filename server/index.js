const path = require('path');
const express = require('express');
const next = require('next');

const app = next({
    dev: process.env.NODE_ENV !== 'production',
});

const handle = app.getRequestHandler();

app.prepare()
    .then(() => {
        const server = express();

        // server.get('/p/:id', (req, res) => {
        //     const actualPage = '/post';
        //     const queryParams = { title: req.params.id };
        //     app.render(req, res, actualPage, queryParams);
        // });

        server.use(express.static(path.join(__dirname, '../public')));

        server.get('*', (req, res) => {
            return handle(req, res);
        });

        server.listen(3000, err => {
            if (err) {
                throw err;
            }

            console.log('> Ready on http://localhost:3000');
        });
    })
    .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
    });
