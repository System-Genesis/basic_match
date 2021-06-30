import basicMatch from '../src/basicMatch';
import { matchedRecord as matchedRecordType } from '../src/types/matchedRecord';
import fieldNames from '../src/config/fieldNames';

// Mock the send log function: in test don't send logs
jest.mock('../src/logger', () => {
    return {
        default: jest.fn(),
    };
});

describe('Test hierarchy', () => {
    test('Test local hierarchy', () => {
        const record: any = {
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

        const matchedRecord: matchedRecordType | null = basicMatch({ record, dataSource: fieldNames.sources.city, runUID: '123' });
        const expectedHierarchy = 'wallmart/dolores/animi/cum/ullam';
        expect(matchedRecord!.hierarchy).toEqual(expectedHierarchy);
    });

    test('Test external hierarchy', () => {
        const record = {
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
            profession: 'unknown',
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

        const matchedRecord: matchedRecordType | null = basicMatch({ record, dataSource: fieldNames.sources.city, runUID: '123' });
        const expectedHierarchy = 'city_name/bladerunners/quas/et/recusandae/eos';
        expect(matchedRecord!.hierarchy).toEqual(expectedHierarchy);
    });

    test('Test external hierarchy with fullName', () => {
        const record = {
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
            profession: 'unknown',
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

        const matchedRecord: matchedRecordType | null = basicMatch({ record, dataSource: fieldNames.sources.city, runUID: '123' });
        const expectedHierarchy = 'city_name/bladerunners/quas/et/recusandae/eos';
        expect(matchedRecord!.hierarchy).toEqual(expectedHierarchy);
    });
});

describe('Test Persons', () => {
    test('City and mir domains', () => {
        const record: any = {
            domUser: 'e316853081@rafael.turtle.com',
            telephone: '0502701436',
            clearance: 3,
            firstName: 'Angel',
            lastName: 'Ward',
            mail: null,
            tz: null,
            personalNumber: '10191758',
            rank: 'mega',
            rld: '2021-04-13T21:01:14.151Z',
            job: 'Regional Optimization Associate',
            profession: 'null',
            department: 'city4',
            stype: '',
            hr: 'wallmart/fugit/nulla',
            company: 'interstellar',
            isPortalUser: false,
            domains: ['local', 'external'],
        };

        const matchedRecord: matchedRecordType | null = basicMatch({ record, dataSource: fieldNames.sources.city, runUID: '123' });

        const expectedRecord: matchedRecordType = {
            entityType: 'agumon',
            userID: 'e316853081@rafael.turtle.com',
            mobilePhone: '0502701436',
            clearance: '3',
            firstName: 'Angel',
            lastName: 'Ward',
            personalNumber: '10191758',
            dischargeDay: '2021-04-14T00:01:14.151Z',
            job: 'Regional Optimization Associate',
            hierarchy: 'wallmart/fugit/nulla',
            source: 'city_name',
        };

        expect(matchedRecord).toEqual(expectedRecord);
    });

    test('Only mir domain', () => {
        const record = {
            domUser: 'g377183994@turtle.com',
            telephone: '0514732022',
            clearance: 4,
            firstName: 'Arnulfo',
            lastName: 'Price',
            mail: 'Valentin_Osinski@turtleS.com',
            tz: '5832482',
            personalNumber: 'unknown',
            rank: 'mega',
            rld: '',
            job: 'Product Division Administrator',
            profession: 'unknown',
            department: 'city5',
            stype: '',
            hr: 'wallmart/perspiciatis/voluptates/reprehenderit/ut',
            company: 'bladerunners',
            isPortalUser: true,
            domains: [],
        };

        const matchedRecord: matchedRecordType | null = basicMatch({ record, dataSource: fieldNames.sources.city, runUID: '123' });

        const expectedRecord: matchedRecordType = {
            entityType: 'digimon',
            userID: 'g377183994@turtle.com',
            mobilePhone: '0514732022',
            clearance: '4',
            firstName: 'Arnulfo',
            lastName: 'Price',
            mail: 'Valentin_Osinski@turtleS.com',
            job: 'Product Division Administrator',
            hierarchy: 'wallmart/perspiciatis/voluptates/reprehenderit/ut',
            source: 'mir_name',
        };

        expect(matchedRecord).toEqual(expectedRecord);
    });

    test('Only city domain', () => {
        const record: any = {
            domUser: 'e806932429@turtle.com',
            telephone: '0532033180',
            clearance: 5,
            firstName: 'Lonny',
            lastName: 'Hagenes',
            mail: 'Neil97@turtleS.com',
            tz: '123456782',
            personalNumber: '1536984',
            rank: 'unknown',
            rld: '',
            job: 'Legacy Mobility Architect',
            profession: 'unknown',
            department: 'city3',
            stype: '',
            hr: 'voluptas/minus/cupiditate/qui',
            company: 'bladerunners',
            isPortalUser: true,
            domains: ['external'],
        };

        const matchedRecord: matchedRecordType | null = basicMatch({ record, dataSource: fieldNames.sources.city, runUID: '123' });

        const expectedRecord: matchedRecordType = {
            entityType: 'agumon',
            userID: 'e806932429@turtle.com',
            mobilePhone: '0532033180',
            clearance: '5',
            firstName: 'Lonny',
            lastName: 'Hagenes',
            personalNumber: '1536984',
            identityCard: '123456782',
            mail: 'Neil97@turtleS.com',
            job: 'Legacy Mobility Architect',
            hierarchy: 'city_name/bladerunners/voluptas/minus/cupiditate/qui',
            source: 'city_name',
        };

        expect(matchedRecord).toEqual(expectedRecord);
    });
});

describe('Test Goal Users', () => {
    test('External Goal User', () => {
        const record: any = {
            domUser: 'm378263366@donatelo.turtle.com',
            telephone: '0598827384',
            firstName: 'Fredy',
            lastName: 'Rath',
            mail: 'Eda_Brown@turtleS.com',
            job: 'International Directives Planner',
            profession: 'unknown',
            stype: '',
            hr: '',
            company: '',
            isPortalUser: true,
            tags: [],
            domains: ['external'],
        };

        const matchedRecord: matchedRecordType | null = basicMatch({ record, dataSource: fieldNames.sources.city, runUID: '123' });

        const expectedRecord: matchedRecordType = {
            entityType: 'tamar',
            goalUserId: 'm378263366@donatelo.turtle.com',
            userID: 'm378263366@donatelo.turtle.com',
            mobilePhone: '0598827384',
            firstName: 'Fredy',
            lastName: 'Rath',
            mail: 'Eda_Brown@turtleS.com',
            job: 'International Directives Planner',
            source: 'city_name',
        };

        expect(matchedRecord).toEqual(expectedRecord);
    });

    test('Ads Goal User', () => {
        const record: any = {
            domUser: 'mads324025207@turtle.com',
            telephone: '0579103082',
            firstName: 'Jed',
            lastName: 'Stoltenberg',
            mail: '',
            job: 'Principal Research Facilitator',
            profession: 'Associate',
            stype: '',
            hr: 'wallmart/praesentium/deleniti',
            company: '',
            isPortalUser: false,
            tags: [],
            domains: ['local'],
        };

        const matchedRecord: matchedRecordType | null = basicMatch({ record, dataSource: fieldNames.sources.city, runUID: '123' });

        const expectedRecord: matchedRecordType = {
            entityType: 'tamar',
            goalUserId: '324025207@rabiran.com',
            userID: 'mads324025207@turtle.com',
            mobilePhone: '0579103082',
            firstName: 'Jed',
            lastName: 'Stoltenberg',
            job: 'Principal Research Facilitator',
            hierarchy: 'wallmart/praesentium/deleniti',
            source: 'mir_name',
        };

        expect(matchedRecord).toEqual(expectedRecord);
    });

    test('adNN Goal User', () => {
        const record: any = {
            domUser: 'madNN437496371@turtle.com',
            telephone: '0599798640',
            firstName: 'Cornell',
            lastName: 'Simonis',
            mail: '',
            job: 'Customer Branding Coordinator',
            profession: '',
            stype: '',
            hr: 'wallmart/ipsum/quaerat',
            company: 'interstellar',
            isPortalUser: true,
            tags: [],
            domains: ['local'],
        };

        const matchedRecord: matchedRecordType | null = basicMatch({ record, dataSource: fieldNames.sources.city, runUID: '123' });

        const expectedRecord: matchedRecordType = {
            entityType: 'tamar',
            goalUserId: '437496371@adnn.com',
            userID: 'madNN437496371@turtle.com',
            mobilePhone: '0599798640',
            firstName: 'Cornell',
            lastName: 'Simonis',
            job: 'Customer Branding Coordinator',
            hierarchy: 'wallmart/ipsum/quaerat',
            source: 'mir_name',
        };

        expect(matchedRecord).toEqual(expectedRecord);
    });
});
