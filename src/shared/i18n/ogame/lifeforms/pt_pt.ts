import { LifeformTranslations } from "./types";
import { en } from './en';
import { LifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";

export const pt_pt: LifeformTranslations = {
    ...en,
    [LifeformType.humans]: 'Humanos',
};