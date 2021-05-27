/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable no-case-declarations */
import fieldNames from '../../config/fieldNames';
import validators from '../../config/validators';

const fn = fieldNames[fieldNames.dataSources.adNN];

export default (record: any, runUID: string) => {
    const keys: string[] = record.keys(record);
    const matchedRecord: any = {};
    keys.map((key) => {
        switch (key) {
            // personal Number / identity card, userID
            case fn.sAMAccountName:
                let uniqueNum: string;
                if (record[key].toLowerCase().includes(fn.extension)) {
                    uniqueNum = record[key].toLowerCase().replace(fn.extension, '');
                } else {
                    // send log
                    break;
                }

                if (validators(uniqueNum).identityCard) {
                    matchedRecord.identityCard = uniqueNum.toString();
                } else {
                    matchedRecord.personalNumber = uniqueNum.toString();
                }

                matchedRecord.userID = record[key].toLowerCase();
                break;

            // firstName
            case fn.firstName:
                matchedRecord.firstName = record[key];
                break;

            // lastName
            case fn.lastName:
                matchedRecord.lastName = record[key];
                break;

            // hierarchy
            case fn.hierarchy:
                matchedRecord.hierarchy = record[key];
                break;

            // mail
            case fn.mail:
                matchedRecord.mail = record[key];
                break;

            default:
            // do nothing
        }
    });

    return matchedRecord;
};
