import matchAka from './matchFiles/matchAka';
import matchEs from './matchFiles/matchEs';
import matchAdNN from './matchFiles/matchAdNN';
import matchCity from './matchFiles/matchCity';
import matchSf from './matchFiles/matchSf';
import fn from './config/fieldNames';
import { queueObject } from './types/queueObject';
import { matchedRecord as matchedRecordType } from './types/matchedRecord';
import filterFieldsByValidation from './utils/filterFieldsByValidation';
import * as logger from './logger';
import { scopeOption } from './types/log';

const { logFields } = fn;

const matchMap = new Map([
    [fn.sources.aka, matchAka],
    [fn.sources.es, matchEs],
    [fn.sources.adNN, matchAdNN],
    [fn.sources.city, matchCity],
    [fn.sources.sf, matchSf],
]);

export default (obj: queueObject): matchedRecordType | null => {
    const { record, dataSource } = obj;
    let matchedRecord: matchedRecordType = {};
    if (matchMap.has(dataSource)) {
        matchedRecord = matchMap.get(dataSource)!(record);
        filterFieldsByValidation(matchedRecord);
        return matchedRecord;
    }
    logger.logError(false, 'Unknown source', logFields.scopes.app as scopeOption, `Source: ${dataSource} not found`);
    return null;
};
