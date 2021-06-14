/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable no-case-declarations */
import fieldNames from '../config/fieldNames';
import validators from '../config/validators';
import { setField } from './basicFuncs';
import { matchedRecord as matchedRecordType } from '../types/matchedRecord';
import { sendLog } from '../rabbit';

const fn = fieldNames[fieldNames.sources.adNN];
const matchedRecordFieldNames = fieldNames.matchedRecord;

// We derive the identifier, the DI and the entity type form the original userID
const setIdentifierDIAndEntityType = (matchedRecord: matchedRecordType, userID: string, runUID: string): void => {
    let suffixIdenttifier: string;
    if (userID.toLowerCase().startsWith(fn.extension)) {
        suffixIdenttifier = userID.toLowerCase().replace(fn.extension, '');
    } else {
        sendLog('error', `Invalid suffix identifier for user ${userID}`, 'Karting', 'Basic Match', {
            user: 'userID',
            source: fieldNames.sources.adNN,
            runUID,
        });
        return;
    }

    if (validators().identityCard(suffixIdenttifier)) {
        // if the unique number is identity Number so it's a c
        matchedRecord.identityCard = suffixIdenttifier.toString();
        matchedRecord.entityType = fieldNames.entityTypeValue.c;
    } else {
        // we can infer the entityType is s
        matchedRecord.personalNumber = suffixIdenttifier.toString();
        matchedRecord.entityType = fieldNames.entityTypeValue.s;
    }

    matchedRecord.userID = userID.toLowerCase();
};

// Take out job and hierarchy from the Hierarchy field. For the most part the last field contains the job and the full name
// Example: root/OG1/OG2/OG3/full name - job
const setHierarchyAndJob = (matchedRecord: matchedRecordType, hierarchy: string, record: any): void => {
    let job: string;
    let hr: string[] = hierarchy.includes('\\')
        ? hierarchy.substring(0, hierarchy.lastIndexOf('\\')).trim().split('\\')
        : hierarchy.substring(0, hierarchy.lastIndexOf('/')).trim().split('/');
    if (hr[0] === '') {
        return;
    }

    // Insert our root hierarchy if needed(the original hierarchy doesn't contains our root hierarchy)
    hr[0] === fieldNames.rootHierarchy.ourCompany ? null : hr.unshift(fieldNames.rootHierarchy.ourCompany);

    // Delete unwanted spaces
    hr = hr.map((organizationName) => {
        return organizationName.trim();
    });
    matchedRecord.hierarchy = hr.join('/');
    matchedRecord.hierarchy = matchedRecord.hierarchy.replace(new RegExp('\u{200f}', 'g'), '');

    // Getting job from the last cell of the hierarchy (usualy if there is a '-' it contains the job)
    if (hierarchy.includes('-')) {
        if (hierarchy.includes('\\')) {
            job = hierarchy
                .substring(hierarchy.lastIndexOf('\\') + 1)
                .replace(/-/g, '')
                .trim();
        } else {
            job = hierarchy
                .substring(hierarchy.lastIndexOf('/') + 1)
                .replace(/-/g, '')
                .trim();
        }
        if (hierarchy.includes(record[fn.fullName])) {
            job = job.replace(record[fn.fullName], '').trim();
        }
        matchedRecord.job = job;
    }
};

const fieldsFuncs = new Map<string, (matchedRecord: matchedRecordType, value: string) => void>([
    [fn.firstName, (mathcedRecord, value) => setField(mathcedRecord, value, matchedRecordFieldNames.firstName)],
    [fn.lastName, (mathcedRecord, value) => setField(mathcedRecord, value, matchedRecordFieldNames.lastName)],
    [fn.mail, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.mail)],
]);

export default (record: any, runUID: string) => {
    const originalRecordFields: string[] = Object.keys(record);
    const matchedRecord: matchedRecordType = {};

    originalRecordFields.map((field: string) => {
        if (record[field] && record[field] !== fieldNames.unknown) {
            if (fieldsFuncs.has(field)) {
                fieldsFuncs.get(field)!(matchedRecord, record[field]);
            } else if (field === fn.hierarchy) {
                setHierarchyAndJob(matchedRecord, record[field], record);
            } else if (field === fn.sAMAccountName) {
                setIdentifierDIAndEntityType(matchedRecord, record[field], runUID);
            }
        }
    });

    matchedRecord[matchedRecordFieldNames.source] = fieldNames.sources.adNN;

    return matchedRecord;
};
