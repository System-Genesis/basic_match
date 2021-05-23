import matchAka from './matchAka';
import matchEs from './matchEs';
import matchAdNN from './matchAdNN';

const matchFuncs = {
    aka: matchAka,
    ads: matchEs,
    adNN: matchAdNN
}

export default (obj: any) => {
    let { record, dataSource } = obj.record;
    let matchedRecord = matchFuncs[dataSource](record);
    return matchedRecord;
}