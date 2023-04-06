import { DebrisFieldReportMessages } from "./types";

export const cz: DebrisFieldReportMessages = {
    regex: [
        /Vytěžil jsi (?<metal>.+) kovu a (?<crystal>.+) krystalů/i,
        /Získáváš (?<metal>.+) kovu, (?<crystal>.+) krystalů a (?<deuterium>.+) deuteria./,
    ],
};