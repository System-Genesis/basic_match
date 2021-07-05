import sendLog from './logger';

import initializeRabbit from './rabbit';

const main = async () => {
    await initializeRabbit();
};

main().catch((err) => sendLog('ERROR', err, true));
