import { matchedRecord as matchedRecordType } from '../types/matchedRecord';

/**
 * Sets the field and it's value
 * @param { matchedRecordType } matchedRecord - The generated record
 * @param { string } value - The value of the field
 * @param { string } fieldName - The name of the field
 */
export default (matchedRecord: matchedRecordType, value: string, fieldName: string): void => {
    matchedRecord[fieldName] = value.toString();
};

/**
 * Sets one of the phone numbers field
 * @param { matchedRecordType } matchedRecord - The generated record
 * @param { string } value - The value of the field
 * @param { string } fieldName - The name of the field
 */
export const setPhone = (matchedRecord: matchedRecordType, value: string | string[], fieldName: string): void => {
    if (!Array.isArray(value)) value = [value];

    // Add 0 at the start and remove '-' from phone numbers
    const phoneNumbers: string[] = value.map((num) => {
        num = num.replace('-', '');
        return num.startsWith('0') ? num : `0${num}`;
    });

    matchedRecord[fieldName] = phoneNumbers;
};
