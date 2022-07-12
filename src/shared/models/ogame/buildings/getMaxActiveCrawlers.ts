import { ServerSettings } from "../../server-settings/ServerSettings";
import { PlayerClass } from "../classes/PlayerClass";

export function getMaxActiveCrawlers(
    metalMineLevel: number,
    crystalMineLevel: number,
    deuteriumSynthesizerLevel: number,
    playerClass: PlayerClass,
    geologist: boolean,
    serverSettings: ServerSettings,
    collectorClassBonus: number
) {
    const maxCrawlerFactor = geologist && playerClass == PlayerClass.collector
        ? (1 + serverSettings.playerClasses.collector.crawlers.geologistActiveCrawlerFactorBonus) * collectorClassBonus
        : 1;
    const maxCrawlers = Math.floor(
        (metalMineLevel + crystalMineLevel + deuteriumSynthesizerLevel) 
        * 8
        * maxCrawlerFactor
    );

    return maxCrawlers;
}