/// <reference types="chrome"/>

export default {
    get: (key: string | number) => new Promise<any>(resolve => {
        chrome.storage.local.get([key], (result: any) => resolve(result[key]));
    }),
    set: (key: string | number, data: any) => new Promise<void>(resolve => {
        chrome.storage.local.set({ [key]: data }, () => resolve());
    }),
};