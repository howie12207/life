export const throttle = (fn: () => void, delay = 100) => {
    let timeId: ReturnType<typeof setTimeout> | null = null;
    let previousTime = 0;

    return () => {
        const nowTime = Date.now();
        const remain = delay - (nowTime - previousTime);

        if (remain <= 0 || remain > delay) {
            if (timeId) timeId = null;

            previousTime = nowTime;
            fn();
        } else if (!timeId) {
            timeId = setTimeout(() => {
                previousTime = Date.now();
                timeId = null;
                fn();
            }, remain);
        }
    };
};

export const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};
