import { DefenseType } from "@/shared/models/ogame/defenses/DefenseType";
import { DefenseTranslations } from "./types";

export const de: DefenseTranslations = {
    [DefenseType.rocketLauncher]: 'Raketenwerfer',
    [DefenseType.lightLaser]: 'Leichtes Lasergeschütz',
    [DefenseType.heavyLaser]: 'Schweres Lasergeschütz',
    [DefenseType.gaussCannon]: 'Gaußkanone',
    [DefenseType.ionCannon]: 'Ionengeschütz',
    [DefenseType.plasmaTurret]: 'Plasmawerfer',
    [DefenseType.smallShieldDome]: 'Kleine Schildkuppel',
    [DefenseType.largeShieldDome]: 'Große Schildkuppel',
};