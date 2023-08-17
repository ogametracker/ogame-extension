import { LifeformTranslations } from "./types";
import { LifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";

export const ro: LifeformTranslations = {
    [LifeformType.none]: 'Nu sunt forme de viață',
    [LifeformType.humans]: 'Oameni',
    [LifeformType.rocktal]: 'Rock\'tal',
    [LifeformType.mechas]: 'Mechas',
    [LifeformType.kaelesh]: 'Kaelesh',
};