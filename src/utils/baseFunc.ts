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
