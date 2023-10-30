import { en as ships } from '../ogame/ships/en';
import { en as defenses } from '../ogame/defenses/en';
import { en as buildings } from '../ogame/buildings/en';
import { en as research } from '../ogame/research/en';
import { en as lifeforms } from '../ogame/lifeforms/en';
import { en as lifeformBuildings } from '../ogame/lifeforms/buildings/en';
import { en as lifeformTechnologies } from '../ogame/lifeforms/technologies/en';
import { en as premium } from '../ogame/premium/en';

import { ExtensionTranslations } from "./type";
import { en as settings } from './settings/en';
import { en as resources } from './resources/en';
import { en as common } from './common/en';
import { en as expeditions } from './expeditions/en';
import { en as combats } from './combats/en';
import { en as donate } from './donate/en';
import { en as debrisFields } from './debrisFields/en';
import { en as resourceBalance } from './resourceBalance/en';
import { en as empire } from './empire/en';
import { en as switchAccounts } from './switchAccounts/en';
import { en as about } from './about/en';
import { en as universeHistory } from './universeHistory/en';
import { en as notifications } from './notifications/en';
import { en as tools } from './tools/en';

import { en as excelExport } from './excelExport/en';
import { en as playerClasses } from './playerClasses/en';

export const en: ExtensionTranslations = {
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