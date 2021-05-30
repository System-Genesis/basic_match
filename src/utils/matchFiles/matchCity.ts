/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-case-declarations */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import fieldNames from '../../config/fieldNames';
import * as basicFunctions from './basicFuncs';

const fn = fieldNames[fieldNames.dataSources.city];

const isNumeric = (value: number | string) => {
    return !isNaN(parseInt(value.toString(), 10));
};

const isStrContains = (target: string, pattern: string[]): boolean => {
    let value = 0;

    pattern.forEach((word) => {
        value += target.includes(word) ? 1 : 0;
    });

    return value > 0;
};

const setHierarchy = (matchedRecord: any, hierarchy: string, record: any): void => {
    const defaultHierarchy = `${fn.rootHierarchy.city}${record[fn.company] ? `/${record[fn.company]}` : ''}`;
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
        // city "enviroment" and than return to us from city API. Can delete this code after stable the specific problem
        // of "fn.rootHierarchy.city/fn.rootHierarchy.city/fn.rootHierarchy.city.."
        if (hr[0] === fn.rootHierarchy.city) {
            let tempCityCount = 0;
            for (const value of hr) {
                if (value === fn.rootHierarchy.city) {
                    tempCityCount += 1;
                } else {
                    break;
                }
            }
            hr.splice(0, tempCityCount - 1);
        }

        tempHr = hr.join('/');
    }

    // this condition come to avoid insertion of "defaultHierarchy" to user that come from our "enviroment" to
    // city "enviroment" and than return to us from city API\
    if (tempHr.includes(fn.rootHierarchy.city)) {
        if (tempHr.includes(defaultHierarchy)) {
            matchedRecord.hierarchy = tempHr;
        } else if (tempHr.startsWith(fn.rootHierarchy.city)) {
            matchedRecord.hierarchy = tempHr.replace(fn.rootHierarchy.city, defaultHierarchy);
        }
    } else {
        const isInternal: boolean = record.domains.includes('CTS');
        // Keep the internal hierarchy of internal du
        matchedRecord.hierarchy = `${isInternal ? '' : defaultHierarchy}${tempHr.includes('/') ? `/${tempHr}` : ''}`;
        if (matchedRecord.hierarchy[0] === '/') {
            matchedRecord.hierarchy = matchedRecord.hierarchy.substring(1);
        }
    }
};

const setEntityTypeAndDU = (matchedRecord: any, userID: string, record: any): void => {
    let rawEntityType: string = '';
    let defaultIdentifier: string = '';

    for (const [index, char] of Array.from(userID.toLowerCase().trim()).entries()) {
        // check if the userID is valid
        if ((index === 0 && isNumeric(char)) || (index === 1 && !isNumeric(char))) {
            return;
        }
        // get the entity type key
        if (index === 0) {
            rawEntityType = char;
        } else if (!isNumeric(char)) {
            // get the identifier
            defaultIdentifier = userID.substring(1, index);
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

    // Set personal number for soldier - if already has, don't over write
    if (matchedRecord.entityType === fn.entityTypePrefix.s && !record.personalNumber) {
        matchedRecord.personalNumber = defaultIdentifier;
    }
};

const funcMap = new Map([
    [fn.firstName, basicFunctions.setFirstName],
    [fn.lastName, basicFunctions.setLastName],
    [fn.rank, basicFunctions.setRank],
    [fn.clearance, basicFunctions.setClearance],
    [fn.personalNumber, basicFunctions.setPersonalNumber],
    [fn.identityCard, basicFunctions.setIdentityCard],
    [fn.dischargeDay, basicFunctions.setDischargeDay],
    [fn.currentUnit, basicFunctions.setAkaUnit],
    [fn.serviceType, basicFunctions.setServiceType],
    [fn.mobilePhone, basicFunctions.setMobilePhone],
    [fn.mail, basicFunctions.setMail],
    [fn.profession, basicFunctions.setJob],
    [fn.job, basicFunctions.setJob],
    [fn.hierarchy, setHierarchy],
    [fn.domains, setEntityTypeAndDU],
]);

export default (record: any, runUID: string) => {
    const keys: string[] = record.keys(record);
    const matchedRecord: any = {};

    keys.map((key: string) => {
        if (funcMap.has(key)) {
            if (key === fn.hierarchy) {
                funcMap.get(key)(matchedRecord, record[key], record);
            } else if (key === fn.domainUsers) {
                funcMap.get(key)(matchedRecord, record[key], record);
            } else {
                funcMap.get(key)(matchedRecord, record[key]);
            }
        }
    });

    matchedRecord.source = record[fn.domains].includes(fn.dataSource.city) ? fn.dataSource.city : fn.dataSource.mir;

    return matchedRecord;
};
