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
import { LifeformDiscoveriesTranslations } from './lifeformDiscoveries/type';
import { NotificationTranslations } from './notifications/type';
import { ResourceBalanceTranslations } from './resourceBalance/type';
import { ResourceTranslations } from './resources/type';
import { SettingsTranslations } from './settings/type';
import { SwitchAccountsTranslations } from './switchAccounts/type';
import { UniverseHistoryTranslations } from './universeHistory/type';

export interface ExtensionTranslations {
    ships: ShipTranslations;
    buildings: BuildingTranslations;
    research: ResearchTranslations;
    lifeforms: LifeformTranslations;
    lifeformBuildings: LifeformBuildingsTranslations;
    lifeformTechnologies: LifeformTechnologiesTranslations;
    premium: PremiumTranslations;

    common: CommonTranslations;
    settings: SettingsTranslations;
    resources: ResourceTranslations;
    expeditions: ExpeditionsTranslations;
    lifeformDiscoveries: LifeformDiscoveriesTranslations;
    combats: CombatsTranslations;
    donate: DonateTranslations;
    debrisFields: DebrisFieldsTranslations;
    resourceBalance: ResourceBalanceTranslations;
    empire: EmpireTranslations;
    switchAccounts: SwitchAccountsTranslations;
    about: AboutTranslations;
    universeHistory: UniverseHistoryTranslations;
    notifications: NotificationTranslations;

    excelExport: ExcelExportTranslations;
}