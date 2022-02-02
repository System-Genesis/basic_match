import logger from 'logger-genesis';
import matchAka from './matchFiles/matchAka';
import matchEs from './matchFiles/matchEs';
import matchAdNN from './matchFiles/matchAdNN';
import matchCity from './matchFiles/matchCity';
import matchSf from './matchFiles/matchSf';
import fn from './config/fieldNames';
import { queueObject } from './types/queueObject';
import { matchedRecord as matchedRecordType } from './types/matchedRecord';
import filterFieldsByValidation from './utils/filterFieldsByValidation';
import { scopeOption } from './types/log';

const { logFields } = fn;

/**
 * Function map for each source
 */
const matchMap = new Map([
    [fn.sources.aka, matchAka],
    [fn.sources.es, matchEs],
    [fn.sources.adNN, matchAdNN],
    [fn.sources.city, matchCity],
    [fn.sources.sf, matchSf],
]);

/**
 * Navigate the record to it's function, filter the field of the record by validate each one
 * @param { queueObject } record got from the queue
 * @return Object in matchedRecord format.
 */
export default (obj: queueObject): matchedRecordType | null => {
    const { record, dataSource } = obj;
    let matchedRecord: matchedRecordType = {};
    if (matchMap.has(dataSource)) {
        matchedRecord = matchMap.get(dataSource)!(record);
        filterFieldsByValidation(matchedRecord);
        return matchedRecord;
    }
    logger.error(true, logFields.scopes.app as scopeOption, 'Unknown source', `Source: ${dataSource} not found`);
    return null;
};
