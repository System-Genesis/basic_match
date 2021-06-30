import basicMatch from '../src/basicMatch';
import { matchedRecord as matchedRecordType } from '../src/types/matchedRecord';
import fieldNames from '../src/config/fieldNames';

// Mock the send log function: in test don't send logs
jest.mock('../src/logger', () => {
    return {
        default: jest.fn(),
    };
});

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
            userID: 'Bonita.Lesch1@leonardo.com',
            sex: 'נ',
            personalNumber: '32369696',
            identityCard: '5191812',
            serviceType: 'E',
            hierarchy: 'wallmart/voluptas/ut/assumenda/excepturi/minus',
            mail: 'Vivienne.Zboncak96@leonardo.com',
            rank: 'rookie',
            entityType: 'agumon',
            dischargeDay: '2032-02-09T19:27:56.548Z',
            source: 'sf_name',
        };

        expect(matchedRecord).toEqual(expectedRecord);
    });
});