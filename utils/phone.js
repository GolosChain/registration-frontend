export function formatPhone(phone) {
    const groups = phone.match(/^(\d+)(\d\d\d)(\d\d)(\d\d)$/);

    if (!groups) {
        return phone;
    }

    const begin = groups[1];
    let start;

    if (/^[17]/.test(begin)) {
        start = `${begin[0]} (${begin.substr(1)}) `;
    } else if (
        /^2[1234569]/.test(begin) ||
        /^3[578]/.test(begin) ||
        /^42/.test(begin) ||
        /^5[09]/.test(begin) ||
        /^6[789]/.test(begin) ||
        /^8[0578]/.test(begin) ||
        /^9[679]/.test(begin)
    ) {
        start = `${begin.substr(0, 3)} (${begin.substr(3)}) `;
    } else {
        start = `${begin.substr(0, 2)} (${begin.substr(2)}) `;
    }

    return `${start} ${groups[2]}-${groups[3]}-${groups[4]}`;
}
