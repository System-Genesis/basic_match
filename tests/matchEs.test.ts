import basicMatch from '../src/basicMatch';
import { matchedRecord as matchedRecordType } from '../src/types/matchedRecord';
import fieldNames from '../src/config/fieldNames';

// Mock the send log function: in test don't send logs
jest.mock('../src/logger', () => {
    return {
        default: jest.fn(),
    };
});

describe('Match Es testing', () => {
    test('Valid match', () => {
        const record: any = {
            mi: '5687556',
            stype: 'C',
            lastName: 'Rippin',
            firstName: 'Kiley',
            tz: '50747744',
            entity: 'agumon',
            rnk: 'rookie',
            rld: null,
            sex: 'ז',
            birthday: '2006-08-29T09:46:01.167Z',
            vphone: '1914',
            cphone: '53-9528948',
            hr: 'beatae/excepturi/iste',
            tf: 'Coordinator',
            userName: 'Kiley_Rippin8',
            mail: 'Kiley_Rippin8@jello.com',
            location: 'District Solutions Technician',
        };

        // const matchedRecord: matchedRecordType = matchEs(record, '123');
        const matchedRecord: matchedRecordType | null = basicMatch({ record, dataSource: fieldNames.sources.es, runUID: '123' });

        const expectedMatchedRecord: matchedRecordType = {
            job: 'Coordinator - District Solutions Technician',
            personalNumber: '5687556',
            serviceType: 'C',
            lastName: 'Rippin',
            firstName: 'Kiley',
            entityType: 'agumon',
            rank: 'rookie',
            sex: 'ז',
            birthDate: '2006-08-29T09:46:01.167Z',
            phone: '1914',
            mobilePhone: '53-9528948',
            hierarchy: 'wallmart/beatae/excepturi/iste',
            userID: 'Kiley_Rippin8@jello.com',
            mail: 'Kiley_Rippin8@jello.com',
            source: 'es_name',
        };

        expect(matchedRecord).toEqual(expectedMatchedRecord);
    });
});
