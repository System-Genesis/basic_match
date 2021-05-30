/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable no-case-declarations */
import fieldNames from '../../config/fieldNames';
import validators from '../../config/validators';
import * as basicFunctions from './basicFuncs';

const fn = fieldNames[fieldNames.dataSources.adNN];

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
    hr[0] === fn.rootHierarchy.ourCompany ? null : hr.unshift(fn.rootHierarchy.ourCompany);
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

const funcMap = new Map([
    [fn.firstName, basicFunctions.setFirstName],
    [fn.lastName, basicFunctions.setLastName],
    [fn.mail, basicFunctions.setMail],
    [fn.sAMAccountName, setIdentifierDUAndEntityType],
    [fn.hierarchy, setHierarchyAndJob],
]);

export default (record: any, runUID: string) => {
    const keys: string[] = record.keys(record);
    const matchedRecord: any = {};

    keys.map((key: string) => {
        if (funcMap.has(key)) {
            if (key === fn.hierarchy) {
                funcMap.get(key)(matchedRecord, record[key], record);
            } else if (key === fn.sAMAccountName) {
                funcMap.get(key)(matchedRecord, record[key]);
            } else {
                funcMap.get(key)(matchedRecord, record[key]);
            }
        }
    });

    matchedRecord.source = fieldNames.dataSources.adNN;

    return matchedRecord;
};
