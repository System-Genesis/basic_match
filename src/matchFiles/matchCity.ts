/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
import logger from 'logger-genesis';
import config from 'config';
import fieldNames from '../config/fieldNames';
import setField, { setPhone } from './setField';
import { matchedRecord as matchedRecordType } from '../types/matchedRecord';
import assembleUserID from '../utils/assembleUserID';
import { DOMAIN_SUFFIXES } from '../config/enums';
import { scopeOption } from '../types/log';
import isStrContains from '../utils/isStrContains';

const domainSuffixes: Map<string, string> = new Map<string, string>(DOMAIN_SUFFIXES);

const { logFields } = fieldNames;

const fn = fieldNames[fieldNames.sources.city];
const matchedRecordFieldNames = fieldNames.matchedRecord;

/**
 * Sets the hierarchy.
 * @param { matchedRecordType } matchedRecord - The generated record.
 * @param { string } hierarchy - The given hierarchy.
 * @param { record } any - The original record
 */
const setHierarchy = (matchedRecord: matchedRecordType, hierarchy: string, record: any): void => {
    const defaultHierarchy = `${fieldNames.sources.city}${record[fn.company] ? `/${record[fn.company]}` : ''}`;
    let tempHr: string = hierarchy.replace('\\', '/');
    const hr: string[] = tempHr.split('/').map((unit) => unit.trim());

    const fullNameRegex = new RegExp(
        `${record.firstName ? record.firstName.replace('(', '').replace(')', '') : ''}( |\t)+${record.lastName ? record.lastName.replace('(', '').replace(')', '') : ''
        }`,
    );

    const firstNameAndLastNameRegex = new RegExp(
        `${record.firstName ? record.firstName.split(' ')[0].replace('(', '').replace(')', '') : ''}( |\t)+${record.lastName ? record.lastName.split(' ')[0].replace('(', '').replace(')', '') : ''
        }`,
    );

    let cutHierarchyFlag = false;
    for (const [index, val] of hr.entries()) {
        const value = val.replace('(', '').replace(')', '');
        if (isStrContains(value, ['-'])) {
            if (fullNameRegex.test(value) || index === hr.length - 1) cutHierarchyFlag = true;
        } else if (fullNameRegex.test(value) || firstNameAndLastNameRegex.test(value) || !value) cutHierarchyFlag = true;
        if (cutHierarchyFlag) {
            hr.splice(index);
            break;
        }

        // if (isStrContains(value, ['-']) || fullNameRegex.test(value) || !value) {
        //     if (!(isStrContains(value, ['-']) && fullNameRegex.test(value))) {
        //         hr.splice(index);
        //         break;
        //     }
        // }
    }

    // this condition come to fix insertion of "defaultHierarchy" to user that come from our "environment" to
    // city "environment" and than return to us from city API.
    // Prevent "fn.rootHierarchy.city/fn.rootHierarchy.city/fn.rootHierarchy.city.."
    tempHr = hr.join('/').substring(hr.join('/').lastIndexOf(fieldNames.rootHierarchy.city));
    tempHr = tempHr.substring(tempHr.lastIndexOf(fieldNames.sources.city));

    // this condition come to avoid insertion of "defaultHierarchy" to user that come from our "environment" to
    // city "environment" and than return to us from city API
    if (tempHr.includes(fieldNames.rootHierarchy.city)) {
        if (tempHr.includes(defaultHierarchy)) {
            matchedRecord.hierarchy = tempHr;
        } else if (tempHr.startsWith(fieldNames.rootHierarchy.city)) {
            matchedRecord.hierarchy = tempHr.replace(fieldNames.rootHierarchy.city, defaultHierarchy);
        }
    } else {
        const isLocalHierarchy: boolean = tempHr.split('/')[0] === fieldNames.rootHierarchy.ourCompany;
        // If the hierarchy start with local root - doesn't need external root hierarchy injection

        // If tempHr, build hierarchy a usual
        // eslint-disable-next-line no-nested-ternary
        if (tempHr) matchedRecord.hierarchy = `${isLocalHierarchy ? '' : !tempHr.startsWith(defaultHierarchy) ? defaultHierarchy : ''}/${tempHr}`;
        // If no tempHr, enter record to invalid hierarchies group
        else matchedRecord.hierarchy = `${fieldNames.rootHierarchy.city}/invalidHierarchy`;

        if (matchedRecord.hierarchy.startsWith('/')) {
            matchedRecord.hierarchy = matchedRecord.hierarchy.substring(1);
        }
    }

    // If source is city or mir
    if (record[fn.domains].includes(fn.domainNames.external)) {
        if (matchedRecord.hierarchy!.startsWith(fieldNames.rootHierarchy.city))
            matchedRecord.hierarchy = matchedRecord.hierarchy!.replace(fieldNames.rootHierarchy.city, fieldNames.treeRoots.city);
        if (!matchedRecord.hierarchy!.startsWith(fieldNames.treeRoots.city))
            matchedRecord.hierarchy = `${fieldNames.treeRoots.city}/${matchedRecord.hierarchy!}`;
    } else {
        matchedRecord.hierarchy = `${fieldNames.treeRoots.mir}/${matchedRecord.hierarchy!}`;
    }
};

/**
 * Sets the entity type and userID.
 * If the entity is Goal User, sets the goalUserId(Goal User identifier).
 * If the given userID is invalid due to an invalid suffix, sends a warning log
 * @param { matchedRecordType } matchedRecord - The generated record.
 * @param { string } userID - The given userID
 */
