let gaLoaded = false;

function isDntEnabled() {
    const dntValues = ['1', 'yes', 'true'];
    return dntValues.includes(String(navigator.doNotTrack).toLowerCase())
        || dntValues.includes(String(window.doNotTrack).toLowerCase())
        || dntValues.includes(String(navigator.msDoNotTrack).toLowerCase());
}

function loadGtag(id) {
    if (gaLoaded) return;

    gaLoaded = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(script);

    // gtag 초기화
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {window.dataLayer.push(arguments);}
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true, send_page_view: false });
}

/**
 * GA 초기화
 */
export function initGA({id, router, enabled = true}) {
    if (!enabled) return;
    if (!id) return;
    if (isDntEnabled()) return;

    loadGtag(id);

    const sendPageView = to => {
        if (typeof window.gtag !== 'function') return;
        const page_location = window.location.origin + to.fullPath;
        const page_title = to.name;
        window.gtag('event', 'page_view', {
            page_title,
            page_location,
            page_path: to.fullPath,
        });
    }

    // 앱 최초 진입 후
    router.isReady().then(() => sendPageView(router.currentRoute.value));
}