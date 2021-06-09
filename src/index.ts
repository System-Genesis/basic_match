/* eslint-disable no-console */
import { rabbitConect } from './rabbit';

const main = async () => {
    await rabbitConect();
};

main().catch((err) => console.error(err));
