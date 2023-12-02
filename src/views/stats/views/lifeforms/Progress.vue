<template>
    <grid-table :columns="columns" :items="items" sticky="100%">
        <template #cell-lifeform="{ value }">
            <span class="mr-2" v-text="$i18n.$t.ogame.lifeforms[value]" />
            <o-lifeform :lifeform="value" />
        </template>
        <template #cell-discoverDate="{ value, item }">
            <i v-if="item.lifeform == 'humans'" v-text="$i18n.$t.extension.empire.lifeforms.alwaysAvailable" />
            <span v-else-if="value != null" v-text="$i18n.$d(value, 'datetime')" />
            <span v-else-if="item.totalExperience > 0" v-text="$i18n.$t.extension.empire.lifeforms.discoveryDateUnknown" />
            <i v-else v-text="$i18n.$t.extension.empire.lifeforms.notDiscoveredYet" />
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
                    label: this.$i18n.$t.extension.empire.lifeforms.lifeform,
                },
                {
                    key: 'discoverDate',
                    label: this.$i18n.$t.extension.empire.lifeforms.discoveredOn,
                },
                {
                    key: 'level',
                    label: this.$i18n.$t.extension.empire.lifeforms.level,
                },
                {
                    key: 'totalExperience',
                    label: this.$i18n.$t.extension.empire.lifeforms.totalLifeformExperience,
                },
                {
                    key: 'findingCount',
                    label: this.$i18n.$t.extension.empire.lifeforms.numberOfLifeformDiscoveries,
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