import { PlanetActiveItems } from "../../empire/PlanetActiveItems";
import { ServerSettings } from "../../server-settings/ServerSettings";
import { getMaxActiveCrawlers } from "../buildings/getMaxActiveCrawlers";
import { MetalMine } from "../buildings/MetalMine";
import { PlayerClass } from "../classes/PlayerClass";
import { ItemHash } from "../items/ItemHash";
import { getLifeformBuildingProductionBonuses } from "../lifeforms/buildings/getLifeformBuildingProductionBonuses";
import { getLifeformCollectorClassBonus } from "../lifeforms/buildings/getLifeformCollectorClassBonus";
import { getLifeformTechnologyProductionBonuses } from "../lifeforms/buildings/getLifeformTechnologyProductionBonuses";
import { hasCommandStaff } from "../premium/hasCommandStaff";
import { ResearchType } from "../research/ResearchType";
import { ProductionBreakdown } from "./types";

function getCrystalItemBoost(activeItems: PlanetActiveItems) {
    const now = Date.now();

    const items10 = [ItemHash.crystalBooster_bronze_1day, ItemHash.crystalBooster_bronze_7days];
    const items20 = [ItemHash.crystalBooster_silver_7days, ItemHash.crystalBooster_silver_30days, ItemHash.crystalBooster_silver_90days];
    const items30 = [ItemHash.crystalBooster_gold_7days, ItemHash.crystalBooster_gold_30days, ItemHash.crystalBooster_gold_90days];
    const items40 = [ItemHash.crystalBooster_platinum_7days, ItemHash.crystalBooster_platinum_30days, ItemHash.crystalBooster_platinum_90days];

    if (items10.some(hash => activeItems[hash] == 'permanent' || (activeItems[hash] ?? -1) > now)) {
        return 0.1;
    }
    if (items20.some(hash => activeItems[hash] == 'permanent' || (activeItems[hash] ?? -1) > now)) {
        return 0.2;
    }
    if (items30.some(hash => activeItems[hash] == 'permanent' || (activeItems[hash] ?? -1) > now)) {
        return 0.3;
    }
    if (items40.some(hash => activeItems[hash] == 'permanent' || (activeItems[hash] ?? -1) > now)) {
        return 0.4;
    }

    return 0;
}

function getCrystalProductionBoost(position: number, serverSettings: ServerSettings) {
    switch (position) {
        case 1:
            return serverSettings.resourceProduction.productionFactorBonus.crystal.pos1;

        case 2:
            return serverSettings.resourceProduction.productionFactorBonus.crystal.pos2;

        case 3:
            return serverSettings.resourceProduction.productionFactorBonus.crystal.pos3;
    }

    return serverSettings.resourceProduction.productionFactorBonus.crystal.default;
}

export function getCrystalProduction(): ProductionBreakdown {
    const boost = getCrystalProductionBoost(dependencies.planet.coordinates.position, dependencies.serverSettings);
    const collectorClassBonus = 1 + getLifeformCollectorClassBonus(dependencies.player);

    const baseProduction = Math.trunc(15 * dependencies.serverSettings.speed.economy * (1 + boost));
    const mineProduction = Math.trunc(20 * dependencies.serverSettings.speed.economy * (1 + boost) * level * 1.1 ** level * dependencies.planet.productionSettings[BuildingType.crystalMine] / 100);
    const geologistProduction = Math.round(mineProduction * 0.1 * (dependencies.player.officers.geologist ? 1 : 0));
    const plasmaTechProduction = mineProduction * 0.0066 * dependencies.player.research[ResearchType.plasmaTechnology];
    const collectorProduction = mineProduction
        * dependencies.serverSettings.playerClasses.collector.productionFactorBonus
        * (dependencies.player.playerClass == PlayerClass.collector ? 1 : 0)
        * collectorClassBonus;
    const commandStaffProduction = Math.round(mineProduction * 0.02 * (hasCommandStaff(dependencies.player.officers) ? 1 : 0));
    const traderProduction = Math.round(mineProduction * 0.05 * (dependencies.player.allianceClass == AllianceClass.trader ? 1 : 0));
    const itemProduction = mineProduction * getCrystalItemBoost(dependencies.planet.activeItems);

    const lifeformBuildingProduction = getLifeformBuildingProductionBonuses(dependencies.planet)
        .map(bonus => mineProduction * bonus.crystal)
        .reduce((acc, cur) => acc + cur, 0);
    const lifeformTechProduction = mineProduction
        * getLifeformTechnologyProductionBonuses(dependencies.player).reduce((acc, cur) => acc + cur.crystal, 0);

    const maxCrawlers = getMaxActiveCrawlers(
        dependencies.planet.buildings[BuildingType.metalMine],
        level,
        dependencies.planet.buildings[BuildingType.deuteriumSynthesizer],
        dependencies.player.playerClass,
        dependencies.player.officers.geologist,
        dependencies.serverSettings,
        collectorClassBonus,
    );
    const crawlerCount = Math.min(maxCrawlers, dependencies.planet.ships[ShipType.crawler]);
    const crawlerProductivity = dependencies.player.playerClass == PlayerClass.collector
        ? (1 + dependencies.serverSettings.playerClasses.collector.crawlers.productionFactorBonus) * collectorClassBonus
        : 1;
    const crawlerBoost = Math.min(
        dependencies.serverSettings.playerClasses.crawlers.maxProductionFactor,
        dependencies.serverSettings.playerClasses.crawlers.productionBoostFactorPerUnit * crawlerCount * crawlerProductivity * dependencies.planet.productionSettings[ShipType.crawler] / 100);
    const crawlerProduction = Math.round(mineProduction * crawlerBoost);

    const production = baseProduction
        + mineProduction
        + geologistProduction
        + plasmaTechProduction
        + collectorProduction
        + commandStaffProduction
        + traderProduction
        + itemProduction
        + crawlerProduction
        + lifeformBuildingProduction
        + lifeformTechProduction;

    return {
        metal: 0,
        crystal: production,
        deuterium: 0,
        energy: 0,
    };
}