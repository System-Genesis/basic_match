/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import logger from 'logger-genesis';
import { matchedRecord as matchedRecordType } from '../types/matchedRecord';
import fieldNames from '../config/fieldNames';
import { RANKS, SERVICE_TYPES, C_SERVICE_TYPES, MALE_ENUM, FEMALE_ENUM } from '../config/enums';
import validators from '../config/validators';
import { scopeOption } from '../types/log';

const { logFields } = fieldNames;

const matchedRecordFieldNames = fieldNames.matchedRecord;

const validateRank = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    if (!RANKS.includes(matchedRecord[matchedRecordFieldNames.rank])) {
        logger.warn(
            false,
            logFields.scopes.app as scopeOption,
            'Invalid Rank',
            `Invalid Rank: ${matchedRecord[matchedRecordFieldNames.rank]} for userID: ${matchedRecord[matchedRecordFieldNames.userID]
            } with identifier: ${identifier} from source: ${matchedRecord[matchedRecordFieldNames.source]}`, {
            id: identifier
        }
        );
        return false;
    }

    return true;
};

// Invalid Rank ${rank} for user ${userID} with identifier ${identifier} from source ${source}

const validateServiceType = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    if (!SERVICE_TYPES.includes(matchedRecord[matchedRecordFieldNames.serviceType])) {
        logger.warn(
            false,
            logFields.scopes.app as scopeOption,
            'Invalid Service Type',
            `Invalid Service Type: ${matchedRecord[matchedRecordFieldNames.serviceType]} for userID: ${matchedRecord[matchedRecordFieldNames.userID]
            } with identifier: ${identifier} from source: ${matchedRecord[matchedRecordFieldNames.source]}`, {
            id: identifier
        }
        );
        return false;
    }

    // If source is Aka set Entity type
    if (matchedRecord[matchedRecordFieldNames.source] === fieldNames.sources.aka) {
        matchedRecord[matchedRecordFieldNames.entityType] = C_SERVICE_TYPES.includes(matchedRecord[matchedRecordFieldNames.serviceType])
            ? fieldNames.entityTypeValue.c
            : fieldNames.entityTypeValue.s;
    }

    return true;
};

const validateClearance = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    if (!validators().clearance.test(matchedRecord[matchedRecordFieldNames.clearance])) {
        logger.warn(
            false,
            logFields.scopes.app as scopeOption,
            'Invalid Clearance',
            `Invalid Clearance: ${matchedRecord[matchedRecordFieldNames.clearance]} for userID: ${matchedRecord[matchedRecordFieldNames.userID]
            } with identifier: ${identifier} from source: ${matchedRecord[matchedRecordFieldNames.source]}`, {
            id: identifier
        }
        );
        return false;
    }

    return true;
};

const validateIdentityCard = (matchedRecord: matchedRecordType): boolean => {
    // Remove 0's from the start
    matchedRecord[matchedRecordFieldNames.identityCard] = matchedRecord[matchedRecordFieldNames.identityCard].replace(/^0+/, '');
    if (!validators().identityCard(matchedRecord[matchedRecordFieldNames.identityCard])) {
        logger.warn(
            false,
            logFields.scopes.app as scopeOption,
            'Invalid Identity Card',
            `Invalid Identity Card: ${matchedRecord[matchedRecordFieldNames.identityCard]} for userID: ${matchedRecord[matchedRecordFieldNames.userID]
            } from source: ${matchedRecord[matchedRecordFieldNames.source]}`, {
            id: matchedRecord[matchedRecordFieldNames.personalNumber]
        }
        );
        return false;
    }

    return true;
};

const validateMobilePhone = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    if (!validators().mobilePhone.test(matchedRecord[matchedRecordFieldNames.mobilePhone])) {
        logger.warn(
            false,
            logFields.scopes.app as scopeOption,
            'Invalid Mobile Phone',
            `Invalid Mobile Phone: ${matchedRecord[matchedRecordFieldNames.mobilePhone]} for userID: ${matchedRecord[matchedRecordFieldNames.userID]
            } with identifier: ${identifier} from source: ${matchedRecord[matchedRecordFieldNames.source]}`, {
            id: identifier
        }
        );
        return false;
    }

    return true;
};

const validatePhone = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    if (!validators().phone.test(matchedRecord[matchedRecordFieldNames.phone])) {
        logger.warn(
            false,
            logFields.scopes.app as scopeOption,
            'Invalid Phone',
            `Invalid Phone: ${matchedRecord[matchedRecordFieldNames.phone]} for userID: ${matchedRecord[matchedRecordFieldNames.userID]
            } with identifier: ${identifier} from source: ${matchedRecord[matchedRecordFieldNames.source]}`, {
            id: identifier
        }
        );
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
        logger.warn(
            false,
            logFields.scopes.app as scopeOption,
            'Invalid Discharge Day',
            `Invalid Discharge Day: ${matchedRecord[matchedRecordFieldNames.dischargeDay]} for userID: ${matchedRecord[matchedRecordFieldNames.userID]
            } with identifier: ${identifier} from source: ${matchedRecord[matchedRecordFieldNames.source]}`, {
            id: identifier
        }
        );
        return false;
    }

    return true;
};

