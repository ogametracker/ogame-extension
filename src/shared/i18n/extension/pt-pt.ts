import { en as ships } from '../ogame/ships/en';
import { en as defenses } from '../ogame/defenses/en';
import { en as buildings } from '../ogame/buildings/en';
import { en as research } from '../ogame/research/en';
import { en as lifeforms } from '../ogame/lifeforms/en';
import { en as lifeformBuildings } from '../ogame/lifeforms/buildings/en';
import { en as lifeformTechnologies } from '../ogame/lifeforms/technologies/en';
import { en as premium } from '../ogame/premium/en';

import { ExtensionTranslations } from "./type";
import { pt_pt as settings } from './settings/pt_pt';
import { pt_pt as resources } from './resources/pt_pt';
import { pt_pt as common } from './common/pt_pt';
import { pt_pt as expeditions } from './expeditions/pt_pt';
import { pt_pt as combats } from './combats/pt_pt';
import { pt_pt as donate } from './donate/pt_pt';
import { pt_pt as debrisFields } from './debrisFields/pt_pt';
import { pt_pt as resourceBalance } from './resourceBalance/pt_pt';
import { pt_pt as empire } from './empire/pt_pt';
import { pt_pt as switchAccounts } from './switchAccounts/pt_pt';
import { pt_pt as about } from './about/pt_pt';
import { pt_pt as universeHistory } from './universeHistory/pt_pt';
import { pt_pt as notifications } from './notifications/pt_pt';
import { pt_pt as tools } from './tools/pt_pt';

import { pt_pt as excelExport } from './excelExport/pt_pt';
import { pt_pt as playerClasses } from './playerClasses/pt_pt';

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
