import { LifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import { LifeformTranslations } from './types';

export const fr: LifeformTranslations = {
    [LifeformType.none]: 'Aucune forme de vie',
    [LifeformType.humans]: 'Les Humains',
    [LifeformType.rocktal]: 'Roctas',
    [LifeformType.mechas]: 'Mécas',
    [LifeformType.kaelesh]: 'Kaeleshs',
};
