import { config, saveConfig } from '@/index';
import axios from 'axios';
import { ResponseNode } from '@/types/pterodactylStructure';
import db from '@/utils/db';
import { getNodes, getUsers } from '@/utils/pterodactyl';
import fs from 'fs';
var message: any = null;
if (fs.existsSync('status.json')) message = JSON.parse(fs.readFileSync('status.json', 'utf8'))?.message || null;

const axiApi = axios.create({
    timeout: 2000,
    headers: {
        'Content-Type': 'application/json'
    }
});


const Run = async () => {
    if (!config.status.webhookEnabled || !config.status.webhook) return;
    const dbNodes = await db.query('SELECT * FROM nodes');
    const nodes = await getNodes().then(async (res) => await res.data.reduce(async (acc: any, node) => {
        const dbNode = dbNodes.find((dbNode: any) => dbNode.id === node.attributes.id);
        if (!dbNode) return acc;
        const nodeConfig = await axios.get(config.pterodactyl.domain + '/api/application/nodes/' + node.attributes.id + '/configuration', {
            headers: {
                Authorization: 'Bearer ' + config.pterodactyl.key
            }
        }).then((res) => res.data).catch(() => null)
        const status = await axiApi.get(node.attributes.scheme + '://' + node.attributes.fqdn + ':' + node.attributes.daemon_listen + '/api/system', {
            headers: {
                Authorization: 'Bearer ' + nodeConfig.token
            }
        }).then(() => true).catch(() => false)
        return [
            ...(await acc),
            ...[{ id: [node.attributes.id], servers: node.attributes.relationships.servers.data.length, name: dbNode.name, slots: dbNode.slots, status: status }]
        ]
    }, Promise.resolve([])));
    const users = await getUsers()
    if (!message) axios.post(config.status.webhook + '?wait=true', {
        content: 'Next Update in <t:' + (Date.now() / 1000 + config.status.webhookInterval * 60) + ':R>',
        embeds: [
            {
                title: '**Nodes status**',
                description: 'This message is for the nodes status and panel status',
                fields: [
                    ...[
                        {
                            name: 'Nodes: ',
                            value: nodes.map((node: any, index: number) => `${node.status ? '🟢' : '🔴'} ${node.name}: ${node.servers}/${node.slots}`).join('\n')
                        }
                    ],
                    ...[{
                        name: 'Panel:',
                        value: 'Servers: ' + nodes.reduce((acc: number, node: any) => acc + node.servers, 0) + '/' + dbNodes.reduce((acc: number, node: any) => acc + node.slots, 0) + ' \n Nodes: ' + nodes.length + '/' + dbNodes.length + ' \nUsers: ' + users.data.length
                    }
                    ]
                ]
            }
        ]
    }).then((res) => {
        message = res.data.id;
        fs.writeFileSync('status.json', JSON.stringify({ message: res.data.id }));
    }).catch((e) => {
        console.log(e);
    });
    else axios.patch(config.status.webhook + '/messages/' + message, {
        content: 'Next Update in <t:' + (Date.now() / 1000 + config.status.webhookInterval * 60) + ':R>',
        embeds: [
            {
                title: '**Nodes status**',
                description: 'This message is for the nodes status and panel status',
                fields: [
                    ...[
                        {
                            name: 'Nodes: ',
                            value: nodes.map((node: any, index: number) => `${node.status ? '🟢' : '🔴'} ${node.name}: ${node.servers}/${node.slots}`).join('\n')
                        }
                    ],
                    ...[{
                        name: 'Panel:',
                        value: 'Servers: ' + nodes.reduce((acc: number, node: any) => acc + node.servers, 0) + '/' + dbNodes.reduce((acc: number, node: any) => acc + node.slots, 0) + ' \n Nodes: ' + nodes.length + '/' + dbNodes.length + ' \nUsers: ' + users.data.length
                    }
                    ]
                ]
            }
        ]
    }).catch((e) => {
        console.log(e);
    });






    setTimeout(Run, config.status.webhookInterval * 60 * 1000)
}
Run();