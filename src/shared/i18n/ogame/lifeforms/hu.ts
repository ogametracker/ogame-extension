import { LifeformTranslations } from "./types";
import { LifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";

export const hu: LifeformTranslations = {
    [LifeformType.none]: 'Életforma',
    [LifeformType.humans]: 'Emberek',
    [LifeformType.rocktal]: 'Rock\'talok',
    [LifeformType.mechas]: 'Mechák',
    [LifeformType.kaelesh]: 'Kaeleshek',
};