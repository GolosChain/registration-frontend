export function formatPhone(phone) {
    const groups = phone.match(/^(\d+)(\d\d\d)(\d\d)(\d\d)$/);

    if (!groups) {
        return phone;
    }

    const begin = groups[1];
    let start;
    let mid;

    if (/^[17]/.test(begin)) {
        start = begin[0];
        mid = begin.substr(1);
    } else if (
        /^2[1234569]/.test(begin) ||
        /^3[578]/.test(begin) ||
        /^42/.test(begin) ||
        /^5[09]/.test(begin) ||
        /^6[789]/.test(begin) ||
        /^8[0578]/.test(begin) ||
        /^9[679]/.test(begin)
    ) {
        start = begin.substr(0, 3);
        mid = begin.substr(3);
    } else {
        start = begin.substr(0, 2);
        mid = begin.substr(2);
    }

    if (mid.length > 1) {
        mid = `(${mid}) `;
    }

    return `${start} ${mid}${groups[2]}-${groups[3]}-${groups[4]}`;
}
