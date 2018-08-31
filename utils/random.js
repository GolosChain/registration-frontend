const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateRandomString(length) {
    try {
        const chars = new Array(length);

        const arr = window.crypto.getRandomValues(new Uint8Array(length));

        for (let i = 0; i < length; ++i) {
            chars[i] = CHARS.charAt(Math.floor((arr[i] / 256) * CHARS.length));
        }

        return chars.join('');
    } catch (err) {
        console.warn(err);
        return generateSimpleRandomString(length);
    }
}

function generateSimpleRandomString(length) {
    const chars = new Array(length);

    for (let i = 0; i < length; ++i) {
        chars[i] = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }

    return chars.join('');
}
