import { Cost } from "../common/Cost";
import { ProductionBuilding, ProductionBuildingDependencies } from "./ProductionBuilding";
class CrystalMineClass extends ProductionBuilding {

    public getProduction(level: number, dependencies: ProductionBuildingDependencies): number {
        const boost = this.getProductionBoost(dependencies.planet.position, dependencies.serverSettings);
        const mineProduction = Math.trunc(
            20
            * dependencies.serverSettings.economySpeed
            * (1 + boost)
            * level
            * 1.1 ** level
            * dependencies.productionSettings.crystalMine / 100
        );

        return mineProduction;
    }

    private getProductionBoost(position: number, serverSettings: ProductionBuildingDependencies['serverSettings']) {
        switch (position) {
            case 1:
                return serverSettings.crystalBoost.pos1;

            case 2:
                return serverSettings.crystalBoost.pos2;

            case 3:
                return serverSettings.crystalBoost.pos3;
        }

        return serverSettings.crystalBoost.default;
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