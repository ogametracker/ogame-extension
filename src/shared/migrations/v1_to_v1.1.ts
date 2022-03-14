import { _logDebug } from "../utils/_log";
import { MigrationFunction } from "./models";

// #region INLINE MODELS 
enum Resource {
    metal = 'metal',
    crystal = 'crystal',
    deuterium = 'deuterium',
}
enum ItemHash {
    discoverer = '2dd05cc4c0e185fce2e712112dc44932027aee98',
    collector = '9374c79a24b84c4331f0d26526ef6c2d33319a6e',
    general = '77eff880829027daf23b755e14820a60c4c6fd93',

    researcher = '1aa36213cb676fd5baad5edc2bee4fbe117a778b',
    trader = '6c9fe5e35bdad0d4e3382eb6a5aeac6bc8263752',
    warrior = '9b48e257cbef6c5df0f03a47cead7f9abda3d437',

    metalBooster_bronze_1day = 'b956c46faa8e4e5d8775701c69dbfbf53309b279',
    metalBooster_bronze_7days = 'de922af379061263a56d7204d1c395cefcfb7d75',
    metalBooster_silver_7days = 'ba85cc2b8a5d986bbfba6954e2164ef71af95d4a',
    metalBooster_silver_30days = '742743b3b0ae1f0b8a1e01921042810b58f12f39',
    metalBooster_silver_90days = '6f44dcd2bd84875527abba69158b4e976c308bbc',
    metalBooster_gold_7days = '05294270032e5dc968672425ab5611998c409166',
    metalBooster_gold_30days = '6fecb993169fe918d9c63cd37a2e541cc067664e',
    metalBooster_gold_90days = '21c1a65ca6aecf54ffafb94c01d0c60d821b325d',
    metalBooster_platinum_7days = 'a83cfdc15b8dba27c82962d57e50d8101d263cfb',
    metalBooster_platinum_30days = 'c690f492cffe5f9f2952337e8eed307a8a62d6cf',
    metalBooster_platinum_90days = 'ca7f903a65467b70411e513b0920d66c417aa3a2',

    crystalBooster_bronze_1day = '090a969b05d1b5dc458a6b1080da7ba08b84ec7f',
    crystalBooster_bronze_7days = '3c9f85221807b8d593fa5276cdf7af9913c4a35d',
    crystalBooster_silver_7days = '422db99aac4ec594d483d8ef7faadc5d40d6f7d3',
    crystalBooster_silver_30days = '5b69663e3ba09a1fe77cf72c5094e246cfe954d6',
    crystalBooster_silver_90days = '04d8afd5936976e32ce894b765ea8bd168aa07ef',
    crystalBooster_gold_7days = '118d34e685b5d1472267696d1010a393a59aed03',
    crystalBooster_gold_30days = '36fb611e71d42014f5ebd0aa5a52bc0c81a0c1cb',
    crystalBooster_gold_90days = 'd45f00e8b909f5293a83df4f369737ea7d69c684',
    crystalBooster_platinum_7days = '35d96e441c21ef112a84c618934d9d0f026998fd',
    crystalBooster_platinum_30days = '6bf45fcba8a6a68158273d04a924452eca75cf39',
    crystalBooster_platinum_90days = '7c2edf40c5cd54ad11c6439398b83020c0a7a6be',

    deuteriumBooster_bronze_1day = 'e254352ac599de4dd1f20f0719df0a070c623ca8',
    deuteriumBooster_bronze_7days = 'd9fa5f359e80ff4f4c97545d07c66dbadab1d1be',
    deuteriumBooster_silver_7days = 'e4b78acddfa6fd0234bcb814b676271898b0dbb3',
    deuteriumBooster_silver_30days = '26416a3cdb94613844b1d3ca78b9057fd6ae9b15',
    deuteriumBooster_silver_90days = '6f0952a919fd2ab9c009e9ccd83c1745f98f758f',
    deuteriumBooster_gold_7days = '5560a1580a0330e8aadf05cb5bfe6bc3200406e2',
    deuteriumBooster_gold_30days = '300493ddc756869578cb2888a3a1bc0c3c66765f',
    deuteriumBooster_gold_90days = 'dc5896bed3311434224d511fa7ced6fdbe41b4e8',
    deuteriumBooster_platinum_7days = '4b51d903560edd102467b110586000bd64fdb954',
    deuteriumBooster_platinum_30days = '620f779dbffa1011aded69b091239727910a3d03',
    deuteriumBooster_platinum_90days = '831c3ea8d868eb3601536f4d5e768842988a1ba9',

