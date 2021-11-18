import * as logger from './logger';
import fieldNames from './config/fieldNames';

import initializeRabbit from './rabbit';
import { scopeOption } from './types/log';

const { logFields } = fieldNames;

const main = async () => {
    await initializeRabbit();
};

main().catch((err: any) => logger.logError(false, 'Unknown error', logFields.scopes.system as scopeOption, err.message));
