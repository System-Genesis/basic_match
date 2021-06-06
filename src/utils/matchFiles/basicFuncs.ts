/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import validators from '../../config/validators';

// raplace all other functions for spesific files

export const setField = (mathcedRecord: any, value: string, fieldName: string): void => {
    mathcedRecord[fieldName] = value;
};

export const setIdentityCard = (matchedRecord: any, value: string): void => {
    validators(value).identityCard ? (matchedRecord.identityCard = value) : null;
};

export const setDischargeDay = (matchedRecord: any, value: string): void => {
    const date: Date | null = value && value !== 'לא ידוע' ? new Date(value) : null;
    if (date) {
        const userTimezoneOffset: number = date.getTimezoneOffset() * 60000;
        matchedRecord.dischargeDay = date ? new Date(date.getTime() - userTimezoneOffset).toISOString() : null;
    }
};

export const setMobilePhone = (matchedRecord: any, value: string): void => {
    validators(value).mobilePhone.test(value) ? (matchedRecord.mobilePhone = value) : null;
};

export const setPhone = (matchedRecord: any, value: string): void => {
    validators(value).phone.test(value) ? (matchedRecord.phone = value) : null;
};
