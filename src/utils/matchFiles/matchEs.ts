/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
import fieldNames from '../../config/fieldNames';
import validators from '../../config/validators';

const fn = fieldNames[fieldNames.dataSources.es];

export default (record: any, runUID: string) => {
    const keys: string[] = Object.keys(record);
    const matchedRecord: any = {};
    const job: string = record[fn.job];
    const location: string = record[fn.location];
    matchedRecord.job = job || location; // incase theres no job but there is an location

    keys.map((key) => {
        switch (key) {
            // Identity card
            case fn.identityCard:
                validators(record[key]).identityCard ? (matchedRecord.identityCard = record[key].toString()) : null;
                break;

            // Personal number
            case fn.personalNumber:
                matchedRecord.personalNumber = record[key];
                break;

            // entityType
            case fn.entityType:
                matchedRecord.entityType = record[key];
                break;

            // firstName
            case fn.firstName:
                matchedRecord.firstName = record[key];
                break;

            // lastName
            case fn.lastName:
                matchedRecord.lastName = record[key];
                break;

            // rank
            case fn.rank:
                matchedRecord.rank = record[key];
                break;

            // mobilePhone
            case fn.mobilePhone:
                validators().mobilePhone.test(record[key]) ? (matchedRecord.mobilePhone = [record[key]]) : null;
                break;

            // dischargeDay
            case fn.dischargeDay:
                matchedRecord.dischargeDay = record[key];
                break;

            // hierarchy
            case fn.hierarchy:
                matchedRecord.hierarchy = record[key];
                break;

            // mail
            case fn.mail:
                matchedRecord.mail = record[key];
                break;

            // job
            case fn.job:
                matchedRecord.job = location ? `${job} - ${location}` : job;
                break;

            default:
            // do nothing
        }
    });

    return matchedRecord;
};
