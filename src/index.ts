import logger from 'logger-genesis';
import initializeLogger from './logger';
import fieldNames from './config/fieldNames';
import initializeRabbit from './rabbit';
import { scopeOption } from './types/log';

const { logFields } = fieldNames;

const main = async () => {
    await initializeRabbit();
    await initializeLogger();
};

main().catch((err: any) => logger.error(false, logFields.scopes.system as scopeOption, 'Unknown error', err.message));
