/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
import fieldNames from '../../config/fieldNames';
import validators from '../../config/validators';

const fn = fieldNames[fieldNames.dataSources.nvSQL];

export default (record: any) => {
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

            // hierarchy
            case fn.hierarchy:
                matchedRecord.hierarchy = record[key];
                break;

            // personalNumber
            case fn.pn:
                matchedRecord.personalNumber = record[key].toString();
                break;

            // identity card
            case fn.identityCard:
                validators(record[key]).identityCard ? (matchedRecord.identityCard = record[key].toString()) : null;
                break;
            default:
            // do nothing
        }
    });
};
