/* eslint-disable no-console */
import connectRabbit from './utils/rabbit';

const main = async () => {
    await connectRabbit();
};

main().catch((err) => console.error(err));
