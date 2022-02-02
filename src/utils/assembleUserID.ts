import { matchedRecord as matchedRecordType } from '../types/matchedRecord';
import { DOMAIN_SUFFIXES } from '../config/enums';

const domainSuffixes: Map<string, string> = new Map<string, string>(DOMAIN_SUFFIXES);

/**
 *  Generating a userID based on the record's source
 * @param { matchedRecordType } - The generated record
 * @return { string } - A userID
 */
export default (record: matchedRecordType): string => `${record.userID!.split('@')[0]}${domainSuffixes.get(record.source!)}`.toLowerCase();
