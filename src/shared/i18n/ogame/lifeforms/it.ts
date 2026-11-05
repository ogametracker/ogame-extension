import { LifeformTranslations } from "./types";
import { LifeformType } from "@ogame-tracker/shared/models/ogame/lifeforms/LifeformType";

export const it: LifeformTranslations = {
    [LifeformType.none]: 'Nessuna forma di vita',
    [LifeformType.humans]: 'Umani',
    [LifeformType.rocktal]: 'Rock\'tal',
    [LifeformType.mechas]: 'Mecha',
    [LifeformType.kaelesh]: 'Kaelesh',
};