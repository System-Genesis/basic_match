import menash, { ConsumerMessage } from 'menashmq';
import basicMatch from './basicMatch';
import config from './config/index';
import { queueObject } from './types/queueObject';
import { matchedRecord as matchedRecordType } from './types/matchedRecord';
import sendLog from './logger';

const { rabbit } = config;

require('dotenv').config();

export default async (): Promise<void> => {
    sendLog('info', 'Trying connect to rabbit...', true);

    await menash.connect(rabbit.uri);
    await menash.declareQueue(rabbit.beforeMatch);
    await menash.declareQueue(rabbit.afterMatch);
    await menash.declareQueue(rabbit.logQueue);

    sendLog('info', 'Rabbit connected', true);

    await menash.queue(rabbit.beforeMatch).activateConsumer(
        (msg: ConsumerMessage) => {
            const obj: queueObject = msg.getContent() as queueObject;
            // eslint-disable-next-line no-console
            console.log(obj);
            try {
                const matchedRecord: matchedRecordType | null = basicMatch(obj);

                if (!matchedRecord) {
                    sendLog('error', `Didn't went trough Basic Match`, false);
                } else {
                    // eslint-disable-next-line no-console
                    console.log(matchedRecord);
                    const hasIdentifier: boolean = !!(matchedRecord.personalNumber || matchedRecord.identityCard || matchedRecord.goalUserId);

                    if (!hasIdentifier) {
                        sendLog('warn', `No identifier `, false, { user: `${matchedRecord.userID}` });
                    } else {
                        const identifier = matchedRecord.personalNumber || matchedRecord.identityCard || matchedRecord.goalUserId;
                        menash.send(rabbit.afterMatch, { record: matchedRecord, dataSource: matchedRecord.source, runUID: obj.runUID });
                        sendLog(
                            'info',
                            `Record ${matchedRecord.userID ? `with userID ${matchedRecord.userID}` : ''}, ${identifier ? `with identifier ${identifier}` : ''
                            } sent to merger service`,
                            false,
                        );
                    }
                }
                msg.ack();
            } catch (err) {
                sendLog('error', 'UNKNOWN_ERROR', true, { msg: err });
                msg.ack();
            }
        },
        { noAck: false },
    );
};
