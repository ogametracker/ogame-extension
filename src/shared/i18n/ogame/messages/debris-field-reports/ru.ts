import { DebrisFieldReportMessages } from "./types";

export const ru: DebrisFieldReportMessages = {
    regex: [
        /Добыто (?<metal>.+) металла и (?<crystal>.+) кристалла/i,
        /Вы собрали (?<metal>.+) металла, (?<crystal>.+) кристалла и (?<deuterium>.+) дейтерия/i,
    ],
};