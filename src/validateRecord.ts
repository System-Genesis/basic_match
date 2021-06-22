/* eslint-disable no-param-reassign */
import { matchedRecord as matchedRecordType } from './types/matchedRecord';
import fieldNames from './config/fieldNames';
import { RANKS, AKA_UNITS, SERVICE_TYPES } from './config/enums';
import validators from './config/validators';

const matchedRecordFieldNames = fieldNames.matchedRecord;

const validateRank = (matchedRecord: matchedRecordType): void => {
    if (!RANKS.includes(matchedRecord[matchedRecordFieldNames.rank])) {
        delete matchedRecord[matchedRecordFieldNames.rank];
    }
};

const validateAKAUnit = (matchedRecord: matchedRecordType): void => {
    if (!AKA_UNITS.includes(matchedRecord[matchedRecordFieldNames.akaUnit])) {
        delete matchedRecord[matchedRecordFieldNames.akaUnit];
    }
};

const validateServiceType = (matchedRecord: matchedRecordType): void => {
    if (!SERVICE_TYPES.includes(matchedRecord[matchedRecordFieldNames.serviceType])) {
        delete matchedRecord[matchedRecordFieldNames.serviceType];
    }
};

const validateClearance = (matchedRecord: matchedRecordType): void => {
    if (!validators().clearance.test(matchedRecord[matchedRecordFieldNames.clearance])) {
        delete matchedRecord[matchedRecordFieldNames.clearance];
    }
};

const validateIdentityCard = (matchedRecord: matchedRecordType): void => {
    if (!validators().identityCard(matchedRecord[matchedRecordFieldNames.identityCard])) {
        delete matchedRecord[matchedRecordFieldNames.identityCard];
    }
};

const validateMobilePhone = (matchedRecord: matchedRecordType): void => {
    if (!validators().mobilePhone.test(matchedRecord[matchedRecordFieldNames.mobilePhone])) {
        delete matchedRecord[matchedRecordFieldNames.mobilePhone];
    }
};

const validatePhone = (matchedRecord: matchedRecordType): void => {
    if (!validators().phone.test(matchedRecord[matchedRecordFieldNames.phone])) {
        delete matchedRecord[matchedRecordFieldNames.phone];
    }
};

const validateDischargeDay = (matchedRecord: matchedRecordType): void => {
    const value = matchedRecord[matchedRecordFieldNames.dischargeDay];
    const date: Date | null = value && value !== fieldNames.unknown ? new Date(value) : null;
    if (date) {
        const userTimezoneOffset: number = date.getTimezoneOffset() * 60000;
        matchedRecord[matchedRecordFieldNames.dischargeDay] = new Date(date.getTime() - userTimezoneOffset).toISOString();
    } else {
        delete matchedRecord[matchedRecordFieldNames.dischargeDay];
    }
};

const validateMail = (matchedRecord: matchedRecordType): void => {
    if (!validators().mail.test(matchedRecord[matchedRecordFieldNames.mail])) {
        delete matchedRecord[matchedRecordFieldNames.mail];
    }
};

const validateFuncs = [
    validateAKAUnit,
    validateClearance,
    validateDischargeDay,
    validateIdentityCard,
    validateMail,
    validateMobilePhone,
    validatePhone,
    validateRank,
    validateServiceType,
];

export default (matchedRecord: matchedRecordType): void => {
    validateFuncs.forEach((func) => {
        func(matchedRecord);
    });
};
