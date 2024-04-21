export interface Config {
name: string;
logo: string;
domain: string;
database: string;
status: {
    webhook: string;
    webhookEnabled: boolean;
    webhookInterval: number;
    avatar: string;
    name: string;
    message: string;
};
log: {
    webhook: string;
    webhookEnabled: boolean;
    avatar: string;
    name: string;
};
website: {
    port: number;
};
discordserver: {
    enabled: boolean;
    invitelink: string;
};
linkvertise: {
    enabled: boolean;
    userid: number;
    coins: number;
};
linkpays: {
    enabled: boolean;
    userid: number;
    coins: number;
    redirectOnStart: boolean;
};
pterodactyl: {
    domain: string;
    key: string;
};
api: {
    client: {
        bot: {
            token: string;
            joinguild: {
                enabled: boolean;
                guilds: number[];
                registeredrole: string;
            };
            overresourcessuspend: boolean;
        };
        renew: {
            enabled: boolean;
            time: number;
            cost: number;
            maxTimeAlive: number;
            deploy: number;
            deployTime: number;
            deployAdditionalCost: {
                ram: number;
                cpu: number;
                disk: number;
                databases: number;
                backups: number;
                ports: number;
            };
            addotionalcost: {
                ram: number;
                cpu: number;
                disk: number;
                databases: number;
                backups: number;
                ports: number;
            };
        };
        oauth2: {
            id: string;
            secret: string;
        };
    };
};
}