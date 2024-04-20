import express from 'express';
import { config } from '@/index';
import db from '@/utils/db';
const app = express.Router();

app.delete('/server/:id', async (req: express.Request, res: express.Response) => {
    res.send({
        success: true
    })
});

export default app;