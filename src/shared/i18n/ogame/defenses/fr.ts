import { DefenseType } from "@/shared/models/ogame/defenses/DefenseType";
import { DefenseTranslations } from "./types";

export const fr: DefenseTranslations =  {
    [DefenseType.rocketLauncher]: 'Lanceur de missiles',
    [DefenseType.lightLaser]: 'Artillerie laser légère',
    [DefenseType.heavyLaser]: 'Artillerie laser lourde',
    [DefenseType.gaussCannon]: 'Canon de Gauss',
    [DefenseType.ionCannon]: 'Artillerie à ions',
    [DefenseType.plasmaTurret]: 'Lanceur de plasma',
    [DefenseType.smallShieldDome]: 'Petit bouclier',
    [DefenseType.largeShieldDome]: 'Grand bouclier',
};
