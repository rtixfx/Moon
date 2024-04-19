// import React from "react";

import { action, createContextStore } from "easy-peasy";

interface SystemData {
    system: {
        name: string;
        logo: string;
    };
    setSystem: (payload: any) => void;
};


export default createContextStore({
    system: {
        name: "APP NAME",
        logo: "/favicon.png"
    },
    setSystem: action((state: any, payload) => {
        state.system = { ...state.system, ...payload }
    }),
} as unknown as SystemData);