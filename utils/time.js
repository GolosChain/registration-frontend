export function timeout(ms) {
    return new Promise((resolve, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT')), ms)
    );
}