const setEntityTypeAndDI = (matchedRecord: matchedRecordType, userID: string): void => {
    const rawEntityType: string = userID[0];

    // set the entityType, determine by the suffix
    if (fn.entityTypePrefix.s.includes(rawEntityType)) {
        matchedRecord.entityType = fieldNames.entityTypeValue.s;
    } else if (fn.entityTypePrefix.c.includes(rawEntityType)) {
        matchedRecord.entityType = fieldNames.entityTypeValue.c;
    } else if (fn.entityTypePrefix.gu.includes(rawEntityType)) {
        matchedRecord.entityType = fieldNames.entityTypeValue.gu;

        // Goal user originally from ADs
        if (userID.startsWith(fn.mirGUPrefixes.ads)) {
            matchedRecord.goalUserId = userID.split('@')[0];
            matchedRecord.goalUserId = matchedRecord.goalUserId.replace(fn.mirGUPrefixes.ads, '');
            matchedRecord.goalUserId += domainSuffixes.get(fieldNames.sources.ads);

            // Goal user originally from adNN
        } else if (userID.startsWith(fn.mirGUPrefixes.adNN)) {
            matchedRecord.goalUserId = userID.split('@')[0];
            matchedRecord.goalUserId = matchedRecord.goalUserId.replace(fn.mirGUPrefixes.adNN, '');
            matchedRecord.goalUserId += domainSuffixes.get(fieldNames.sources.adNN);
        } else {
            matchedRecord.goalUserId = userID.split('@')[0] + domainSuffixes.get(fieldNames.sources.city);
        }

        matchedRecord.goalUserId = matchedRecord.goalUserId.toLowerCase();

        // matchedRecord.goalUserId = userID.split('@')[0];

        // // Remove the local GU prefix
        // if (userID.startsWith(fn.mirGUPrefixes.ads || fn.mirGUPrefixes.adNN)) {
        //     matchedRecord.goalUserId = matchedRecord.goalUserId.replace(new RegExp(`${fn.mirGUPrefixes.ads}|${fn.mirGUPrefixes.ads}`, 'gi'), '');
        // }
    } else {
        logger.warn(true, logFields.scopes.app as scopeOption, 'Invalid userID and EntityType', `Invalid userID: ${userID}`, {
            id:
                matchedRecord[matchedRecordFieldNames.identityCard] ||
                matchedRecord[matchedRecordFieldNames.personalNumber] ||
                matchedRecord[matchedRecordFieldNames.goalUserId],
        });
        return;
    }

    // Set the userID
    matchedRecord.userID = userID;
};

/**
 * Sets the job.
 * @param { matchedRecordType } matchedRecord - The generated record.
 * @param { string } value - the given job
 * @param { string } originFieldName - The name of the field in the original record
 */
const setJob = (matchedRecord: matchedRecordType, value: string, originFieldName: string): void => {
    // Give priority to job field
    if (originFieldName === fn.profession) {
        if (!matchedRecord[matchedRecordFieldNames.job]) {
            matchedRecord[matchedRecordFieldNames.job] = value;
        }
    } else {
        matchedRecord[matchedRecordFieldNames.job] = value;
    }
};

/**
 * Convert from old Aka unit to new one if there is.
 * @param { matchedRecordType } matchedRecord - The generated record.
 * @param { string } value - The given Aka unit
 */
const convertAkaUnit = (matchedRecord: matchedRecordType, value: string): void => {
    const akaUnitsMap: any = config.get('akaUnitsMap');

    matchedRecord[matchedRecordFieldNames.akaUnit] = akaUnitsMap[value]?.newName || value;
};

const setFieldsFuncs = new Map<string, (matchedRecord: matchedRecordType, value: string) => void>([
    [fn.firstName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.firstName)],
    [fn.lastName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.lastName)],
    [fn.rank, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.rank)],
    [fn.clearance, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.clearance)],
    [fn.personalNumber, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.personalNumber)],
    [fn.identityCard, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.identityCard)],
    [fn.dischargeDay, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.dischargeDay)],
    [fn.unitName, (matchedRecord, value) => convertAkaUnit(matchedRecord, value)],
    [fn.serviceType, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.serviceType)],
    [fn.address, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.address)],
    [fn.mail, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.mail)],
    [fn.profession, (matchedRecord, value) => setJob(matchedRecord, value, fn.profession)],
    [fn.job, (matchedRecord, value) => setJob(matchedRecord, value, fn.job)],
]);

export default (record: any) => {
    const originalRecordFields: string[] = Object.keys(record);
    const matchedRecord: matchedRecordType = {};

    originalRecordFields.forEach((field: string) => {
        if (record[field] && record[field] !== fieldNames.unknown) {
            if (setFieldsFuncs.has(field)) {
                setFieldsFuncs.get(field)!(matchedRecord, record[field]);
            } else if (field === fn.hierarchy) {
                setHierarchy(matchedRecord, record[field], record);
            } else if (field === fn.domainUsers) {
                setEntityTypeAndDI(matchedRecord, record[field]);
            } else if (field === fn.mobilePhone) {
                setPhone(matchedRecord, record[field], matchedRecordFieldNames.mobilePhone);
            }
        }
    });

    matchedRecord[matchedRecordFieldNames.source] = record[fn.domains].includes(fn.domainNames.external)
        ? fieldNames.sources.city
        : fieldNames.sources.mir;
    if (matchedRecord[matchedRecordFieldNames.userID]) matchedRecord[matchedRecordFieldNames.userID] = assembleUserID(matchedRecord);

    return matchedRecord;
};
