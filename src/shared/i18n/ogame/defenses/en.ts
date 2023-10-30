import { DefenseType } from "@/shared/models/ogame/defenses/DefenseType";
import { DefenseTranslations } from "./types";

export const en: DefenseTranslations =  {
    [DefenseType.rocketLauncher]: 'Rocket Launcher',
    [DefenseType.lightLaser]: 'Light Laser',
    [DefenseType.heavyLaser]: 'Heavy Laser',
    [DefenseType.gaussCannon]: 'Gauss Cannon',
    [DefenseType.ionCannon]: 'Ion Cannon',
    [DefenseType.plasmaTurret]: 'Plasma Turret',
    [DefenseType.smallShieldDome]: 'Small Shield Dome',
    [DefenseType.largeShieldDome]: 'Large Shield Dome',
};