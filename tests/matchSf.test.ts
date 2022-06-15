/* eslint-disable prettier/prettier */
import logger from 'logger-genesis';
import basicMatch from '../src/basicMatch';
import { matchedRecord as matchedRecordType } from '../src/types/matchedRecord';
import fieldNames from '../src/config/fieldNames';

// Mock the logs functions: in test don't send logs
logger.info = () => { };
logger.warn = () => { };
logger.error = () => { };

describe('Match sf testing', () => {
    test('Valid match', () => {
        const record: any = {
            firstName: 'Bonita',
            lastName: 'Lesch',
            userName: 'Bonita.Lesch1',
            fullName: 'Bonita Lesch',
            sex: 'f',
            personalNumber: '32369696',
            tz: '5191812',
            stype: 'E',
            hierarchy: ['voluptas', 'ut', 'assumenda', 'excepturi', 'minus'],
            mail: 'Vivienne.Zboncak96@leonardo.com',
            rank: 'rookie',
            status: 'active',
            address: '2268 Leuschke Crest Apt. 469',
            telephone: '0545198546',
            entity: 'soldier',
            discharge: '2032-02-09T17:27:56.548Z',
            primaryDU: {
                uniqueID: 'Vivienne.Zboncak96',
                adfsUID: 'Vivienne.Zboncak96@ddd',
            },
        };

        const matchedRecord: matchedRecordType | null = basicMatch({ record, dataSource: fieldNames.sources.sf, runUID: '123' });

        const expectedRecord: matchedRecordType = {
            firstName: 'Bonita',
            lastName: 'Lesch',
            userID: 'bonita.lesch1@leonardo.com',
            sex: 'female',
            personalNumber: '32369696',
            identityCard: '5191812',
            serviceType: 'E',
            hierarchy: `${fieldNames.sources.sf}/voluptas/ut/assumenda/excepturi/minus`,
            mail: 'vivienne.zboncak96@leonardo.com',
            rank: 'rookie',
            // entityType: 'agumon', TODO fix test
            dischargeDay: '2032-02-09T19:27:56.548Z',
            source: 'sf_name',
        };

        expect(matchedRecord).toEqual(expectedRecord);
    });
});