    energyBooster_bronze_7days = '3f6f381dc9b92822406731a942c028adf8dc978f',
    energyBooster_silver_7days = 'c2bad58fcec374d709099d11d0549e59ea7e233e',
    energyBooster_silver_30days = 'bedd248aaf288c27e9351cfacfa6be03f1dbb898',
    energyBooster_silver_90days = 'e05aa5b9e3df5be3857b43da8403eafbf5ad3b96',
    energyBooster_gold_7days = '55b52cbfb148ec80cd4e5b0580f7bed01149d643',
    energyBooster_gold_30days = '4fa9a2273ee446284d5177fd9d60a22de01e932b',
    energyBooster_gold_90days = '5ad783dcfce3655ef97b36197425718a0dad6b66',
    energyBooster_platinum_7days = '77c36199102e074dca46f5f26ef57ce824d044dd',
    energyBooster_platinum_30days = 'dfe86378f8c3d7f3ee0790ea64603bc44e83ca47',
    energyBooster_platinum_90days = 'c39aa972a971e94b1d9b4d7a8f734b3d8be12534',

    moonFields_bronze = 'be67e009a5894f19bbf3b0c9d9b072d49040a2cc',
    moonFields_silver = 'c21ff33ba8f0a7eadb6b7d1135763366f0c4b8bf',
    moonFields_gold = '05ee9654bd11a261f1ff0e5d0e49121b5e7e4401',
    moonFields_platinum = '8a426241572b2fea57844acd99bc326fe40e35cf',

    moonShot_bronze = '485a6d5624d9de836d3eb52b181b13423f795770',
    moonShot_silver = 'fd895a5c9fd978b9c5c7b65158099773ba0eccef',
    moonShot_gold = '45d6660308689c65d97f3c27327b0b31f880ae75',

    planetFields_bronze = '16768164989dffd819a373613b5e1a52e226a5b0',
    planetFields_silver = '0e41524dc46225dca21c9119f2fb735fd7ea5cb3',
    planetFields_gold = '04e58444d6d0beb57b3e998edc34c60f8318825a',
    planetFields_platinum = 'f3d9b82e10f2e969209c1a5ad7d22181c703bb36',

    resourcePackage_all = 'c1d0232604872f899ea15a9772baf76880f55c5f',
    resourcePackage_metal = '859d82d316b83848f7365d21949b3e1e63c7841f',
    resourcePackage_crystal = 'bb2f6843226ef598f0b567b92c51b283de90aa48',
    resourcePackage_deuterium = 'cb72ed207dd871832a850ee29f1c1f83aa3f4f36',

    shortenTime_buildings = 'cb4fd53e61feced0d52cfc4c1ce383bad9c05f67',
    shortenTime_research = '14c17d49462963f5e5b67efa1257622ce1b866ac',
    shortenTime_shipyard = '75accaa0d1bc22b78d83b89cd437bdccd6a58887',

    kraken_bronze = '40f6c78e11be01ad3389b7dccd6ab8efa9347f3c',
    kraken_silver = '4a58d4978bbe24e3efb3b0248e21b3b4b1bfbd8a',
    kraken_gold = '929d5e15709cc51a4500de4499e19763c879f7f7',
    kraken_platinum = 'f36042d76e6b8b33d931e1d4ae99f35265cd82d1',

    detroid_bronze = 'd3d541ecc23e4daa0c698e44c32f04afd2037d84',
    detroid_silver = '27cbcd52f16693023cb966e5026d8a1efbbfc0f9',
    detroid_gold = '0968999df2fe956aa4a07aea74921f860af7d97f',
    detroid_platinum = '3347bcd4ee59f1d3fa03c4d18a25bca2da81de82',

    newtron_bronze = 'da4a2a1bb9afd410be07bc9736d87f1c8059e66d',
    newtron_silver = 'd26f4dab76fdc5296e3ebec11a1e1d2558c713ea',
    newtron_gold = '8a4f9e8309e1078f7f5ced47d558d30ae15b4a1b',
    newtron_platinum = 'a1ba242ede5286b530cdf991796b3d1cae9e4f23',

