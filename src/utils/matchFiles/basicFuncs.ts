/* eslint-disable no-unused-expressions */
import validators from '../../config/validators';

/* eslint-disable no-param-reassign */
export const setFirstName = (mathcedRecord: any, value: string) => {
    mathcedRecord.firstName = value;
};

export const setLastName = (mathcedRecord: any, value: string) => {
    mathcedRecord.lastName = value;
};

export const setRank = (mathcedRecord: any, value: string) => {
    mathcedRecord.rank = value;
};

export const setClearance = (mathcedRecord: any, value: string) => {
    mathcedRecord.clearance = value;
};

export const setSex = (mathcedRecord: any, value: string) => {
    mathcedRecord.sex = value;
};

export const setPersonalNumber = (mathcedRecord: any, value: string) => {
    mathcedRecord.personalNumber = value;
};

export const setIdentityCard = (matchedRecord: any, value: string) => {
    validators(value).identityCard ? (matchedRecord.identityCard = value) : null;
};

export const setDischargeDay = (matchedRecord: any, value: Date) => {
    const date: Date | null = value ? new Date(value) : null;
    if (date) {
        const userTimezoneOffset: number = date.getTimezoneOffset() * 60000;
        matchedRecord.dischargeDay = date ? new Date(date.getTime() - userTimezoneOffset).toISOString() : null;
    }
};

export const setAkaUnit = (matchedRecord: any, value: string) => {
    matchedRecord.unitName = value.toString().replace(new RegExp('"', 'g'), ' ');
};

export const setServiceType = (matchedRecord: any, value: string) => {
    matchedRecord.serviceType = value;
};

export const setMobilePhone = (matchedRecord: any, value: string) => {
    validators().mobilePhone.test(value) ? (matchedRecord.mobilePhone = value) : null;
};

export const setBirthdate = (matchedRecord: any, value: Date) => {
    matchedRecord.birthDate = value;
};

export const setAddress = (matchedRecord: any, value: string) => {
    matchedRecord.address = value;
};

export const setMail = (matchedRecord: any, value: string) => {
    matchedRecord.mail = value;
};

export const setJob = (matchedRecord: any, value: string) => {
    matchedRecord.job = value;
};

export const setHierarchy = (matchedRecord: any, value: string) => {
    matchedRecord.hierarchy = value;
};
