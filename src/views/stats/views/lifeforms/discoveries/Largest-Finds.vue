<template>
    <loading-spinner v-if="loading" />
    <div v-else>
        <div class="find-column">
            <h3 v-text="`${translations().extension.empire.lifeforms.topFinds.topFinds} (${translations().extension.empire.lifeforms.topFinds.artifacts})`" />

            <grid-table inline :columns="artifactColumns" :items="largestFinds.artifacts.values" :style="`--color: ${colors.artifacts}`">
                <template #cell-size="{ value }">
                    <expedition-size-icon :size="value" class="scaled-icon" />
                </template>
                <template #cell-amount="{ value }">
                    <span v-text="formatNumber(value)" />
                </template>
                <template #cell-date="{ value }">
                    <span v-text="formatDate(value, 'date')" />
                </template>
            </grid-table>
        </div>

        <div v-for="key in experienceKeys" :key="`largest-${key}`" class="find-column">
            <h3>
                <span v-text="translations().extension.empire.lifeforms.topFinds.topFinds" />
                <span v-text="` (${translations().extension.empire.lifeforms.topFinds.experience}`" />
                <span v-if="key != 'all'" v-text="`, ${translations().ogame.lifeforms[key]}`" />
                <span v-text="')'" />
            </h3>

            <grid-table
                inline
                :columns="experienceColumns"
                :items="largestFinds.experience[key].values"
                :style="`--color: ${key == 'all' ? colors.experience : colors.lifeform[key]}`
            ">
                <template #cell-lifeform="{ value }">
                    <o-lifeform :lifeform="value" size="22px" />
                </template>
                <template #cell-amount="{ value }">
                    <span v-text="formatNumber(value)" />
                </template>
                <template #cell-date="{ value }">
                    <span v-text="formatDate(value, 'date')" />
                </template>
            </grid-table>
        </div>

        <div v-for="key in experienceKeys" :key="`smallest-${key}`" class="find-column">
            <h3>
                <span v-text="translations().extension.empire.lifeforms.topFinds.worstFinds" />
                <span v-text="` (${translations().extension.empire.lifeforms.topFinds.experience}`" />
                <span v-if="key != 'all'" v-text="`, ${translations().ogame.lifeforms[key]}`" />
                <span v-text="')'" />
            </h3>

            <grid-table
                inline
                :columns="experienceColumns"
                :items="smallestFinds.experience[key].values"
                :style="`--color: ${key == 'all' ? colors.experience : colors.lifeform[key]}`
            ">
                <template #cell-lifeform="{ value }">
                    <o-lifeform :lifeform="value" size="22px" />
                </template>
                <template #cell-amount="{ value }">
                    <span v-text="formatNumber(value)" />
                </template>
                <template #cell-date="{ value }">
                    <span v-text="formatDate(value, 'date')" />
                </template>
            </grid-table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { translations, formatNumber, formatDate } from '@stats/i18n';
