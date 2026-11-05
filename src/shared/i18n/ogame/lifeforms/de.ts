import { LifeformTranslations } from "./types";
import { LifeformType } from "@ogame-tracker/shared/models/ogame/lifeforms/LifeformType";

export const de: LifeformTranslations = {
    [LifeformType.none]: 'Keine Lebensform',
    [LifeformType.humans]: 'Menschen',
    [LifeformType.rocktal]: 'Rock\'tal',
    [LifeformType.mechas]: 'Mechas',
    [LifeformType.kaelesh]: 'Kaelesh',
};