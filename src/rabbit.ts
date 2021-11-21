/* eslint-disable no-console */
import menash, { ConsumerMessage } from 'menashmq';
import logger from 'logger-genesis';
import { scopeOption } from './types/log';
import basicMatch from './basicMatch';
import config from './config/index';
import { queueObject } from './types/queueObject';
import { matchedRecord as matchedRecordType } from './types/matchedRecord';
import fieldNames from './config/fieldNames';

const { logFields } = fieldNames;

const { rabbit } = config;

require('dotenv').config();

export default async (): Promise<void> => {
    console.log('Trying to connect to RabbitMQ...');

    await menash.connect(rabbit.uri, rabbit.retryOptions);
    await menash.declareQueue(rabbit.beforeMatch);
    await menash.declareQueue(rabbit.afterMatch);
    await menash.declareQueue(rabbit.logQueue);

    console.log('RabbitMQ connected');

    await menash.queue(rabbit.beforeMatch).activateConsumer(
        (msg: ConsumerMessage) => {
            const obj: queueObject = msg.getContent() as queueObject;
            try {
                const matchedRecord: matchedRecordType | null = basicMatch(obj);

                if (matchedRecord && (matchedRecord.personalNumber || matchedRecord.identityCard || matchedRecord.goalUserId)) {
                    menash.send(rabbit.afterMatch, { record: matchedRecord, dataSource: matchedRecord.source, runUID: obj.runUID });
                }
                msg.ack();
            } catch (err: any) {
                logger.logError(false, 'Unknown error', logFields.scopes.system as scopeOption, err.message);
                msg.ack();
            }
        },
        { noAck: false },
    );
};
