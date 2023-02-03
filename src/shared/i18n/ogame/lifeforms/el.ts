import { LifeformTranslations } from "./types";
import { LifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";

export const el: LifeformTranslations = {
    [LifeformType.none]: 'Καμία μορφή ζωής',
    [LifeformType.humans]: 'Άνθρωποι',
    [LifeformType.rocktal]: 'Ροκ`ταλ',
    [LifeformType.mechas]: 'Μέχα',
    [LifeformType.kaelesh]: 'Κελές',
};