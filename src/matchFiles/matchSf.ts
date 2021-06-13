/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */
/* eslint-disable array-callback-return */
import fieldNames from '../config/fieldNames';
import { setField, setIdentityCard, setDischargeDay } from './basicFuncs';
import { matchedRecord as matchedRecordType } from '../types/matchedRecord';
import { sendLog } from '../rabbit';

const fn = fieldNames[fieldNames.dataSources.sf];
const matchedRecordFieldNames = fieldNames.matchedRecord;

const setSex = (matchedRecord: matchedRecordType, value: string): void => {
    const sfSex: string[] = Object.keys(fn.sfSexValues);
    matchedRecord.sex = value === sfSex[0] ? fn.sfSexValues[sfSex[0]] : fn.sfSexValues[sfSex[1]];
};

const setEntityType = (matchedRecord: matchedRecordType, value: string, runUID: string): void => {
    if (value === fn.s) {
        matchedRecord.entityType = fieldNames.entityTypeValue.s;
    } else {
        sendLog('error', 'Invalid entity type', 'Karting', 'Basic Match', { user: 'userID', source: fieldNames.dataSources.sf, runUID });
    }
};

const setHierarchy = (matchedRecord: matchedRecordType, value: string[] | string): void => {
    matchedRecord.hierarchy = typeof value === 'string' ? value : value.join('/');
};

const fieldsFuncs = new Map<string, (matchedRecord: matchedRecordType, value: string) => void>([
    [fn.firstName, (mathcedRecord, value) => setField(mathcedRecord, value, matchedRecordFieldNames.firstName)],
    [fn.lastName, (mathcedRecord, value) => setField(mathcedRecord, value, matchedRecordFieldNames.lastName)],
    [fn.rank, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.rank)],
    [fn.personalNumber, (mathcedRecord, value) => setField(mathcedRecord, value, matchedRecordFieldNames.personalNumber)],
    [fn.identityCard, setIdentityCard],
    [fn.dischargeDay, setDischargeDay],
    [fn.serviceType, (mathcedRecord, value) => setField(mathcedRecord, value, matchedRecordFieldNames.serviceType)],
    [fn.mail, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.mail)],
    [fn.userName, (mathcedRecord, value) => setField(mathcedRecord, value, matchedRecordFieldNames.userID)],
    [fn.hierarchy, setHierarchy],
    [fn.sex, setSex],
]);

export default (record: any, runUID: string) => {
    const originalRecordFields: string[] = Object.keys(record);
    const matchedRecord: matchedRecordType = {};

    originalRecordFields.map((field: string) => {
        if (record[field] && record[field] !== fieldNames.unknown) {
            if (fieldsFuncs.has(field)) {
                fieldsFuncs.get(field)!(matchedRecord, record[field]);
            } else if (field === fn.entityType) {
                setEntityType(matchedRecord, record[field], runUID);
            }
        }
    });

    matchedRecord[matchedRecordFieldNames.source] = fieldNames.dataSources.sf;

    return matchedRecord;
};
