/* eslint-disable no-console */
import menash, { ConsumerMessage } from 'menashmq';
import * as fs from 'fs';
import basicMatch from './basicMatch';
import config from './config/index';
import { queueObject } from './types/queueObject';
import { matchedRecord as matchedRecordType } from './types/matchedRecord';
import { logObject } from './types/log';

const { rabbit } = config;

require('dotenv').config();

export const sendLog = async (level: string, message: string, system: string, service: string, extraFields?: any): Promise<void> => {
    const logToSend: logObject = {
        level,
        message,
        system,
        service,
    };

    if (extraFields) {
        logToSend.extraFields = extraFields;
    }

    await menash.send(rabbit.logQueue, logToSend);
};

export const initializeRabbit = async (): Promise<void> => {
    console.log('Trying connect to rabbit...');

    await menash.connect(rabbit.uri);
    await menash.declareQueue(rabbit.beforeMatch);
    await menash.declareQueue(rabbit.afterMatch);
    await menash.declareQueue(rabbit.logQueue);

    console.log('Rabbit connected');

    await menash.queue(rabbit.beforeMatch).activateConsumer(
        async (msg: ConsumerMessage) => {
            const obj: queueObject = msg.getContent() as queueObject;

            const matchedRecord: matchedRecordType = basicMatch(obj);

            const hasIdentifier: boolean = !!(matchedRecord.personalNumber || matchedRecord.identityCard || matchedRecord.goalUserId);

            if (!hasIdentifier) {
                sendLog('error', `No identifier/userID for user ${matchedRecord.userID}`, 'Karting', 'Basic match');
            } else {
                fs.appendFileSync('a.json', JSON.stringify({ record: matchedRecord, dataSource: matchedRecord.source, runUID: obj.runUID }));
                fs.appendFileSync('a.json', ',');
                await menash.send(rabbit.afterMatch, { record: matchedRecord, dataSource: matchedRecord.source, runUID: obj.runUID });
            }

            msg.ack();
        },
        { noAck: false },
    );
};
