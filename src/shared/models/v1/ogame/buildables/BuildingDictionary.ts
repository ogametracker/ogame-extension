import BuildingEnum from "@/models/Building";
import Building from "./buildings/Building";
import CrystalMine from "./buildings/CrystalMine";
import DeuteriumSynthesizer from "./buildings/DeuteriumSynthesizer";
import MetalMine from "./buildings/MetalMine";

const dictionary: Partial<Record<BuildingEnum, Building>> = {
    [BuildingEnum.metalMine]: MetalMine,
    [BuildingEnum.crystalMine]: CrystalMine,
    [BuildingEnum.deuteriumSynthesizer]: DeuteriumSynthesizer,
};
export default dictionary;