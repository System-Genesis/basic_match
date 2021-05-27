import matchAka from './matchAka';
import matchEs from './matchEs';
import matchAdNN from './matchAdNN';
import matchCity from './matchCity';
import matchAds from './matchAds';
import matchSf from './matchSf';
import matchNV from './matchNV';
import fn from '../../config/fieldNames';

interface queueObject {
    record: any;
    dataSource: string;
    runUID: string;
}

const matchMap = new Map([
    [fn.dataSources.aka, matchAka],
    [fn.dataSources.sf, matchEs],
    [fn.dataSources.adNN, matchAdNN],
    [fn.dataSources.city, matchCity],
    [fn.dataSources.ads, matchAds],
    [fn.dataSources.sf, matchSf],
    [fn.dataSources.nvSQL, matchNV],
]);

export default (obj: queueObject) => {
    const { record, dataSource, runUID } = obj;
    const matchedRecord = matchMap.get(dataSource)(record, runUID);
    return matchedRecord;
};
