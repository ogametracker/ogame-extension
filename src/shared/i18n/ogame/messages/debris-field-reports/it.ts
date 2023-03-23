import { DebrisFieldReportMessages } from "./types";

export const it: DebrisFieldReportMessages = {
    regex: [
        /Hai raccolto (?<metal>.+) unità di metallo e (?<crystal>.+) unità di cristallo/i,
        /Hai raccolto (?<metal>.+) unità di metallo, (?<crystal>.+) unità di cristallo e (?<deuterium>.+) unità di deuterio/i,
    ],
};