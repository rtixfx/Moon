import cron from 'node-cron';
import { config } from '@/index';
import db from '@/utils/db';
import { deleteServer, suspendServer } from '@/utils/pterodactyl';


const job = cron.schedule('* * * * *', async () => {
    const servers = await db.query('SELECT * FROM servers WHERE renew < ?', [new Date()]);
    servers.forEach(async (server: any) => {
        if (server.suspended) {
            if (new Date(server.renew).getTime() < (new Date().getTime() + config.api.client.renew.maxTimeAlive * 60 * 60 * 1000)) {
                console.log('Deleting server', server.id, new Date(server.renew).getTime() < (new Date().getTime() + config.api.client.renew.maxTimeAlive * 60 * 60 * 1000), new Date(server.renew).getTime(), (new Date().getTime() + config.api.client.renew.maxTimeAlive * 60 * 60 * 1000))
                // await deleteServer(server.id);
                await db.query('DELETE FROM servers WHERE id = ?', [server.id]);
                return;
            }
            return;
        }
        console.log('Suspending server', server.id);
        await suspendServer(server.id)
        await db.query('UPDATE servers SET suspended = 1 WHERE id = ?', [server.id]);
    });
})
job.start();
setInterval(() => {
    job.now();
}, 1000)
