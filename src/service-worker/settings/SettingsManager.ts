import { isSupportedLanguage } from '../../shared/i18n/isSupportedLanguage';
import { LanguageKey } from '../../shared/i18n/LanguageKey';
import { CombatResultType } from '../../shared/models/v1/combat-reports/CombatResultType';
import { ExpeditionEventSize } from '../../shared/models/v1/expeditions/ExpeditionEventSize';
import { ExpeditionEventType } from '../../shared/models/v1/expeditions/ExpeditionEventType';
import { ResourceType } from '../../shared/models/v1/ogame/resources/ResourceType';
import { ShipType } from '../../shared/models/v1/ogame/ships/ShipType';
import { Settings } from '../../shared/models/v1/settings/Settings';
import { PersistentDataManager } from '../PersistentData';

export class SettingsManager extends PersistentDataManager<Settings> {
    private readonly ogameLanguage: string;

    constructor(key: string) {
        super(key, 'settings');

        this.ogameLanguage = key.split('-')[1];
        console.debug(`[Settings Maager]: Ogame language is '${this.ogameLanguage}'`);
    }

    protected getDefaultItem(): Settings {
        return {
            dateRanges: [],
            showDetailedResourceBalance: false,
            msuConversionRates: {
                crystal: 2,
                deuterium: 3,
            },
            expeditionFoundShipsResourceFactor: 1,
            extensionLanguage: isSupportedLanguage(this.ogameLanguage) ? LanguageKey[this.ogameLanguage as LanguageKey] : LanguageKey.en,
            defaultRoutes: {},
            colors: {
                combatResults: {
                    [CombatResultType.won]: '#00a95e',
                    [CombatResultType.draw]: '#888888',
                    [CombatResultType.lost]: '#c72525',
                },
                resources: {
                    [ResourceType.metal]: '#de5200',
                    [ResourceType.crystal]: '#249df3',
                    [ResourceType.deuterium]: '#14bf73',
                    totalMsu: '#999999',
                },
                ships: {
                    [ShipType.lightFighter]: '#2472f3',
                    [ShipType.heavyFighter]: '#c72525',
                    [ShipType.cruiser]: '#fbbc04',
                    [ShipType.battleship]: '#9ecc00',
                    [ShipType.bomber]: '#00a95e',
                    [ShipType.battlecruiser]: '#075263',
                    [ShipType.destroyer]: '#de5200',
                    [ShipType.reaper]: '#16a8d4',
                    [ShipType.pathfinder]: '#ad135e',
                    [ShipType.smallCargo]: '#888888',
                    [ShipType.largeCargo]: '#ffffff',
                    [ShipType.espionageProbe]: '#4b17da',
                    [ShipType.deathStar]: '#262530',
                    [ShipType.recycler]: '#8aff8e',
                    [ShipType.colonyShip]: '#d7b58e',
                    [ShipType.crawler]: '#94b4ff',
                    [ShipType.solarSatellite]: '#dd94ff',
                },
                expeditions: {
                    events: {
                        [ExpeditionEventType.nothing]: '#666666',
                        [ExpeditionEventType.resources]: '#a36ae3',
                        [ExpeditionEventType.fleet]: '#4525c7',
                        [ExpeditionEventType.delay]: '#ff6f00',
                        [ExpeditionEventType.early]: '#64dd17',
                        [ExpeditionEventType.darkMatter]: '#359cb3',
                        [ExpeditionEventType.pirates]: '#ffb592',
                        [ExpeditionEventType.aliens]: '#92ffdc',
                        [ExpeditionEventType.item]: '#ad135e',
                        [ExpeditionEventType.trader]: '#fbbc04',
                        [ExpeditionEventType.lostFleet]: '#d50000',
                    },
                    sizes: {
                        [ExpeditionEventSize.small]: '#6c6c6c',
                        [ExpeditionEventSize.medium]: '#5494ff',
                        [ExpeditionEventSize.large]: '#ab47bc',
                    },
                },
            },
        };
    }
}