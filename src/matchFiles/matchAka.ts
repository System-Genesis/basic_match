/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
import fieldNames from '../config/fieldNames';
import { setField, setDischargeDay, setIdentityCard } from './basicFuncs';
import validators from '../config/validators';
import { matchedRecord as matchedRecordType } from '../types/matchedRecord';

const fn = fieldNames[fieldNames.dataSources.aka];
const macthedRecordFN = fieldNames.matchedRecord;

const setPhone = (matchedRecord: matchedRecordType, phone: string, areaCode: string) => {
    validators().phone.test(`${areaCode}-${phone}`) ? (matchedRecord.phone = `${areaCode}-${phone}`) : null;
};

const setMobilePhone = (matchedRecord: matchedRecordType, mobilePhone: string, mobileAreaCode: string) => {
    validators().mobilePhone.test(`${mobileAreaCode}-${mobilePhone}`) ? (matchedRecord.mobilePhone = `${mobileAreaCode}-${mobilePhone}`) : null;
};

const funcMap = new Map<string, (matchedRecord: matchedRecordType, value: string) => void>([
    [fn.firstName, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.firstName)],
    [fn.lastName, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.lastName)],
    [fn.rank, (matchedRecord, value) => setField(matchedRecord, value, macthedRecordFN.rank)],
    [fn.clearance, (matchedRecord, value) => setField(matchedRecord, value, macthedRecordFN.clearance)],
    [fn.sex, (matchedRecord, value) => setField(matchedRecord, value, macthedRecordFN.sex)],
    [fn.personalNumber, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.personalNumber)],
    [fn.identityCard, setIdentityCard],
    [fn.dischargeDay, setDischargeDay],
    [fn.unitName, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.akaUnit)],
    [fn.serviceType, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.serviceType)],
    [fn.birthDate, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.birthDate)],
]);

export default (record: any, runUID: string) => {
    const keys: string[] = Object.keys(record);
    const matchedRecord: matchedRecordType = {};

    keys.map((key: string) => {
        if (record[key] && record[key] !== 'לא ידוע') {
            if (funcMap.has(key)) {
                funcMap.get(key)!(matchedRecord, record[key]);
            } else if (key === fn.mobilePhone && record[fn.areaCodeMobile]) {
                setMobilePhone(matchedRecord, record[key], record[fn.areaCodeMobile]);
            } else if (key === fn.phone && record[fn.areaCode]) {
                setPhone(matchedRecord, record[key], record[fn.areaCode]);
            }
        }
    });

    return matchedRecord;
};
