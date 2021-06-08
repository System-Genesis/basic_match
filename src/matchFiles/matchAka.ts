/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
import fieldNames from '../config/fieldNames';
import { setField, setDischargeDay, setIdentityCard } from './basicFuncs';
import validators from '../config/validators';
import { matchedRecord as matchedRecordType } from '../types/matchedRecord';

const fn = fieldNames[fieldNames.dataSources.aka];
const matchedRecordFieldNames = fieldNames.matchedRecord;

const setPhone = (matchedRecord: matchedRecordType, phone: string, areaCode: string) => {
    validators().phone.test(`${areaCode}-${phone}`) ? (matchedRecord.phone = `${areaCode}-${phone}`) : null;
};

const setMobilePhone = (matchedRecord: matchedRecordType, mobilePhone: string, mobileAreaCode: string) => {
    validators().mobilePhone.test(`${mobileAreaCode}-${mobilePhone}`) ? (matchedRecord.mobilePhone = `${mobileAreaCode}-${mobilePhone}`) : null;
};

const fieldsFuncs = new Map<string, (matchedRecord: matchedRecordType, value: string) => void>([
    [fn.firstName, (mathcedRecord, value) => setField(mathcedRecord, value, matchedRecordFieldNames.firstName)],
    [fn.lastName, (mathcedRecord, value) => setField(mathcedRecord, value, matchedRecordFieldNames.lastName)],
    [fn.rank, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.rank)],
    [fn.clearance, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.clearance)],
    [fn.sex, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.sex)],
    [fn.personalNumber, (mathcedRecord, value) => setField(mathcedRecord, value, matchedRecordFieldNames.personalNumber)],
    [fn.identityCard, setIdentityCard],
    [fn.dischargeDay, setDischargeDay],
    [fn.unitName, (mathcedRecord, value) => setField(mathcedRecord, value, matchedRecordFieldNames.akaUnit)],
    [fn.serviceType, (mathcedRecord, value) => setField(mathcedRecord, value, matchedRecordFieldNames.serviceType)],
    [fn.birthDate, (mathcedRecord, value) => setField(mathcedRecord, value, matchedRecordFieldNames.birthDate)],
]);

export default (record: any, runUID: string) => {
    const originalRecordFields: string[] = Object.keys(record);
    const matchedRecord: matchedRecordType = {};

    originalRecordFields.map((field: string) => {
        if (record[field] && record[field] !== fieldNames.unknown) {
            if (fieldsFuncs.has(field)) {
                fieldsFuncs.get(field)!(matchedRecord, record[field]);
            } else if (field === fn.mobilePhone && record[fn.areaCodeMobile]) {
                setMobilePhone(matchedRecord, record[field], record[fn.areaCodeMobile]);
            } else if (field === fn.phone && record[fn.areaCode]) {
                setPhone(matchedRecord, record[field], record[fn.areaCode]);
            }
        }
    });

    return matchedRecord;
};
