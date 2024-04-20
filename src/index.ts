import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import { Config } from '@/types/Config';
if (!fs.existsSync(path.join(__dirname, 'config.yml'))) fs.writeFileSync(path.join(__dirname, 'config.yml'), fs.readFileSync(path.join(__dirname, 'config.example.yml'), 'utf8'));
export let config: Config = yaml.load(fs.readFileSync(path.join(__dirname, 'config.yml'), 'utf8')) as Config;
const generateTypesFileForConfig = (object: any, spaces: number = 0) => {
    let types = '';
    Object.keys(object).forEach(key => {
        const value = object[key];
        if (typeof value === 'object') {
            if (Array.isArray(value)) {
                types += `${' '.repeat(spaces)}${key}: ${typeof value[0]}[];\n`;
            } else types += `${' '.repeat(spaces)}${key}: {\n${generateTypesFileForConfig(value, spaces + 4)}${' '.repeat(spaces)}};\n`;
        } else {
            types += `${' '.repeat(spaces)}${key}: ${typeof value};\n`;
        }
    });
    return types;
}
const newTypes = `export interface Config {\n${generateTypesFileForConfig(config)}}`;
if (JSON.stringify(newTypes) !== JSON.stringify(fs.readFileSync(path.join(__dirname, 'types', 'Config.ts'), 'utf8'))) fs.writeFileSync(path.join(__dirname, 'types', 'Config.ts'), newTypes);

fs.watchFile(path.join(__dirname, 'config.yml'), () => {
    config = yaml.load(fs.readFileSync(path.join(__dirname, 'config.yml'), 'utf8')) as Config;
    const newTypes = `export interface Config {\n${generateTypesFileForConfig(config)}}`;
    if (JSON.stringify(newTypes) !== JSON.stringify(fs.readFileSync(path.join(__dirname, 'types', 'Config.ts'), 'utf8'))) fs.writeFileSync(path.join(__dirname, 'types', 'Config.ts'), newTypes);
})
import express = require('express');
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import db from '@/utils/db';
import { createServer, getEggs, getNodes } from '@/utils/pterodactyl';
import { ResponseNode } from './types/pterodactylStructure';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/api/miactyl/cdn', express.static(path.join(__dirname, 'cdn')));

const handlers = fs.readdirSync(path.join(__dirname, 'handlers'));
handlers.forEach(handler => {
    require(path.join(__dirname, 'handlers', handler))
});

const apis = fs.readdirSync(path.join(__dirname, 'api'));
apis.forEach(api => {
    app.use('/api/miactyl', require(path.join(__dirname, 'api', api)).default);
});

app.listen(config.website.port, () => {
    console.log(`Server is running on ${config.domain}`);
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