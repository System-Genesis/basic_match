/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
import fieldNames from '../../config/fieldNames';
import * as basicFunctions from './basicFuncs';

const fn = fieldNames[fieldNames.dataSources.aka];

const aka = {
    serviceType: 'nstype',
    firstName: 'firstName',
    lastName: 'lastName',
    identityCard: 'tz',
    personalNumber: 'mi',
    rank: 'rnk',
    phone: 'telephone',
    areaCode: 'ktelephone',
    mobilePhone: 'telephone',
    areaCodeMobile: 'ktelephone',
    dischargeDay: 'rld',
    clearance: 'clearance',
    unitName: 'hr',
    telephoneType: 'telephoneType',
    uniqeFieldForDeepDiff: 'mi',
    birthDate: 'birthday',
    sex: 'sex',
    picture: 'picture',
};

const funcMap = new Map([
    [fn.firstName, basicFunctions.setFirstName],
    [fn.lastName, basicFunctions.setLastName],
    [fn.rank, basicFunctions.setRank],
    [fn.clearance, basicFunctions.setClearance],
    [fn.sex, basicFunctions.setSex],
    [fn.personalNumber, basicFunctions.setPersonalNumber],
    [fn.identityCard, basicFunctions.setIdentityCard],
    [fn.dischargeDay, basicFunctions.setDischargeDay],
]);

export default (record: any, runUID: string) => {
    const keys: string[] = Object.keys(record);
    const matchedRecord: any = {};

    return matchedRecord;
};
