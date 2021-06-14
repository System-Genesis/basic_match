/* eslint-disable no-console */
import { initializeRabbit } from './rabbit';

const main = async () => {
    await initializeRabbit();
};

main().catch((err) => console.error(err));
