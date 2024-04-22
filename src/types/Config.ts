export interface Config {
    name: string;
    logo: string;
    autoUpdate: boolean;
    domain: string;
    database: string;
    status: {
        webhook: string;
        webhookEnabled: boolean;
        webhookInterval: number;
        avatar: string;
        name: string;
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
            };
            renew: {
                overresourcessuspend: boolean;
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