export interface Config {
name: string;
logo: string;
domain: string;
database: string;
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
            deploy: number;
            deployAdditionalCost: {
                ram: number;
                cpu: number;
                disk: number;
                databases: number;
                backups: number;
                allocations: number;
            };
            addotionalcost: {
                ram: number;
                cpu: number;
                disk: number;
                databases: number;
                backups: number;
                allocations: number;
            };
        };
        oauth2: {
            id: string;
            secret: string;
        };
    };
};
}