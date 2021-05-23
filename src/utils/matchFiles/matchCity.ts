import fieldNames from '../../config/fieldNames';
import validators from '../../config/validators';

const fn = fieldNames.city_name;

export default (record: any) => {
    const keys: string[] = record.keys(record);
    let matchedRecord: any = {};
    keys.map(key => {
        switch(key) {
            //firstName
            case fn.firstName:
                matchedRecord.firstName = record[key];
                break;
            //lastName
            case fn.lastName:
                matchedRecord.lastName = record[key];
                break;
            //rank
            case fn.rank:
                matchedRecord.rank = record[key];
                break;

            // Entity type, userID and 
            case fn.domainUsers:
                let entityTypeChar: string = record[key][0];
                // set the entityType
                if (fn.entityTypePrefix.s.includes(entityTypeChar)) {
                    matchedRecord.entityType = fn.entityTypePrefix.s;
                }
                else if (fn.entityTypePrefix.c.includes(entityTypeChar)) {
                    matchedRecord.entityType = fn.entityTypePrefix.c;
                }
                else if (fn.entityTypePrefix.gu.includes(entityTypeChar)) {
                    matchedRecord.entityType = fn.entityTypePrefix.gu;                    
                } else {
                    // log error entity type
                }

                // Set identity card or personal number - if already has don't over write
                if (matchedRecord.entityType !== fn.entityTypePrefix.gu) { 
                    let defaultIdentifier: string = record[key].split('@').substring(1);
                    if (validators(defaultIdentifier).identityCard) { 
                        (matchedRecord.identityCard) ? null : matchedRecord.identityCard = defaultIdentifier;
                    } else {
                        (matchedRecord.personalNumber) ? null : matchedRecord.personalNumber = defaultIdentifier;
                    }
                }
                break;
            // Identity card
            case fn.identityCard: 
                matchedRecord.identityCard = record[key];
                break;
            // Personal number
            case fn.personalNumber:
                matchedRecord.personalNumber = record[key];
                break;
        }
    })

    

    return matchedRecord;
}