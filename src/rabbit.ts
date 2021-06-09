/* eslint-disable no-console */
import menash, { ConsumerMessage } from 'menashmq';
import basicMatch from './basicMatch';
import config from './config/index';
import { queueObject } from './types/queueObject';
import { matchedRecord as matchedRecordType } from './types/matchedRecord';
import { logObject } from './types/log';

const { rabbit } = config;

require('dotenv').config();

export const rabbitConect = async (): Promise<void> => {
    console.log('Trying connect to rabbit...');

    await menash.connect(rabbit.uri);
    await menash.declareQueue(rabbit.beforeMatch);
    await menash.declareQueue(rabbit.logQueue);
    // await menash.declareQueue(rabbit.afterMatch);

    console.log('Rabbit connected');

    await menash.queue(rabbit.beforeMatch).activateConsumer(
        async (msg: ConsumerMessage) => {
            const obj: queueObject = msg.getContent() as queueObject;

            // console.log(obj);

            const matchedRecord: matchedRecordType = basicMatch(obj);

            // console.log(matchedRecord);

            // await menash.send('afterMatch', { record: matchedRecord, dataSource: obj.dataSource });

            msg.ack();
        },
        { noAck: false },
    );
};

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
