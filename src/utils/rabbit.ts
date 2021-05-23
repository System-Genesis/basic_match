import menash, { ConsumerMessage } from 'menashmq';
import basicMatch from '../utils/matchFiles/basicMatch'
import config from '../config/index';

const { rabbit }  = config;


require("dotenv").config();

export default async () => {
    console.log("Trying connect to rabbit...");

    await menash.connect(rabbit.uri);
    await menash.declareQueue(rabbit.beforeMatch);
    await menash.declareQueue(rabbit.afterMatch);

    console.log("Rabbit connected");

    await menash.queue('beforeMatch').activateConsumer(async (msg: ConsumerMessage) => {
        let obj: any = JSON.parse(msg.getContent());

        let matchedRecord = basicMatch(obj);

        await menash.send('afterMatch', { record: matchedRecord, dataSource: obj.dataSource});
    
        msg.ack();
    }, { noAck: false });
}
