/* eslint-disable no-console */
import menash, { ConsumerMessage } from 'menashmq';
// import * as fs from 'fs';
import basicMatch from './basicMatch';
import config from './config/index';
import { queueObject } from './types/queueObject';
import { matchedRecord as matchedRecordType } from './types/matchedRecord';
import sendLog from './logger';

const { rabbit } = config;

require('dotenv').config();

export default async (): Promise<void> => {
    console.log('Trying connect to rabbit...');

    await menash.connect(rabbit.uri);
    await menash.declareQueue(rabbit.beforeMatch);
    await menash.declareQueue(rabbit.afterMatch);
    await menash.declareQueue(rabbit.logQueue);

    console.log('Rabbit connected');

    await menash.queue(rabbit.beforeMatch).activateConsumer(
        async (msg: ConsumerMessage) => {
            const obj: queueObject = msg.getContent() as queueObject;
            try {
                const matchedRecord: matchedRecordType = basicMatch(obj);

                const hasIdentifier: boolean = !!(matchedRecord.personalNumber || matchedRecord.identityCard || matchedRecord.goalUserId);

                if (!matchedRecord) {
                    sendLog('error', `Didn't went trough Basic Match`, false);
                }
                if (!hasIdentifier) {
                    sendLog('error', `No identifier `, false, { user: `${matchedRecord.userID}` });
                } else {
                    await menash.send(rabbit.afterMatch, { record: matchedRecord, dataSource: matchedRecord.source, runUID: obj.runUID });
                }

                msg.ack();
            } catch (err) {
                sendLog('error', 'Unknown error', true);
                msg.ack();
            }
        },
        { noAck: false },
    );
};
