import express from 'express';
import { config } from '@/index';
import axios from 'axios';
import crypto from 'crypto';
import db from '@/utils/db';
import { createUser, getUser } from '@/utils/pterodactyl';
import { User } from '@/types/pterodactylStructure';
const app = express.Router();

const rateLimiter = {} as { [key: string]: number };
setInterval(() => {
    for (const key in rateLimiter) {
        rateLimiter[key] = 0;
    }
}, 60000);

app.use('/auth', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress as string;
    if (!rateLimiter[ip]) rateLimiter[ip] = 0;
    if (rateLimiter[ip] > 1000) return res.status(429).json({ success: false, error: 'Rate limit exceeded' });
    rateLimiter[ip]++;
    next();
})

app.get('/auth/logout', async (req: express.Request, res: express.Response) => {
    const token = req.cookies.token;
    if (!token) return res.json({ success: false });
    await db.query('DELETE FROM sessions WHERE token = ?', [token]);
    res.clearCookie('token').redirect('/');
})


app.get('/auth/user', async (req: express.Request, res: express.Response) => {
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
    res.json({ success: true, user: { ...user, password: undefined, attributes: pterodactylUser.attributes } });
});

app.post('/auth/login', async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;
    const user = await db.query('SELECT * FROM users WHERE username = ? OR email = ?', [email, email]).then((res: any) => res[0]);
    if (!user) return res.json({ success: false, error: 'Invalid credentials' });
    const [salt, loop, hash] = user.password.split('$');
    const hashPassword = crypto.createHash('sha512WithRSAEncryption');
    for (let i = 0; i < loop; i++) {
        hashPassword.update(password + salt);
    }
    const hashed = hashPassword.digest('hex');
    if (hashed !== hash) return res.json({ success: false, error: 'Invalid credentials' });
    const token = crypto.randomBytes(64).toString('hex');
    await db.query('INSERT INTO sessions (user, token) VALUES (?, ?)', [user.id, token]);
    const pterodactylUser: User = await getUser(user.pterodactyl).catch((e) => {
        return null as any;
    });
    res.cookie('token', token, { maxAge: 86400000 }).send({ success: true, user: { ...user, password: undefined, attributes: pterodactylUser.attributes } });
})
app.post('/auth/register', async (req: express.Request, res: express.Response) => {
    const { username, email, password } = req.body as { username: string, email: string, password: string };
    if (!username || !email || !password) return res.json({ success: false, error: 'Invalid data' });
    if (!username.match(/^[a-zA-Z0-9]+$/)) return res.json({ success: false, error: 'Invalid username' });
    if (!email.match(/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) return res.json({ success: false, error: 'Invalid email' });
    if (password.length < 8) return res.json({ success: false, error: 'Password too short' });
    if (username.length < 5) return res.json({ success: false, error: 'Username too short' });
    const alreadyInDB = await db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email])
    if (alreadyInDB.length > 0) return res.json({ success: false, error: 'Already existing' });
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha512WithRSAEncryption');
    const loop = Math.floor(Math.random() * 1000);
    for (let i = 0; i < loop; i++) {
        hash.update(password + salt);
    }
    const hashed = hash.digest('hex');
    const token = crypto.randomBytes(64).toString('hex');
    const pterodactylUser = await createUser(email, password, username)
    await db.query('INSERT INTO users (username, email, password, pterodactyl) VALUES (?, ?, ?, ?)', [username, email, `${salt}$${loop}$${hashed}`, pterodactylUser.user.attributes.id]);
    const dbUser = await db.query('SELECT * FROM users WHERE email = ?', [email]).then((res: any) => res[0]);
    await db.query('INSERT INTO sessions (user, token) VALUES (?, ?)', [dbUser.id, token]);
    res.cookie('token', token, { maxAge: 86400000 }).send({ success: true });
})

app.get('/auth/discord', (req: any, res: { redirect: (arg0: string) => void; }) => {
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${config.api.client.oauth2.id}&redirect_uri=${config.domain}/oauth2/discord&response_type=code&scope=identify%20email%20guilds.join`);
});

app.post('/auth/discord', async (req: express.Request, res: express.Response) => {
    console.log(req.query);
    if (!req.query.code) return res.json({ success: false });
    const accessToken = await fetch(`https://discord.com/api/oauth2/token`, {
        method: 'POST',
        body: new URLSearchParams({
            client_id: config.api.client.oauth2.id,
            client_secret: config.api.client.oauth2.secret,
            code: req.query.code,
            grant_type: 'authorization_code',
            redirect_uri: `${config.domain}/oauth2/discord`,
            scope: 'identify email guilds.join'
        } as any).toString(),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    }).then((res) => res.json())
        .catch((e) => {
            return null;
        });
    if (!accessToken?.access_token) return res.json({ success: false });
    const user = await axios.get('https://discord.com/api/users/@me', {
        headers: {
            Authorization: `Bearer ${accessToken.access_token}`
        }
    }).catch((e) => {
        return null;
    });
    if (!user) return res.json({ success: false });
    if (config.api.client.bot.joinguild.enabled) {
        config.api.client.bot.joinguild.guilds.forEach(async (guild) => {
            await axios.put(`https://discord.com/api/guilds/${guild}/members/${user.data.id}`, {
                access_token: accessToken.access_token
            }, {
                headers: {
                    Authorization: `Bot ${config.api.client.bot.token}`
                }
            }).catch((e) => {
            });
        });
    }
    const token = crypto.randomBytes(64).toString('hex');
    const exists = await db.query('SELECT * FROM users WHERE discord_id = ?', [user.data.id]).then((res: any) => res[0]);
    const avatarUrl = user.data.avatar ? `https://cdn.discordapp.com/avatars/${user.data.id}/${user.data.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${user.data.id % 5}.png`;
    if (exists) {
        await db.query('INSERT INTO sessions (user, token) VALUES (?, ?)', [exists.id, token]);
        await db.query('UPDATE users SET avatar_url = ? WHERE discord_id = ?', [avatarUrl, user.data.id]);
    } else {
        const pterodactylUser = await createUser(user.data.email, crypto.randomBytes(16).toString('hex'), user.data.username);
        await db.query('INSERT INTO users (discord_id, username, email, avatar_url, pterodactyl) VALUES (?, ?, ?, ?, ?)', [user.data.id, user.data.username, user.data.email, avatarUrl, pterodactylUser.user.attributes.id]);
        const dbUser = await db.query('SELECT * FROM users WHERE discord_id = ?', [user.data.id]).then((res: any) => res[0]);
        await db.query('INSERT INTO sessions (user, token) VALUES (?, ?)', [dbUser.id, token]);
    }
    res.cookie('token', token, { maxAge: 86400000 }).send({ success: true });
});
export default app;