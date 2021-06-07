import matchAka from './matchFiles/matchAka';
import matchEs from './matchFiles/matchEs';
import matchAdNN from './matchFiles/matchAdNN';
import matchCity from './matchFiles/matchCity';
import matchSf from './matchFiles/matchSf';
import fn from './config/fieldNames';
import { queueObject } from './types/queueObject';
import { matchedRecord as matchedRecordType } from './types/matchedRecord';

const matchMap = new Map([
    [fn.dataSources.aka, matchAka],
    [fn.dataSources.es, matchEs],
    [fn.dataSources.adNN, matchAdNN],
    [fn.dataSources.city, matchCity],
    [fn.dataSources.sf, matchSf],
]);

export default (obj: queueObject): matchedRecordType => {
    const { record, dataSource, runUID } = obj;
    let matchedRecord: matchedRecordType = {};
    if (matchMap.has(dataSource)) {
        matchedRecord = matchMap.get(dataSource)!(record, runUID);
    }
    return matchedRecord;
};
