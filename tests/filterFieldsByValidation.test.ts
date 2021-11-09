import { matchedRecord as matchedRecordType } from '../src/types/matchedRecord';
import filterFieldsByValidation from '../src/utils/filterFieldsByValidation';

// Mock the send log function: in test don't send logs
jest.mock('../src/logger', () => {
    return {
        default: jest.fn(),
    };
});

describe('Validate Record and filter fields', () => {
    it('filter all fields', () => {
        const record: matchedRecordType = {
            job: 'Coordinator - District Solutions Technician',
            personalNumber: '568755651',
            serviceType: 'R',
            lastName: 'Rippin',
            firstName: 'Kiley',
            entityType: 'agumon',
            rank: 'something',
            sex: 'ז',
            birthDate: 'happy birthday',
            mobilePhone: ['1234'],
            hierarchy: 'wallmart/beatae/excepturi/iste',
            userID: 'Kiley_Rippin8@jello.com',
            mail: 'Kiley_Rippin8@je@llo.com',
            source: 'es_name',
        };

        filterFieldsByValidation(record);

        const expectedRecord = {
            job: 'Coordinator - District Solutions Technician',
            personalNumber: '568755651',
            lastName: 'Rippin',
            firstName: 'Kiley',
            entityType: 'agumon',
            sex: 'male',
            hierarchy: 'wallmart/beatae/excepturi/iste',
            userID: 'Kiley_Rippin8@jello.com',
            source: 'es_name',
        };

        expect(record).toEqual(expectedRecord);
    });
});
