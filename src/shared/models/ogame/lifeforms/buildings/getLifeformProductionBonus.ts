import { LocalPlayerData } from "@/shared/models/empire/LocalPlayerData";
import { Cost } from "../../common/Cost";
import { LifeformTechnologyBonusLifeformBuildings, ResourceProductionBonusLifeformBuildings } from "./LifeformBuildings";

//TODO get total production bonus by lifeform buildings and technologies
export function getLifeformProductionBonus(player: LocalPlayerData): Cost {
    const productionBonusBuildings = ResourceProductionBonusLifeformBuildings;
    const technologyBonusBuildings = LifeformTechnologyBonusLifeformBuildings;

    //TODO: lifeform technologies
}