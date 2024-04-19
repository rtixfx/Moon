// import React from "react";

import { action, createContextStore } from "easy-peasy";

interface UserData {
    user: {
        sidebar: boolean;
        transactions: {
            id: string;
            user: number;
            item: string;
            quantity: number;
            price: number;
            created_at: string;
        }[];
        pterodactyl: number;
        ram: number;
        disk: number;
        cpu: number;
        slots: number;
        ports: number;
        databases: number;
        coins: number;
        backups: number;
        discord_id: string | null;
        id: string;
        username: string;
        email: string;
        admin: boolean;
        plan: string;
        attributes: {
            id: string;
            external_id: string | null;
            uuid: string;
            username: string;
            email: string;
            first_name: string;
            last_name: string;
            language: string;
            root_admin: boolean;
            "2fa": boolean;
            created_at: string;
            updated_at: string;
            relationships: {
                servers: {
                    object: string;
                    data: {
                        reduce(arg0: (acc: any, server: any) => any, arg1: number): unknown;
                        object: string;
                        attributes: {
                            id: string;
                            external_id: string | null;
                            uuid: string;
                            identifier: string;
                            name: string;
                            description: string;
                            suspended: boolean;
                            status: string | null;
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
                            container: {
                                "startup_command": string;
                                "image": string;
                                "environment": {
                                    [key: string]: string;
                                };
                            };
                            updated_at: string;
                            created_at: string;
                        }
                    }
                }
            }
        };
        avatar_url: string;
        object: string;
    };
    setUser: (payload: any) => void;
}


export default createContextStore({
    user: {
        sidebar: false,
        transactions: [],
        pterodactyl: 0,
        ram: 0,
        disk: 0,
        cpu: 0,
        slots: 0,
        ports: 0,
        databases: 0,
        coins: 0,
        backups: 0,
        discord_id: null,
        id: "",
        plan: "",
        username: "",
        email: "",
        admin: false,
        avatar_url: "",
        attributes: {
            id: "",
            external_id: null,
            uuid: "",
            username: "",
            email: "",
            first_name: "",
            last_name: "",
            language: "",
            root_admin: false,
            "2fa": false,
            created_at: "",
            updated_at: "",
            relationships: {
                servers: {
                    object: "",
                    data: []
                }
            }
        },
        object: "",
    },
    setUser: action((state: any, payload) => {
        state.user = { ...state.user, ...payload }
    }),
} as unknown as UserData);