import logger from 'logger-genesis';
import initializeLogger from './logger';
import fieldNames from './config/fieldNames';
import initializeRabbit, { initializeConsumer } from './rabbit';
import { scopeOption } from './types/log';

const { logFields } = fieldNames;

/**
 * The main function.
 * Calls all the initializations
 */
const main = async (): Promise<void> => {
    await initializeRabbit();
    await initializeLogger();
    await initializeConsumer();
};

main().catch((err: any) => logger.error(false, logFields.scopes.system as scopeOption, 'Unknown error', err.message));