const validateMail = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    matchedRecord[matchedRecordFieldNames.mail] = matchedRecord[matchedRecordFieldNames.mail].toLowerCase();
    if (!validators().mail.test(matchedRecord[matchedRecordFieldNames.mail])) {
        logger.warn(
            false,
            logFields.scopes.app as scopeOption,
            'Invalid mail',
            `Invalid mail: ${matchedRecord[matchedRecordFieldNames.mail]} for userID: ${matchedRecord[matchedRecordFieldNames.userID]
            } with identifier: ${identifier} from source: ${matchedRecord[matchedRecordFieldNames.source]}`, {
            id: identifier
        }
        );
        return false;
    }

    return true;
};

const validatePersonalNumber = (matchedRecord: matchedRecordType, identityCard: string): boolean => {
    if (
        isNaN(matchedRecord[matchedRecordFieldNames.personalNumber]) ||
        !validators().personalNumber.test(matchedRecord[matchedRecordFieldNames.personalNumber]) ||
        (matchedRecord[matchedRecordFieldNames.rank] && matchedRecord[matchedRecordFieldNames.rank] === fieldNames.invalidRankForPN)
    ) {
        logger.warn(
            false,
            logFields.scopes.app as scopeOption,
            'Invalid Personal Number',
            `Invalid Personal Number: ${matchedRecord[matchedRecordFieldNames.mobilePhone]} for userID: ${matchedRecord[matchedRecordFieldNames.userID]
            } with identifier: ${identityCard} from source: ${matchedRecord[matchedRecordFieldNames.source]}`, {
            id: identityCard
        }
        );
        return false;
    }

    return true;
};

const validateBirthday = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    if (!Date.parse(matchedRecord[matchedRecordFieldNames.birthDate])) {
        logger.warn(
            false,
            logFields.scopes.app as scopeOption,
            'Invalid Birth Date',
            `Invalid Birth Date: ${matchedRecord[matchedRecordFieldNames.birthDate]} for userID: ${matchedRecord[matchedRecordFieldNames.userID]
            } with identifier: ${identifier} from source: ${matchedRecord[matchedRecordFieldNames.source]}`, {
            id: identifier
        }
        );
        return false;
    }

    return true;
};

const validateSex = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    const sexLowerCased: string = matchedRecord[matchedRecordFieldNames.sex].toLowerCase();
    if (MALE_ENUM.includes(sexLowerCased)) matchedRecord[matchedRecordFieldNames.sex] = fieldNames.sexValues.m;
    else if (FEMALE_ENUM.includes(sexLowerCased)) matchedRecord[matchedRecordFieldNames.sex] = fieldNames.sexValues.f;
    else {
        logger.warn(
            false,
            logFields.scopes.app as scopeOption,
            'Invalid Sex',
            `Invalid Sex: ${matchedRecord[matchedRecordFieldNames.sex]} for userID: ${matchedRecord[matchedRecordFieldNames.userID]
            } with identifier: ${identifier} from source: ${matchedRecord[matchedRecordFieldNames.source]}`, {
            id: identifier
        }
        );
        return false;
    }

    return true;
};

const validateHierarchy = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    const hierarchyReg: RegExp = new RegExp(`[^a-zA-Z0-9\u0590-\u05FF/\\"'. ,!()_*%@$-]`, 'g');
    matchedRecord[matchedRecordFieldNames.hierarchy] = matchedRecord[matchedRecordFieldNames.hierarchy].replace(hierarchyReg, '');
    const hierarchy: string = matchedRecord[matchedRecordFieldNames.hierarchy];
    if (hierarchy.endsWith('/') || hierarchy.includes('//')) {
        logger.warn(
            false,
            logFields.scopes.app as scopeOption,
            'Invalid Hierarchy',
            `Invalid hierarchy: ${hierarchy} for userID: ${matchedRecord[matchedRecordFieldNames.userID]
            } with identifier: ${identifier} from source: ${matchedRecord[matchedRecordFieldNames.source]}`,
            { id: identifier });
        return false;
    }

    return true;
}

const validationFunctions = new Map<string, (matchedRecord: matchedRecordType, identifier: string) => boolean>([
    [matchedRecordFieldNames.clearance, validateClearance],
    [matchedRecordFieldNames.dischargeDay, validateDischargeDay],
    [matchedRecordFieldNames.mail, validateMail],
    [matchedRecordFieldNames.rank, validateRank],
    [matchedRecordFieldNames.serviceType, validateServiceType],
    [matchedRecordFieldNames.birthDate, validateBirthday],
    [matchedRecordFieldNames.sex, validateSex],
    [matchedRecordFieldNames.hierarchy, validateHierarchy],
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
