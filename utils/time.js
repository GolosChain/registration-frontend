export function errorTimeout(ms) {
    return new Promise((resolve, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT')), ms)
    );
}
