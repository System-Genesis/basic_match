import basicMatch from '../src/basicMatch';
import { matchedRecord as matchedRecordType } from '../src/types/matchedRecord';
import fieldNames from '../src/config/fieldNames';

// Mock the send log function: in test don't send logs
jest.mock('../src/logger', () => {
    return {
        default: jest.fn(),
    };
});

describe('Match adNN testing', () => {
    test('Valid match - valid userName', () => {
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
    });

    test('Invalid match - invalid userName', () => {
        const record: any = {
            KfirstName: 'Viola',
            guName: 'Viola',
            KlastName: 'Jacobi',
            userPrincipalName: 'BB42337541',
            Kjob: 'Regional Applications Associate',
            hierarchy: 'in/doloribus/quis/Regional Applications Associate - Viola Jacobi',
            sAMAccountName: 'Geovany69',
            mail: 'Geovany69@rabiran.com',
        };

        const matchedRecord: matchedRecordType | null = basicMatch({ record, dataSource: fieldNames.sources.adNN, runUID: '123' });

        const expectedRecord: matchedRecordType = {
            firstName: 'Viola',
            lastName: 'Jacobi',
            hierarchy: `${fieldNames.sources.adNN}/in/doloribus/quis`,
            job: 'Viola Jacobi',
            mail: 'geovany69@rabiran.com',
            source: 'adNN_name',
        };

        expect(matchedRecord).toEqual(expectedRecord);
    });
});
