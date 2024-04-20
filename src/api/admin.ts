import express from 'express';
import { config } from '@/index';
import db from '@/utils/db';
import { Egg, User } from '@/types/pterodactylStructure';
import { getEggs, getUser } from '@/utils/pterodactyl';
const app = express.Router();
interface userWithAttributes extends User {
    id: number;
    username: string;
    email: string;
    pterodactyl: number;
    role: string;
    plan: string;
    coins: number;
    backups: number;
    slots: number;
    cpu: number;
    ram: number;
    disk: number;
    ports: number;
    databases: number;
}


export interface ReqWithUser extends express.Request {
    user?: userWithAttributes;
}

app.use('/admin', async (req: ReqWithUser, res, next) => {
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
    if (user.role !== 'root_admin') return res.json({ success: false });
    req.user = {
        ...user,
        attributes: pterodactylUser.attributes

    }
    next();
})


app.get('/admin/images', async (req, res,) => {
    const images = await db.query('SELECT * FROM images');
    res.send({
        data: images
    })
})

app.post('/admin/images', async (req, res) => {
    req.body = {
        ...req.body,
        ports: parseInt(req.body.ports),
        databases: parseInt(req.body.databases),
        backups: parseInt(req.body.backups),
        cores: parseInt(req.body.cores) === -1 ? -1 : parseInt(req.body.cores) * 100,
        memory: parseInt(req.body.memory) === -1 ? -1 : parseInt(req.body.memory) * 1024,
        disk: parseInt(req.body.disk) === -1 ? -1 : parseInt(req.body.disk) * 1024,
        image: parseInt(req.body.image)
    }
    const {
        name,
        cores,
        memory,
        disk,
        ports,
        databases,
        backups,
        egg
    } = req.body;
    if (!name || !cores || !memory || !disk || !ports || !databases || !backups || !egg) return res.json({ success: false, error: 'Missing data (' + Object.keys(req.body).filter((key) => !req.body[key]).join(', ') + ')' });
    if (Number.isNaN(cores) || Number.isNaN(memory) || Number.isNaN(disk) || Number.isNaN(ports) || Number.isNaN(databases) || Number.isNaN(backups) || Number.isNaN(egg)) return res.json({ success: false, error: 'Invalid data (' + Object.keys(req.body).filter((key) => Number.isNaN(req.body[key])).join(', ') + ')' });
    const eggs = await getEggs();
    const nest = eggs.data.find((nest) => nest.attributes.relationships.eggs.data.find((eggP: Egg) => eggP.attributes.id === egg));
    if (!nest) return res.json({ success: false, error: 'Invalid nest' });
    const eggP = nest.attributes.relationships.eggs.data.find((eggP: Egg) => eggP.attributes.id === egg);
    if (!eggP) return res.json({ success: false, error: 'Invalid egg' });
    const sort = await db.query('SELECT COUNT(*) as count FROM images').then((res: any) => res[0].count);
    await db.query('INSERT INTO images (name, cpu, ram, disk, ports, `databases`, backups, nestId, imageId, startup, docker_image, sort) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, cores, memory, disk, ports, databases, backups, nest.attributes.id, eggP.attributes.id, eggP.attributes.startup, eggP.attributes.docker_image, sort + 1]).catch((e: any) => {
        res.json({ success: false, error: 'Error while creating image' });
        throw e;
    });
    res.json({ success: true });
})

app.delete('/admin/images/:id', async (req, res) => {
    const id = req.params.id;
    await db.query('DELETE FROM images WHERE id = ?', [id]);
    res.json({ success: true });
})


app.get('/admin/eggs', async (req, res) => {
    const eggs = await getEggs();
    res.send(eggs)
})

export default app;