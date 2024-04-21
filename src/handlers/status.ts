import { config } from '@/index';
import axios from 'axios';
import { ResponseNode } from '@/types/pterodactylStructure';
import db from '@/utils/db';
import { getNodes } from '@/utils/pterodactyl';

const Run = async () => {
    if (!config.status.webhookEnabled || !config.status.webhook) return;
    const nodes = await getNodes().then((res) => res.data.reduce((acc, node) => acc[node.attributes.id] = node.attributes.relationships.servers.data.length, {} as any));
    const dbNodes = await db.query('SELECT * FROM nodes');
    if (!config.status.message) axios.post(config.status.webhook, {
        content: `**Nodes status**\n${nodes.map((node: any, index: number) => `${dbNodes.find((dbNode: any) => dbNode.id === node).name}: ${node}/${dbNodes.find((dbNode: any) => dbNode.id === node).slots} servers`).join('\n')}`
    })






    setTimeout(Run, config.status.webhookInterval * 60 * 1000)
}
Run();