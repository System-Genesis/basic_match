import { matchedRecord as matchedRecordType } from '../types/matchedRecord';

// Set the records' field - the function gets the field name
export default (matchedRecord: matchedRecordType, value: string, fieldName: string): void => {
    matchedRecord[fieldName] = value.toString();
};

export const setPhone = (matchedRecord: matchedRecordType, value: string | string[], fieldName: string): void => {
    if (!Array.isArray(value)) value = [value];

    // Add 0 at the start and remove '-' from phone numbers
    const phoneNumbers: string[] = value.map((num) => {
        num = num.replace('-', '');
        return num.startsWith('0') ? num : `0${num}`;
    });

    matchedRecord[fieldName] = phoneNumbers;
};
