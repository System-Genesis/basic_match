/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
import fieldNames from '../../config/fieldNames';
import * as basicFunctions from './basicFuncs';

const fn = fieldNames[fieldNames.dataSources.es];

const setJob = (matchedRecord: any, location: string, job: string): void => {
    matchedRecord.job = location ? `${job} - ${location}` : job;
};

const setHierarchy = (matchedRecord: any, value: string): void => {
    let hr: string[] = value.split('/');
    if (hr[0] === '') {
        return;
    }
    hr[0] === fn.rootHierarchy.ourCompany ? null : hr.unshift(fn.rootHierarchy.ourCompany);
    hr = hr.map((organizationName) => {
        return organizationName.trim();
    });
    matchedRecord.hierarchy = hr.join('/');
};

const funcMap = new Map([
    [fn.firstName, basicFunctions.setFirstName],
    [fn.lastName, basicFunctions.setLastName],
    [fn.rank, basicFunctions.setRank],
    [fn.sex, basicFunctions.setSex],
    [fn.personalNumber, basicFunctions.setPersonalNumber],
    [fn.identityCard, basicFunctions.setIdentityCard],
    [fn.dischargeDay, basicFunctions.setDischargeDay],
    [fn.entityType, basicFunctions.setEntityType],
    [fn.serviceType, basicFunctions.setServiceType],
    [fn.mobilePhone, basicFunctions.setMobilePhone],
    [fn.phone, basicFunctions.setPhone],
    [fn.birthdate, basicFunctions.setBirthdate],
    [fn.address, basicFunctions.setAddress],
    [fn.mail, basicFunctions.setMail],
    [fn.job, setJob],
    [fn.hierarchy, setHierarchy],
    [fn.userName, basicFunctions.setUserID],
]);

export default (record: any, runUID: string) => {
    const keys: string[] = Object.keys(record);
    const matchedRecord: any = {};

    const job: string = record[fn.job];
    const location: string = record[fn.location];
    matchedRecord.job = job || location; // incase theres no job but there is an location

    keys.map((key: string) => {
        if (funcMap.has(key)) {
            if (key === fn.hierarchy) {
                funcMap.get(key)(matchedRecord, record[key]);
            } else if (key === fn.job) {
                funcMap.get(key)(matchedRecord, location, record[key]);
            } else {
                funcMap.get(key)(matchedRecord, record[key]);
            }
        }
    });

    matchedRecord.source = fieldNames.dataSources.es;

    return matchedRecord;
};
