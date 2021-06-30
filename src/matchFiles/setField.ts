import { matchedRecord as matchedRecordType } from '../types/matchedRecord';

// Set the records' field - the function gets the field name
export default (matchedRecord: matchedRecordType, value: string, fieldName: string): void => {
    matchedRecord[fieldName] = value.toString();
};