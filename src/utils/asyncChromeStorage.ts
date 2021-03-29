/// <reference types="chrome"/>

import env from "@/env";

export default {
    get<T>(key: string | number): Promise<T | null> {
        return new Promise<T | null>(resolve => {
            if (!env.isProduction) {
                resolve(null);
                return;
            }

            chrome.storage.local.get([key], (result: any) => resolve(result[key]));
        });
    },
    set<T>(key: string | number, data: T) {
        return new Promise<void>(resolve => {
            if (!env.isProduction) {
                resolve();
                return;
            }

            chrome.storage.local.set({ [key]: data }, () => resolve());
        });
    },
};