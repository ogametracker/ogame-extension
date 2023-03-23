import { DebrisFieldReportMessages } from "./types";

export const nl: DebrisFieldReportMessages = {
    regex: [
        /Je hebt (?<metal>.+) metaal en (?<crystal>.+) kristal opgehaald/i,
        /Je hebt (?<metal>.+) metaal, (?<crystal>.+) kristal en (?<deuterium>.+) deuterium opgehaald/i,
    ]
};