import logger from 'logger-genesis';
import envConfig from './config/index';

/**
 * Initializing the logger
 */
export default async (): Promise<void> => {
    await logger.initialize(envConfig.systemName, envConfig.service, envConfig.rabbit.logQueue, false);
};
