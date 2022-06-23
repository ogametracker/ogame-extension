import { ShipTranslations } from '../ogame/ships/types';
import { AboutTranslations } from './about/type';
import { CombatsTranslations } from './combats/type';
import { CommonTranslations } from './common/type';
import { DebrisFieldsTranslations } from './debrisFields/type';
import { DonateTranslations } from './donate/type';
import { EmpireTranslations } from './empire/type';
import { ExpeditionsTranslations } from './expeditions/type';
import { ResourceBalanceTranslations } from './resourceBalance/type';
import { ResourceTranslations } from './resources/type';
import { SettingsTranslations } from './settings/type';
import { SwitchAccountsTranslations } from './switchAccounts/type';
import { UniverseHistoryTranslations } from './universeHistory/type';

export interface ExtensionTranslations {
    common: CommonTranslations;
    settings: SettingsTranslations;
    ships: ShipTranslations;
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
}