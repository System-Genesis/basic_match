import { matchedRecord as matchedRecordType } from '../types/matchedRecord';
import { DOMAIN_SUFFIXES } from '../config/enums';

const domainSuffixes: Map<string, string> = new Map<string, string>(DOMAIN_SUFFIXES);

export default (record: matchedRecordType): string => {
    if (!record.userID!.includes('@')) return `${record.userID}${domainSuffixes.get(record.source!)}`;
    return record.userID!;
};
