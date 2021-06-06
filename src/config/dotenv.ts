/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import * as dotenv from 'dotenv';
import * as fs from 'fs';

const dotenvPath = process.env.LOAD_DEV_DOTENV ? '.env.dev' : '.env';

dotenv.config({ path: dotenvPath });
if (process.env.LOAD_DEV_DOTENV === 'true') {
    const envConfig = dotenv.parse(fs.readFileSync('.env.dev'));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}
