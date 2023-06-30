export const toStartTime = (time: Date) => {
    if (!time) return time;
    time = new Date(time);

    time.setHours(0);
    time.setMinutes(0);
    time.setSeconds(0);
    time.setMilliseconds(0);
    return time;
};
