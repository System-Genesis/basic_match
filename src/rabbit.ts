/* eslint-disable no-console */
import menash, { ConsumerMessage } from 'menashmq';
import basicMatch from './basicMatch';
import config from './config/index';
import { queueObject } from './types/queueObject';

const { rabbit } = config;

require('dotenv').config();

export default async () => {
    console.log('Trying connect to rabbit...');

    await menash.connect(rabbit.uri);
    await menash.declareQueue(rabbit.beforeMatch);
    // await menash.declareQueue(rabbit.afterMatch);

    console.log('Rabbit connected');

    await menash.queue(rabbit.beforeMatch).activateConsumer(
        async (msg: ConsumerMessage) => {
            const obj: queueObject = msg.getContent() as queueObject;

            console.log(obj);

            const matchedRecord: any = basicMatch(obj);

            console.log(matchedRecord);

            // await menash.send('afterMatch', { record: matchedRecord, dataSource: obj.dataSource });

            msg.ack();
        },
        { noAck: false },
    );
};
