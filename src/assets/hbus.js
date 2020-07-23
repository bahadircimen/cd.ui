
function scriptGenerator(url) {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                const head = document.getElementsByTagName('head')[0]
                const script = document.createElement('script')
                script.type = 'text/javascript'
                script.src = url;
                script.async = 1;
                head.appendChild(script);
                resolve()
            }, 0)
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * Tool initializer
 */
export const initilize = () => {
    const cdnUri = 'https://images.hepsiburada.net/hbus/hbus.min.v3.2.8.js';
    const baseUrl = `${window.location.protocol}//${window.location.hostname}${window.location.port !== '' ? `:${window.location.port}` : ''}`;

    return new Promise((resolve, reject) => {
        scriptGenerator(cdnUri)
            .then(() => {
                window.addEventListener(
                    'hbus:ready',
                    () => {
                        // window.HBUS_LAZY = true;
                        window.hwindow.config.davinci.host = baseUrl;
                        // window.hwindow.config.debug = false;
                        resolve('hbus:ready')
                    },
                    false
                )
            })
            .catch(error => {
                // eslint-disable-next-line no-console
                console.error(error);
                reject(error)
            })
    })
};

export const publish = (eventName = '', eventType = '', eventValue = {}, eventProperties = {}) => {
    let davinciEventName = '';
    davinciEventName += eventName + 'Hbus';
    window.hepsiBus.track(davinciEventName, eventProperties)
};
