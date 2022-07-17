import { PlayerOfficers } from "../../empire/PlayerOfficers";
import { AllianceClass } from "../classes/AllianceClass";
import { PlayerClass } from "../classes/PlayerClass";
import { Cost } from "../common/Cost";
import { ItemHash } from "../items/ItemHash";
import { ResearchType } from "../research/ResearchType";
import { ShipType } from "../ships/ShipType";
import { BuildingType } from "./BuildingType";
import { ProductionBuilding, ProductionBuildingDependencies } from "./ProductionBuilding";
import { getMaxActiveCrawlers } from './getMaxActiveCrawlers';
import { PlanetActiveItems } from "../../empire/PlanetActiveItems";
import { ServerSettings } from "../../server-settings/ServerSettings";
import { getLifeformCollectorClassBonus } from "../lifeforms/buildings/getLifeformCollectorClassBonus";
import { getLifeformTechnologyProductionBonuses } from "../lifeforms/buildings/getLifeformTechnologyProductionBonuses";
import { getLifeformBuildingProductionBonuses } from "../lifeforms/buildings/getLifeformBuildingProductionBonuses";

//TODO: refactor, production should only return mine production
class CrystalMineClass extends ProductionBuilding {

    public getProduction(level: number, dependencies: ProductionBuildingDependencies): Cost {
        const boost = this.getProductionBoost(dependencies.planet.coordinates.position, dependencies.serverSettings);
        const mineProduction = Math.trunc(20 * dependencies.serverSettings.speed.economy * (1 + boost) * level * 1.1 ** level * dependencies.planet.productionSettings[BuildingType.crystalMine] / 100);

        return {
            metal: 0,
            crystal: mineProduction,
            deuterium: 0,
            energy: 0,
        };
    }

    private getProductionBoost(position: number, serverSettings: ServerSettings) {
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

    public getConsumption(level: number, dependencies: ProductionBuildingDependencies): Cost {
        return {
            metal: 0,
            crystal: 0,
            deuterium: 0,
            energy: Math.ceil(10 * level * 1.1 ** level),
        };
    }

    public getCost(level: number): Cost {
        return {
            metal: Math.round(30 * 1.6 ** level),
            crystal: Math.round(15 * 1.6 ** level),
            deuterium: 0,
            energy: 0,
        };
    }

}
export const CrystalMine = new CrystalMineClass();