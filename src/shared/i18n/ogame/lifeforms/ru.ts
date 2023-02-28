import { LifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";
import { LifeformTranslations } from "./types";

export const ru: LifeformTranslations = {
    [LifeformType.none]: 'Нет форм жизни',
    [LifeformType.humans]: 'Люди',
    [LifeformType.rocktal]: 'Рок’тал',
    [LifeformType.mechas]: 'Мехи',
    [LifeformType.kaelesh]: 'Кэлиш',
};