import fieldNames from '../config/fieldNames';
import setField from './setField';
import { matchedRecord as matchedRecordType } from '../types/matchedRecord';
import sendLog from '../logger';
import assembleUserID from '../utils/assembleUserID';

const fn = fieldNames[fieldNames.sources.sf];
const matchedRecordFieldNames = fieldNames.matchedRecord;

const setSex = (matchedRecord: matchedRecordType, value: string): void => {
    const sfSex: string[] = Object.keys(fn.sfSexValues);
    matchedRecord.sex = value === sfSex[0] ? fn.sfSexValues[sfSex[0]] : fn.sfSexValues[sfSex[1]];
};

const setEntityType = (matchedRecord: matchedRecordType, value: string, runUID: string): void => {
    if (value === fn.s) {
        matchedRecord.entityType = fieldNames.entityTypeValue.s;
    } else {
        sendLog('warn', 'Invalid entity type', false, { user: 'userID', source: fieldNames.sources.sf, runUID });
    }
};

const setHierarchy = (matchedRecord: matchedRecordType, value: string[]): void => {
    const hr = value;
    // if (hr[0] !== fieldNames.rootHierarchy.ourCompany) hr.unshift(fieldNames.rootHierarchy.ourCompany);
    hr.unshift(`${fieldNames.treeRoots.sf}/`);
    matchedRecord.hierarchy = hr.join('/');
};

const setFieldsFuncs = new Map<string, (matchedRecord: matchedRecordType, value: string) => void>([
    [fn.firstName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.firstName)],
    [fn.lastName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.lastName)],
    [fn.rank, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.rank)],
    [fn.personalNumber, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.personalNumber)],
    [fn.identityCard, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.identityCard)],
    [fn.dischargeDay, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.dischargeDay)],
    [fn.serviceType, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.serviceType)],
    [fn.mail, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.mail)],
    [fn.userName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.userID)],
    [fn.sex, setSex],
]);

export default (record: any, runUID: string) => {
    const originalRecordFields: string[] = Object.keys(record);
    const matchedRecord: matchedRecordType = {};

    originalRecordFields.forEach((field: string) => {
        if (record[field] && record[field] !== fieldNames.unknown) {
            if (setFieldsFuncs.has(field)) {
                setFieldsFuncs.get(field)!(matchedRecord, record[field]);
            } else if (field === fn.entityType) {
                setEntityType(matchedRecord, record[field], runUID);
            } else if (field === fn.hierarchy) {
                setHierarchy(matchedRecord, record[field]);
            }
        }
    });

    matchedRecord[matchedRecordFieldNames.source] = fieldNames.sources.sf;
    if (matchedRecord[matchedRecordFieldNames.userID]) matchedRecord[matchedRecordFieldNames.userID] = assembleUserID(matchedRecord);

    return matchedRecord;
};
