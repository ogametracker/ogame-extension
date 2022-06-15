import { ShipTranslations } from '../ogame/ships/types';
import { CombatsTranslations } from './combats/type';
import { CommonTranslations } from './common/type';
import { DonateTranslations } from './donate/type';
import { ExpeditionsTranslations } from './expeditions/type';
import { ResourceTranslations } from './resources/type';
import { SettingsTranslations } from './settings/type';

export interface ExtensionTranslations {
    common: CommonTranslations;
    settings: SettingsTranslations;
    ships: ShipTranslations;
    resources: ResourceTranslations;
    expeditions: ExpeditionsTranslations;
    combats: CombatsTranslations;
    donate: DonateTranslations;
}