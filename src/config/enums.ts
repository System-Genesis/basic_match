import fieldNames from './fieldNames';

// eslint-disable-next-line no-shadow
export enum RANKS {
    'unknown' = 1,
    'rookie' = 2,
    'champion' = 3,
    'ultimate' = 4,
}

// List of the valid service types
export const SERVICE_TYPES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

// Map between a source and it's domain suffix for the userID
export const DOMAIN_SUFFIXES: [string, string][] = [
    [fieldNames.sources.ads, '@rabiran.com'],
    [fieldNames.sources.es, '@jello.com'],
    [fieldNames.sources.adNN, '@adnn.com'],
    [fieldNames.sources.sf, '@leonardo.com'],
    [fieldNames.sources.city, '@city.com'],
    [fieldNames.sources.mir, '@city.com'],
];

// List of the civilian service types
export const C_SERVICE_TYPES: string[] = ['F', 'G'];

// List of all the possible given male sex
export const MALE_ENUM = ['m', 'male', 'ז', 'זכר'];

// List of all the possible given female sex
export const FEMALE_ENUM = ['f', 'נ', 'נקבה', 'female'];
