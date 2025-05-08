import { envs } from '@configs';
import { createServer } from './Server';

const PORT = 8812;

// DO NOT modify, it is used to resolve port mapping when deploy.
const HOST = envs.isDev ? 'localhost' : '0.0.0.0';

const app = createServer({
    host: HOST,
    port: PORT
});

app.start();
