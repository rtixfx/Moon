export interface Config {
    name: string;
    logo: string;
    domain: string;
    database: string;
    website: {
        port: number;
        secret: string;
    };
    discordserver: {
        enabled: boolean;
        invitelink: string;
    };
    pterodactyl: {
        domain: string;
        key: string;
    };
    linkvertise: {
        enabled: boolean;
        userid: number;
        coins: number;
        double: boolean;
    };
    status: {
        enabled: boolean;
        script: string;
    };
    api: {
        client: {
            bot: {
                token: string;
                joinguild: {
                    enabled: boolean;
                    guilds: string[];
                    registeredrole: string;
                };
            };
            webhook: {
                webhook_url: string;
                auditlogs: {
                    enabled: boolean;
                    disabled: string[];
                };
            };
            passwordgenerator: {
                signup: boolean;
                length: number;
            };
            allow: {
                newusers: boolean;
                regen: boolean;
                server: {
                    create: boolean;
                    modify: boolean;
                    delete: boolean;
                };
                overresourcessuspend: boolean;
                renew: {
                    enabled: boolean;
                    time: number;
                    cost: number;
                    addotionalcost: {
                        ram: number;
                        cpu: number;
                        disk: number;
                        databases: number;
                        backups: number;
                        allocations: number;

                    };
                };
            };
            oauth2: {
                id: string;
                secret: string;
            };
        };
    };
}