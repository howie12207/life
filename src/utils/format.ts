export const toStartTime = (time: Date) => {
    if (!time) return time;
    time = new Date(time);

    time.setHours(0);
    time.setMinutes(0);
    time.setSeconds(0);
    time.setMilliseconds(0);
    return time;
};

/**
 * 將時間轉成一般字串
 * @param {Date|Number|String} time 時間
 * @returns {String} xxxx-xx-xx xx:xx:xx
 */
export const formatDateTime = (time: Date | number | string) => {
    if (!time) return time;
    time = new Date(time);
    if (time.toString() === 'Invalid Date') return '';
    const yyyy = time.getFullYear();
    const mm = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
    const dd = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
    const hh = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    const MM = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    const ss = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
    return `${yyyy}-${mm}-${dd} ${hh}:${MM}:${ss}`;
};

export const formatDate = (time: Date | number | string) => {
    if (!time) return time;
    time = new Date(time);
    return (formatDateTime(time) as string)?.slice(0, 10);
};
