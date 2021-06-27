import { menash } from 'menashmq';
// import * as path from 'path';
import * as winston from 'winston';
import envConfig from './config/index';
import { logObject } from './types/log';

const { rabbit } = envConfig;

const { config, format } = winston;

// const date = () => new Date(Date.now()).toLocaleDateString();

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

export default async (level: string, message: string, localLog: boolean, extraFields?: any): Promise<void> => {
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
        await menash.send(rabbit.logQueue, logToSend);
    }

    logger[level](`${message} ${!extraFields ? '' : JSON.stringify(extraFields)}`);
};
