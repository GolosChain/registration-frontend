const request = require('request-promise-native');

let lastDisabledResponse = false;

async function checkRegistration() {
    const response = await request.post({
        url: process.env.GLS_REGISTRATION_CONNECT,
        json: true,
        body: {
            jsonrpc: '2.0',
            id: 1,
            method: 'isRegistrationEnabled',
            params: {},
        },
    });

    lastDisabledResponse = !response.result.enabled;
}

function isDisabled() {
    return lastDisabledResponse;
}

module.exports = {
    checkRegistration,
    isDisabled,
};
