/* eslint-disable prettier/prettier */
import logger from 'logger-genesis';
import basicMatch from '../src/basicMatch';
import { matchedRecord as matchedRecordType } from '../src/types/matchedRecord';
import fieldNames from '../src/config/fieldNames';

// Mock the logs functions: in test don't send logs
logger.info = () => { };
logger.warn = () => { };
logger.error = () => { };

test('Match Aka testiness', () => {
    const record: any = {
        nstype: 'B',
        firstName: 'Roei',
        lastName: 'Oren',
        tz: '123456782',
        mi: '8181564',
        rnk: '2',
        mPhone: '050-1234561',
        rld: '2022-08-06',
        clearance: '303',
        hr: 'Area 51',
        birthday: '2001-06-06',
        sex: 'male',
        picture: {
            path: "https://localhost:3000",
            format: '.jpg',
            takenAt: '2020-10-10'
        },
    }

    const matchedRecord: matchedRecordType | null = basicMatch({ record, dataSource: fieldNames.sources.aka, runUID: '123' });

    const expectedRecord: matchedRecordType = {
        firstName: 'Roei',
        lastName: 'Oren',
        serviceType: 'B',
        identityCard: '123456782',
        personalNumber: '8181564',
        rank: 'rookie',
        mobilePhone: ['0501234561'],
        dischargeDay: '2022-08-06T03:00:00.000Z',
        clearance: '3',
        fullClearance: '303',
        akaUnit: 'Area 51',
        birthDate: '2001-06-06T03:00:00.000Z',
        sex: 'male',
        pictures: {
            profile: {
                meta: {
                    path: "https://localhost:3000",
                    format: '.jpg',
                    takenAt: '2020-10-10'
                }
            }
        },
        source: 'aka',
        entityType: 'agumon'
    }

    expect(matchedRecord).toEqual(expectedRecord);
})