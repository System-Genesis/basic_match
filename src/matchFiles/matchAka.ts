import fieldNames from '../config/fieldNames';
import setField, { setPhone } from './setField';
import { matchedRecord as matchedRecordType } from '../types/matchedRecord';
import akaPhone from '../types/akaPhone';
import { PNCYPicture as pictureType } from '../types/pictures';

const fn = fieldNames[fieldNames.sources.aka];
const matchedRecordFieldNames = fieldNames.matchedRecord;

const setAkaPhones = (matchedRecord: matchedRecordType, phones: akaPhone | akaPhone[]) => {
    if (!Array.isArray(phones)) phones = [phones];
    phones.forEach((phone) => {
        setPhone(
            matchedRecord,
            `0${phone.KIDOMET}${phone.MIS_TELEPHON}`,
            phone.SUG_TELEPHONE === '1' ? matchedRecordFieldNames.phone : matchedRecordFieldNames.mobilePhone,
        );
    });
};

const setPicture = (matchedRecord: matchedRecordType, picture: pictureType) => {
    matchedRecord.pictures = {
        profile: {
            meta: {
                path: picture.path,
                format: picture.format,
                takenAt: picture.takenAt,
                updatedAt: picture.updatedAt,
            },
        },
    };
};

const setFieldsFuncs = new Map<string, (matchedRecord: matchedRecordType, value: string) => void>([
    [fn.firstName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.firstName)],
    [fn.lastName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.lastName)],
    [fn.rank, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.rank)],
    [fn.clearance, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.clearance)],
    [fn.sex, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.sex)],
    [fn.personalNumber, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.personalNumber)],
    [fn.identityCard, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.identityCard)],
    [fn.dischargeDay, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.dischargeDay)],
    [fn.unitName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.akaUnit)],
    [fn.serviceType, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.serviceType)],
    [fn.birthDate, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.birthDate)],
    [fn.serviceType, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.serviceType)],
]);

export default (record: any): matchedRecordType => {
    const originalRecordFields: string[] = Object.keys(record);
    const matchedRecord: matchedRecordType = {};

    originalRecordFields.forEach((field: string) => {
        if (record[field] && record[field] !== fieldNames.unknown) {
            if (setFieldsFuncs.has(field)) {
                setFieldsFuncs.get(field)!(matchedRecord, record[field]);
            } else if (field === fn.phone) {
                setAkaPhones(matchedRecord, record[field]);
            } else if (field === fn.picture) {
                setPicture(matchedRecord, record[field]);
            }
        }
    });

    matchedRecord[matchedRecordFieldNames.source] = fieldNames.sources.aka;

    return matchedRecord;
};
