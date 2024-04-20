import express from 'express';
import { config } from '@/index';
import db from '@/utils/db';
const app = express.Router();

app.get('/admin/images', async (req: express.Request, res: express.Response) => {
    const images = await db.query('SELECT id,name,sort FROM images');
    res.send({
        data: images
    })
})

export default app;