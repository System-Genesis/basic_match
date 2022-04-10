import menash from 'menashmq';
import logger from 'logger-genesis';

export default () => {
    return menash.isReady && logger.isConnected();
};
