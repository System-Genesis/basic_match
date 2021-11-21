import logger from 'logger-genesis';
import envConfig from './config/index';

export default async () => {
    await logger.initialize(envConfig.systemName, envConfig.service, envConfig.rabbit.uri, envConfig.rabbit.logQueue, false);
};
