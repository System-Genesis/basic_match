/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */
/* eslint-disable array-callback-return */
import fieldNames from '../config/fieldNames';
import { setField, setIdentityCard, setDischargeDay } from './basicFuncs';

const fn = fieldNames[fieldNames.dataSources.sf];
const macthedRecordFN = fieldNames.matchedRecord;

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

const funcMap = new Map<string, (matchedRecord: any, value: string) => void>([
    [fn.firstName, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.firstName)],
    [fn.lastName, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.lastName)],
    [fn.rank, (matchedRecord, value) => setField(matchedRecord, value, macthedRecordFN.rank)],
    [fn.personalNumber, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.personalNumber)],
    [fn.identityCard, setIdentityCard],
    [fn.dischargeDay, setDischargeDay],
    [fn.serviceType, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.serviceType)],
    [fn.mail, (matchedRecord, value) => setField(matchedRecord, value, macthedRecordFN.mail)],
    [fn.userName, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.userID)],
    [fn.hierarchy, setHierarchy],
    [fn.entityType, setEntityType],
    [fn.sex, setSex],
]);

export default (record: any, runUID: string) => {
    const keys: string[] = Object.keys(record);
    const matchedRecord: any = {};

    keys.map((key: string) => {
        if (record[key] && record[key] !== 'לא ידוע') {
            if (funcMap.has(key)) {
                funcMap.get(key)!(matchedRecord, record[key]);
            }
        }
    });

    matchedRecord[macthedRecordFN.source] = fieldNames.dataSources.sf;

    return matchedRecord;
};
