export function phoneCodesToSelectItems(phoneCodes) {
    return phoneCodes.map(({ code, label }) => ({ value: code, label }));
}
