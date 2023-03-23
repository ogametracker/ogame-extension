import { ExpeditionEventCombatSize } from "./ExpeditionEvents";

export enum ExpeditionEventSize {
    small = 'small',
    medium = 'medium',
    large = 'large',
}
export const ExpeditionEventSizes: ExpeditionEventSize[] = [
    ExpeditionEventSize.small,
    ExpeditionEventSize.medium,
    ExpeditionEventSize.large,
];

export const ExpeditionEventCombatSizes: ExpeditionEventCombatSize[] = [
    ...ExpeditionEventSizes,
    'fled-death-star',
];