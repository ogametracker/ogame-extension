import { DebrisFieldReportMessages } from "./types";

export const cz: DebrisFieldReportMessages = {
    regex: [
        /Vytěžil jsi (?<metal>.+) kovu a (?<crystal>.+) krystalů/i,
        /Získáváš (?<metal>.+) kovu, (?<crystal>.+) (?<deuterium>.+) a 0 deuteria./i,
    ],
};