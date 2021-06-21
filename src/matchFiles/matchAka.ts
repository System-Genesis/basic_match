/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
import fieldNames from '../config/fieldNames';
import { setField, setDischargeDay, setIdentityCard } from './basicFuncs';
import { matchedRecord as matchedRecordType } from '../types/matchedRecord';

const fn = fieldNames[fieldNames.sources.aka];
const matchedRecordFieldNames = fieldNames.matchedRecord;

const fieldsFuncs = new Map<string, (matchedRecord: matchedRecordType, value: string) => void>([
    [fn.firstName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.firstName)],
    [fn.lastName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.lastName)],
    [fn.rank, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.rank)],
    [fn.clearance, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.clearance)],
    [fn.sex, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.sex)],
    [fn.personalNumber, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.personalNumber)],
    [fn.identityCard, setIdentityCard],
    [fn.dischargeDay, setDischargeDay],
    [fn.unitName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.akaUnit)],
    [fn.serviceType, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.serviceType)],
    [fn.phone, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.phone)],
    [fn.mobilePhone, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.mobilePhone)],
    [fn.birthDate, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.birthDate)],
]);

export default (record: any, runUID: string): matchedRecordType => {
    const originalRecordFields: string[] = Object.keys(record);
    const matchedRecord: matchedRecordType = {};

    originalRecordFields.map((field: string) => {
        if (record[field] && record[field] !== fieldNames.unknown && fieldsFuncs.has(field)) {
            if (field === fn.mobilePhone && record[fn.areaCodeMobile]) {
                console.log(`${record[fn.areaCodeMobile]}-${record[field]}`);
                fieldsFuncs.get(field)!(matchedRecord, `${record[fn.areaCodeMobile]}-${record[field]}`);
            } else if (field === fn.phone && record[fn.areaCode]) {
                fieldsFuncs.get(field)!(matchedRecord, `${record[fn.areaCode]}-${record[field]}`);
            } else {
                fieldsFuncs.get(field)!(matchedRecord, record[field]);
            }
        }
    });

    matchedRecord[matchedRecordFieldNames.source] = fieldNames.sources.aka;

    return matchedRecord;
};
