import fieldNames from '../../config/fieldNames';

const fn = fieldNames.aka;

export default( record: any ) => {
    const keys: string[] = Object.keys(record);
    let matchedRecord: any = {};
    keys.map(key => {
        switch(key) {
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