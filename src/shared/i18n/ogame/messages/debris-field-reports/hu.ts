import { DebrisFieldReportMessages } from "./types";

export const hu: DebrisFieldReportMessages = {
    regex: [
        /Betakarítottál (?<metal>.+) fémet és (?<crystal>.+) kristályt/i,
        /Begyűjtöttél (?<metal>.+) fémet, (?<crystal>.+) kristályt és (?<deuterium>.+) deutériumot./i,
    ],
};