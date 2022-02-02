/* eslint-disable prettier/prettier */
import logger from 'logger-genesis';
import fieldNames from '../config/fieldNames';
import validators from '../config/validators';
import setField from './setField';
import { matchedRecord as matchedRecordType } from '../types/matchedRecord';
import assembleUserID from '../utils/assembleUserID';
import { scopeOption } from '../types/log';

const fn = fieldNames[fieldNames.sources.adNN];
const { logFields } = fieldNames;
const matchedRecordFieldNames = fieldNames.matchedRecord;

/**
 * Sets the identifier, userID and the entity type
 * If the userID's suffix is invalid, sends a warning log
 * @param { matchedRecordType } matchedRecord - The generated record.
 * @param { string } userID - The given userID
 */
const setIdentifierDIAndEntityType = (matchedRecord: matchedRecordType, userID: string): void => {

    // We derive the identifier, the DI and the entity type form the original userID
    let suffixIdentifier: string;
    if (userID.toLowerCase().startsWith(fn.extension)) {
        suffixIdentifier = userID.toLowerCase().replace(fn.extension, '');
    } else {
        logger.warn(true, logFields.scopes.app as scopeOption, 'Invalid suffix', `Invalid suffix for userID: ${userID}`, {
            id: matchedRecord[matchedRecordFieldNames.identityCard] ||
                matchedRecord[matchedRecordFieldNames.personalNumber] ||
                matchedRecord[matchedRecordFieldNames.goalUserId],
        });
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

/**
 * Sets the hierarchy and the job
 * If the given hierarchy is invalid, sends a warning log
 * @param { matchedRecordType } matchedRecord - The generated record
 * @param { string } hierarchy - The given hierarchy
 * @param { any } record - The original record
 */
const setHierarchyAndJob = (matchedRecord: matchedRecordType, hierarchy: string, record: any): void => {

    // Take out job and hierarchy from the Hierarchy field. For the most part the last field contains the job and the full name
    // Example: root/OG1/OG2/OG3/full name - job
    let job: string;
    const splitSymbol = hierarchy.includes('\\') ? '\\' : '/';
    let hr: string[] = hierarchy.substring(0, hierarchy.lastIndexOf(splitSymbol)).trim().split(splitSymbol);
    if (hr[0] === '') {
        logger.warn(
            true,
            logFields.scopes.app as scopeOption,
            'Invalid hierarchy',
            `Invalid hierarchy: ${hierarchy} for userID: ${matchedRecord[matchedRecordFieldNames.userID]}`, {
            id: matchedRecord[matchedRecordFieldNames.identityCard] ||
                matchedRecord[matchedRecordFieldNames.personalNumber] ||
                matchedRecord[matchedRecordFieldNames.goalUserId],
        }

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

    // Firstly set the identifier
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
