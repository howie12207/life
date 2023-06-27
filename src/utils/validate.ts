export const isRequired = (value: string) => {
    value = value.trim();
    if (value === null || value === undefined || value === '') return false;
    return true;
};
