/* eslint-disable no-case-declarations */
/* eslint-disable array-callback-return */
import fieldNames from '../../config/fieldNames';

const fn = fieldNames[fieldNames.dataSources.sf];

export default (record: any, runUID: string) => {
    const keys: string[] = Object.keys(record);
    const matchedRecord: any = {};
    keys.map((key) => {
        switch (key) {
            // Identity card
            case fn.identityCard:
                matchedRecord.identityCard = record[key];
                break;

            // Personal number
            case fn.personalNumber:
                matchedRecord.personalNumber = record[key];
                break;

            // firstName
            case fn.firstName:
                matchedRecord.firstName = record[key];
                break;

            // lastName
            case fn.lastName:
                matchedRecord.lastName = record[key];
                break;

            // sex
            case fn.sex:
                const sfSex: string[] = Object.keys(fn.sfSexValues);
                matchedRecord.sex = record[key] === sfSex[0] ? fn.sfSexValues[sfSex[0]] : fn.sfSexValues[sfSex[1]];
                break;

            // mail
            case fn.mail:
                matchedRecord.mail = record[key];
                break;

            // hierarchy
            case fn.hierarchy:
                matchedRecord.hierarchy = record[key].join('/');
                break;

            // rank
            case fn.rank:
                matchedRecord.rank = record[key];
                break;

            // entityType
            case fn.entityType:
                if (record[key] === fn.s) {
                    matchedRecord.entityType = fieldNames.entityTypeValue.s;
                } else {
                    // send log
                }
                break;

            // discharge day
            case fn.dischargeDay:
                const date: Date | null = record[key] ? new Date(record[key]) : null;
                if (date) {
                    const userTimezoneOffset: number = date.getTimezoneOffset() * 60000;
                    matchedRecord.dischargeDay = date ? new Date(date.getTime() - userTimezoneOffset).toISOString() : null;
                }
                break;

            default:
            // do nothing
        }
    });

    return matchedRecord;
};
