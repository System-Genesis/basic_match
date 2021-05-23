/* eslint-disable no-console */
import Server from './express/server';
import config from './config';

const { mongo, rabbit, service } = config;

const main = async () => {

    await connectRabbit();

    const server = new Server(service.port);

    await server.start();

    console.log(`Server started on port: ${service.port}`);
};

main().catch((err) => console.error(err));
