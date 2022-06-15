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

/**
 * Checks if the rank is valid.
 * Determines if the rank is valid by checking if the rank exists in the ranks' list
 * If the rank is invalid also sends a warning log
 * @param { matchedRecordType } matchedRecord - The generated record
 * @param { string } identifier - One of the identifiers of the record
 * @returns { boolean } true if the rank is valid
 */
const validateRank = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    if (!(matchedRecord[matchedRecordFieldNames.rank] in RANKS)) {
        logger.warn(
            true,
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

/**
 * Checks if the service type is valid.
 * Determines if the service type is valid by checking if the service type exists in the service types' list
 * If the service type is invalid also sends a warning log
 * @param { matchedRecordType } matchedRecord - The generated record
 * @param { string } identifier - One of the identifiers of the record
 * @returns { boolean } true if the service type is valid
 */
const validateServiceType = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    if (!SERVICE_TYPES.includes(matchedRecord[matchedRecordFieldNames.serviceType])) {
        logger.warn(
            true,
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

/**
 * Checks if the clearance is valid.
 * Determines if the clearance is valid by it's length and type
 * If the clearance is invalid also sends a warning log
 * @param { matchedRecordType } matchedRecord - The generated record
 * @param { string } identifier - One of the identifiers of the record
 * @returns { boolean } true if the clearance is valid
 */
const validateClearance = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    if (!validators().clearance.test(matchedRecord[matchedRecordFieldNames.clearance])) {
        logger.warn(
            true,
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

/**
 * Checks if the fullClearance is valid.
 * Determines if the fullClearance is valid by it's length and type
 * If the fullClearance is invalid also sends a warning log
 * @param { matchedRecordType } matchedRecord - The generated record
 * @param { string } identifier - One of the identifiers of the record
 * @returns { boolean } true if the fullClearance is valid
 */
const validateFullClearance = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    if (!validators().fullClearance.test(matchedRecord[matchedRecordFieldNames.fullClearance])) {
        logger.warn(
            true,
            logFields.scopes.app as scopeOption,
            'Invalid fullClearance',
            `Invalid fullClearance: ${matchedRecord[matchedRecordFieldNames.fullClearance]} for userID: ${matchedRecord[matchedRecordFieldNames.userID]
            } with identifier: ${identifier} from source: ${matchedRecord[matchedRecordFieldNames.source]}`, {
            id: identifier
        }
        );
        return false;
    }

    return true;
};

/**
 * Checks if the identity card is valid.
 * Determines if the identity card is valid by checking if it's a number, and by the state's algorithm.
 * If the identity card is invalid also sends a warning log
 * @param { matchedRecordType } matchedRecord - The generated record
 * @param { string } identifier - One of the identifiers of the record
 * @returns { boolean } true if the identity card is valid
 */
const validateIdentityCard = (matchedRecord: matchedRecordType): boolean => {
    // Remove 0's from the start
    matchedRecord[matchedRecordFieldNames.identityCard] = matchedRecord[matchedRecordFieldNames.identityCard].replace(/^0+/, '');
    if (!validators().identityCard(matchedRecord[matchedRecordFieldNames.identityCard])) {
        logger.warn(
            true,
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

/**
 * Checks if the mobile phone is valid.
 * Determines if the mobile phone is valid by checking if it's a number and in the correct format
 * If the mobile phone is invalid also sends a warning log
 * @param { matchedRecordType } matchedRecord - The generated record
 * @param { string } identifier - One of the identifiers of the record
 * @returns { boolean } true if the mobile phone is valid
 */
const validateMobilePhone = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    if (!validators().mobilePhone.test(matchedRecord[matchedRecordFieldNames.mobilePhone])) {
        logger.warn(
            true,
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

/**
 * Checks if the phone is valid.
 * Determines if the phone is valid by checking if it's a number and in the correct format
 * If the phone is invalid also sends a warning log
 * @param { matchedRecordType } matchedRecord - The generated record
 * @param { string } identifier - One of the identifiers of the record
 * @returns { boolean } true if the phone is valid
 */
const validatePhone = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    if (!validators().phone.test(matchedRecord[matchedRecordFieldNames.phone])) {
        logger.warn(
            true,
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

/**
 * Checks if the discharge day is valid.
 * Determines if the discharge day is valid by checking if it's a date and in the correct format
 * Also fixes the offset difference time
 * If the discharge day is invalid also sends a warning log
 * @param { matchedRecordType } matchedRecord - The generated record
 * @param { string } identifier - One of the identifiers of the record
 * @returns { boolean } true if the discharge day is valid
 */
const validateDischargeDay = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    const value = matchedRecord[matchedRecordFieldNames.dischargeDay];
    const date: Date | null = value && value !== fieldNames.unknown ? new Date(value) : null;
    if (date && !isNaN(date.getTime())) {
        const userTimezoneOffset: number = date.getTimezoneOffset() * 60000;
        matchedRecord[matchedRecordFieldNames.dischargeDay] = new Date(date.getTime() - userTimezoneOffset).toISOString();
    } else {
        logger.warn(
            true,
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

/**
 * Checks if the mail is valid.
 * Determines if the mail is valid by checking if it's in the correct format
 * If the mail is invalid also sends a warning log
 * @param { matchedRecordType } matchedRecord - The generated record
 * @param { string } identifier - One of the identifiers of the record
 * @returns { boolean } true if the mail is valid
 */
const validateMail = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    matchedRecord[matchedRecordFieldNames.mail] = matchedRecord[matchedRecordFieldNames.mail].toLowerCase();
    if (!validators().mail.test(matchedRecord[matchedRecordFieldNames.mail])) {
        logger.warn(
            true,
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

/**
 * Checks if the personal number is valid.
 * Determines if the personal number is valid by checking if it's a number and in the correct length
 * If the personal number is invalid also sends a warning log
 * @param { matchedRecordType } matchedRecord - The generated record
 * @param { string } identifier - One of the identifiers of the record
 * @returns { boolean } true if the personal number is valid
 */
const validatePersonalNumber = (matchedRecord: matchedRecordType, identityCard: string): boolean => {
    if (
        isNaN(matchedRecord[matchedRecordFieldNames.personalNumber]) ||
        !validators().personalNumber.test(matchedRecord[matchedRecordFieldNames.personalNumber]) ||
        (matchedRecord[matchedRecordFieldNames.rank] && matchedRecord[matchedRecordFieldNames.rank] === fieldNames.invalidRankForPN)
    ) {
        logger.warn(
            true,
            logFields.scopes.app as scopeOption,
            'Invalid Personal Number',
            `Invalid Personal Number: ${matchedRecord[matchedRecordFieldNames.personalNumber]} for userID: ${matchedRecord[matchedRecordFieldNames.userID]
            } with identifier: ${identityCard} from source: ${matchedRecord[matchedRecordFieldNames.source]}`, {
            id: identityCard
        }
        );
        return false;
    }

    return true;
};

/**
 * Checks if the birthday is valid.
 * Determines if the birthday is valid by checking if it's a date and in the correct format
 * Also fixes the offset difference time
 * If the birthday is invalid also sends a warning log
 * @param { matchedRecordType } matchedRecord - The generated record
 * @param { string } identifier - One of the identifiers of the record
 * @returns { boolean } true if the birthday is valid
 */
const validateBirthday = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    const value = matchedRecord[matchedRecordFieldNames.birthDate];
    const date: Date | null = value && value !== fieldNames.unknown ? new Date(value) : null;
    if (date && !isNaN(date.getTime())) {
        const userTimezoneOffset: number = date.getTimezoneOffset() * 60000;
        matchedRecord[matchedRecordFieldNames.birthDate] = new Date(date.getTime() - userTimezoneOffset).toISOString();
    } else {
        logger.warn(
            true,
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

/**
 * Checks if the sex is valid.
 * Determines if the sex is valid by checking if it's in the sex's list
 * Also fixes the offset difference time
 * If the sex is invalid also sends a warning log
 * @param { matchedRecordType } matchedRecord - The generated record
 * @param { string } identifier - One of the identifiers of the record
 * @returns { boolean } true if the sex is valid
 */
const validateSex = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    const sexLowerCased: string = matchedRecord[matchedRecordFieldNames.sex].toLowerCase();
    if (MALE_ENUM.includes(sexLowerCased)) matchedRecord[matchedRecordFieldNames.sex] = fieldNames.sexValues.m;
    else if (FEMALE_ENUM.includes(sexLowerCased)) matchedRecord[matchedRecordFieldNames.sex] = fieldNames.sexValues.f;
    else {
        logger.warn(
            true,
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

/**
 * Checks if the hierarchy is valid.
 * Determines if the hierarchy is valid by checking if it's in the correct format.
 * Also fixes the offset difference time
 * If the hierarchy is invalid also sends a warning log
 * @param { matchedRecordType } matchedRecord - The generated record
 * @param { string } identifier - One of the identifiers of the record
 * @returns { boolean } true if the hierarchy is valid
 */
const validateHierarchy = (matchedRecord: matchedRecordType, identifier: string): boolean => {
    const hierarchyReg: RegExp = new RegExp(`[^a-zA-Z0-9\u0590-\u05FF/\\"'. ,!()_*%@$-]`, 'g');
    matchedRecord[matchedRecordFieldNames.hierarchy] = matchedRecord[matchedRecordFieldNames.hierarchy].replace(hierarchyReg, '');
    const hierarchy: string = matchedRecord[matchedRecordFieldNames.hierarchy];
    if (hierarchy.endsWith('/') || hierarchy.includes('//')) {
        logger.warn(
            true,
            logFields.scopes.app as scopeOption,
            'Invalid Hierarchy',
            `Invalid hierarchy: ${hierarchy} for userID: ${matchedRecord[matchedRecordFieldNames.userID]
            } with identifier: ${identifier} from source: ${matchedRecord[matchedRecordFieldNames.source]}`,
            { id: identifier });
        return false;
    }

    return true;
}

/**
 * Checks if the employeeNumber is valid.
 * Determines if the employeeNumber is valid by checking if it's in the correct format.
 * If the employeeNumber is invalid also sends a warning log
 * @param { matchedRecordType } matchedRecord - The generated record
 * @returns { boolean } true if the employeeNumber is valid
 */
const validateEmployeeNumber = (matchedRecord: matchedRecordType): boolean => {
    if (!validators().employeeNumber.test(matchedRecord[matchedRecordFieldNames.employeeNumber])) {
        logger.warn(
            true,
            logFields.scopes.app as scopeOption,
            'Invalid employeeNumber',
            `Invalid employeeNumber: ${matchedRecord[matchedRecordFieldNames.employeeNumber]} for userID: ${matchedRecord[matchedRecordFieldNames.userID]
            } from source: ${matchedRecord[matchedRecordFieldNames.source]}`,
        );
        return false;
    }

    return true;
}

const validationFunctions = new Map<string, (matchedRecord: matchedRecordType, identifier: string) => boolean>([
    [matchedRecordFieldNames.clearance, validateClearance],
    [matchedRecordFieldNames.fullClearance, validateFullClearance],
    [matchedRecordFieldNames.dischargeDay, validateDischargeDay],
    [matchedRecordFieldNames.mail, validateMail],
    [matchedRecordFieldNames.rank, validateRank],
    [matchedRecordFieldNames.serviceType, validateServiceType],
    [matchedRecordFieldNames.birthDate, validateBirthday],
    [matchedRecordFieldNames.sex, validateSex],
    [matchedRecordFieldNames.hierarchy, validateHierarchy],
]);

export default (matchedRecord: matchedRecordType): void => {

    // Firstly validate the identity card due to it's an identifier
    if (matchedRecord[matchedRecordFieldNames.identityCard]) {
        if (!validateIdentityCard(matchedRecord)) delete matchedRecord[matchedRecordFieldNames.identityCard];
    }

    // Secondly validate the personalNumber due to it's an identifier
    if (matchedRecord[matchedRecordFieldNames.personalNumber]) {
        if (!validatePersonalNumber(matchedRecord, matchedRecord[matchedRecordFieldNames.identityCard]))
            delete matchedRecord[matchedRecordFieldNames.personalNumber];
    }

    // If employeeId is the identifier, check it firstly
    if (matchedRecord[matchedRecordFieldNames.employeeId]) {
        if (!validateEmployeeNumber(matchedRecord)) {
            delete matchedRecord[matchedRecordFieldNames.employeeId];
            delete matchedRecord[matchedRecordFieldNames.employeeNumber];
            delete matchedRecord[matchedRecordFieldNames.organization];
        }
    }

    // The mobile phone field is an array, so filter each element individually
    if (matchedRecord[matchedRecordFieldNames.mobilePhone]) {
        matchedRecord[matchedRecordFieldNames.mobilePhone] = matchedRecord[matchedRecordFieldNames.mobilePhone].filter((mobilePhone) =>
            validateMobilePhone(matchedRecord, mobilePhone),
        );
        if (matchedRecord[matchedRecordFieldNames.mobilePhone].length === 0) delete matchedRecord[matchedRecordFieldNames.mobilePhone];
    }

    // The phone field is an array, so filter each element individually
    if (matchedRecord[matchedRecordFieldNames.phone]) {
        matchedRecord[matchedRecordFieldNames.phone] = matchedRecord[matchedRecordFieldNames.phone].filter((phone) =>
            validatePhone(matchedRecord, phone),
        );
        if (matchedRecord[matchedRecordFieldNames.phone].length === 0) delete matchedRecord[matchedRecordFieldNames.phone];
    }

    const identifier: string =
        matchedRecord[matchedRecordFieldNames.identityCard] ||
        matchedRecord[matchedRecordFieldNames.personalNumber] ||
        matchedRecord[matchedRecordFieldNames.goalUserId] ||
        matchedRecord[matchedRecordFieldNames.employeeId];

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
