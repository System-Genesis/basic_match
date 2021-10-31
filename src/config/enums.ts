import fieldNames from './fieldNames';

export const RANKS = ['unknown', 'rookie', 'champion', 'ultimate'];

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
