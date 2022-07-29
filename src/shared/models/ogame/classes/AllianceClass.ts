export enum AllianceClass {
    trader = 'trader',
    researcher = 'researcher',
    warrior = 'warrior',
    none = 'none',
}

export const AllianceClasses: AllianceClass[] = [
    AllianceClass.none,
    AllianceClass.trader,
    AllianceClass.researcher,
    AllianceClass.warrior,
];

export const SelectableAllianceClasses: AllianceClass[] = [
    AllianceClass.trader,
    AllianceClass.researcher,
    AllianceClass.warrior,
];