/// <reference types="chrome"/>

import env from "@/env";
import clone from "./clone";

export default {
    get<T>(key: string | number): Promise<T | null> {
        return new Promise<T | null>(resolve => {
            if (!env.isProduction) {
                resolve(null);
                return;
            }

            chrome.storage.local.get([key], (result: Record<string, any>) => resolve(result[key]));
        });
    },
    set<T>(key: string | number, data: T): Promise<void> {
        return new Promise<void>(resolve => {
            if (!env.isProduction) {
                resolve();
                return;
            }

            // necessary because Firefox does not save getters/setters from the Vue watchers
            data = clone(data);

            chrome.storage.local.set({ [key]: data }, () => resolve());
        });
    },
    getBytesInUse(key?: string | number): Promise<number> {
        return new Promise<number>(resolve => {
            if (!env.isProduction) {
                resolve(-1);
                return;
            }

            chrome.storage.local.getBytesInUse(key?.toString() ?? null, bytes => resolve(bytes));
        });
    }
};