import { DebrisFieldReportMessages } from "./types";

export const dk: DebrisFieldReportMessages = {
    regex: [
        /Du har samlet (?<metal>.+) metal og (?<crystal>.+) krystal/i,
        /Du har samlet (?<metal>.+) metal, (?<crystal>.+) krystal og (?<deuterium>.+) deuterium/i,
    ],
};