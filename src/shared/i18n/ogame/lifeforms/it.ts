import { LifeformTranslations } from "./types";
import { en } from './en';
import { LifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";

export const it: LifeformTranslations = {
    ...en,
    [LifeformType.humans]: 'Umani',
    [LifeformType.mechas]: 'Mecha',
};