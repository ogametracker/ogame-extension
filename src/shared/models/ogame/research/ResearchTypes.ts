import { Research } from "./Research";
import { ResearchType } from "./ResearchType";
import { ArmorTechnology } from "./ArmorTechnology";
import { ComputerTechnology } from "./ComputerTechnology";
import { EspionageTechnology } from "./EspionageTechnology";
import { ShieldingTechnology } from "./ShieldingTechnology";
import { WeaponsTechnology } from "./WeaponsTechnology";
import { EnergyTechnology } from "./EnergyTechnology";
import { HyperspaceTechnology } from "./HyperspaceTechnology";
import { CombustionDrive } from "./CombustionDrive";
import { ImpulseDrive } from "./ImpulseDrive";
import { HyperspaceDrive } from "./HyperspaceDrive";
import { LaserTechnology } from "./LaserTechnology";
import { IonTechnology } from "./IonTechnology";
import { PlasmaTechnology } from "./PlasmaTechnology";
import { IntergalacticResearchNetwork } from "./IntergalacticResearchNetwork";
import { Astrophysics } from "./Astrophysics";
import { GravitonTechnology } from "./GravitonTechnology";

export const ResearchTypes: ResearchType[] = [
    ResearchType.espionageTechnology,
    ResearchType.computerTechnology,
    ResearchType.weaponsTechnology,
    ResearchType.shieldingTechnology,
    ResearchType.armorTechnology,
    ResearchType.energyTechnology,
    ResearchType.hyperspaceTechnology,
    ResearchType.combustionDrive,
    ResearchType.impulseDrive,
    ResearchType.hyperspaceDrive,
    ResearchType.laserTechnology,
    ResearchType.ionTechnology,
    ResearchType.plasmaTechnology,
    ResearchType.intergalacticResearchNetwork,
    ResearchType.astrophysics,
    ResearchType.gravitonTechnology,
];
export const ResearchByTypes: Record<ResearchType, Research> = {
    [ResearchType.espionageTechnology]: EspionageTechnology,
    [ResearchType.computerTechnology]: ComputerTechnology,
    [ResearchType.weaponsTechnology]: WeaponsTechnology,
    [ResearchType.shieldingTechnology]: ShieldingTechnology,
    [ResearchType.armorTechnology]: ArmorTechnology,
    [ResearchType.energyTechnology]: EnergyTechnology,
    [ResearchType.hyperspaceTechnology]: HyperspaceTechnology,
    [ResearchType.combustionDrive]: CombustionDrive,
    [ResearchType.impulseDrive]: ImpulseDrive,
    [ResearchType.hyperspaceDrive]: HyperspaceDrive,
    [ResearchType.laserTechnology]: LaserTechnology,
    [ResearchType.ionTechnology]: IonTechnology,
    [ResearchType.plasmaTechnology]: PlasmaTechnology,
    [ResearchType.intergalacticResearchNetwork]: IntergalacticResearchNetwork,
    [ResearchType.astrophysics]: Astrophysics,
    [ResearchType.gravitonTechnology]: GravitonTechnology,
};