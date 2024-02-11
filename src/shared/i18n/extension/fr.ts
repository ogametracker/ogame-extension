import { fr as ships } from '../ogame/ships/fr';
import { fr as defenses } from '../ogame/defenses/fr';
import { fr as buildings } from '../ogame/buildings/fr';
import { fr as research } from '../ogame/research/fr';
import { fr as lifeforms } from '../ogame/lifeforms/fr';
import { fr as lifeformBuildings } from '../ogame/lifeforms/buildings/fr';
import { fr as lifeformTechnologies } from '../ogame/lifeforms/technologies/fr';
import { fr as premium } from '../ogame/premium/fr';

import { ExtensionTranslations } from "./type";
import { fr as settings } from './settings/fr';
import { fr as resources } from './resources/fr';
import { fr as common } from './common/fr';
import { fr as expeditions } from './expeditions/fr';
import { fr as combats } from './combats/fr';
import { fr as donate } from './donate/fr';
import { fr as debrisFields } from './debrisFields/fr';
import { fr as resourceBalance } from './resourceBalance/fr';
import { fr as empire } from './empire/fr';
import { fr as switchAccounts } from './switchAccounts/fr';
import { fr as about } from './about/fr';
import { fr as universeHistory } from './universeHistory/fr';
import { fr as notifications } from './notifications/fr';
import { fr as tools } from './tools/fr';

import { fr as excelExport } from './excelExport/fr';
import { fr as playerClasses } from './playerClasses/fr';
import { RecursivePartial } from '@/shared/types/RecursivePartial';

export const fr: RecursivePartial<ExtensionTranslations> = {
    ogame: {
        buildings,
        lifeforms,
        lifeformBuildings,
        lifeformTechnologies,
        premium,
        resources,
        research,
        ships,
        defenses,
    },

    extension: {
        common,
        settings,
        resources,
        expeditions,
        combats,
        donate,
        debrisFields,
        resourceBalance,
        empire,
        switchAccounts,
        about,
        universeHistory,
        notifications,
        tools,

        excelExport,
        playerClasses,
    },
};
