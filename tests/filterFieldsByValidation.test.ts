/* eslint-disable prettier/prettier */
import logger from 'logger-genesis';
import { matchedRecord as matchedRecordType } from '../src/types/matchedRecord';
import filterFieldsByValidation from '../src/utils/filterFieldsByValidation';

// Mock the logs functions: in test don't send logs
logger.info = () => { };
logger.warn = () => { };
logger.error = () => { };

describe('Validate Record and filter fields', () => {
    it('filter all fields', async () => {
        const record: matchedRecordType = {
            job: 'Coordinator - District Solutions Technician',
            personalNumber: '568755651',
            identityCard: '1462',
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
