import { DefenseType } from "@/shared/models/ogame/defenses/DefenseType";
import { DefenseTranslations } from "./types";

export const pt_pt: DefenseTranslations =  {
    [DefenseType.rocketLauncher]: 'Lançador de Misséis',
    [DefenseType.lightLaser]: 'Laser Ligeiro',
    [DefenseType.heavyLaser]: 'Laser Pesado',
    [DefenseType.gaussCannon]: 'Canhão de Gauss',
    [DefenseType.ionCannon]: 'Canhão de Iões',
    [DefenseType.plasmaTurret]: 'Canhão de Plasma',
    [DefenseType.smallShieldDome]: 'Pequeno Escudo Planetário',
    [DefenseType.largeShieldDome]: 'Grande Escudo Planetário',
};
