import * as logger from './logger';
import fieldNames from './config/fieldNames';

import initializeRabbit from './rabbit';
import { scopeOption } from './types/log';

const { logFields } = fieldNames;

const main = async () => {
    await initializeRabbit();
};

// TODO: check if local log
main().catch((err: any) => logger.logError(true, 'Unknown error', logFields.scopes.system as scopeOption, err.message));
