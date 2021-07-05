import { menash } from 'menashmq';
import * as winston from 'winston';
import envConfig from './config/index';
import { logObject } from './types/log';

const { rabbit } = envConfig;

const { config, format } = winston;

const logger = winston.createLogger({
    levels: config.npm.levels,

    format: format.combine(
        format.colorize(),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.splat(),
        format.simple(),
    ),
    transports: [new winston.transports.Console()],
});

export default (level: string, message: string, localLog: boolean, extraFields?: any): void => {
    const logToSend: logObject = {
        level,
        message,
        system: 'Traking',
        service: 'Basic Match',
    };

    if (extraFields) {
        logToSend.extraFields = extraFields;
    }

    if (!localLog) {
        menash.send(rabbit.logQueue, logToSend);
    }

    logger[level](`${message} ${!extraFields ? '' : JSON.stringify(extraFields)}`);
};
