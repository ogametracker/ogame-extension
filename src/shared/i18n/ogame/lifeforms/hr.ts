import { LifeformTranslations } from "./types";
import { LifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";

export const hr: LifeformTranslations = {
    [LifeformType.none]: 'No Lifeform',
    [LifeformType.humans]: 'Humans',
    [LifeformType.rocktal]: 'Rock\'tal',
    [LifeformType.mechas]: 'Mechas',
    [LifeformType.kaelesh]: 'Kaelesh',
};