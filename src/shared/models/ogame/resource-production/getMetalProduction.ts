import { PlanetActiveItems } from "../../empire/PlanetActiveItems";
import { BuildingType } from "../buildings/BuildingType";
import { MetalMine } from "../buildings/MetalMine";
import { AllianceClass } from "../classes/AllianceClass";
import { PlayerClass } from "../classes/PlayerClass";
import { ItemHash } from "../items/ItemHash";
import { getLifeformBuildingProductionBonuses } from "../lifeforms/buildings/getLifeformBuildingProductionBonuses";
import { getLifeformCollectorClassBonus } from "../lifeforms/buildings/getLifeformCollectorClassBonus";
import { getLifeformTechnologyProductionBonuses } from "../lifeforms/buildings/getLifeformTechnologyProductionBonuses";
import { hasCommandStaff } from "../premium/hasCommandStaff";
import { ResearchType } from "../research/ResearchType";
import { createProductionBreakdown } from "./createProductionBreakdown";
import { ProductionBreakdown, ProductionDependencies } from "./types";
import { getCrawlerBoost } from "./getCrawlerBoost";
import { getProductionBuildingDependencies } from "./getProductionBuildingDependencies";

function getMetalItemBoost(activeItems: PlanetActiveItems) {
    const now = Date.now();

    const items10 = [ItemHash.metalBooster_bronze_1day, ItemHash.metalBooster_bronze_7days];
    const items20 = [ItemHash.metalBooster_silver_7days, ItemHash.metalBooster_silver_30days, ItemHash.metalBooster_silver_90days];
    const items30 = [ItemHash.metalBooster_gold_7days, ItemHash.metalBooster_gold_30days, ItemHash.metalBooster_gold_90days];
    const items40 = [ItemHash.metalBooster_platinum_7days, ItemHash.metalBooster_platinum_30days, ItemHash.metalBooster_platinum_90days];

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

function getMetalProductionBoost(position: number) {
    switch (position) {
        case 8:
            return 0.35;

        case 7:
        case 9:
            return 0.23;

        case 6:
        case 10:
            return 0.17;
    }

    return 0;
}

export function getMetalProduction(dependencies: ProductionDependencies): ProductionBreakdown {
    const boost = getMetalProductionBoost(dependencies.planet.coordinates.position);

    const baseProduction = 30 * dependencies.serverSettings.speed.economy * (1 + boost);

    const mineLevel = dependencies.planet.buildings[BuildingType.metalMine];
    const mineProduction = MetalMine.getProduction(mineLevel, getProductionBuildingDependencies(dependencies));

    const geologistFactor = dependencies.player.officers.geologist ? 1 : 0;
    const geologistBonus = 0.1; //10%
    const geologistProduction = Math.round(geologistFactor * mineProduction * geologistBonus);

    const plasmaTechBonusPerLevel = 0.01; //1%
    const plasmaTechProduction = mineProduction * plasmaTechBonusPerLevel * dependencies.player.research[ResearchType.plasmaTechnology];

    const collectorClassFactor = 1 + getLifeformCollectorClassBonus(dependencies.player);
    const collectorFactor = dependencies.player.playerClass == PlayerClass.collector ? 1 : 0;
    const playerClassProduction = collectorFactor
        * mineProduction
        * dependencies.serverSettings.playerClasses.collector.productionFactorBonus
        * collectorClassFactor;

    const commandStaffFactor = hasCommandStaff(dependencies.player.officers) ? 1 : 0;
    const commandStaffBonus = 0.02; //2%
    const commandStaffProduction = Math.round(commandStaffFactor * mineProduction * commandStaffBonus);

    const traderBonus = 0.05; //5%
    const allianceClassFactor = dependencies.player.allianceClass == AllianceClass.trader ? 1 : 0;
    const allianceClassProduction = Math.round(allianceClassFactor * mineProduction * traderBonus);

    const itemProduction = mineProduction * getMetalItemBoost(dependencies.planet.activeItems);

    const lifeformBuildingProduction = getLifeformBuildingProductionBonuses(dependencies.planet)
        .map(bonus => mineProduction * bonus.metal)
        .reduce((acc, cur) => acc + cur, 0);

    const lifeformTechProduction = mineProduction
        * getLifeformTechnologyProductionBonuses(dependencies.player).reduce((acc, cur) => acc + cur.metal, 0);

    const crawlerBoost = getCrawlerBoost(dependencies, collectorClassFactor);
    const crawlerProduction = Math.round(mineProduction * crawlerBoost);

    return createProductionBreakdown({
        base: baseProduction,
        mine: mineProduction,
        plasmaTechnology: plasmaTechProduction,
        geologist: geologistProduction,
        commandStaff: commandStaffProduction,
        allianceClass: allianceClassProduction,
        playerClass: playerClassProduction,
        crawlers: crawlerProduction,
        item: itemProduction,
        lifeformBuildings: lifeformBuildingProduction,
        lifeformTechnologies: lifeformTechProduction,
    });

}