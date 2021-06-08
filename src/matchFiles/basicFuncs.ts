/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import validators from '../config/validators';
import { matchedRecord as matchedRecordType } from '../types/matchedRecord';
import fieldNames from '../config/fieldNames';

// raplace all other functions for spesific files

export const setField = (mathcedRecord: any, value: string, fieldName: string): void => {
    mathcedRecord[fieldName] = value;
};

export const setIdentityCard = (matchedRecord: matchedRecordType, value: string): void => {
    validators().identityCard(value) ? (matchedRecord.identityCard = value) : null;
};

export const setDischargeDay = (matchedRecord: matchedRecordType, value: string): void => {
    const date: Date | null = value && value !== fieldNames.unknown ? new Date(value) : null;
    if (date) {
        const userTimezoneOffset: number = date.getTimezoneOffset() * 60000;
        matchedRecord.dischargeDay = new Date(date.getTime() - userTimezoneOffset).toISOString();
    }
};

export const setMobilePhone = (matchedRecord: matchedRecordType, value: string): void => {
    validators().mobilePhone.test(value) ? (matchedRecord.mobilePhone = value) : null;
};

export const setPhone = (matchedRecord: matchedRecordType, value: string): void => {
    validators().phone.test(value) ? (matchedRecord.phone = value) : null;
};
