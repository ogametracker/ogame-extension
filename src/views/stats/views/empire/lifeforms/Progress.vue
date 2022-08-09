<template>
    <grid-table :columns="columns" :items="items" sticky>
        <template #cell-lifeform="{ value }">
            <o-lifeform :lifeform="value" />
            <span class="ml-1" v-text="$i18n.$t.lifeforms[value]" />
        </template>
        <template #cell-discoverDate="{ value, item }">
            <span v-if="value != null" v-text="$i18n.$d(value, 'datetime')" />
            <span v-else-if="item.totalExperience > 0" v-text="$i18n.$t.empire.lifeforms.discoveryDateUnknown" />
            <i v-else v-text="$i18n.$t.empire.lifeforms.notDiscoveredYet" />
        </template>
        <template #cell-level="{ item }">
            <span v-text="`${item.level} (${$i18n.$n(item.levelExperience)}/${$i18n.$n(item.neededLevelExperience)} XP)`" />
        </template>
        <template #cell-totalExperience="{ value }">
            <span v-text="$i18n.$n(value)" />
        </template>
        <template #cell-findingCount="{ value }">
            <span v-text="$i18n.$n(value)" />
        </template>
    </grid-table>
</template>

<script lang="ts">
    import { getLifeformExperienceNeededForLevel, getLifeformLevel } from '@/shared/models/ogame/lifeforms/experience';
    import { ValidLifeformType, ValidLifeformTypes } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { GridTableColumn } from '@/views/stats/components/common/GridTable.vue';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { LifeformDiscoveryDataModule } from '@/views/stats/data/LifeformDiscoveryDataModule';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    interface LifeformProgressItem {
        lifeform: ValidLifeformType;
        level: number;
        levelExperience: number;
        neededLevelExperience: number;
        totalExperience: number;
        discoverDate?: number;
        findingCount: number;
    }

    @Component({})
    export default class Progress extends Vue {
        private get columns(): GridTableColumn<keyof LifeformProgressItem>[] {
            return [
                {
                    key: 'lifeform',
                    label: this.$i18n.$t.empire.lifeforms.lifeform,
                },
                {
                    key: 'discoverDate',
                    label: this.$i18n.$t.empire.lifeforms.discoveredOn,
                },
                {
                    key: 'level',
                    label: this.$i18n.$t.empire.lifeforms.level,
                },
                {
                    key: 'totalExperience',
                    label: this.$i18n.$t.empire.lifeforms.totalLifeformExperience,
                },
                {
                    key: 'findingCount',
                    label: this.$i18n.$t.empire.lifeforms.numberOfLifeformDiscoveries,
                },
            ];
        }

        private get items(): LifeformProgressItem[] {
            const lifeformExperience = EmpireDataModule.lifeformExperience;

            return ValidLifeformTypes.map<LifeformProgressItem>(lifeform => {
                const exp = lifeformExperience[lifeform];
                const level = getLifeformLevel(exp);
                const lifeformInfo = LifeformDiscoveryDataModule.lifeforms;

                return {
                    lifeform,
                    level,
                    levelExperience: Math.max(0, exp - getLifeformExperienceNeededForLevel(level)),
                    neededLevelExperience: getLifeformExperienceNeededForLevel(level + 1) - getLifeformExperienceNeededForLevel(level),
                    totalExperience: exp,
                    findingCount: lifeformInfo[lifeform].discoveriesCount,
                    discoverDate: lifeformInfo[lifeform].discoveredDate,
                };
            });
        }
    }
</script>