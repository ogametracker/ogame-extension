import { LifeformType } from "@ogame-tracker/shared/models/ogame/lifeforms/LifeformType";
import { LifeformTranslations } from "./types";

export const pl: LifeformTranslations = {
    [LifeformType.none]: 'Brak formy życia',
    [LifeformType.humans]: 'Ludzie',
    [LifeformType.rocktal]: 'Rock`talowie',
    [LifeformType.mechas]: 'Mechy',
    [LifeformType.kaelesh]: 'Kaeleshowie',
};