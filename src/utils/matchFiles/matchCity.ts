/* eslint-disable no-case-declarations */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import fieldNames from '../../config/fieldNames';
import validators from '../../config/validators';

const fn = fieldNames[fieldNames.dataSources.city];

export default (record: any, runUID: string) => {
    const keys: string[] = record.keys(record);
    const matchedRecord: any = {};
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

            // dischargeDay
            case fn.dischargeDay:
                const date: Date | null = record[key] ? new Date(record[key]) : null;
                if (date) {
                    const userTimezoneOffset: number = date.getTimezoneOffset() * 60000;
                    matchedRecord.dischargeDay = date ? new Date(date.getTime() - userTimezoneOffset).toISOString() : null;
                }
                break;

            // clearance
            case fn.clearance:
                matchedRecord.clearance = record[key];
                break;

            // currentUnit
            case fn.currentUnit:
                matchedRecord.unitName = record[key].toString().replace(new RegExp('"', 'g'), ' ');
                break;

            // serviceType
            case fn.serviceType:
                matchedRecord.serviceType = record[key];
                break;

            // mobilePhone
            case fn.mobilePhone:
                validators().mobilePhone.test(record[key]) ? (matchedRecord.mobilePhone = [record[key]]) : null;
                break;

            // mail
            case fn.mail:
                matchedRecord.mail = record[key];
                break;
            // job

            case fn.profession:
            case fn.job:
                if (!record.job) {
                    matchedRecord.job = record[fn.job] || record[fn.profession];
                }
                break;

            // hierarchy
            case fn.hierarchy:
                matchedRecord.hierarchy = record[key];
                break;

            // Entity type, userID and
            case fn.domainUsers:
                // Set the userID
                matchedRecord.userID = record[key];
                const entityTypeChar: string = record[key][0];
                // set the entityType
                if (fn.entityTypePrefix.s.includes(entityTypeChar)) {
                    matchedRecord.entityType = fn.entityTypePrefix.s;
                } else if (fn.entityTypePrefix.c.includes(entityTypeChar)) {
                    matchedRecord.entityType = fn.entityTypePrefix.c;
                } else if (fn.entityTypePrefix.gu.includes(entityTypeChar)) {
                    matchedRecord.entityType = fn.entityTypePrefix.gu;
                } else {
                    // TO DO
                    // log error entity type
                }

                // Set identity card or personal number - if already has don't over write
                if (matchedRecord.entityType === fn.entityTypePrefix.s && !record.personalNumber) {
                    const defaultIdentifier: string = record[key].split('@').substring(1);
                    matchedRecord.personalNumber = defaultIdentifier;
                }
                break;
            default:
            // do nothing
        }
    });

    return matchedRecord;
};
