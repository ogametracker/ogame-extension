<template>
    <lifeform-planet-bonuses-component
        :technologyBonuses="{}" 
        no-technology-bonuses
        :types="bonusTypes" 
        :buildings="buildings" 
        :forceIncludeBuildings="[BuildingType.spaceDock]"
        :planets="planets" 
        :limits="limits" 
        research-bonus-breakdown-route-name="lifeforms/bonus-breakdown/resource-production" 
    />
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { Component, Vue } from 'vue-property-decorator';
    import LifeformPlanetBonusesComponent, { LifeformPlanetBonusesType, LifeformPlanetBonuses } from '@/views/stats/components/lifeforms/LifeformPlanetBonuses.vue';
    import { getLifeformBonusLimit } from '@/shared/models/ogame/lifeforms/LifeformBonusLimits';
    import { LifeformBonusTypeId } from '@/shared/models/ogame/lifeforms/LifeformBonusType';
    import { LifeformBuildingType, LifeformBuildingTypesByLifeform } from '@/shared/models/ogame/lifeforms/LifeformBuildingType';
    import { LifeformBuildingsByType, SpaceDockBonusLifeformBuildings } from '@/shared/models/ogame/lifeforms/buildings/LifeformBuildings';
    import { createMappedRecord, createRecord } from '@/shared/utils/createRecord';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { SpaceDockBonusLifeformBuilding } from '@/shared/models/ogame/lifeforms/buildings/interfaces';
    import { BuildingType } from '@/shared/models/ogame/buildings/BuildingType';
    import { SpaceDock } from '@/shared/models/ogame/buildings/SpaceDock';
import { ServerSettingsDataModule } from '@/views/stats/data/ServerSettingsDataModule';

    type Key = 'wreckfield';

    @Component({
        components: {
            LifeformPlanetBonusesComponent,
        }
    })
    export default class ResourceProduction extends Vue {
        private get bonusTypes(): LifeformPlanetBonusesType<Key>[] {
            return [
                {
                    key: 'wreckfield',
                    label: this.$i18n.$t.extension.empire.lifeforms.planetBonuses.wreckfield.header,
                },
            ];
        }

        private readonly BuildingType = BuildingType;

        private readonly buildings: (LifeformBuildingType | BuildingType)[] = [
            SpaceDock.type,
            ...SpaceDockBonusLifeformBuildings.map(b => b.type),
        ];

        private get limits(): Record<Key, (value: number) => number> {
            const limit = getLifeformBonusLimit({ type: LifeformBonusTypeId.SpaceDockBonus });
            return {
                wreckfield: value => limit != null ? Math.min(value, limit) : value,
            };
        }

        private get empirePlanets() {
            return EmpireDataModule.empire.planetOrder
                    .map(id => EmpireDataModule.empire.planets[id])
                    .filter(planet => !planet.isMoon) as PlanetData[];
        }

        private get planets(): Record<number, LifeformPlanetBonuses<Key>> {
            return createMappedRecord(
                this.empirePlanets,

                planet => planet.id,
                planet => {
                    const activeBuildingTypes = (LifeformBuildingTypesByLifeform[planet.activeLifeform] as (LifeformBuildingType | BuildingType)[])
                        .filter(b => this.buildings.includes(b))
                        .concat(SpaceDock.type); 

                    
                    const bonusByBuilding = createRecord<Key, Record<LifeformBuildingType | BuildingType, number>>(
                        ['wreckfield'], 
                        () => createRecord(
                            activeBuildingTypes, 
                            type =>  {
                                const dfSetting = ServerSettingsDataModule.serverSettings.combats.debrisFieldFactors.ships;
                                const wfFactor = SpaceDock.getWreckfield(planet.buildings[BuildingType.spaceDock], dfSetting);
                                    
                                if(type == BuildingType.spaceDock) {
                                    return wfFactor;
                                }

                                const lfBuildingType = type as LifeformBuildingType;
                                const bonus =  (LifeformBuildingsByType[lfBuildingType] as SpaceDockBonusLifeformBuilding)
                                    .getSpaceDockBonus(planet.lifeformBuildings[lfBuildingType])

                                return bonus * wfFactor;
                            },
                        )
                    );

                    return {
                        planet,
                        bonusByBuilding,
                    };
                }
            );
        }
    }
</script>