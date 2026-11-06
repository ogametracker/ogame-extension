import { LifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import { LifeformTranslations } from './types';

export const tr: LifeformTranslations = {
    [LifeformType.none]: 'Canlı türü yok',
    [LifeformType.humans]: 'İnsanlar',
    [LifeformType.rocktal]: 'Rock’tal',
    [LifeformType.mechas]: 'Mekalar',
    [LifeformType.kaelesh]: 'Kaeleshler',
};
