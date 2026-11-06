<template>
    <GridTable :columns="columns" :items="items" sticky="100%">
        <template #cell-lifeform="{ value }">
            <span class="mr-2" v-text="translations().ogame.lifeforms[value]" />
            <OLifeform :lifeform="value" />
        </template>
        <template #cell-discoverDate="{ value, item }">
            <i v-if="item.lifeform == 'humans'" v-text="translations().extension.empire.lifeforms.alwaysAvailable" />
            <span v-else-if="value != null" v-text="formatDate(value, 'datetime')" />
            <span v-else-if="item.totalExperience > 0" v-text="translations().extension.empire.lifeforms.discoveryDateUnknown" />
            <i v-else v-text="translations().extension.empire.lifeforms.notDiscoveredYet" />
        </template>
        <template #cell-level="{ item }">
            <span v-text="`${item.level} (${formatNumber(item.levelExperience)}/${formatNumber(item.neededLevelExperience)} XP)`" />
        </template>
        <template #cell-totalExperience="{ value }">
            <span v-text="formatNumber(value)" />
        </template>
        <template #cell-findingCount="{ value }">
            <span v-text="formatNumber(value)" />
        </template>
    </GridTable>
</template>

<script setup lang="ts">
import GridTable from '@stats/components/common/GridTable.vue';
import OLifeform from '@ogame-tracker/view-shared/components/ogame/OLifeform.vue';
import { computed } from 'vue';
import { translations, formatNumber, formatDate } from '@stats/i18n';
import { getLifeformExperienceNeededForLevel, getLifeformLevel } from '@ogame-tracker/shared/models/ogame/lifeforms/experience';
import { ValidLifeformTypes } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import type { ValidLifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import type { GridTableColumn } from '@stats/components/common/GridTable.vue';
import { useEmpireStore } from '@stats/data/EmpireDataModule';
import { useLifeformDiscoveryStore } from '@stats/data/LifeformDiscoveryDataModule';

interface LifeformProgressItem {
    lifeform: ValidLifeformType;
    level: number;
    levelExperience: number;
    neededLevelExperience: number;
    totalExperience: number;
    discoverDate?: number;
    findingCount: number;
}

const empireStore = useEmpireStore();

const lifeformDiscoveryStore = useLifeformDiscoveryStore();

const columns = computed<GridTableColumn<keyof LifeformProgressItem>[]>(() => {
    return [
        {
            key: 'lifeform',
            label: translations().extension.empire.lifeforms.lifeform,
        },
        {
            key: 'discoverDate',
            label: translations().extension.empire.lifeforms.discoveredOn,
        },
        {
            key: 'level',
            label: translations().extension.empire.lifeforms.level,
        },
        {
            key: 'totalExperience',
            label: translations().extension.empire.lifeforms.totalLifeformExperience,
        },
        {
            key: 'findingCount',
            label: translations().extension.empire.lifeforms.numberOfLifeformDiscoveries,
        },
    ];
});

const items = computed<LifeformProgressItem[]>(() => {
    const lifeformExperience = empireStore.lifeformExperience;

    return ValidLifeformTypes.map<LifeformProgressItem>(lifeform => {
        const exp = lifeformExperience[lifeform];
        const level = getLifeformLevel(exp);
        const lifeformInfo = lifeformDiscoveryStore.lifeforms;

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
});
</script>
