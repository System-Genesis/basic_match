/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */
/* eslint-disable array-callback-return */
import fieldNames from '../../config/fieldNames';
import * as basicFunctions from './basicFuncs';

const fn = fieldNames[fieldNames.dataSources.sf];

const setSex = (matchedRecord: any, value: string): void => {
    const sfSex: string[] = Object.keys(fn.sfSexValues);
    matchedRecord.sex = value === sfSex[0] ? fn.sfSexValues[sfSex[0]] : fn.sfSexValues[sfSex[1]];
};

const setEntityType = (matchedRecord: any, value: string): void => {
    if (value === fn.s) {
        matchedRecord.entityType = fieldNames.entityTypeValue.s;
    } else {
        // send log
    }
};

const setHierarchy = (matchedRecord: any, value: string[] | string): void => {
    matchedRecord.hierarchy = typeof value === 'string' ? value : value.join('/');
};

const funcMap = new Map([
    [fn.firstName, basicFunctions.setFirstName],
    [fn.lastName, basicFunctions.setLastName],
    [fn.rank, basicFunctions.setRank],
    [fn.sex, setSex],
    [fn.personalNumber, basicFunctions.setPersonalNumber],
    [fn.identityCard, basicFunctions.setIdentityCard],
    [fn.dischargeDay, basicFunctions.setDischargeDay],
    [fn.entityType, setEntityType],
    [fn.serviceType, basicFunctions.setServiceType],
    [fn.mail, basicFunctions.setMail],
    [fn.hierarchy, setHierarchy],
    [fn.userName, basicFunctions.setUserID],
]);

export default (record: any, runUID: string) => {
    const keys: string[] = Object.keys(record);
    const matchedRecord: any = {};

    keys.map((key: string) => {
        if (funcMap.has(key)) {
            if (key === fn.hierarchy) {
                funcMap.get(key)(matchedRecord, record[key]);
            } else if (key === fn.entityType) {
                funcMap.get(key)(matchedRecord, record[key]);
            } else if (key === fn.sex) {
                funcMap.get(key)(matchedRecord, record[key]);
            } else {
                funcMap.get(key)(matchedRecord, record[key]);
            }
        }
    });

    matchedRecord.source = fieldNames.dataSources.sf;

    return matchedRecord;
};
