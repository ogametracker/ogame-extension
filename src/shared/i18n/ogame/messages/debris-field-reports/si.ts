import { DebrisFieldReportMessages } from "./types";

export const si: DebrisFieldReportMessages = {
    regex: [
        /Recikliral si (?<metal>.+) metala in (?<crystal>.+) kristala/i,
        /Pobral si (?<metal>.+) Metala, (?<crystal>.+) Kristala in (?<deuterium>.+) Deuteriuma/i
    ],
};