import ExpeditionSizeIcon from '@stats/components/expeditions/ExpeditionSizeIcon.vue';
import type { GridTableColumn } from '../../../components/common/GridTable.vue';
import { useSettingsStore } from '../../../data/SettingsDataModule';
import { getRGBString } from '../../../utils/getRGBString';
import { LifeformDiscoveryEventArtifactFindingSize } from '@ogame-tracker/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize';
import { LifeformType, ValidLifeformTypes } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import type { ValidLifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import { createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { useLifeformDiscoveryStore } from '@stats/data/LifeformDiscoveryDataModule';
import { LifeformDiscoveryEventType } from '@ogame-tracker/shared/models/lifeform-discoveries/LifeformDiscoveryEventType';
import type { LifeformDiscoveryEventArtifacts, LifeformDiscoveryEventKnownLifeformFound } from '@ogame-tracker/shared/models/lifeform-discoveries/LifeformDiscoveryEvent';
import { TopList } from '@stats/models/TopList';

type ArtifactsFind = {
    size: LifeformDiscoveryEventArtifactFindingSize;
    amount: number;
    date: number;
};

type ExperienceFind = {
    lifeform: LifeformType;
    amount: number;
    date: number;
};

type Finds = {
    artifacts: TopList<ArtifactsFind>;
    experience: Record<ValidLifeformType | 'all', TopList<ExperienceFind>>;
};

const settingsStore = useSettingsStore();

const lifeformDiscoveryStore = useLifeformDiscoveryStore();

const loading = ref(true);

const largestFinds: Finds = {
    artifacts: new TopList<ArtifactsFind>({
        comparator: (a, b) => b.amount - a.amount,
        maxSize: 25,
    }),
    experience: {
        ...createRecord(ValidLifeformTypes, () => new TopList<ExperienceFind>({
            comparator: (a, b) => b.amount - a.amount,
            maxSize: 25,
        })),
        all: new TopList<ExperienceFind>({
            comparator: (a, b) => b.amount - a.amount,
            maxSize: 25,
        }),
    },
};

const smallestFinds: Finds = {
    artifacts: new TopList<ArtifactsFind>({
        comparator: (a, b) => a.amount - b.amount,
        maxSize: 25,
    }),
    experience: {
        ...createRecord(ValidLifeformTypes, () => new TopList<ExperienceFind>({
            comparator: (a, b) => a.amount - b.amount,
            maxSize: 25,
        })),
        all: new TopList<ExperienceFind>({
            comparator: (a, b) => a.amount - b.amount,
            maxSize: 25,
        }),
    },
};

const experienceKeys: (keyof Finds['experience'])[] = ['all', ...ValidLifeformTypes];

const keyTranslations = computed<Record<keyof Finds, string>>(() => {
    return {
        artifacts: translations().extension.empire.lifeforms.topFinds.artifacts,
        experience: translations().extension.empire.lifeforms.topFinds.experience,
    };
});

const colors = computed(() => {
    const localColors = settingsStore.settings.colors;

    return {
        artifacts: getRGBString(localColors.lifeformDiscoveries.events.artifacts),
        lifeform: createRecord(ValidLifeformTypes, lifeform => getRGBString(localColors.lifeforms[lifeform])),
        experience: getRGBString(localColors.lifeformDiscoveries.events.knownLifeformFound),
    };
});

const artifactColumns = computed<GridTableColumn<keyof ArtifactsFind>[]>(() => {
    return [
        {
            key: 'size',
            label: translations().extension.empire.lifeforms.topFinds.size,
        },
        {
            key: 'amount',
            label: translations().extension.empire.lifeforms.topFinds.amount,
        },
        {
            key: 'date',
            label: translations().extension.empire.lifeforms.topFinds.date,
        },
    ];
});

const experienceColumns = computed<GridTableColumn<keyof ExperienceFind>[]>(() => {
    return [
        {
            key: 'lifeform',
            label: translations().extension.empire.lifeforms.lifeform,
        },
        {
            key: 'amount',
            label: translations().extension.empire.lifeforms.topFinds.amount,
        },
        {
            key: 'date',
            label: translations().extension.empire.lifeforms.topFinds.date,
        },
    ];
});

function addExperienceFind(discovery: LifeformDiscoveryEventKnownLifeformFound, lifeform: ValidLifeformType | 'all' = discovery.lifeform) {
    largestFinds.experience[lifeform].add({
        lifeform: discovery.lifeform,
        amount: discovery.experience,
        date: discovery.date,
    });
    smallestFinds.experience[lifeform].add({
        lifeform: discovery.lifeform,
        amount: discovery.experience,
        date: discovery.date,
    });
}

function addArtifactFind(discovery: LifeformDiscoveryEventArtifacts) {
    largestFinds.artifacts.add({
        size: discovery.size,
        amount: discovery.artifacts,
        date: discovery.date,
    });
}

onMounted(async () => {
    const discoveries = await lifeformDiscoveryStore.getRawData();

    discoveries.forEach(d => {
        if (d.type == LifeformDiscoveryEventType.artifacts) {
            addArtifactFind(d);
        }
        else if (d.type == LifeformDiscoveryEventType.knownLifeformFound) {
            addExperienceFind(d);
            addExperienceFind(d, 'all');
        }
    });

    loading.value = false;
});
</script>

<style lang="scss" scoped>
    .scaled-icon {
        transform: scale(1.6);
    }

    .find-column {
        display: inline-flex;
        flex-direction: column;
        margin-right: 16px;
    }
</style>
