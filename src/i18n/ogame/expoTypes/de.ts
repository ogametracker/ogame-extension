import ExpoType from "@/models/expeditions/ExpoType";

export default {
    expoTypes: {
        [ExpoType.aliens]: 'Aliens',
        [ExpoType.pirates]: 'Piraten',
        [ExpoType.darkMatter]: 'Dunkle Materie',
        [ExpoType.delay]: 'Verspätung',
        [ExpoType.early]: 'Verfühung',
        [ExpoType.fleet]: 'Flotte',
        [ExpoType.item]: 'Item',
        [ExpoType.lostFleet]: 'Flottenverlust',
        [ExpoType.nothing]: 'Ohne Ereignis',
        [ExpoType.resources]: 'Rohstoffe',
        [ExpoType.trader]: 'Händler',
    },
};