import matchAka from './matchAka';
import matchEs from './matchEs';
import matchAdNN from './matchAdNN';
import matchCity from './matchCity';
import matchSf from './matchSf';
import fn from '../../config/fieldNames';

type queueObject = {
    record: any;
    dataSource: string;
    runUID: string;
};

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
