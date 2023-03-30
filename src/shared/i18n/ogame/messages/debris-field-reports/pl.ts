import { DebrisFieldReportMessages } from "./types";

export const pl: DebrisFieldReportMessages = {
    regex: [
        /Udało ci się odzyskać (?<metal>.+) szt. metalu i (?<crystal>.+) szt. kryształu/i,
        /Udało ci się odzyskać (?<metal>.+) szt. metalu i (?<crystal>.+) szt. kryształu oraz (?<deuterium>.+) deuteru./i
    ],
};