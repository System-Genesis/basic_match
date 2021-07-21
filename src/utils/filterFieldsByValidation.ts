import { matchedRecord as matchedRecordType } from '../types/matchedRecord';
import fieldNames from '../config/fieldNames';
import { RANKS, SERVICE_TYPES, AKA_UNITS } from '../config/enums';
import validators from '../config/validators';
import sendLog from '../logger';

const matchedRecordFieldNames = fieldNames.matchedRecord;

const validateRank = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    if (!RANKS.includes(matchedRecord[matchedRecordFieldNames.rank])) {
        sendLog('warn', 'Invalid Rank', false, {
            identifier,
            user: matchedRecord[matchedRecordFieldNames.userID],
            source: matchedRecord[matchedRecordFieldNames.source],
            value: matchedRecord[matchedRecordFieldNames.rank],
        });
        return false;
    }

    return true;
};

const validateAKAUnit = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    if (!AKA_UNITS.includes(matchedRecord[matchedRecordFieldNames.akaUnit])) {
        sendLog('warn', 'Invalid AKA Unit', false, {
            identifier,
            user: matchedRecord[matchedRecordFieldNames.userID],
            source: matchedRecord[matchedRecordFieldNames.source],
            value: matchedRecord[matchedRecordFieldNames.akaUnit],
        });
        return false;
    }

    return true;
};

const validateServiceType = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    if (!SERVICE_TYPES.includes(matchedRecord[matchedRecordFieldNames.serviceType])) {
        sendLog('warn', 'Invalid Service Type', false, {
            identifier,
            user: matchedRecord[matchedRecordFieldNames.userID],
            source: matchedRecord[matchedRecordFieldNames.source],
            value: matchedRecord[matchedRecordFieldNames.serviceType],
        });
        return false;
    }

    return true;
};

const validateClearance = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    if (!validators().clearance.test(matchedRecord[matchedRecordFieldNames.clearance])) {
        sendLog('warn', 'Invalid Clearance', false, {
            identifier,
            user: matchedRecord[matchedRecordFieldNames.userID],
            source: matchedRecord[matchedRecordFieldNames.source],
            value: matchedRecord[matchedRecordFieldNames.clearance],
        });
        return false;
    }

    return true;
};

const validateIdentityCard = (matchedRecord: matchedRecordType): boolean => {
    // Remove 0's from the start
    matchedRecord[matchedRecordFieldNames.identityCard] = matchedRecord[matchedRecordFieldNames.identityCard].replace(/^0+/, '');
    if (!validators().identityCard(matchedRecord[matchedRecordFieldNames.identityCard])) {
        sendLog('warn', 'Invalid Identity Card', false, {
            user: matchedRecord[matchedRecordFieldNames.userID],
            source: matchedRecord[matchedRecordFieldNames.source],
            value: matchedRecord[matchedRecordFieldNames.identityCard],
        });
        return false;
    }

    return true;
};

const validateMobilePhone = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    if (!Array.isArray(matchedRecord[matchedRecordFieldNames.mobilePhone])) {
        matchedRecord[matchedRecordFieldNames.mobilePhone] = [matchedRecord[matchedRecordFieldNames.mobilePhone]];
    }
    if (!validators().mobilePhone.test(matchedRecord[matchedRecordFieldNames.mobilePhone])) {
        sendLog('warn', 'Invalid Mobile Phone', false, {
            identifier,
            user: matchedRecord[matchedRecordFieldNames.userID],
            source: matchedRecord[matchedRecordFieldNames.source],
            value: matchedRecord[matchedRecordFieldNames.mobilePhone],
        });
        return false;
    }

    return true;
};

const validatePhone = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    if (!validators().phone.test(matchedRecord[matchedRecordFieldNames.phone])) {
        sendLog('warn', 'Invalid Phone', false, {
            identifier,
            user: matchedRecord[matchedRecordFieldNames.userID],
            source: matchedRecord[matchedRecordFieldNames.source],
            value: matchedRecord[matchedRecordFieldNames.phone],
        });
        return false;
    }

    return true;
};

