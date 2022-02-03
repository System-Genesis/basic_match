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

/**
 * Connecting to Rabbit and declaring the queues
 */
export default async (): Promise<void> => {
    console.log('Trying to connect to RabbitMQ...');

    await menash.connect(rabbit.uri, rabbit.retryOptions);
    await menash.declareQueue(rabbit.beforeMatch, { durable: true });
    await menash.declareQueue(rabbit.afterMatch, { durable: true });

    console.log('RabbitMQ connected');
};

/**
 * Activate the flow of the record and sends the return value to the queue.
 */
export const initializeConsumer = async (): Promise<void> => {
    await menash.queue(rabbit.beforeMatch).activateConsumer(
        (msg: ConsumerMessage) => {
            const obj: queueObject = msg.getContent() as queueObject;
            try {
                const matchedRecord: matchedRecordType | null = basicMatch(obj);

                // Checks the record has an identifier
                if (matchedRecord && (matchedRecord.personalNumber || matchedRecord.identityCard || matchedRecord.goalUserId)) {
                    menash.send(
                        rabbit.afterMatch,
                        { record: matchedRecord, dataSource: matchedRecord.source, runUID: obj.runUID },
                        { persistent: true },
                    );
                    logger.info(
                        false,
                        logFields.scopes.app as scopeOption,
                        'Sending Record to Merger',
                        `Record with userID: ${matchedRecord.userID}, identifier: ${matchedRecord.personalNumber || matchedRecord.identityCard || matchedRecord.goalUserId
                        } from source: ${matchedRecord?.source} was send to Merger`,
                    );
                }
                msg.ack();
            } catch (err: any) {
                logger.error(false, logFields.scopes.system as scopeOption, 'Unknown error', err.message);
                msg.ack();
            }
        },
        { noAck: false },
    );
};
