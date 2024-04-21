export interface Server {
    object: string;
    attributes: {
        renew: number;
        locked: string;
        id: number;
        external_id: string;
        uuid: string;
        identifier: string;
        name: string;
        description: string;
        suspended: boolean;
        limits: {
            memory: number;
            swap: number;
            disk: number;
            io: number;
            cpu: number;
        };
        feature_limits: {
            databases: number;
            allocations: number;
            backups: number;
        };
        user: number;
        node: number;
        allocation: number;
        nest: number;
        egg: number;
        pack: number;
        container: {
            startup_command: string;
            image: string;
            installed: boolean;
            environment: {
                [key: string]: string;
            };
        };
        updated_at: string;
        created_at: string;
    }
}

export interface User {
    object: string;
    attributes: {
        transactions: {
            id: string;
            user: number;
            item: string;
            quantity: number;
            price: number;
            created_at: string;
        }[];
        id: number;
        external_id: string;
        uuid: string;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        language: string;
        root_admin: boolean;
        "2fa": boolean;
        relationships: {
            servers: {
                object: string;
                data: Server[];
            };
        };
        created_at: string;
        updated_at: string;
    }
}

export interface Node {
    object: string;
    attributes: {
        id: number;
        public: boolean;
        name: string;
        description: string;
        location_id: number;
        fqdn: string;
        scheme: string;
        behind_proxy: boolean;
        maintenance_mode: boolean;
        memory: number;
        memory_overallocate: number;
        disk: number;
        disk_overallocate: number;
        upload_size: number;
        daemon_listen: number;
        daemon_sftp: number;
        daemon_base: string;
        created_at: string;
        updated_at: string;
        relationships: {
            servers: {
                object: string;
                data: Server[];
            };
        };
    }
}

export interface Egg {
    object: string;
    attributes: {
        id: number;
        uuid: string;
        name: string;
        nest: number;
        author: string;
        description: string;
        docker_image: string;
        docker_images: string[];
        config: {
            files: {
                [key: string]: {
                    parser: string;
                    find: string;
                    replace: string;
                };
            };
            startup: {
                done: string;
                userInteraction: string[]
            }
            stop: string;
            logs: {
                custom: boolean;
                location: string;
            }
            extends: string;
        };
        startup: string;
        script: {
            privileged: boolean;
            install: string;
            entry: string;
            container: string;
            extends: string;
        }
        relationships: {
            variables: {
                object: string;
                data: {
                    object: string;
                    attributes: {
                        name: string;
                        description: string;
                        env_variable: string;
                        default_value: string;
                        server_value: string;
                        is_editable: boolean;
                        rules: string;
                        created_at: string;
                        updated_at: string;
                    }
                }[]
            }
        }
        created_at: string;
        updated_at: string;

    }

}
export interface Nest {
    object: string;
    attributes: {
        id: number;
        uuid: string;
        author: string;
        name: string;
        description: string;
        created_at: string;
        updated_at: string;
        relationships: {
            eggs: {
                object: string;
                data: Egg[];
            }
        }
    }
}



export interface ResponseUser {
    object: string;
    data: User[]
}

export interface ResponseServer {
    object: string;
    data: Server[]
}

export interface ResponseNode {
    object: string;
    data: Node[]
}
export interface ResponseEgg {
    object: string;
    data: Egg[]
}

export interface ResponseNest {
    object: string;
    data: Nest[]
}