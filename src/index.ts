import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import { Config } from '@/types/Config';
if (!fs.existsSync(path.join(__dirname, 'config.yml'))) fs.writeFileSync(path.join(__dirname, 'config.yml'), fs.readFileSync(path.join(__dirname, 'config.example.yml'), 'utf8'));
export let config: Config = yaml.load(fs.readFileSync(path.join(__dirname, 'config.yml'), 'utf8')) as Config;
fs.watchFile(path.join(__dirname, 'config.yml'), () => {
    config = yaml.load(fs.readFileSync(path.join(__dirname, 'config.yml'), 'utf8')) as Config;
})
import express = require('express');
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import db from '@/utils/db';
import { createServer, getNodes } from '@/utils/pterodactyl';
import { ResponseNode } from './types/pterodactylStructure';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

getNodes().then((nodes: ResponseNode) => {
    nodes.data.forEach(node => {
        db.query('INSERT INTO nodes (id, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = ?', [node.attributes.id, node.attributes.name, node.attributes.name]);
    })
})


app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/api/miactyl/cdn', express.static(path.join(__dirname, 'cdn')));

const apis = fs.readdirSync(path.join(__dirname, 'api'));
apis.forEach(api => {
    app.use('/api/miactyl', require(path.join(__dirname, 'api', api)).default);
});

app.listen(config.website.port, () => {
    console.log(`Server is running on port ${config.website.port}`);
});
const errors = [
    "unhandledRejection",
    "uncaughtException"
];
errors.forEach(error => {
    process.on(error, (e) => {
        console.error(e);
    });
});