import matchAka from './matchFiles/matchAka';
import matchEs from './matchFiles/matchEs';
import matchAdNN from './matchFiles/matchAdNN';
import matchCity from './matchFiles/matchCity';
import matchSf from './matchFiles/matchSf';
import fn from './config/fieldNames';
import { queueObject } from './types/queueObject';

const matchMap = new Map([
    [fn.dataSources.aka, matchAka],
    [fn.dataSources.es, matchEs],
    [fn.dataSources.adNN, matchAdNN],
    [fn.dataSources.city, matchCity],
    [fn.dataSources.sf, matchSf],
]);

export default (obj: queueObject) => {
    const { record, dataSource, runUID } = obj;
    let matchedRecord: any;
    if (matchMap.has(dataSource)) {
        matchedRecord = matchMap.get(dataSource)!(record, runUID);
    }
    return matchedRecord;
};
