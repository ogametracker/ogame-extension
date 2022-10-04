import { LifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";
import { LifeformTranslations } from "./types";

export const si: LifeformTranslations = {
    [LifeformType.none]: 'No Lifeform',
    [LifeformType.humans]: 'Humans',
    [LifeformType.rocktal]: 'Rock\'tal',
    [LifeformType.mechas]: 'Mechas',
    [LifeformType.kaelesh]: 'Kaelesh',
};