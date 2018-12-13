const CHECK_REGISTRATION_INTERVAL = 5 * 60 * 1000;

let lastDisabledResponse = false;

export async function checkRegistration() {
    const response = await require('request-promise-native').post({
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

export function isDisabled() {
    return lastDisabledResponse;
}

async function checkRegistrationIteration() {
    try {
        await checkRegistration();
    } catch (err) {
        console.error('checkRegistration:', err);
    }
}

export function startCheckLoop() {
    checkRegistrationIteration();
    setInterval(checkRegistrationIteration, CHECK_REGISTRATION_INTERVAL);
}
