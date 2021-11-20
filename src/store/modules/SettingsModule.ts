
import { extensionI18n } from '@/i18n';
import LanguageKey from '@/i18n/languageKey';
import getLanguage from '@/i18n/mapLanguage';
import ExpoType from '@/models/expeditions/ExpoType';
import OgameMetaData from '@/models/ogame/OgameMetaData';
import Resource from '@/models/Resource';
import Settings from '@/models/settings/Settings';
import Ship from '@/models/Ship';
import asyncChromeStorage from '@/utils/asyncChromeStorage';
import waitForDocumentLoad from '@/utils/waitForDocumentLoad';
import { Component, Vue } from 'vue-property-decorator';

@Component({})
class SettingsModule extends Vue {
    public settings: Settings = null!;

    public getDefaultSettings(): Settings {
        return {
            tables: {
                ranges: [
                    {
                        type: "day",
                        skip: 0,
                        take: 1,
                        label: extensionI18n.$t.settings.defaultRanges.today,
                    },
                    {
                        type: "day",
                        skip: 1,
                        take: 1,
                        label: extensionI18n.$t.settings.defaultRanges.yesterday,
                    },
                    {
                        type: "week",
                        skip: 0,
                        take: 1,
                        label: extensionI18n.$t.settings.defaultRanges.currentWeek,
                    },
                    {
                        type: "week",
                        skip: 1,
                        take: 1,
                        label: extensionI18n.$t.settings.defaultRanges.lastWeek,
                    },
                    {
                        type: "month",
                        skip: 0,
                        take: 1,
                        label: extensionI18n.$t.settings.defaultRanges.currentMonth,
                    },
                    {
                        type: "all",
                    },
                ]
            },
            charts: {
                days: 31,
                colors: {
                    overview: {
                        [ExpoType.nothing]: '#2472f3',
                        [ExpoType.resources]: '#c72525',
                        [ExpoType.fleet]: '#fbbc04',
                        [ExpoType.delay]: '#9ecc00',
                        [ExpoType.early]: '#00a95e',
                        [ExpoType.darkMatter]: '#075263',
                        [ExpoType.pirates]: '#de5200',
                        [ExpoType.aliens]: '#16a8d4',
                        [ExpoType.item]: '#ad135e',
                        [ExpoType.trader]: '#888888',
                        [ExpoType.lostFleet]: '#ffffff',
                    },
                    resources: {
                        [Resource.metal]: '#de5200',
                        [Resource.crystal]: '#249df3',
                        [Resource.deuterium]: '#14bf73',
                    },
                    ships: {
                        [Ship.lightFighter]: '#2472f3',
                        [Ship.heavyFighter]: '#c72525',
                        [Ship.cruiser]: '#fbbc04',
                        [Ship.battleship]: '#9ecc00',
                        [Ship.bomber]: '#00a95e',
                        [Ship.battlecruiser]: '#075263',
                        [Ship.destroyer]: '#de5200',
                        [Ship.reaper]: '#16a8d4',
                        [Ship.pathfinder]: '#ad135e',
                        [Ship.smallCargo]: '#888888',
                        [Ship.largeCargo]: '#ffffff',
                        [Ship.espionageProbe]: '#4b17da',
                        [Ship.deathStar]: '#250909',
                        [Ship.recycler]: '#8aff8e',
                        [Ship.colonyShip]: '#d7b58e',
                        [Ship.crawler]: '#94b4ff',
                        [Ship.solarSatellite]: '#dd94ff',
                    },
                    battleResults: {
                        draw: '#888888',
                        lost: '#c72525',
                        won: '#00a95e',
                    },
                },
            },
            msuConversionRates: {
                [Resource.crystal]: 2,
                [Resource.deuterium]: 3,
            },
            
            language: getLanguage(LanguageKey.en),
        };
    }

    private async updateSettings() {
        const defaultSettings = this.getDefaultSettings();
        const settings = await asyncChromeStorage.get<Settings>(this.storageKey);

        this.settings = {
            ...defaultSettings,
            ...settings
        };

        await Promise.resolve();
    }

    public createdPromise: Promise<void> = Promise.resolve();
    private async created() {
        await waitForDocumentLoad;

        this.createdPromise = this.init();
        await this.createdPromise;
    }

    private async init() {
        await this.updateSettings();

        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName != 'local') {
                return;
            }
            if (!(this.storageKey in changes)) {
                return;
            }

            // update settings
            this.updateSettings();
        });
    }

    private get storageKey(): string {
        return `${OgameMetaData.storageKeyPrefix}-settings`;
    }

    public async save() {
        await asyncChromeStorage.set(this.storageKey, this.settings);
    }
}

export default new SettingsModule();