import moment from 'moment';

export default function generatePdf(accountName, password) {
    if (!window.jsPDF) {
        return;
    }

    const img = new Image();
    img.src = '/images/password.png';

    img.onload = () => {
        const doc = new jsPDF();

        doc.setFontSize(13);
        doc.text(20, 30, `Login: ${accountName}`);
        doc.text(20, 38, `Password: ${password}`);

        doc.addImage(img, 'PNG', 15, 80, 180, 127);

        doc.save(`golos-account_${moment().format('YYYY-MM-DD_HH-mm-ss')}.pdf`);
    };
}
