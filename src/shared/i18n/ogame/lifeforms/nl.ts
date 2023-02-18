import { LifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";
import { LifeformTranslations } from "./types";

export const nl: LifeformTranslations = {
    [LifeformType.none]: 'Geen levensvormen',
    [LifeformType.humans]: 'Mensen',
    [LifeformType.rocktal]: 'Rock\'tal',
    [LifeformType.mechas]: 'Mechas',
    [LifeformType.kaelesh]: 'Kaelesh',
};