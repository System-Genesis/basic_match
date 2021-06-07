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

const fn = fieldNames[fieldNames.dataSources.city];
const macthedRecordFN = fieldNames.matchedRecord;

const setHierarchy = (matchedRecord: matchedRecordType, hierarchy: string, record: any): void => {
    const defaultHierarchy = `${fieldNames.rootHierarchy.city}${record[fn.company] ? `/${record[fn.company]}` : ''}`;
    let tempHr: string = hierarchy.replace('\\', '/');
    if (tempHr.includes('/')) {
        const hr: string[] = tempHr.split('/').map((unit) => unit.trim());

        const fullNameRegex = new RegExp(
            `${record.firstName.replace('(', '').replace(')', '')}( |\t)+${record.lastName.replace('(', '').replace(')', '')}`,
        );
        // eslint-disable-next-line prefer-const
        for (let [index, value] of hr.entries()) {
            value = value.replace('(', '').replace(')', '');
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

const setEntityTypeAndDU = (matchedRecord: matchedRecordType, userID: string): void => {
    let rawEntityType: string = '';

    for (const [index, char] of Array.from(userID.toLowerCase().trim()).entries()) {
        // check if the userID is valid
        if ((index === 0 && isNumeric(char)) || (index === 1 && !isNumeric(char))) {
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
        // TO DO
        // log error entity type
    }
};

// Give priority to job field
const setJob = (matchedRecord: matchedRecordType, value: string, originFieldName: string): void => {
    if (originFieldName === fn.profession) {
        if (!matchedRecord[macthedRecordFN.job]) {
            matchedRecord[macthedRecordFN.job] = value;
        }
    } else {
        matchedRecord[macthedRecordFN.job] = value;
    }
};

const funcMap = new Map<string, (matchedRecord: matchedRecordType, value: string) => void>([
    [fn.firstName, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.firstName)],
    [fn.lastName, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.lastName)],
    [fn.rank, (matchedRecord, value) => setField(matchedRecord, value, macthedRecordFN.rank)],
    [fn.clearance, (matchedRecord, value) => setField(matchedRecord, value, macthedRecordFN.clearance)],
    [fn.personalNumber, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.personalNumber)],
    [fn.identityCard, setIdentityCard],
    [fn.dischargeDay, setDischargeDay],
    [fn.unitName, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.akaUnit)],
    [fn.serviceType, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.serviceType)],
    [fn.mobilePhone, setMobilePhone],
    [fn.address, (mathcedRecord, value) => setField(mathcedRecord, value, macthedRecordFN.address)],
    [fn.mail, (matchedRecord, value) => setField(matchedRecord, value, macthedRecordFN.mail)],
    [fn.profession, (matchedRecord, value) => setJob(matchedRecord, value, fn.profession)],
    [fn.job, (matchedRecord, value) => setJob(matchedRecord, value, fn.job)],
    [fn.domainUsers, setEntityTypeAndDU],
]);

export default (record: any, runUID: string) => {
    const keys: string[] = Object.keys(record);
    const matchedRecord: matchedRecordType = {};
    // eslint-disable-next-line no-console
    console.log(runUID);

    keys.map((key: string) => {
        if (record[key] && record[key] !== 'לא ידוע') {
            if (funcMap.has(key)) {
                funcMap.get(key)!(matchedRecord, record[key]);
            } else if (key === fn.hierarchy) {
                setHierarchy(matchedRecord, record[key], record);
            }
        }
    });

    matchedRecord[macthedRecordFN.source] = record[fn.domains].includes(fn.domainNames.external)
        ? fieldNames.dataSources.city
        : fieldNames.dataSources.mir;

    return matchedRecord;
};
