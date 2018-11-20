import phoneCodes from '../app/phoneCodes.json';

let saved = null;

export function phoneCodesToSelectItems() {
    if (!saved) {
        const list = phoneCodes.list.map((item, i) => {
            if (!item) {
                return null;
            }

            return {
                value: i,
                code: item.code,
                label: item.label,
            };
        });

        if (phoneCodes.topCount) {
            list.splice(phoneCodes.topCount, 0, {
                value: '',
                code: 0,
                label: '',
            });
        }

        saved = list;
    }

    return saved;
}
