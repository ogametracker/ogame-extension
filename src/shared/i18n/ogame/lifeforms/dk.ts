import { LifeformTranslations } from "./types";
import { LifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";

export const dk: LifeformTranslations = {
    [LifeformType.none]: 'Ingen livsformer',
    [LifeformType.humans]: 'Mennesker',
    [LifeformType.rocktal]: 'Rock\'tal',
    [LifeformType.mechas]: 'Mechas',
    [LifeformType.kaelesh]: 'Kaelesh',
};