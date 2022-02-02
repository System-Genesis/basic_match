/**
 * Checks if a string contains the given patterns
 * @param { string } target -  The string that being checked
 * @param { string [] } pattern - Contains the pattern that being searched in the given string
 * @return { boolean } true if the string contains at least one pattern
 */
export default (target: string, pattern: string[]): boolean => {
    let value = 0;

    pattern.forEach((word) => {
        value += target.includes(word) ? 1 : 0;
    });

    return value > 0;
};
