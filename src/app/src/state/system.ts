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
    };
    setSystem: (payload: any) => void;
};


export default createContextStore({
    system: {
        name: "APP NAME",
        logo: "/favicon.png",
        nodes: [],
        images: [],
    },
    setSystem: action((state: any, payload) => {
        state.system = { ...state.system, ...payload }
    }),
} as unknown as SystemData);