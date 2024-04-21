import axios from 'axios';
import db from '@/utils/db';
import {
    config
} from '@/index';
import {
    Egg,
    Nest,
    ResponseNest,
    ResponseNode,
    ResponseUser,
    User
} from '@/types/pterodactylStructure';

export const createUser = async (email: string, password: string, username: string) => {
    const alreadyExists = await axios.get(`${config.pterodactyl.domain}/api/application/users?filter[email]=${email}`, {
        headers: {
            Authorization: `Bearer ${config.pterodactyl.key}`
        }
    }).then((res) => res.data as ResponseUser).then((res: ResponseUser) => res.data.find((user: User) => user.attributes.email === email) as User);
    if (alreadyExists) return ({
        success: true,
        user: alreadyExists
    })
    const userReturn: User = await axios.post(`${config.pterodactyl.domain}/api/application/users`, {
        email,
        username,
        first_name: username,
        last_name: username,
    }, {
        headers: {
            Authorization: `Bearer ${config.pterodactyl.key}`
        }
    }).then((res) => res.data as User)
    axios.patch(`${config.pterodactyl.domain}/api/application/users/${userReturn.attributes.id}`, {
        email,
        username,
        first_name: username,
        last_name: username,
        language: "en",
        password
    }, {
        headers: {
            Authorization: `Bearer ${config.pterodactyl.key}`
        }
    });
    return {
        success: true,
        user: userReturn
    }
}

export const getNodes = async () => {
    return await axios.get(`${config.pterodactyl.domain}/api/application/nodes?include=servers`, {
        headers: {
            Authorization: `Bearer ${config.pterodactyl.key}`
        }
    }).then((res) => res.data as ResponseNode);
}

export const getUser = async (id: number, userId?: string) => {
    const user: User = await axios.get(`${config.pterodactyl.domain}/api/application/users/${id}?include=servers`, {
        headers: {
            Authorization: `Bearer ${config.pterodactyl.key}`
        }
    }).then((res) => res.data as User);
    // get all posible data from database
    const serversData = await Promise.all(user.attributes.relationships.servers.data.map(async (server: any) => {
        return await db.query('SELECT * FROM servers WHERE id = ?', [server.attributes.id]).then((res: any) => res[0] || { renew: 0, locked: null });
    }));
    user.attributes.relationships.servers.data.forEach((server: any, index: number) => {
        server.attributes = { ...server.attributes, ...serversData[index] };
    });
    const transactions = await db.query('SELECT * FROM transactions WHERE user = ?', [userId]).then((res: any) => res || []);
    user.attributes.transactions = transactions;
    return user;
}

export const createServer = async (name: string, user: number, node: number, args: any) => {
    const availableNodesAlolcations = await axios.get(`${config.pterodactyl.domain}/api/application/nodes/${node}/allocations?per_page=100000`, {
        headers: {
            Authorization: `Bearer ${config.pterodactyl.key}`
        }
    }).then((res) => res.data as any);
    if (!availableNodesAlolcations.data.find((allocation: any) => allocation.attributes.assigned === false)) return Promise.reject('No available allocations');
    return await axios.post(`${config.pterodactyl.domain}/api/application/servers`, {
        name,
        user,
        node,
        ...args,
        allocation: {
            ...args.allocation,
            default: availableNodesAlolcations.data.find((allocation: any) => allocation.attributes.assigned === false)?.attributes.id
        }
    }, {
        headers: {
            Authorization: `Bearer ${config.pterodactyl.key}`
        }
    }).then((res) => res.data as any);
}

export const getEggs = async () => {
    const nests: ResponseNest = await axios.get(`${config.pterodactyl.domain}/api/application/nests?include=eggs`, {
        headers: {
            Authorization: `Bearer ${config.pterodactyl.key}`
        }
    }).then((res) => res.data as ResponseNest);
    return nests;
}
export const getEgg = async (id: number) => {
    const eggs: ResponseNest = await getEggs();
    return eggs.data.find((nest: Nest) => nest.attributes.relationships.eggs.data.find((egg: Egg) => egg.attributes.id === id));
}

export const getEggByNest = async (nest: number, egg: number) => {
    return await axios.get(`${config.pterodactyl.domain}/api/application/nests/${nest}/eggs/${egg}?include=variables`, {
        headers: {
            Authorization: `Bearer ${config.pterodactyl.key}`
        }
    }).then((res) => res.data as Egg);
}

export const deleteServer = async (id: number) => {
    return await axios.delete(`${config.pterodactyl.domain}/api/application/servers/${id}`, {
        headers: {
            Authorization: `Bearer ${config.pterodactyl.key}`
        }
    }).then((res) => res.status === 204);
}

export const suspendServer = async (id: number) => {
    return await axios.post(`${config.pterodactyl.domain}/api/application/servers/${id}/suspend`, {}, {
        headers: {
            Authorization: `Bearer ${config.pterodactyl.key}`
        }
    }).then((res) => res.status === 204);
}