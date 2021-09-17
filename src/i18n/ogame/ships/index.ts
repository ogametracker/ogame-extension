import LanguageKey from '@/i18n/languageKey';
import Ship from '@/models/Ship';
import de from './de';
import en from './en';
import dk from './dk';

export interface I18nOgameShips {
    [Ship.lightFighter]: string;
    [Ship.heavyFighter]: string;
    [Ship.cruiser]: string;
    [Ship.battleship]: string;
    [Ship.battlecruiser]: string;
    [Ship.bomber]: string;
    [Ship.destroyer]: string;
    [Ship.deathStar]: string;
    [Ship.reaper]: string;
    [Ship.pathfinder]: string;
    [Ship.smallCargo]: string;
    [Ship.largeCargo]: string;
    [Ship.recycler]: string;
    [Ship.colonyShip]: string;
    [Ship.espionageProbe]: string;
    [Ship.crawler]: string;
    [Ship.solarSatellite]: string;
}

const messages: Record<LanguageKey, I18nOgameShips> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
    [LanguageKey.dk]: dk,
};
export default messages;