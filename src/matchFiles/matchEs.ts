import fieldNames from '../config/fieldNames';
import setField, { setPhone } from './setField';
import { matchedRecord as matchedRecordType } from '../types/matchedRecord';
import sendLog from '../logger';
import assembleUserID from '../utils/assembleUserID';

const fn = fieldNames[fieldNames.sources.es];
const matchedRecordFieldNames = fieldNames.matchedRecord;

const setJob = (matchedRecord: matchedRecordType, location: string, job: string): void => {
    matchedRecord.job = location ? `${job} - ${location}` : job;
};

const setHierarchy = (matchedRecord: matchedRecordType, value: string, runUID: string): void => {
    let hr: string[] = value.split('/');
    if (hr[0] === '') {
        sendLog('warn', `Invalid hierarchy`, false, {
            user: matchedRecord.userID,
            source: fieldNames.sources.es,
            runUID,
        });
        return;
    }

    // Add our root hierarchy if needed - wasn't in the original hierarchy
    // if (hr[0] !== fieldNames.rootHierarchy.ourCompany) hr.unshift(fieldNames.rootHierarchy.ourCompany);

    // Insert tree root
    hr.unshift(`${fieldNames.treeRoots.es}/`);

    hr = hr.map((organizationName) => {
        return organizationName.trim();
    });
    matchedRecord.hierarchy = hr.join('/');
};

const setFieldsFuncs = new Map<string, (matchedRecord: matchedRecordType, value: string) => void>([
    [fn.firstName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.firstName)],
    [fn.lastName, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.lastName)],
    [fn.rank, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.rank)],
    [fn.sex, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.sex)],
    [fn.personalNumber, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.personalNumber)],
    [fn.identityCard, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.identityCard)],
    [fn.dischargeDay, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.dischargeDay)],
    [fn.entityType, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.entityType)],
    [fn.serviceType, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.serviceType)],
    [fn.birthDate, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.birthDate)],
    [fn.address, (matched, value) => setField(matched, value, matchedRecordFieldNames.address)],
    [fn.mail, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.mail)],
    [fn.userName, (matched, value) => setField(matched, value, matchedRecordFieldNames.userID)],
]);

export default (record: any, runUID: string) => {
    const originalRecordFields: string[] = Object.keys(record);
    const matchedRecord: matchedRecordType = {};

    const job: string = record[fn.job];
    const location: string = record[fn.location];
    matchedRecord.job = job || location; // incase theres no job but there is an location

    originalRecordFields.forEach((field: string) => {
        if (record[field] && record[field] !== fieldNames.unknown) {
            if (setFieldsFuncs.has(field)) {
                setFieldsFuncs.get(field)!(matchedRecord, record[field]);
            } else if (field === fn.job) {
                setJob(matchedRecord, location, record[field]);
            } else if (field === fn.hierarchy) {
                setHierarchy(matchedRecord, record[field], runUID);
            } else if (field === fn.mobilePhone || field === fn.phone) {
                setPhone(
                    matchedRecord,
                    record[field],
                    field === fn.mobilePhone ? matchedRecordFieldNames.mobilePhone : matchedRecordFieldNames.phone,
                );
            }
        }
    });

    matchedRecord[matchedRecordFieldNames.source] = fieldNames.sources.es;
    if (matchedRecord[matchedRecordFieldNames.userID]) matchedRecord[matchedRecordFieldNames.userID] = assembleUserID(matchedRecord);

    return matchedRecord;
};
