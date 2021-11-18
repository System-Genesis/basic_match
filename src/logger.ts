import { menash } from 'menashmq';
import * as winston from 'winston';
import envConfig from './config/index';
import { logObject, scopeOption, levelOptions } from './types/log';
import fieldNames from './config/fieldNames';

const { logFields } = fieldNames;

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

const sendLog = (level: levelOptions, title: string, scope: scopeOption, message: string, extraFields: any) => {
    const logToSend: logObject = {
        level,
        title,
        scope,
        system: logFields.system,
        service: logFields.service,
        message,
        '@timeStamp': Date.now(),
        ...extraFields,
    };

    menash.send(rabbit.logQueue, logToSend);
};

export const logInfo = (local: boolean, title: string, scope: scopeOption, message: string, extraFields?: any) => {
    if (!local) sendLog(logFields.levels.info as levelOptions, title, scope, message, extraFields);
    logger[logFields.levels.info](`${title} => ${message}`);
};

export const logWarn = (local: boolean, title: string, scope: scopeOption, message: string, extraFields?: any) => {
    if (!local) sendLog(logFields.levels.warn as levelOptions, title, scope, message, extraFields);
    logger[logFields.levels.warn](`${title} => ${message}`);
};

export const logError = (local: boolean, title: string, scope: scopeOption, message: string, extraFields?: any) => {
    if (!local) sendLog(logFields.levels.error as levelOptions, title, scope, message, extraFields);
    logger[logFields.levels.error](`${title} => ${message}`);
};