    expeditionslots_bronze_7days = 'e54ecc0416d6e96b4165f24238b03a1b32c1df47',
    expeditionslots_bronze_30days = '8c1f6c6849d1a5e4d9de6ae9bb1b861f6f7b5d4d',
    expeditionslots_bronze_90days = 'a5784c685c0e1e6111d9c18aeaf80af2e0777ab4',
    expeditionslots_silver_7days = 'b2bc9789df7c1ef5e058f72d61380b696dde54e8',
    expeditionslots_silver_30days = '31a504be1195149a3bef05b9cc6e3af185d24ef2',
    expeditionslots_silver_90days = '4f6f941bbf2a8527b0424b3ad11014502d8f4fb8',
    expeditionslots_gold_7days = '9336b9f29d36e3f69b0619c9523d8bec5e09ab8e',
    expeditionslots_gold_30days = 'fd7d35e73d0e09e83e30812b738ef966ea9ef790',
    expeditionslots_gold_90days = '540410439514ac09363c5c47cf47117a8b8ae79a',

    fleetSlots_bronze_7days = '0684c6a5a42acbb3cd134913d421fc28dae6b90d',
    fleetSlots_bronze_30days = '94a28491b6fd85003f1cb151e88dde106f1d7596',
    fleetSlots_bronze_90days = 'bb47add58876240199a18ddacc2db07789be1934',
    fleetSlots_silver_7days = 'f8fd610825fb4a442e27e4e9add74f050e040e27',
    fleetSlots_silver_30days = 'c4e598a85805a7eb3ca70f9265cbd366fc4d2b0e',
    fleetSlots_silver_90days = 'a693c5ce3f5676efaaf0781d94234bea4f599d2e',
    fleetSlots_gold_7days = '5a8000c372cd079292a92d35d4ddba3c0f348d3b',
    fleetSlots_gold_30days = '1808bf7639b81ac3ac87bcb7eb3bbba0a1874d0a',
    fleetSlots_gold_90days = '1f7024c4f6493f0c589e1b00c76e6ced258c00e5',

    migrationItem = '7eacfcee74660f30bb92a5874e8cccf2bb286ebd',
}
interface ExpoEventBase {
    id: number;
    date: number;
    type: ExpoType;
}
enum Ship {
    lightFighter = 204,
    heavyFighter = 205,
    cruiser = 206,
    battleship = 207,
    bomber = 211,
    battlecruiser = 215,
    destroyer = 213,
    deathStar = 214,
    reaper = 218,
    pathfinder = 219,
    smallCargo = 202,
    largeCargo = 203,
    espionageProbe = 210,
    recycler = 209,
    colonyShip = 208,
    solarSatellite = 212,
    crawler = 217,
}
interface ExpoSizeableEvent {
    size: ExpoSize;
}
type ExpoEventDarkMatter = ExpoEventBase & ExpoSizeableEvent & {
    type: ExpoType.darkMatter;
    darkMatter: number;
};
type ExpoEventResourcesList = Record<Resource, number>;
type ExpoEventResources = ExpoEventBase & ExpoSizeableEvent & {
    type: ExpoType.resources;
    resources: ExpoEventResourcesList;
};
enum ExpoFindableShips {
    lightFighter = Ship.lightFighter,
    heavyFighter = Ship.heavyFighter,
    cruiser = Ship.cruiser,
    battleship = Ship.battleship,
    battlecruiser = Ship.battlecruiser,
    bomber = Ship.bomber,
    destroyer = Ship.destroyer,
    reaper = Ship.reaper,
    pathfinder = Ship.pathfinder,
    smallCargo = Ship.smallCargo,
    largeCargo = Ship.largeCargo,
    espionageProbe = Ship.espionageProbe,
}
type ExpoFindableFleet = Record<ExpoFindableShips, number | undefined>;
type ExpoEventFleet = ExpoEventBase & ExpoSizeableEvent & {
    type: ExpoType.fleet;
    fleet: ExpoFindableFleet;
};
type ExpoEventItem = ExpoEventBase & {
    type: ExpoType.item;
    itemHash: ItemHash;
};
type ExpoEventEarly = ExpoEventBase & {
    type: ExpoType.early;
};
type ExpoEventDelay = ExpoEventBase & {
    type: ExpoType.delay;
};
type ExpoEventTrader = ExpoEventBase & {
    type: ExpoType.trader;
};
type ExpoEventLostFleet = ExpoEventBase & {
    type: ExpoType.lostFleet;
};
type ExpoEventNothing = ExpoEventBase & {
    type: ExpoType.nothing;
};
type ExpoEventAliens = ExpoEventBase & ExpoSizeableEvent & {
    type: ExpoType.aliens;
};
type ExpoEventPirates = ExpoEventBase & ExpoSizeableEvent & {
    type: ExpoType.pirates;
};
type ExpoEvent = ExpoEventDarkMatter
    | ExpoEventResources
    | ExpoEventFleet
    | ExpoEventItem
    | ExpoEventEarly
    | ExpoEventDelay
    | ExpoEventTrader
    | ExpoEventLostFleet
    | ExpoEventNothing
    | ExpoEventPirates
    | ExpoEventAliens;
