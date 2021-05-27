/* eslint-disable no-console */
import menash, { ConsumerMessage } from 'menashmq';
import basicMatch from './matchFiles/basicMatch';
import config from '../config/index';

const { rabbit } = config;

require('dotenv').config();

interface queueObject {
    record: any;
    dataSource: string;
    runUID: string;
}

export default async () => {
    console.log('Trying connect to rabbit...');

    await menash.connect(rabbit.uri);
    await menash.declareQueue(rabbit.beforeMatch);
    await menash.declareQueue(rabbit.afterMatch);

    console.log('Rabbit connected');

    await menash.queue('beforeMatch').activateConsumer(
        async (msg: ConsumerMessage) => {
            const obj: queueObject = msg.getContent() as queueObject;

            const matchedRecord: any = basicMatch(obj);

            await menash.send('afterMatch', { record: matchedRecord, dataSource: obj.dataSource });

            msg.ack();
        },
        { noAck: false },
    );
};