const validateDischargeDay = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    const value = matchedRecord[matchedRecordFieldNames.dischargeDay];
    const date: Date | null = value && value !== fieldNames.unknown ? new Date(value) : null;
    if (date) {
        const userTimezoneOffset: number = date.getTimezoneOffset() * 60000;
        matchedRecord[matchedRecordFieldNames.dischargeDay] = new Date(date.getTime() - userTimezoneOffset).toISOString();
    } else {
        sendLog('warn', 'Invalid Discharge Day', false, {
            identifier,
            user: matchedRecord[matchedRecordFieldNames.userID],
            source: matchedRecord[matchedRecordFieldNames.source],
            value: matchedRecord[matchedRecordFieldNames.dischargeDay],
        });
        return false;
    }

    return true;
};

const validateMail = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    if (!validators().mail.test(matchedRecord[matchedRecordFieldNames.mail])) {
        sendLog('warn', 'Invalid mail', false, {
            identifier,
            user: matchedRecord[matchedRecordFieldNames.userID],
            source: matchedRecord[matchedRecordFieldNames.source],
            value: matchedRecord[matchedRecordFieldNames.mail],
        });
        return false;
    }

    return true;
};

const validatePersonalNumber = (matchedRecord: matchedRecordType, identityCard: string): boolean => {
    if (matchedRecord[matchedRecordFieldNames.rank] && matchedRecord[matchedRecordFieldNames.rank] === fieldNames.invalidRankForPN) {
        sendLog('warn', 'Removed Personal Number due to It is not a personal number', false, {
            identifier: identityCard,
            user: matchedRecord[matchedRecordFieldNames.userID],
            source: matchedRecord[matchedRecordFieldNames.source],
            value: fieldNames.invalidRankForPN,
        });
        return false;
    }

    return true;
};

const validateBirthday = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    if (!Date.parse(matchedRecord[matchedRecordFieldNames.birthDate])) {
        sendLog('warn', 'Invalid birthday', false, {
            identifier,
            user: matchedRecord[matchedRecordFieldNames.userID],
            source: matchedRecord[matchedRecordFieldNames.source],
            value: fieldNames.invalidRankForPN,
        });
        return false;
    }

    return true;
};

const validationFunctions = new Map<string, (matchedRecord: matchedRecordType, identifier: string) => boolean>([
    [matchedRecordFieldNames.akaUnit, validateAKAUnit],
    [matchedRecordFieldNames.clearance, validateClearance],
    [matchedRecordFieldNames.dischargeDay, validateDischargeDay],
    [matchedRecordFieldNames.mail, validateMail],
    [matchedRecordFieldNames.rank, validateRank],
    [matchedRecordFieldNames.serviceType, validateServiceType],
    [matchedRecordFieldNames.birthDate, validateBirthday],
]);

export default (matchedRecord: matchedRecordType): void => {
    if (matchedRecord[matchedRecordFieldNames.identityCard]) {
        if (!validateIdentityCard(matchedRecord)) delete matchedRecord[matchedRecordFieldNames.identityCard];
    }

    if (matchedRecord[matchedRecordFieldNames.personalNumber]) {
        if (!validatePersonalNumber(matchedRecord, matchedRecord[matchedRecordFieldNames.personalNumber]))
            delete matchedRecord[matchedRecordFieldNames.personalNumber];
    }

    if (matchedRecord[matchedRecordFieldNames.mobilePhone]) {
        matchedRecord[matchedRecordFieldNames.mobilePhone] = matchedRecord[matchedRecordFieldNames.mobilePhone].filter((mobilePhone) =>
            validateMobilePhone(matchedRecord, mobilePhone),
        );
        if (matchedRecord[matchedRecordFieldNames.mobilePhone].length === 0) delete matchedRecord[matchedRecordFieldNames.mobilePhone];
    }

    if (matchedRecord[matchedRecordFieldNames.phone]) {
        matchedRecord[matchedRecordFieldNames.phone] = matchedRecord[matchedRecordFieldNames.phone].filter((phone) =>
            validatePhone(matchedRecord, phone),
        );
        if (matchedRecord[matchedRecordFieldNames.phone].length === 0) delete matchedRecord[matchedRecordFieldNames.phone];
    }

    const identifier: string =
        matchedRecord[matchedRecordFieldNames.identityCard] ||
        matchedRecord[matchedRecordFieldNames.personalNumber] ||
        matchedRecord[matchedRecordFieldNames.goalUserId];

    const recordFields: string[] = Object.keys(matchedRecord);

    recordFields.forEach((field) => {
        if (validationFunctions.has(field)) {
            // If field is invalid - delete the field
            if (!validationFunctions.get(field)!(matchedRecord, identifier)) {
                delete matchedRecord[field];
            }
        }
    });
};
