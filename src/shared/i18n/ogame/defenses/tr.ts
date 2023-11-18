import { DefenseType } from "@/shared/models/ogame/defenses/DefenseType";
import { DefenseTranslations } from "./types";

export const tr: DefenseTranslations = {
    [DefenseType.rocketLauncher]: 'Roketatar',
    [DefenseType.lightLaser]: 'Hafif Lazer Topu',
    [DefenseType.heavyLaser]: 'Ağır Lazer Topu',
    [DefenseType.gaussCannon]: 'Gaus Topu',
    [DefenseType.ionCannon]: 'Iyon Topu',
    [DefenseType.plasmaTurret]: 'Plazma Atıcı',
    [DefenseType.smallShieldDome]: 'Küçük Kalkan Kubbesi',
    [DefenseType.largeShieldDome]: 'Büyük Kalkan Kubbesi',
};