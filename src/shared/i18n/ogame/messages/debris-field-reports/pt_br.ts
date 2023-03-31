import { DebrisFieldReportMessages } from "./types";

export const pt_br: DebrisFieldReportMessages = {
    regex: [
        /Recolheste (?<metal>.+) Metal e (?<crystal>.+) Cristal/i,
        /Você colheu ?(?<metal>.+) Metal, (?<crystal>.+) Cristal e (?<deuterium>.+) Deutério/i,
    ],
};