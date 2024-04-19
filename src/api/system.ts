import express from 'express';
import { config } from '@/index';
import db from '@/utils/db';
const app = express.Router();

app.get('/system', async (req: express.Request, res: express.Response) => {
    res.json({
        name: config.name,
        logo: config.logo,
        prefix: config.prefix
    })
});

export default app;