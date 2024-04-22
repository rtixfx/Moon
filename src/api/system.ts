import express from 'express';
import { config, shared } from '@/index';
import db from '@/utils/db';
const app = express.Router();

app.get('/system', async (req: express.Request, res: express.Response) => {
    const nodes = await db.query('SELECT id,name,plan,sort FROM nodes');
    const images = await db.query('SELECT id,name,sort FROM images');
    res.json({
        name: config.name,
        logo: config.logo,
        nodes: nodes,
        images: images,
        deployCost: config.api.client.renew.deploy,
        deployCostAddition: config.api.client.renew.deployAdditionalCost,
        update: shared.update,
        version: shared.version,
        panel: config.pterodactyl.domain
    })
});

export default app;