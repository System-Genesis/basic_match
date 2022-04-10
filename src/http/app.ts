import http from 'http';
import config from '../config';
import checkConnections from './checkConnections';

const { port } = config;

function responseHandler(res: http.ServerResponse, status: number, message: string) {
    res.writeHead(status, { 'Content-Type': 'text/html' });
    res.write(message);
    res.end();
}

const initializeHttp = () => {
    http.createServer((req, res) => {
        if (req.url === '/isAlive') {
            if (checkConnections()) {
                responseHandler(res, 200, 'OK');
            } else {
                responseHandler(res, 200, 'Not OK');
            }
        } else {
            responseHandler(res, 404, 'Invalid Route');
        }
    }).listen(port);

    // eslint-disable-next-line no-console
    console.log(`Listening on port ${port}`);
};

export default initializeHttp;
