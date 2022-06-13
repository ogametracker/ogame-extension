import { DBSchema } from "idb";
import { Settings } from "../../models/settings/Settings";

export interface DbAccount {
    serverId: number;
    serverLanguage: string;
    id: number;
    name: string;
};
export interface DbServer {
    id: number;
    name: string;
    language: string;
};


export interface OgameTrackerGlobalDbSchema extends DBSchema {
    settings: {
        key: 0;
        value: Settings;
    };

    accounts: {
        key: [number, string, number];
        value: DbAccount;
    };

    servers: {
        key: [number, string],
        value: DbServer;
    };
}