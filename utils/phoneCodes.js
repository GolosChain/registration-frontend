export function phoneCodesToSelectItems(phoneCodes) {
    return phoneCodes.map(({ label }, i) => ({
        value: i,
        label,
    }));
}
