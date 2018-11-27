export default function generatePdf(accountName, password) {
    if (!window.jsPDF) {
        return;
    }

    const img = new Image();
    img.src = '/images/password.png';

    img.onload = () => {
        const doc = new jsPDF();

        doc.setFontSize(13);
        doc.text(20, 30, 'Login:');
        doc.text(20, 38, 'Password:');

        doc.setFontType('bold');

        doc.text(43, 30, accountName || '');
        doc.text(43, 38, password);

        doc.addImage(img, 'PNG', 60, 50, 90, 64);

        doc.save(`golos-account_${makeTimeStamp()}.pdf`);
    };
}

function makeTimeStamp() {
    const now = new Date();

    const date = [
        now.getFullYear(),
        nn(now.getMonth() + 1),
        nn(now.getDate()),
    ].join('-');

    const time = [
        nn(now.getHours()),
        nn(now.getMinutes()),
        nn(now.getSeconds()),
    ].join('-');

    return `${date}_${time}`;
}

function nn(value) {
    if (value < 10) {
        return `0${value}`;
    } else {
        return value.toString();
    }
}
