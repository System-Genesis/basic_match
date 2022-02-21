/* eslint-disable prettier/prettier */
import logger from 'logger-genesis';
import basicMatch from '../src/basicMatch';
import { matchedRecord as matchedRecordType } from '../src/types/matchedRecord';
import fieldNames from '../src/config/fieldNames';

// Mock the logs functions: in test don't send logs
logger.info = () => { };
logger.warn = () => { };
logger.error = () => { };

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
            rld: '2022-08-06',
            sex: 'ז',
            birthday: '2006-08-29T09:46:01.167Z',
            vphone: '1914',
            cphone: '53-9528948',
            hr: 'beatae/excepturi/iste',
            tf: 'Coordinator',
            userName: 'Kiley_Rippin8',
            mail: 'Kiley_Rippin8@jello.com',
            location: 'District Solutions Technician',
            adr: '13 Alenby, Tel Aviv'
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
            sex: 'male',
            birthDate: '2006-08-29T12:46:01.167Z',
            dischargeDay: '2022-08-06T03:00:00.000Z',
            address: '13 Alenby, Tel Aviv',
            phone: ['01914'],
            mobilePhone: ['0539528948'],
            hierarchy: `${fieldNames.sources.es}/beatae/excepturi/iste`,
            userID: 'kiley_rippin8@jello.com',
            mail: 'kiley_rippin8@jello.com',
            source: 'es_name',
        };

        expect(matchedRecord).toEqual(expectedMatchedRecord);
    });
});
