import { DebrisFieldReportMessages } from "./types";

export const el: DebrisFieldReportMessages = {
    regex: [
        /Μαζέψατε (?<metal>.+) μέταλλο και (?<crystal>.+) κρύσταλλο/i,
        /Μαζέψατε (?<metal>.+) μέταλλο, (?<crystal>.+) κρύσταλλο και (?<deuterium>.+) Δευτέριο/i,
    ],
};