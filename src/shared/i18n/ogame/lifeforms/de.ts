import { LifeformTranslations } from "./types";
import { en } from './en';
import { LifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";

export const de: LifeformTranslations = {
    ...en,
    [LifeformType.humans]: 'Menschen',
    [LifeformType.none]: 'Keine Lebensform',
};