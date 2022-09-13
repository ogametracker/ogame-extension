import { BallisticMissile } from "./BallisticMissile";
import { Defense } from "./Defense";
import { DefenseType } from "./DefenseType";
import { GaussCannon } from "./GaussCannon";
import { HeavyLaser } from "./HeavyLaser";
import { InterplanetaryMissile } from "./InterplanetaryMissile";
import { IonCannon } from "./IonCannon";
import { LargeShieldDome } from "./LargeShieldDome";
import { LightLaser } from "./LightLaser";
import { PlasmaTurret } from "./PlasmaTurret";
import { RocketLauncher } from "./RocketLauncher";
import { SmallShieldDome } from "./SmallShieldDome";

export const DefenseTypes: DefenseType[] = [
    DefenseType.rocketLauncher,
    DefenseType.lightLaser,
    DefenseType.heavyLaser,
    DefenseType.gaussCannon,
    DefenseType.ionCannon,
    DefenseType.plasmaTurret,
    DefenseType.smallShieldDome,
    DefenseType.largeShieldDome,

    DefenseType.ballisticMissile,
    DefenseType.interplanetaryMissile,
];


export const DefenseByTypes: Record<DefenseType, Defense> = {
    [DefenseType.rocketLauncher]: RocketLauncher,
    [DefenseType.lightLaser]: LightLaser,
    [DefenseType.heavyLaser]: HeavyLaser,
    [DefenseType.gaussCannon]: GaussCannon,
    [DefenseType.ionCannon]: IonCannon,
    [DefenseType.plasmaTurret]: PlasmaTurret,
    [DefenseType.smallShieldDome]: SmallShieldDome,
    [DefenseType.largeShieldDome]: LargeShieldDome,

    [DefenseType.ballisticMissile]: BallisticMissile,
    [DefenseType.interplanetaryMissile]: InterplanetaryMissile,
};