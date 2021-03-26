/// <reference types="chrome"/>

import env from "@/env";

export default {
    get: (key: string | number) => new Promise<any>(resolve => {
        if (env.isProduction) {
            chrome.storage.local.get([key], (result: any) => resolve(result[key]));
        }
    }),
    set: (key: string | number, data: any) => new Promise<void>(resolve => {
        if (env.isProduction) {
            chrome.storage.local.set({ [key]: data }, () => resolve());
        }
    }),
};