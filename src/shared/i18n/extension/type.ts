import { RecursivePartial } from '@/shared/types/RecursivePartial';
import { BuildingTranslations } from '../ogame/buildings/types';
import { LifeformBuildingsTranslations } from '../ogame/lifeforms/buildings/types';
import { LifeformTechnologiesTranslations } from '../ogame/lifeforms/technologies/types';
import { LifeformTranslations } from '../ogame/lifeforms/types';
import { PremiumTranslations } from '../ogame/premium/types';
import { ResearchTranslations } from '../ogame/research/types';
import { ShipTranslations } from '../ogame/ships/types';
import { AboutTranslations } from './about/type';
import { CombatsTranslations } from './combats/type';
import { CommonTranslations } from './common/type';
import { DebrisFieldsTranslations } from './debrisFields/type';
import { DonateTranslations } from './donate/type';
import { EmpireTranslations } from './empire/type';
import { ExcelExportTranslations } from './excelExport/type';
import { ExpeditionsTranslations } from './expeditions/type';
import { NotificationTranslations } from './notifications/type';
import { ResourceBalanceTranslations } from './resourceBalance/type';
import { ResourceTranslations } from './resources/type';
import { SettingsTranslations } from './settings/type';
import { SwitchAccountsTranslations } from './switchAccounts/type';
import { ToolsTranslations } from './tools/type';
import { UniverseHistoryTranslations } from './universeHistory/type';

export interface ExtensionTranslationsFull {
    ogame: {
        buildings: BuildingTranslations;
        lifeforms: LifeformTranslations;
        lifeformBuildings: LifeformBuildingsTranslations;
        lifeformTechnologies: LifeformTechnologiesTranslations;
        premium: PremiumTranslations;
        research: ResearchTranslations;
        ships: ShipTranslations;
    };

    extension: {
        common: CommonTranslations;
        settings: SettingsTranslations;
        resources: ResourceTranslations;
        expeditions: ExpeditionsTranslations;
        combats: CombatsTranslations;
        donate: DonateTranslations;
        debrisFields: DebrisFieldsTranslations;
        resourceBalance: ResourceBalanceTranslations;
        empire: EmpireTranslations;
        switchAccounts: SwitchAccountsTranslations;
        about: AboutTranslations;
        universeHistory: UniverseHistoryTranslations;
        notifications: NotificationTranslations;
        tools: ToolsTranslations;

        excelExport: ExcelExportTranslations;
    };
}

export interface ExtensionTranslations {
    ogame: ExtensionTranslationsFull['ogame'];
    extension: RecursivePartial<ExtensionTranslationsFull['extension']>;
}