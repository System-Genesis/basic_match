/* eslint-disable no-unused-expressions */
import validators from '../../config/validators';

/* eslint-disable no-param-reassign */
export const setFirstName = (mathcedRecord: any, value: string): void => {
    mathcedRecord.firstName = value;
};

export const setLastName = (mathcedRecord: any, value: string): void => {
    mathcedRecord.lastName = value;
};

export const setRank = (mathcedRecord: any, value: string): void => {
    mathcedRecord.rank = value;
};

export const setClearance = (mathcedRecord: any, value: string): void => {
    mathcedRecord.clearance = value;
};

export const setSex = (mathcedRecord: any, value: string): void => {
    mathcedRecord.sex = value;
};

export const setPersonalNumber = (mathcedRecord: any, value: string): void => {
    mathcedRecord.personalNumber = value;
};

export const setIdentityCard = (matchedRecord: any, value: string): void => {
    validators(value).identityCard ? (matchedRecord.identityCard = value) : null;
};

export const setDischargeDay = (matchedRecord: any, value: string): void => {
    const date: Date | null = value ? new Date(value) : null;
    if (date) {
        const userTimezoneOffset: number = date.getTimezoneOffset() * 60000;
        matchedRecord.dischargeDay = date ? new Date(date.getTime() - userTimezoneOffset).toISOString() : null;
    }
};

export const setAkaUnit = (matchedRecord: any, value: string): void => {
    matchedRecord.unitName = value.toString().replace(new RegExp('"', 'g'), ' ');
};

export const setServiceType = (matchedRecord: any, value: string): void => {
    matchedRecord.serviceType = value;
};

export const setMobilePhone = (matchedRecord: any, value: string): void => {
    validators().mobilePhone.test(value) ? (matchedRecord.mobilePhone = value) : null;
};

export const setBirthdate = (matchedRecord: any, value: string): void => {
    matchedRecord.birthDate = value;
};

export const setAddress = (matchedRecord: any, value: string): void => {
    matchedRecord.address = value;
};

export const setMail = (matchedRecord: any, value: string): void => {
    matchedRecord.mail = value;
};

export const setJob = (matchedRecord: any, value: string): void => {
    matchedRecord.job = value;
};

export const setHierarchy = (matchedRecord: any, value: string): void => {
    matchedRecord.hierarchy = value;
};

export const setPhone = (matchedRecord: any, value: string): void => {
    validators().phone.test(value) ? (matchedRecord.phone = value) : null;
};
};

export const setSource = (matchedRecord: any, value: string): void => {
    matchedRecord.source = value;
};

export const setEntityType = (matchedRecord: any, value: string): void => {
    matchedRecord.entityType = value;
};

export const setUserID = (matchedRecord: any, value: string): void => {
    matchedRecord.userID = value;
};
