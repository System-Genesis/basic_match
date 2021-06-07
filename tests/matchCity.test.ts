/* eslint-disable no-console */
import matchCity from '../src/matchFiles/matchCity';
import { matchedRecord as matchedRecordType } from '../src/types/matchedRecord';

describe('Match City unit testings', () => {
    test('Test local hierarchy', async () => {
        const user: any = {
            domUser: 'g172007621@turtle.com',
            telephone: '0534215028',
            clearance: 5,
            firstName: 'Carlos',
            lastName: 'Schoen',
            mail: '',
            tz: '6957032',
            personalNumber: '92783746',
            rank: 'ultimate',
            rld: '2020-02-20T20:21:08.635Z',
            job: 'Lead Implementation Analyst',
            profession: 'null',
            department: 'city5',
            stype: '',
            hr: 'wallmart/dolores/animi/cum/ullam',
            company: 'odyssey',
            isPortalUser: false,
            tags: [
                {
                    name: 'transportable',
                },
            ],
            domains: ['external', 'local'],
        };

        const matchedRecord: matchedRecordType = matchCity(user, '123');
        expect(matchedRecord.hierarchy).toEqual('wallmart/dolores/animi/cum/ullam');
    });

    test('Test external hierarchy', async () => {
        const user = {
            domUser: 'e702048317@turtle.com',
            telephone: '0502335236',
            clearance: 4,
            firstName: 'Bud',
            lastName: 'Gulgowski',
            mail: null,
            tz: null,
            personalNumber: '',
            rank: 'champion',
            rld: '',
            job: 'Regional Group Planner',
            profession: 'לא ידוע',
            department: 'city6',
            stype: '',
            hr: 'quas/et/recusandae/eos',
            company: 'bladerunners',
            isPortalUser: false,
            tags: [
                {
                    name: 'transportable',
                },
            ],
            domains: ['external'],
        };

        const matchedRecord: matchedRecordType = matchCity(user, '123');
        expect(matchedRecord.hierarchy).toEqual('city_name/bladerunners/quas/et/recusandae/eos');
    });

    test('Test external hierarchy with fullName', async () => {
        const user = {
            domUser: 'e702048317@turtle.com',
            telephone: '0502335236',
            clearance: 4,
            firstName: 'Bud',
            lastName: 'Gulgowski',
            mail: null,
            tz: null,
            personalNumber: '',
            rank: 'champion',
            rld: '',
            job: 'Regional Group Planner',
            profession: 'לא ידוע',
            department: 'city6',
            stype: '',
            hr: 'quas/et/recusandae/eos/Bud Gulgowski',
            company: 'bladerunners',
            isPortalUser: false,
            tags: [
                {
                    name: 'transportable',
                },
            ],
            domains: ['external'],
        };

        const matchedRecord: matchedRecordType = matchCity(user, '123');
        expect(matchedRecord.hierarchy).toEqual('city_name/bladerunners/quas/et/recusandae/eos');
    });
});
