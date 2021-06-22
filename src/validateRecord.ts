/* eslint-disable no-param-reassign */
import { matchedRecord as matchedRecordType } from './types/matchedRecord';
import fieldNames from './config/fieldNames';
import { RANKS, AKA_UNITS, SERVICE_TYPES } from './config/enums';
import validators from './config/validators';
import { sendLog } from './rabbit';

const matchedRecordFieldNames = fieldNames.matchedRecord;

const validateRank = (matchedRecord: matchedRecordType, identifier: string): void => {
    if (!RANKS.includes(matchedRecord[matchedRecordFieldNames.rank])) {
        sendLog('error', 'Invalid Rank', 'Traking', 'Basic Match', {
            identifier,
            user: matchedRecord[matchedRecordFieldNames.userID],
        });
        delete matchedRecord[matchedRecordFieldNames.rank];
    }
};

const validateAKAUnit = (matchedRecord: matchedRecordType, identifier: string): void => {
    if (!AKA_UNITS.includes(matchedRecord[matchedRecordFieldNames.akaUnit])) {
        sendLog('error', 'Invalid AKA Unit', 'Traking', 'Basic Match', {
            identifier,
            user: matchedRecord[matchedRecordFieldNames.userID],
        });
        delete matchedRecord[matchedRecordFieldNames.akaUnit];
    }
};

const validateServiceType = (matchedRecord: matchedRecordType, identifier: string): void => {
    if (!SERVICE_TYPES.includes(matchedRecord[matchedRecordFieldNames.serviceType])) {
        sendLog('error', 'Invalid Service Type', 'Traking', 'Basic Match', {
            identifier,
            user: matchedRecord[matchedRecordFieldNames.userID],
        });
        delete matchedRecord[matchedRecordFieldNames.serviceType];
    }
};

const validateClearance = (matchedRecord: matchedRecordType, identifier: string): void => {
    if (!validators().clearance.test(matchedRecord[matchedRecordFieldNames.clearance])) {
        sendLog('error', 'Invalid Clearance', 'Traking', 'Basic Match', {
            identifier,
            user: matchedRecord[matchedRecordFieldNames.userID],
        });
        delete matchedRecord[matchedRecordFieldNames.clearance];
    }
};

const validateIdentityCard = (matchedRecord: matchedRecordType): void => {
    if (!validators().identityCard(matchedRecord[matchedRecordFieldNames.identityCard])) {
        sendLog('error', 'Invalid Identity Card', 'Traking', 'Basic Match', {
            user: matchedRecord[matchedRecordFieldNames.userID],
        });
        delete matchedRecord[matchedRecordFieldNames.identityCard];
    }
};

const validateMobilePhone = (matchedRecord: matchedRecordType, identifier: string): void => {
    if (!validators().mobilePhone.test(matchedRecord[matchedRecordFieldNames.mobilePhone])) {
        sendLog('error', 'Invalid Mobile Phone', 'Traking', 'Basic Match', {
            identifier,
            user: matchedRecord[matchedRecordFieldNames.userID],
        });
        delete matchedRecord[matchedRecordFieldNames.mobilePhone];
    }
};

const validatePhone = (matchedRecord: matchedRecordType, identifier: string): void => {
    if (!validators().phone.test(matchedRecord[matchedRecordFieldNames.phone])) {
        sendLog('error', 'Invalid Phone', 'Traking', 'Basic Match', {
            identifier,
            user: matchedRecord[matchedRecordFieldNames.userID],
        });
        delete matchedRecord[matchedRecordFieldNames.phone];
    }
};

const validateDischargeDay = (matchedRecord: matchedRecordType, identifier: string): void => {
    const value = matchedRecord[matchedRecordFieldNames.dischargeDay];
    const date: Date | null = value && value !== fieldNames.unknown ? new Date(value) : null;
    if (date) {
        const userTimezoneOffset: number = date.getTimezoneOffset() * 60000;
        matchedRecord[matchedRecordFieldNames.dischargeDay] = new Date(date.getTime() - userTimezoneOffset).toISOString();
    } else {
        sendLog('error', 'Invalid Discharge Day', 'Traking', 'Basic Match', {
            identifier,
            user: matchedRecord[matchedRecordFieldNames.userID],
        });
        delete matchedRecord[matchedRecordFieldNames.dischargeDay];
    }
};

const validateMail = (matchedRecord: matchedRecordType, identifier: string): void => {
    if (!validators().mail.test(matchedRecord[matchedRecordFieldNames.mail])) {
        sendLog('error', 'Invalid mail', 'Traking', 'Basic Match', {
            identifier,
            user: matchedRecord[matchedRecordFieldNames.userID],
        });
        delete matchedRecord[matchedRecordFieldNames.mail];
    }
};

const fieldsFuncs = new Map<string, (matchedRecord: matchedRecordType, identifier: string) => void>([
    [matchedRecordFieldNames.akaUnit, validateAKAUnit],
    [matchedRecordFieldNames.clearance, validateClearance],
    [matchedRecordFieldNames.dischargeDay, validateDischargeDay],
    [matchedRecordFieldNames.mail, validateMail],
    [matchedRecordFieldNames.mobilePhone, validateMobilePhone],
    [matchedRecordFieldNames.phone, validatePhone],
    [matchedRecordFieldNames.rank, validateRank],
    [matchedRecordFieldNames.serviceType, validateServiceType],
]);

export default (matchedRecord: matchedRecordType): void => {
    validateIdentityCard(matchedRecord);
    const identifier: string =
        matchedRecord[matchedRecordFieldNames.identityCard] ||
        matchedRecord[matchedRecordFieldNames.personalNumber] ||
        matchedRecord[matchedRecordFieldNames.goalUserId];

    const recordFields: string[] = Object.keys(matchedRecord);

    recordFields.forEach((field) => {
        if (fieldsFuncs.has(field) && field !== matchedRecordFieldNames.identityCard) {
            fieldsFuncs.get(field)!(matchedRecord, identifier);
        }
    });
};
