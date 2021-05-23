import fieldNames from '../../config/fieldNames';
import validators from '../../config/validators';

const fn = fieldNames.adNN_name;

export default (record: any) => {
    const keys: string[] = record.keys(record);
    let matchedRecord: any = {};
    keys.map(key => {
        switch(key) {
            case fn.sAMAccountName:
                let uniqueNum: string;
                if (record[key].toLowerCase().includes(fn.extension)) {
                    uniqueNum = record[key].toLowerCase().replace(fn.extension, "")

                } else {
                    // sendLog(logLevel.warn, logDetails.warn.WRN_USER_NOT_EXTENTION, record[key], fn.extension);
                    break;
                }

                if (validators(uniqueNum).identityCard) {
                   matchedRecord.identityCard = uniqueNum.toString();
                } else {
                    matchedRecord.personalNumber = uniqueNum.toString();
                }
                break;
                
        }
    })

    return matchedRecord;
}