import { en as ships } from '../ogame/ships/en';
import { en as defenses } from '../ogame/defenses/en';
import { en as buildings } from '../ogame/buildings/en';
import { en as research } from '../ogame/research/en';
import { en as lifeforms } from '../ogame/lifeforms/en';
import { en as lifeformBuildings } from '../ogame/lifeforms/buildings/en';
import { en as lifeformTechnologies } from '../ogame/lifeforms/technologies/en';
import { en as premium } from '../ogame/premium/en';

import { ExtensionTranslations } from "./type";
import { pt-pt as settings } from './settings/pt-pt';
import { pt-pt as resources } from './resources/pt-pt';
import { pt-pt as common } from './common/pt-pt';
import { pt-pt as expeditions } from './expeditions/pt-pt';
import { pt-pt as combats } from './combats/pt-pt';
import { pt-pt as donate } from './donate/pt-pt';
import { pt-pt as debrisFields } from './debrisFields/pt-pt';
import { pt-pt as resourceBalance } from './resourceBalance/pt-pt';
import { pt-pt as empire } from './empire/pt-pt';
import { pt-pt as switchAccounts } from './switchAccounts/pt-pt';
import { pt-pt as about } from './about/pt-pt';
import { pt-pt as universeHistory } from './universeHistory/pt-pt';
import { pt-pt as notifications } from './notifications/pt-pt';
import { pt-pt as tools } from './tools/pt-pt';

import { pt-pt as excelExport } from './excelExport/pt-pt';
import { pt-pt as playerClasses } from './playerClasses/pt-pt';

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
