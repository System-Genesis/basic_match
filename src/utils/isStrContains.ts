export const isStrContains = (target: string, pattern: string[]): boolean => {
    let value = 0;

    pattern.forEach((word) => {
        value += target.includes(word) ? 1 : 0;
    });

    return value > 0;
};
