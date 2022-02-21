/* eslint-disable prettier/prettier */
import logger from 'logger-genesis';
import basicMatch from '../src/basicMatch';
import { matchedRecord as matchedRecordType } from '../src/types/matchedRecord';
import fieldNames from '../src/config/fieldNames';

// Mock the logs functions: in test don't send logs
logger.info = () => { };
logger.warn = () => { };
logger.error = () => { };

describe('Check Return type - validation of source', () => {
    test('Valid Source', () => {
        const record: any = {
            KfirstName: 'Melisa',
            guName: 'Melisa',
            KlastName: 'Steuber',
            userPrincipalName: 'Maxwell_Heaney',
            Kjob: 'Human Program Agent',
            hierarchy: 'nihil/soluta/dolores/Human Program Agent - Melisa Steuber',
            sAMAccountName: 'nn17892194',
            mail: 'Maxwell_Heaney@rabiran.com',
        };

        const matchedRecord: matchedRecordType | null = basicMatch({ record, dataSource: fieldNames.sources.adNN, runUID: '123' });

        const expectedRecord: matchedRecordType = {
            userID: 'nn17892194@adnn.com',
            personalNumber: '17892194',
            entityType: 'agumon',
            firstName: 'Melisa',
            lastName: 'Steuber',
            hierarchy: `${fieldNames.sources.adNN}/nihil/soluta/dolores`,
            job: 'Melisa Steuber',
            mail: 'maxwell_heaney@rabiran.com',
            source: 'adNN_name',
        };

        expect(matchedRecord).toEqual(expectedRecord);
    })

    test('Invalid Source', () => {
        const record: any = {
            KfirstName: 'Melisa',
            guName: 'Melisa',
            KlastName: 'Steuber',
            userPrincipalName: 'Maxwell_Heaney',
            Kjob: 'Human Program Agent',
            hierarchy: 'nihil/soluta/dolores/Human Program Agent - Melisa Steuber',
            sAMAccountName: 'nn17892194',
            mail: 'Maxwell_Heaney@rabiran.com',
        };

        const matchedRecord: matchedRecordType | null = basicMatch({ record, dataSource: 'justSource', runUID: '123' });

        expect(matchedRecord).toEqual(null);
    })
})