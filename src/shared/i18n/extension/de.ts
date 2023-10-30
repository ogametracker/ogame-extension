import { de as ships } from '../ogame/ships/de';
import { de as defenses } from '../ogame/defenses/de';
import { de as buildings } from '../ogame/buildings/de';
import { de as research } from '../ogame/research/de';
import { de as lifeforms } from '../ogame/lifeforms/de';
import { de as lifeformBuildings } from '../ogame/lifeforms/buildings/de';
import { de as lifeformTechnologies } from '../ogame/lifeforms/technologies/de';
import { de as premium } from '../ogame/premium/de';

import { ExtensionTranslations } from "./type";
import { de as settings } from './settings/de';
import { de as resources } from './resources/de';
import { de as common } from './common/de';
import { de as expeditions } from './expeditions/de';
import { de as combats } from './combats/de';
import { de as donate } from './donate/de';
import { de as debrisFields } from './debrisFields/de';
import { de as resourceBalance } from './resourceBalance/de';
import { de as empire } from './empire/de';
import { de as switchAccounts } from './switchAccounts/de';
import { de as about } from './about/de';
import { de as universeHistory } from './universeHistory/de';
import { de as notifications } from './notifications/de';
import { de as tools } from './tools/de';

import { de as excelExport } from './excelExport/de';
import { de as playerClasses } from './playerClasses/de';

export const de: ExtensionTranslations = {
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