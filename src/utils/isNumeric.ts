export const isNumeric = (value: number | string) => {
    return !isNaN(parseInt(value.toString(), 10));
};
