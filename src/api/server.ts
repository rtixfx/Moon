import express from 'express';
import { config } from '@/index';
import db from '@/utils/db';
import { createServer, deleteServer, getEggByNest, getEggs, getNodes, getUser } from '@/utils/pterodactyl';
import { Egg, Node, ResponseNode, Server, User } from '@/types/pterodactylStructure';
import { ReqWithUser } from './admin';
const app = express.Router();


app.use('/server', async (req: ReqWithUser, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.json({ success: false });
    const session = await db.query('SELECT * FROM sessions WHERE token = ?', [token]).then((res: any) => res[0]);
    if (!session) return res.json({ success: false });
    const user = await db.query('SELECT * FROM users WHERE id = ?', [session.user]).then((res: any) => res[0]);
    if (!user) return res.json({ success: false });
    const pterodactylUser: User = await getUser(user.pterodactyl, user.id).catch((e) => {
        return null as any;
    })
    if (pterodactylUser.attributes.root_admin === true && user.role !== 'root_admin') {
        user.role = 'root_admin';
        db.query('UPDATE users SET role = ? WHERE id = ?', ['root_admin', user.id]);
    }
    req.user = {
        ...user,
        attributes: pterodactylUser.attributes
    }
    next();
})

app.delete('/server/:id', async (req: ReqWithUser, res) => {
    if (!req?.user) return res.json({ success: false, error: 'Invalid user' });
    if (!req.params.id) return res.json({ success: false, error: 'Invalid server' });
    if (!req.user.attributes.relationships.servers.data.find((server: any) => server.attributes.uuid === req.params.id)) return res.json({ success: false, error: 'Invalid server' });
    const deleted = await deleteServer(req.user.attributes.relationships.servers.data.find((server: any) => server.attributes.uuid === req.params.id)?.attributes.id as any);
    if (!deleted) return res.json({ success: false, error: 'Error while deleting server' });
    await db.query('DELETE FROM servers WHERE id = ?', [req.params.id]).catch(() => {
        return null;
    });
    res.send({
        success: true
    })
});
app.post('/server', async (req: ReqWithUser, res) => {
    if (!req?.user) return res.json({ success: false, error: 'Invalid user' });
    var {
        name,
        cores,
        memory,
        disk,
        ports,
        databases,
        backups,
    } = req.body;
    var imageId = req.body.image;
    if (!cores || !memory || !disk || !ports || !databases || !backups || !imageId) return res.json({
        success: false,
        error: 'Missing fields'
    });
    cores = parseInt(cores) * 100;
    memory = parseInt(memory) * 1024;
    disk = parseInt(disk) * 1024;
    ports = parseInt(ports);
    databases = parseInt(databases);
    backups = parseInt(backups);
    console.log(req.body, cores, memory, disk, ports, databases, backups, imageId);
    const image = await db.query('SELECT * FROM images WHERE id = ?', [imageId]).then((res: any) => res[0]);
    if (!image) return res.json({
        success: false,
        error: 'Invalid image'
    });
    if (
        cores === 0 ||
        memory === 0 ||
        disk === 0
    ) return res.json({
        success: false,
        error: 'Invalid limits'
    });
    if (
        (image.cpu === -1 ? false : cores > image.cpu) ||
        (image.ram === -1 ? false : memory > image.ram) ||
        (image.disk === -1 ? false : disk > image.disk) ||
        (image.ports === -1 ? false : ports > image.ports) ||
        (image.databases === -1 ? false : databases > image.databases) ||
        (image.backups === -1 ? false : backups > image.backups)
    ) return res.json({
        success: false,
        error: 'Image limits exceeded'
    });
    const userAloc = {
        cpu: req.user.attributes.relationships.servers.data.reduce((acc: number, server: any) => acc + server.attributes.limits.cpu, 0),
        ram: req.user.attributes.relationships.servers.data.reduce((acc: number, server: any) => acc + server.attributes.limits.memory, 0),
        disk: req.user.attributes.relationships.servers.data.reduce((acc: number, server: any) => acc + server.attributes.limits.disk, 0),
        ports: req.user.attributes.relationships.servers.data.reduce((acc: number, server: any) => acc + server.attributes.allocations, 0),
        databases: req.user.attributes.relationships.servers.data.reduce((acc: number, server: any) => acc + server.attributes.feature_limits.databases, 0),
        backups: req.user.attributes.relationships.servers.data.reduce((acc: number, server: any) => acc + server.attributes.feature_limits.backups, 0),
    }
    if (
        (req.user.cpu === -1 ? false : cores + userAloc.cpu > req.user.cpu) ||
        (req.user.ram === -1 ? false : memory + userAloc.ram > req.user.ram) ||
        (req.user.disk === -1 ? false : disk + userAloc.disk > req.user.disk) ||
        (req.user.ports === -1 ? false : ports + userAloc.ports > req.user.ports) ||
        (req.user.databases === -1 ? false : databases + userAloc.databases > req.user.databases) ||
        (req.user.backups === -1 ? false : backups + userAloc.backups > req.user.backups)
    ) return res.json({
        success: false, error: 'User limits exceeded '
    });
    const cost = config.api.client.renew.deploy + (config.api.client.renew.deployAdditionalCost.cpu * cores) + (config.api.client.renew.deployAdditionalCost.ram * memory) + (config.api.client.renew.deployAdditionalCost.disk * disk) + (config.api.client.renew.deployAdditionalCost.ports * ports) + (config.api.client.renew.deployAdditionalCost.databases * databases) + (config.api.client.renew.deployAdditionalCost.backups * backups);
    if (req.user.coins < cost) return res.json({ success: false, error: 'Insufficient funds' });
    req.user.coins -= cost;
    const egg = await getEggByNest(image.nestId, image.imageId);
    if (!egg) return res.json({ success: false, error: 'Egg not found' });
    if (!name) name = 'Change me! (Settings -> SERVER NAME)';
    const avaibleNodes = await db.query('SELECT * FROM nodes WHERE plan = ? ORDER BY sort ASC', [req?.user?.plan]);
    const ServerNodes = await getNodes().then((res: ResponseNode) => res.data.filter((node: Node) => node.attributes.relationships.servers.data.length < avaibleNodes.find((n: any) => n.id === node.attributes.id)?.slots || avaibleNodes.find((n: any) => n.id === node.attributes.id)?.slots === -1)).catch((e) => {
        console.log(e);
        return [];
    });
    if (ServerNodes.length === 0) return res.json({ success: false, error: 'No available nodes' });
    const server = await createServer(name, req.user.pterodactyl, ServerNodes[0].attributes.id, {
        limits: {
            memory: memory,
            swap: 0,
            disk: disk,
            io: 500,
            cpu: cores
        },
        environment: {
            ...egg.attributes.relationships.variables.data.reduce((acc: any, variable: any) => {
                acc[variable.attributes.env_variable] = variable.attributes.default_value;
                return acc;
            }, {}),
        },
        feature_limits: {
            databases: databases,
            allocations: ports,
            backups: backups
        },
        egg: egg.attributes.id,
        docker_image: image.docker_image,
        startup: image.startup,
    }).catch((e) => {
        res.json({ success: false, error: e });
        return "Jack";
    })
    if (!server) return res.json({ success: false, error: 'Error while creating server' });
    if (server === "Jack") return;
    await db.query('INSERT INTO servers (id, renew) VALUES (?, ?)', [server.attributes.id, new Date(new Date().getTime() + config.api.client.renew.deployTime * 60 * 60 * 1000)])
    res.json({ success: true });
});
export default app;