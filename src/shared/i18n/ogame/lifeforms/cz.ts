import { LifeformTranslations } from "./types";
import { en } from './en';
import { LifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";

export const cz: LifeformTranslations = {
    ...en,
    [LifeformType.humans]: 'Lidé',
    [LifeformType.rocktal]: 'Rock\'talové',
    [LifeformType.mechas]: 'Mechani',
    [LifeformType.kaelesh]: 'Kaeleshi',
};