import { DefenseType } from '../ogame/defenses/DefenseType';

export type DefenseCount = Record<Exclude<DefenseType, DefenseType.smallShieldDome | DefenseType.largeShieldDome>, number>
    & Record<DefenseType.smallShieldDome | DefenseType.largeShieldDome, boolean>;