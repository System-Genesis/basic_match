import fieldNames from './fieldNames';

// eslint-disable-next-line no-shadow
export enum RANKS {
    'unknown' = 1,
    'rookie' = 2,
    'champion' = 3,
    'ultimate' = 4,
}

export const SERVICE_TYPES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export const DOMAIN_SUFFIXES: [string, string][] = [
    [fieldNames.sources.ads, '@rabiran.com'],
    [fieldNames.sources.es, '@jello.com'],
    [fieldNames.sources.adNN, '@adnn.com'],
    [fieldNames.sources.sf, '@leonardo.com'],
    [fieldNames.sources.city, '@city.com'],
    [fieldNames.sources.mir, '@city.com'],
];

export const C_SERVICE_TYPES: string[] = ['F', 'G'];

export const MALE_ENUM = ['m', 'male', 'ז', 'זכר'];
export const FEMALE_ENUM = ['f', 'נ', 'נקבה', 'female'];
