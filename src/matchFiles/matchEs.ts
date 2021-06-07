/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
import fieldNames from '../config/fieldNames';
import { setDischargeDay, setField, setIdentityCard, setMobilePhone, setPhone } from './basicFuncs';
import { matchedRecord as matchedRecordType } from '../types/matchedRecord';

const fn = fieldNames[fieldNames.dataSources.es];
const macthedRecordFN = fieldNames.matchedRecord;

const setJob = (matchedRecord: matchedRecordType, location: string, job: string): void => {
    matchedRecord.job = location ? `${job} - ${location}` : job;
};

const setHierarchy = (matchedRecord: matchedRecordType, value: string): void => {
    let hr: string[] = value.split('/');
    if (hr[0] === '') {
        return;
    }
    hr[0] === fieldNames.rootHierarchy.ourCompany ? null : hr.unshift(fieldNames.rootHierarchy.ourCompany);
    hr = hr.map((organizationName) => {
        return organizationName.trim();
    });
    matchedRecord.hierarchy = hr.join('/');
};

const funcMap = new Map<string, (matchedRecord: matchedRecordType, value: string) => void>([
    [fn.firstName, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.firstName)],
    [fn.lastName, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.lastName)],
    [fn.rank, (matchedRecord, value) => setField(matchedRecord, value, macthedRecordFN.rank)],
    [fn.sex, (matchedRecord, value) => setField(matchedRecord, value, macthedRecordFN.sex)],
    [fn.personalNumber, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.personalNumber)],
    [fn.identityCard, setIdentityCard],
    [fn.dischargeDay, setDischargeDay],
    [fn.entityType, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.entityType)],
    [fn.serviceType, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.serviceType)],
    [fn.mobilePhone, setMobilePhone],
    [fn.phone, setPhone],
    [fn.birthDate, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.birthDate)],
    [fn.address, (matched, value) => setField(matched, value, macthedRecordFN.address)],
    [fn.mail, (matchedRecord, value) => setField(matchedRecord, value, macthedRecordFN.mail)],
    [fn.userName, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.userID)],
    [fn.hierarchy, setHierarchy],
]);

export default (record: any, runUID: string) => {
    const keys: string[] = Object.keys(record);
    const matchedRecord: matchedRecordType = {};

    const job: string = record[fn.job];
    const location: string = record[fn.location];
    matchedRecord.job = job || location; // incase theres no job but there is an location

    keys.map((key: string) => {
        if (record[key] && record[key] !== 'לא ידוע') {
            if (funcMap.has(key)) {
                funcMap.get(key)!(matchedRecord, record[key]);
            } else if (key === fn.job) {
                setJob(matchedRecord, location, record[key]);
            }
        }
    });

    matchedRecord[macthedRecordFN.source] = fieldNames.dataSources.es;

    return matchedRecord;
};
