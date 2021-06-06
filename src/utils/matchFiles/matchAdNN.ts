/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable no-case-declarations */
import fieldNames from '../../config/fieldNames';
import validators from '../../config/validators';
import { setField } from './basicFuncs';

const fn = fieldNames[fieldNames.dataSources.adNN];
const macthedRecordFN = fieldNames.matchedRecord;

const setIdentifierDUAndEntityType = (matchedRecord: any, userID: string): void => {
    let uniqueNum: string;
    if (userID.toLowerCase().includes(fn.extension)) {
        uniqueNum = userID.toLowerCase().replace(fn.extension, '');
    } else {
        // send log
        return;
    }

    if (validators(uniqueNum).identityCard) {
        // if the unique number is identity Number so it's a civillian
        matchedRecord.identityCard = uniqueNum.toString();
        matchedRecord.entityType = fieldNames.entityTypeValue.c;
    } else {
        // we can infer the entityType is soldier
        matchedRecord.personalNumber = uniqueNum.toString();
        matchedRecord.entityType = fieldNames.entityTypeValue.s;
    }

    matchedRecord.userID = userID.toLowerCase();
};

const setHierarchyAndJob = (matchedRecord: any, hierarchy: string, record: any): void => {
    let job: string;
    let hr: string[] = hierarchy.includes('\\')
        ? hierarchy.substring(0, hierarchy.lastIndexOf('\\')).trim().split('\\')
        : hierarchy.substring(0, hierarchy.lastIndexOf('/')).trim().split('/');
    if (hr[0] === '') {
        return;
    }
    hr[0] === fieldNames.rootHierarchy.ourCompany ? null : hr.unshift(fieldNames.rootHierarchy.ourCompany);
    hr = hr.map((organizationName) => {
        return organizationName.trim();
    });
    matchedRecord.hierarchy = hr.join('/');
    matchedRecord.hierarchy = matchedRecord.hierarchy.replace(new RegExp('\u{200f}', 'g'), '');

    // Getting job
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

const funcMap = new Map<string, (matchedRecord: any, value: string) => void>([
    [fn.firstName, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.firstName)],
    [fn.lastName, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.lastName)],
    [fn.mail, (matchedRecord, value) => setField(matchedRecord, value, macthedRecordFN.mail)],
]);

export default (record: any, runUID: string) => {
    const keys: string[] = Object.keys(record);
    const matchedRecord: any = {};

    keys.map((key: string) => {
        if (record[key] && record[key] !== 'לא ידוע') {
            if (funcMap.has(key)) {
                funcMap.get(key)!(matchedRecord, record[key]);
            } else if (key === fn.hierarchy) {
                setHierarchyAndJob(matchedRecord, record[key], record);
            } else if (key === fn.sAMAccountName) {
                setIdentifierDUAndEntityType(matchedRecord, record[key]);
            }
        }
    });

    matchedRecord[macthedRecordFN.source] = fieldNames.dataSources.adNN;

    return matchedRecord;
};
