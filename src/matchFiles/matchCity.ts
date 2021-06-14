/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-case-declarations */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import fieldNames from '../config/fieldNames';
import { setDischargeDay, setField, setIdentityCard, setMobilePhone } from './basicFuncs';
import { isNumeric } from '../utils/isNumeric';
import { isStrContains } from '../utils/isStrContains';
import { matchedRecord as matchedRecordType } from '../types/matchedRecord';
import { sendLog } from '../rabbit';

const fn = fieldNames[fieldNames.sources.city];
const matchedRecordFieldNames = fieldNames.matchedRecord;

const setHierarchy = (matchedRecord: matchedRecordType, hierarchy: string, record: any): void => {
    const defaultHierarchy = `${fieldNames.rootHierarchy.city}${record[fn.company] ? `/${record[fn.company]}` : ''}`;
    let tempHr: string = hierarchy.replace('\\', '/');
    if (tempHr.includes('/')) {
        const hr: string[] = tempHr.split('/').map((unit) => unit.trim());

        const fullNameRegex = new RegExp(
            `${record.firstName.replace('(', '').replace(')', '')}( |\t)+${record.lastName.replace('(', '').replace(')', '')}`,
        );
        // eslint-disable-next-line prefer-const
        for (const [index, val] of hr.entries()) {
            const value = val.replace('(', '').replace(')', '');
            if (isStrContains(value, ['-']) || fullNameRegex.test(value) || !value) {
                hr.splice(index);
                break;
            }
        }

        // this condition come to fix insertion of "defaultHierarchy" to user that come from our "enviroment" to
        // city "enviroment" and than return to us from city API.
        // Prevent "fn.rootHierarchy.city/fn.rootHierarchy.city/fn.rootHierarchy.city.."
        tempHr = hr.join('/').substring(hr.join('/').lastIndexOf(fieldNames.rootHierarchy.city));
    }

    // this condition come to avoid insertion of "defaultHierarchy" to user that come from our "enviroment" to
    // city "enviroment" and than return to us from city API
    if (tempHr.includes(fieldNames.rootHierarchy.city)) {
        if (tempHr.includes(defaultHierarchy)) {
            matchedRecord.hierarchy = tempHr;
        } else if (tempHr.startsWith(fieldNames.rootHierarchy.city)) {
            matchedRecord.hierarchy = tempHr.replace(fn.rootHierarchy.city, defaultHierarchy);
        }
    } else {
        const isInternal: boolean = record.domains.includes(fieldNames.city_name.domainNames.internal);
        // Keep the internal hierarchy of internal du
        matchedRecord.hierarchy = `${isInternal ? '' : defaultHierarchy}${tempHr.includes('/') ? `/${tempHr}` : ''}`;
        if (matchedRecord.hierarchy.startsWith('/')) {
            matchedRecord.hierarchy = matchedRecord.hierarchy.substring(1);
        }
    }
};

const setEntityTypeAndDI = async (matchedRecord: matchedRecordType, userID: string, runUID: string): Promise<void> => {
    let rawEntityType: string = '';

    for (const [index, char] of Array.from(userID.toLowerCase().trim()).entries()) {
        // check if the userID is valid
        if ((index === 0 && isNumeric(char)) || (index === 1 && !isNumeric(char))) {
            sendLog('error', `Invalid userID for user ${userID}`, 'Karting', 'Basic Match', {
                user: userID,
                source: fieldNames.sources.city,
                runUID,
            });
            return;
        }
        // get the entity type key
        if (index === 0) {
            rawEntityType = char;
        } else if (!isNumeric(char)) {
            break;
        }
    }

    // Set the userID
    matchedRecord.userID = userID;

    // set the entityType
    if (fn.entityTypePrefix.s.includes(rawEntityType)) {
        matchedRecord.entityType = fieldNames.entityTypeValue.s;
    } else if (fn.entityTypePrefix.c.includes(rawEntityType)) {
        matchedRecord.entityType = fieldNames.entityTypeValue.c;
    } else if (fn.entityTypePrefix.gu.includes(rawEntityType)) {
        matchedRecord.entityType = fieldNames.entityTypeValue.gu;
    } else {
        await sendLog('error', 'Invalid entity type', 'Karting', 'Basic Match', {
            user: 'userID',
            source: fieldNames.sources.city,
            runUID,
        });
    }
};

// Give priority to job field
const setJob = (matchedRecord: matchedRecordType, value: string, originFieldName: string): void => {
    if (originFieldName === fn.profession) {
        if (!matchedRecord[matchedRecordFieldNames.job]) {
            matchedRecord[matchedRecordFieldNames.job] = value;
        }
    } else {
        matchedRecord[matchedRecordFieldNames.job] = value;
    }
};

const fieldsFuncs = new Map<string, (matchedRecord: matchedRecordType, value: string) => void>([
    [fn.firstName, (mathcedRecord, value) => setField(mathcedRecord, value, matchedRecordFieldNames.firstName)],
    [fn.lastName, (mathcedRecord, value) => setField(mathcedRecord, value, matchedRecordFieldNames.lastName)],
    [fn.rank, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.rank)],
    [fn.clearance, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.clearance)],
    [fn.personalNumber, (mathcedRecord, value) => setField(mathcedRecord, value, matchedRecordFieldNames.personalNumber)],
    [fn.identityCard, setIdentityCard],
    [fn.dischargeDay, setDischargeDay],
    [fn.unitName, (mathcedRecord, value) => setField(mathcedRecord, value, matchedRecordFieldNames.akaUnit)],
    [fn.serviceType, (mathcedRecord, value) => setField(mathcedRecord, value, matchedRecordFieldNames.serviceType)],
    [fn.mobilePhone, setMobilePhone],
    [fn.address, (mathcedRecord, value) => setField(mathcedRecord, value, matchedRecordFieldNames.address)],
    [fn.mail, (matchedRecord, value) => setField(matchedRecord, value, matchedRecordFieldNames.mail)],
    [fn.profession, (matchedRecord, value) => setJob(matchedRecord, value, fn.profession)],
    [fn.job, (matchedRecord, value) => setJob(matchedRecord, value, fn.job)],
]);

export default (record: any, runUID: string) => {
    const originalRecordFields: string[] = Object.keys(record);
    const matchedRecord: matchedRecordType = {};

    originalRecordFields.map((field: string) => {
        if (record[field] && record[field] !== fieldNames.unknown) {
            if (fieldsFuncs.has(field)) {
                fieldsFuncs.get(field)!(matchedRecord, record[field]);
            } else if (field === fn.hierarchy) {
                setHierarchy(matchedRecord, record[field], record);
            } else if (field === fn.domainUsers) {
                setEntityTypeAndDI(matchedRecord, record[field], runUID);
            }
        }
    });

    matchedRecord[matchedRecordFieldNames.source] = record[fn.domains].includes(fn.domainNames.external)
        ? fieldNames.sources.city
        : fieldNames.sources.mir;

    return matchedRecord;
};
