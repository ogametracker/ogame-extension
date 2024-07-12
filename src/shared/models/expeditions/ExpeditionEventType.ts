export enum ExpeditionEventType {
    nothing = 'nothing',
    resources = 'resources',
    fleet = 'fleet',
    delay = 'delay',
    early = 'early',
    darkMatter = 'darkMatter',
    /** legacy */
    pirates = 'pirates',
    /** legacy */
    aliens = 'aliens',
    combat = 'combat',
    item = 'item',
    trader = 'trader',
    lostFleet = 'lostFleet',
}
export const ExpeditionEventTypes = [
    ExpeditionEventType.nothing,
    ExpeditionEventType.resources,
    ExpeditionEventType.fleet,
    ExpeditionEventType.delay,
    ExpeditionEventType.early,
    ExpeditionEventType.darkMatter,
    ExpeditionEventType.pirates,
    ExpeditionEventType.aliens,
    ExpeditionEventType.combat,
    ExpeditionEventType.item,
    ExpeditionEventType.trader,
    ExpeditionEventType.lostFleet,
];