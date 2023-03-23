import { DebrisFieldReportMessages } from "./types";

export const cz: DebrisFieldReportMessages = {
    regex: [
        /Vytěžil jsi (?<metal>.+) kovu a (?<crystal>.+) krystalů/i,
        /Vytěžil jsi (?<metal>.+), (?<crystal>.+) krystalů kovu a (?<deuterium>.+) deuterium/i,
    ],
};