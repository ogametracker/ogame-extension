import { DebrisFieldReportMessages } from "./types";

export const hr: DebrisFieldReportMessages = {
    regex: [
        /Ti izvlacis (?<metal>.+) Metala i (?<crystal>.+) Kristala/i,
        /Izvukli ste (?<metal>.+) Metala, (?<crystal>.+) Kristala i (?<deuterium>.+) Deuterija/i,
    ],
};