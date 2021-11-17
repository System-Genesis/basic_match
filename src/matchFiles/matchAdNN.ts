/* eslint-disable prettier/prettier */
import fieldNames from '../config/fieldNames';
import validators from '../config/validators';
import setField from './setField';
import { matchedRecord as matchedRecordType } from '../types/matchedRecord';
import * as logger from '../logger';
import assembleUserID from '../utils/assembleUserID';
import { scopeOption } from '../types/log';

const fn = fieldNames[fieldNames.sources.adNN];
const { logFields } = fieldNames;
const matchedRecordFieldNames = fieldNames.matchedRecord;

// We derive the identifier, the DI and the entity type form the original userID
const setIdentifierDIAndEntityType = (matchedRecord: matchedRecordType, userID: string): void => {
    let suffixIdentifier: string;
    if (userID.toLowerCase().startsWith(fn.extension)) {
        suffixIdentifier = userID.toLowerCase().replace(fn.extension, '');
    } else {
        logger.logWarn(false, 'Invalid suffix', logFields.scopes.app as scopeOption, `Invalid suffix for userID: ${userID}`);
        return;
    }

    if (validators().identityCard(suffixIdentifier)) {
        // if the unique number is identity Number so it's a c
        matchedRecord.identityCard = suffixIdentifier.toString();
        matchedRecord.entityType = fieldNames.entityTypeValue.c;
    } else {
        // we can infer the entityType is s
        matchedRecord.personalNumber = suffixIdentifier.toString();
        matchedRecord.entityType = fieldNames.entityTypeValue.s;
    }

    matchedRecord.userID = userID.toLowerCase();
};

// Take out job and hierarchy from the Hierarchy field. For the most part the last field contains the job and the full name
// Example: root/OG1/OG2/OG3/full name - job
const setHierarchyAndJob = (matchedRecord: matchedRecordType, hierarchy: string, record: any): void => {
    let job: string;
    const splitSymbol = hierarchy.includes('\\') ? '\\' : '/';
    let hr: string[] = hierarchy.substring(0, hierarchy.lastIndexOf(splitSymbol)).trim().split(splitSymbol);
    if (hr[0] === '') {
        logger.logWarn(
            false,
            'Invalid hierarchy',
            logFields.scopes.app as scopeOption,
            `Invalid hierarchy: ${hierarchy} for userID: ${matchedRecord[matchedRecordFieldNames.userID]}`,
            matchedRecord[matchedRecordFieldNames.identityCard] ||
            matchedRecord[matchedRecordFieldNames.personalNumber] ||
            matchedRecord[matchedRecordFieldNames.goalUserId],
        );
    }

    // Insert our root hierarchy if needed(the original hierarchy doesn't contains our root hierarchy)
    // if (hr[0] !== fieldNames.rootHierarchy.ourCompany) hr.unshift(fieldNames.rootHierarchy.ourCompany);

    // Insert tree root
    hr.unshift(`${fieldNames.treeRoots.adNN}`);

    // Delete unwanted spaces
    hr = hr.map((organizationName) => {
        return organizationName.trim();
    });

    matchedRecord.hierarchy = hr.join('/');
    matchedRecord.hierarchy = matchedRecord.hierarchy.replace(new RegExp('\u{200f}', 'g'), '');

    // Getting job from the last cell of the hierarchy (usually if there is a '-' it contains the job)
    if (hierarchy.includes('-')) {
        job = hierarchy
            .substring(hierarchy.lastIndexOf(splitSymbol) + 1)
            .replace(/-/g, '')
            .trim();
        if (hierarchy.includes(record[fn.fullName])) {
            job = job.replace(record[fn.fullName], '').trim();
        }
        matchedRecord.job = job;
    }

    matchedRecord.hierarchy = matchedRecord.hierarchy.replace(/\/\//g, '/');
};

const setFieldsFuncs = new Map<string, (matchedRecord: matchedRecordType, value: string) => void>([
    [fn.firstName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.firstName)],
    [fn.lastName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.lastName)],
    [fn.mail, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.mail)],
]);

export default (record: any) => {
    const originalRecordFields: string[] = Object.keys(record);
    const matchedRecord: matchedRecordType = {};

    setIdentifierDIAndEntityType(matchedRecord, record[fn.sAMAccountName]);

    originalRecordFields.forEach((field: string) => {
        if (record[field] && record[field] !== fieldNames.unknown) {
            if (setFieldsFuncs.has(field)) {
                setFieldsFuncs.get(field)!(matchedRecord, record[field]);
            } else if (field === fn.hierarchy) {
                setHierarchyAndJob(matchedRecord, record[field], record);
            }
        }
    });

    matchedRecord[matchedRecordFieldNames.source] = fieldNames.sources.adNN;
    if (matchedRecord[matchedRecordFieldNames.userID]) matchedRecord[matchedRecordFieldNames.userID] = assembleUserID(matchedRecord);

    return matchedRecord;
};
