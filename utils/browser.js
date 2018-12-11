export function isMobile() {
    return (
        window.outerWidth <= 500 ||
        window.innerHeight <= 500 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
            window.navigator.userAgent
        )
    );
}
