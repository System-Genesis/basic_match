import logger from 'logger-genesis';
import fieldNames from '../config/fieldNames';
import setField from './setField';
import { matchedRecord as matchedRecordType } from '../types/matchedRecord';
import assembleUserID from '../utils/assembleUserID';
import { scopeOption } from '../types/log';

const { logFields } = fieldNames;

const fn = fieldNames[fieldNames.sources.sf];
const matchedRecordFieldNames = fieldNames.matchedRecord;

const setEntityType = (matchedRecord: matchedRecordType, value: string): void => {
    if (value === fn.s) {
        matchedRecord.entityType = fieldNames.entityTypeValue.s;
    } else {
        logger.warn(
            false,
            logFields.scopes.app as scopeOption,
            'Invalid EntityType',
            `Invalid EntityType or userID ${matchedRecord[matchedRecordFieldNames.userID]}`,
            {
                id:
                    matchedRecord[matchedRecordFieldNames.identityCard] ||
                    matchedRecord[matchedRecordFieldNames.personalNumber] ||
                    matchedRecord[matchedRecordFieldNames.goalUserId],
            },
        );
    }
};

const setHierarchy = (matchedRecord: matchedRecordType, value: string[]): void => {
    const hr = value;
    // if (hr[0] !== fieldNames.rootHierarchy.ourCompany) hr.unshift(fieldNames.rootHierarchy.ourCompany);

    // Insert tree root
    hr.unshift(`${fieldNames.treeRoots.sf}`);
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
    [fn.sex, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.sex)],
]);

export default (record: any) => {
    const originalRecordFields: string[] = Object.keys(record);
    const matchedRecord: matchedRecordType = {};

    originalRecordFields.forEach((field: string) => {
        if (record[field] && record[field] !== fieldNames.unknown) {
            if (setFieldsFuncs.has(field)) {
                setFieldsFuncs.get(field)!(matchedRecord, record[field]);
            } else if (field === fn.entityType) {
                setEntityType(matchedRecord, record[field]);
            } else if (field === fn.hierarchy) {
                setHierarchy(matchedRecord, record[field]);
            }
        }
    });

    matchedRecord[matchedRecordFieldNames.source] = fieldNames.sources.sf;
    if (matchedRecord[matchedRecordFieldNames.userID]) matchedRecord[matchedRecordFieldNames.userID] = assembleUserID(matchedRecord);

    return matchedRecord;
};
