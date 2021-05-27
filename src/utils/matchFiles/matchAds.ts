/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-case-declarations */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import fieldNames from '../../config/fieldNames';
import validators from '../../config/validators';

const fn = fieldNames[fieldNames.dataSources.ads];

const isNumeric = (value: string) => {
    return !isNaN(parseInt(value.toString(), 10));
};

export default (record: any, runUID: string) => {
    const keys: string[] = record.keys(record);
    const matchedRecord: any = {};
    keys.map((key) => {
        switch (key) {
            // firstName
            case fn.firstName:
                matchedRecord.firstName = record[key];
                break;

            // lastName
            case fn.lastName:
                matchedRecord.lastName = record[key];
                break;

            // job
            case fn.job:
                matchedRecord.job = record[key];
                break;

            // mail
            case fn.mail:
                matchedRecord.mail = record[key];
                break;

            // hierarchy
            case fn.hierarchy:
                matchedRecord.hierarchy = record[key];
                break;

            // entityType, personalNumber/identityCard
            case fn.upn:
                let upnPrefix: string = '';
                for (const char of record[fn.upn].toLowerCase().trim()) {
                    if (isNumeric(char) === false) {
                        upnPrefix += char;
                    } else {
                        break;
                    }
                }
                switch (upnPrefix) {
                    case fn.cPrefix:
                        matchedRecord.entityType = fieldNames.entityTypeValue.c;
                        break;
                    case fn.sPrefix:
                        matchedRecord.entityType = fieldNames.entityTypeValue.s;
                        break;
                    case fn.guPrefix:
                        matchedRecord.entityType = fieldNames.entityTypeValue.gu;
                        matchedRecord.firstName = record[fn.guName] ? record[fn.guName] : 'cn';
                        matchedRecord.job = record[fn.guName] ? record[fn.guName] : 'cn';
                        break;
                    default:
                    // send log
                }
                const identityCardCandidate = record[key].toLowerCase().split(upnPrefix)[1].split('@')[0].toString();
                matchedRecord.entityType === fn.entityTypeValue.c && validators(identityCardCandidate).identityCard
                    ? (matchedRecord.identityCard = identityCardCandidate)
                    : null;
                matchedRecord.entityType === fn.entityTypeValue.s ? (matchedRecord.personalNumber = identityCardCandidate) : null;
                break;

            // // userID
            // case fn.sAMAccountName:

            default:
            // do nothing
        }
    });

    return matchedRecord;
};
