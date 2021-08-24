/* eslint-disable no-restricted-syntax */
import fieldNames from '../config/fieldNames';
import setField, { setPhone } from './setField';
import { isStrContains } from '../utils/isStrContains';
import { matchedRecord as matchedRecordType } from '../types/matchedRecord';
import sendLog from '../logger';
import assembleUserID from '../utils/assembleUserID';
import { DOMAIN_SUFFIXES } from '../config/enums';

const domainSuffixes: Map<string, string> = new Map<string, string>(DOMAIN_SUFFIXES);

const fn = fieldNames[fieldNames.sources.city];
const matchedRecordFieldNames = fieldNames.matchedRecord;

const setHierarchy = (matchedRecord: matchedRecordType, hierarchy: string, record: any): void => {
    const defaultHierarchy = `${fieldNames.rootHierarchy.city}${record[fn.company] ? `/${record[fn.company]}` : ''}`;
    let tempHr: string = hierarchy.replace('\\', '/');
    if (tempHr.includes('/')) {
        const hr: string[] = tempHr.split('/').map((unit) => unit.trim());

        const fullNameRegex = new RegExp(
            `${record.firstName.replace('(', '').replace(')', '')}( |\t)+${record.lastName.replace('(', '').replace(')', '')}`,
        );
        for (const [index, val] of hr.entries()) {
            const value = val.replace('(', '').replace(')', '');
            if (isStrContains(value, ['-']) || fullNameRegex.test(value) || !value) {
                hr.splice(index);
                break;
            }
        }

        // this condition come to fix insertion of "defaultHierarchy" to user that come from our "environment" to
        // city "environment" and than return to us from city API.
        // Prevent "fn.rootHierarchy.city/fn.rootHierarchy.city/fn.rootHierarchy.city.."
        tempHr = hr.join('/').substring(hr.join('/').lastIndexOf(fieldNames.rootHierarchy.city));
    }

    // this condition come to avoid insertion of "defaultHierarchy" to user that come from our "environment" to
    // city "environment" and than return to us from city API
    if (tempHr.includes(fieldNames.rootHierarchy.city)) {
        if (tempHr.includes(defaultHierarchy)) {
            matchedRecord.hierarchy = tempHr;
        } else if (tempHr.startsWith(fieldNames.rootHierarchy.city)) {
            matchedRecord.hierarchy = tempHr.replace(fn.rootHierarchy.city, defaultHierarchy);
        }
    } else {
        const isLocalHierarchy: boolean = tempHr.split('/')[0] === fieldNames.rootHierarchy.ourCompany;
        // If the hierarchy start with local root - doesn't need external root hierarchy injection
        matchedRecord.hierarchy = `${isLocalHierarchy ? '' : defaultHierarchy}${tempHr.includes('/') ? `/${tempHr}` : ''}`;
        if (matchedRecord.hierarchy.startsWith('/')) {
            matchedRecord.hierarchy = matchedRecord.hierarchy.substring(1);
        }
    }

    // If source is city or mir
    if (record[fn.domains].includes(fn.domainNames.external)) {
        if (!matchedRecord.hierarchy!.startsWith(fieldNames.treeRoots.city)) matchedRecord.hierarchy!.replace(/^/, `${fieldNames.treeRoots.city}/`);
    } else {
        matchedRecord.hierarchy = matchedRecord.hierarchy!.replace(/^/, `${fieldNames.treeRoots.mir}/`);
    }
};

const setEntityTypeAndDI = (matchedRecord: matchedRecordType, userID: string, runUID: string): void => {
    const rawEntityType: string = userID[0];

    // set the entityType
    if (fn.entityTypePrefix.s.includes(rawEntityType)) {
        matchedRecord.entityType = fieldNames.entityTypeValue.s;
    } else if (fn.entityTypePrefix.c.includes(rawEntityType)) {
        matchedRecord.entityType = fieldNames.entityTypeValue.c;
    } else if (fn.entityTypePrefix.gu.includes(rawEntityType)) {
        matchedRecord.entityType = fieldNames.entityTypeValue.gu;
        matchedRecord.goalUserId = userID;

        if (userID.startsWith(fn.mirGUPrefixes.ads)) {
            matchedRecord.goalUserId = userID.split('@')[0];
            matchedRecord.goalUserId = matchedRecord.goalUserId.replace(fn.mirGUPrefixes.ads, '');
            matchedRecord.goalUserId += domainSuffixes.get(fieldNames.sources.ads);
        } else if (userID.startsWith(fn.mirGUPrefixes.adNN)) {
            matchedRecord.goalUserId = userID.split('@')[0];
            matchedRecord.goalUserId = matchedRecord.goalUserId.replace(fn.mirGUPrefixes.adNN, '');
            matchedRecord.goalUserId += domainSuffixes.get(fieldNames.sources.adNN);
        }

        // matchedRecord.goalUserId = userID.split('@')[0];

        // // Remove the local GU prefix
        // if (userID.startsWith(fn.mirGUPrefixes.ads || fn.mirGUPrefixes.adNN)) {
        //     matchedRecord.goalUserId = matchedRecord.goalUserId.replace(new RegExp(`${fn.mirGUPrefixes.ads}|${fn.mirGUPrefixes.ads}`, 'gi'), '');
        // }
    } else {
        sendLog('warn', `Invalid user id and entity type`, false, {
            user: userID,
            source: fieldNames.sources.city,
            runUID,
        });
        return;
    }

    // Set the userID
    matchedRecord.userID = userID;
};

// Give priority to job field
const setJob = (matchedRecord: matchedRecordType, value: string, originFieldName: string): void => {
    if (originFieldName === fn.profession) {
        if (!matchedRecord[matchedRecordFieldNames.job]) {
            matchedRecord[matchedRecordFieldNames.job] = value;
        }
    } else {
        matchedRecord[matchedRecordFieldNames.job] = value;
    }
};

const setFieldsFuncs = new Map<string, (matchedRecord: matchedRecordType, value: string) => void>([
    [fn.firstName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.firstName)],
    [fn.lastName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.lastName)],
    [fn.rank, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.rank)],
    [fn.clearance, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.clearance)],
    [fn.personalNumber, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.personalNumber)],
    [fn.identityCard, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.identityCard)],
    [fn.dischargeDay, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.dischargeDay)],
    [fn.unitName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.akaUnit)],
    [fn.serviceType, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.serviceType)],
    [fn.address, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.address)],
    [fn.mail, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.mail)],
    [fn.profession, (matchedRecord, value) => setJob(matchedRecord, value, fn.profession)],
    [fn.job, (matchedRecord, value) => setJob(matchedRecord, value, fn.job)],
]);

export default (record: any, runUID: string) => {
    const originalRecordFields: string[] = Object.keys(record);
    const matchedRecord: matchedRecordType = {};

    originalRecordFields.forEach((field: string) => {
        if (record[field] && record[field] !== fieldNames.unknown) {
            if (setFieldsFuncs.has(field)) {
                setFieldsFuncs.get(field)!(matchedRecord, record[field]);
            } else if (field === fn.hierarchy) {
                setHierarchy(matchedRecord, record[field], record);
            } else if (field === fn.domainUsers) {
                setEntityTypeAndDI(matchedRecord, record[field], runUID);
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
