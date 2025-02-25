// import React from "react";

import { action, createContextStore } from "easy-peasy";

interface SystemData {
    system: {
        name: string;
        logo: string;
        nodes: {
            id: number;
            name: string;
            plan: string;
            sort: number;
        }[],
        images: {
            id: number;
            name: string;
            sort: number;
        }[]
        deployCost: number;
        deployCostAddition: {
            cpu: number;
            ram: number;
            disk: number;
            swap: number;
            io: number;
            backups: number;
            databases: number;
            ports: number;
        }
        update: boolean;
        version: string;
        panel: string;
    };
    setSystem: (payload: any) => void;
};



// these values are automatically set by the server

export default createContextStore({
    system: {
        name: "APP NAME",
        logo: "/favicon.png",
        nodes: [],
        images: [],
        deployCost: 0,
        deployCostAddition: {
            cpu: 0,
            ram: 0,
            disk: 0,
            swap: 0,
            io: 0,
            backups: 0,
            databases: 0,
            ports: 0,
        },
        update: false,
        version: 'unknown',
        panel: 'https://panel.example.com'
    },
    setSystem: action((state: any, payload) => {
        state.system = { ...state.system, ...payload }
    }),
} as unknown as SystemData);