/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
import fieldNames from '../../config/fieldNames';
import * as basicFunctions from './basicFuncs';

const fn = fieldNames[fieldNames.dataSources.aka];

const funcMap = new Map([
    [fn.firstName, basicFunctions.setFirstName],
    [fn.lastName, basicFunctions.setLastName],
    [fn.rank, basicFunctions.setRank],
    [fn.clearance, basicFunctions.setClearance],
    [fn.sex, basicFunctions.setSex],
    [fn.personalNumber, basicFunctions.setPersonalNumber],
    [fn.identityCard, basicFunctions.setIdentityCard],
    [fn.dischargeDay, basicFunctions.setDischargeDay],
    [fn.unitName, basicFunctions.setAkaUnit],
    [fn.serviceType, basicFunctions.setServiceType],
    [fn.mobilePhone, basicFunctions.setMobilePhone],
    [fn.phone, basicFunctions.setPhone],
    [fn.birthDate, basicFunctions.setBirthdate],
]);

export default (record: any, runUID: string) => {
    const keys: string[] = Object.keys(record);
    const matchedRecord: any = {};

    keys.map((key: string) => {
        if (funcMap.has(key)) {
            funcMap.get(key)(matchedRecord, record[key]);
        }
    });

    return matchedRecord;
};
