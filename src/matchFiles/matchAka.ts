import fieldNames from '../config/fieldNames';
import setField, { setPhone } from './setField';
import { matchedRecord as matchedRecordType } from '../types/matchedRecord';
import { PNCYPicture as pictureType } from '../types/pictures';
import { RANKS } from '../config/enums';

const fn = fieldNames[fieldNames.sources.aka];
const matchedRecordFieldNames = fieldNames.matchedRecord;

/**
 * Sets the pictures field
 * @param { matchedRecordType } matchedRecord - The generated record
 * @param { pictureType } picture - The given picture metadata
 */
const setPicture = (matchedRecord: matchedRecordType, picture: pictureType): void => {
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

/**
 * Sets the rank.
 * Convert from a rank code to a string rank
 * @param matchedRecord - The generated record.
 * @param rank - The given rank code.
 */
const setRank = (matchedRecord: matchedRecordType, rank: number): void => {
    matchedRecord[matchedRecordFieldNames.rank] = RANKS[rank];
};

const setFieldsFuncs = new Map<string, (matchedRecord: matchedRecordType, value: string) => void>([
    [fn.firstName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.firstName)],
    [fn.lastName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.lastName)],
    [fn.rank, (matchedRecord, value) => setRank(matchedRecord, parseInt(value, 10))],
    [fn.clearance, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.clearance)],
    [fn.sex, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.sex)],
    [fn.personalNumber, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.personalNumber)],
    [fn.identityCard, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.identityCard)],
    [fn.dischargeDay, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.dischargeDay)],
    [fn.unitName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.akaUnit)],
    [fn.serviceType, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.serviceType)],
    [fn.birthDate, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.birthDate)],
    [fn.mobilePhone, (matchedRecord, value) => setPhone(matchedRecord, value, matchedRecordFieldNames.mobilePhone)],
    [fn.phone, (matchedRecord, value) => setPhone(matchedRecord, value, matchedRecordFieldNames.phone)],
]);

export default (record: any): matchedRecordType => {
    const originalRecordFields: string[] = Object.keys(record);
    const matchedRecord: matchedRecordType = {};

    originalRecordFields.forEach((field: string) => {
        if (record[field] && record[field] !== fieldNames.unknown) {
            if (setFieldsFuncs.has(field)) {
                setFieldsFuncs.get(field)!(matchedRecord, record[field]);
            } else if (field === fn.picture) {
                setPicture(matchedRecord, record[field]);
            }
        }
    });

    matchedRecord[matchedRecordFieldNames.source] = fieldNames.sources.aka;

    return matchedRecord;
};
