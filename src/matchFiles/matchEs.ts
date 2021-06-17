/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
import fieldNames from '../config/fieldNames';
import { setDischargeDay, setField, setIdentityCard, setMobilePhone, setPhone } from './basicFuncs';
import { matchedRecord as matchedRecordType } from '../types/matchedRecord';

const fn = fieldNames[fieldNames.sources.es];
const matchedRecordFieldNames = fieldNames.matchedRecord;

const setJob = (matchedRecord: matchedRecordType, location: string, job: string): void => {
    matchedRecord.job = location ? `${job} - ${location}` : job;
};

const setHierarchy = (matchedRecord: matchedRecordType, value: string): void => {
    let hr: string[] = value.split('/');
    if (hr[0] === '') {
        return;
    }

    // Add our root hierarchy if needed - wasn't in the original hierarchy
    hr[0] === fieldNames.rootHierarchy.ourCompany ? null : hr.unshift(fieldNames.rootHierarchy.ourCompany);
    hr = hr.map((organizationName) => {
        return organizationName.trim();
    });
    matchedRecord.hierarchy = hr.join('/');
};

const setUserID = (matchedRecord: matchedRecordType, value: string) => {
    matchedRecord.userID = value.split('@')[0];
};

const fieldsFuncs = new Map<string, (matchedRecord: matchedRecordType, value: string) => void>([
    [fn.firstName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.firstName)],
    [fn.lastName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.lastName)],
    [fn.rank, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.rank)],
    [fn.sex, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.sex)],
    [fn.personalNumber, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.personalNumber)],
    [fn.identityCard, setIdentityCard],
    [fn.dischargeDay, setDischargeDay],
    [fn.entityType, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.entityType)],
    [fn.serviceType, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.serviceType)],
    [fn.mobilePhone, setMobilePhone],
    [fn.phone, setPhone],
    [fn.birthDate, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.birthDate)],
    [fn.address, (matched, value) => setField(matched, value, matchedRecordFieldNames.address)],
    [fn.mail, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.mail)],
    [fn.userName, setUserID],
    [fn.hierarchy, setHierarchy],
]);

export default (record: any, runUID: string) => {
    const originalRecordFields: string[] = Object.keys(record);
    const matchedRecord: matchedRecordType = {};

    const job: string = record[fn.job];
    const location: string = record[fn.location];
    matchedRecord.job = job || location; // incase theres no job but there is an location

    originalRecordFields.map((field: string) => {
        if (record[field] && record[field] !== fieldNames.unknown) {
            if (fieldsFuncs.has(field)) {
                fieldsFuncs.get(field)!(matchedRecord, record[field]);
            } else if (field === fn.job) {
                setJob(matchedRecord, location, record[field]);
            }
        }
    });

    matchedRecord[matchedRecordFieldNames.source] = fieldNames.sources.es;

    return matchedRecord;
};
