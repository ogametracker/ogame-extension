import { ShipTranslations } from '../ogame/ships/types';
import { ResourceTranslations } from './resources/type';
import { SettingsTranslations } from './settings/type';

export interface ExtensionTranslations {
    settings: SettingsTranslations;
    ships: ShipTranslations;
    resources: ResourceTranslations;
}