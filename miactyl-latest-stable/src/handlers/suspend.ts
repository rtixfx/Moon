import cron from 'node-cron';
import { config } from '@/index';
import db from '@/utils/db';
import { deleteServer, suspendServer } from '@/utils/pterodactyl';


const job = cron.schedule('* * * * *', async () => {
    const servers = await db.query('SELECT * FROM servers WHERE renew < ?', [new Date()]);
    servers.forEach(async (server: any) => {
        if (server.suspended) {
            if ((new Date(server.renew).getTime() + config.api.client.renew.maxTimeAlive * 60 * 60 * 1000) < (new Date().getTime() + config.api.client.renew.maxTimeAlive)) {
                console.log('Deleting server', server.id, (new Date(server.renew).getTime() + config.api.client.renew.maxTimeAlive * 60 * 60 * 1000) < new Date().getTime(), (new Date(server.renew).getTime() + config.api.client.renew.maxTimeAlive * 60 * 60 * 1000), new Date().getTime())
                await deleteServer(server.id);
                await db.query('DELETE FROM servers WHERE id = ?', [server.id]);
                return;
            }
            return;
        }
        if (server.suspended) return;
        await suspendServer(server.id)
        await db.query('UPDATE servers SET suspended = 1 WHERE id = ?', [server.id]);
    });
})
job.start();
setInterval(() => {
    job.now();
}, 1000)
