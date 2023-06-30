export const isRequired = (value: string | Date) => {
    value = typeof value === 'string' ? value.trim() : value;
    if (value === null || value === undefined || value === '') return false;
    return true;
};

export const onlyNumber = (value: string | Date, canEmpty = false) => {
    if (canEmpty && !isRequired(value)) return true;
    return /^(?!$)(\d+)*$/.test(value as string);
};
