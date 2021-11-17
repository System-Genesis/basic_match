import menash, { ConsumerMessage } from 'menashmq';
import { scopeOption } from './types/log';
import basicMatch from './basicMatch';
import config from './config/index';
import { queueObject } from './types/queueObject';
import { matchedRecord as matchedRecordType } from './types/matchedRecord';
import * as logger from './logger';
import fieldNames from './config/fieldNames';

const { logFields } = fieldNames;

const { rabbit } = config;

require('dotenv').config();

export default async (): Promise<void> => {
    logger.logInfo(false, 'Trying to connect to RabbitMQ...', logFields.scopes.system as scopeOption, 'Trying to connect to RabbitMQ...');

    await menash.connect(rabbit.uri, rabbit.retryOptions);
    await menash.declareQueue(rabbit.beforeMatch);
    await menash.declareQueue(rabbit.afterMatch);
    await menash.declareQueue(rabbit.logQueue);

    logger.logInfo(false, 'RabbitMQ connected', logFields.scopes.system as scopeOption, 'RabbitMQ connected');

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
                // TODO: check if local log
                logger.logError(true, 'Unknown error', logFields.scopes.system as scopeOption, err.message);
                msg.ack();
            }
        },
        { noAck: false },
    );
};