enum ExpoSize {
    small = 'small',
    medium = 'medium',
    large = 'large',
}
enum ExpoType {
    nothing = 'nothing',
    resources = 'resources',
    fleet = 'fleet',
    delay = 'delay',
    early = 'early',
    darkMatter = 'darkMatter',
    pirates = 'pirates',
    aliens = 'aliens',
    item = 'item',
    trader = 'trader',
    lostFleet = 'lostFleet',
}
// #endregion


interface ExpoEventFleet_kaputt extends ExpoEventBase, ExpoSizeableEvent {
    type: ExpoType.fleet;
    fleet: {
        lightFighter: number;
        heavyFighter: number;
        cruiser: number;
        battleship: number;
        battlecruiser: number;
        bomber: number;
        destroyer: number;
        espionageProbe: number;
        largeCargo: number;
        pathfinder: number;
        reaper: number;
        smallCargo: number;
    };
}

function migrateExpo_v1_v1_1_fleetfix(expoEvent: ExpoEventFleet_kaputt): void {
    const fixedFleet: ExpoFindableFleet = {
        [Ship.lightFighter]: expoEvent.fleet.lightFighter,
        [Ship.heavyFighter]: expoEvent.fleet.heavyFighter,
        [Ship.cruiser]: expoEvent.fleet.cruiser,
        [Ship.battleship]: expoEvent.fleet.battleship,
        [Ship.battlecruiser]: expoEvent.fleet.battlecruiser,
        [Ship.bomber]: expoEvent.fleet.bomber,
        [Ship.destroyer]: expoEvent.fleet.destroyer,
        [Ship.espionageProbe]: expoEvent.fleet.espionageProbe,
        [Ship.largeCargo]: expoEvent.fleet.largeCargo,
        [Ship.pathfinder]: expoEvent.fleet.pathfinder,
        [Ship.reaper]: expoEvent.fleet.reaper,
        [Ship.smallCargo]: expoEvent.fleet.smallCargo,
    };

    (expoEvent as ExpoEventFleet).fleet = fixedFleet;
}


const migrate: MigrationFunction = async () => {
    _logDebug('migrating from v1 to v1.1');

    const allData = await chrome.storage.local.get(null);
    const keyPrefixes = [
        ...new Set<string>(
            Object.keys(allData)
                .map(key => key.match(/^(?<prefix>s\d+-\w+-\d+)-.+$/)?.groups?.prefix)
                .filter(key => key != null) as string[]
        )
    ].filter(prefix => allData[`${prefix}-version`] == '1.0');

    for (const prefix of keyPrefixes) {
        _logDebug(`migrating from v1 to v1.1: '${prefix}'`);
        const exposKey = `${prefix}-expoEvents`;
        const versionKey = `${prefix}-version`;
        const expos = allData[exposKey] as Record<number, ExpoEvent>;

        Object.values(expos).forEach(expo => {
            if (expo.type != ExpoType.fleet)
                return;

            migrateExpo_v1_v1_1_fleetfix(expo as ExpoEventFleet_kaputt);
        });

        await chrome.storage.local.set({
            [exposKey]: expos,
            [versionKey]: '1.1',
        });
    }
};
export default migrate;