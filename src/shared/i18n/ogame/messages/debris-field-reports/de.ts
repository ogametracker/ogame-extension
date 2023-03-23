import { DebrisFieldReportMessages } from "./types";

export const de: DebrisFieldReportMessages = {
    regex: [
        /Du hast (?<metal>.+) Metall und (?<crystal>.+) Kristall abgebaut/i,
        /Du hast (?<metal>.+) Metall, (?<crystal>.+) Kristall und (?<deuterium>.+) Deuterium abgebaut/i,
    ],
};