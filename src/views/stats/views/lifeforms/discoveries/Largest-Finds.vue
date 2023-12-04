<template>
    <loading-spinner v-if="loading" />
    <div v-else>
        <div class="find-column">
            <h3 v-text="`${$i18n.$t.extension.empire.lifeforms.topFinds.topFinds} (${$i18n.$t.extension.empire.lifeforms.topFinds.artifacts})`" />

            <grid-table inline :columns="artifactColumns" :items="largestFinds.artifacts" :style="`--color: ${colors.artifacts}`">
                <template #cell-size="{ value }">
                    <expedition-size-icon :size="value" class="scaled-icon" />
                </template>
                <template #cell-amount="{ value }">
                    <span v-text="$i18n.$n(value)" />
                </template>
                <template #cell-date="{ value }">
                    <span v-text="$i18n.$d(value, 'date')" />
                </template>
            </grid-table>
        </div>

        <div v-for="key in experienceKeys" :key="key" class="find-column">
            <h3>
                <span v-text="$i18n.$t.extension.empire.lifeforms.topFinds.topFinds" />
                <span v-text="` (${$i18n.$t.extension.empire.lifeforms.topFinds.experience}`" />
                <span v-if="key != 'all'" v-text="`, ${$i18n.$t.ogame.lifeforms[key]}`" />
                <span v-text="')'" />
            </h3>

            <grid-table 
                inline 
                :columns="experienceColumns" 
                :items="largestFinds.experience[key]" 
                :style="`--color: ${key == 'all' ? colors.experience : colors.lifeform[key]}`
            ">
                <template #cell-lifeform="{ value }">
                    <o-lifeform :lifeform="value" size="22px" />
                </template>
                <template #cell-amount="{ value }">
                    <span v-text="$i18n.$n(value)" />
                </template>
                <template #cell-date="{ value }">
                    <span v-text="$i18n.$d(value, 'date')" />
                </template>
            </grid-table>
        </div>

        <div v-for="key in experienceKeys" :key="key" class="find-column">
            <h3>
                <span v-text="$i18n.$t.extension.empire.lifeforms.topFinds.worstFinds" />
                <span v-text="` (${$i18n.$t.extension.empire.lifeforms.topFinds.experience}`" />
                <span v-if="key != 'all'" v-text="`, ${$i18n.$t.ogame.lifeforms[key]}`" />
                <span v-text="')'" />
            </h3>

            <grid-table 
                inline 
                :columns="experienceColumns" 
                :items="smallestFinds.experience[key]" 
                :style="`--color: ${key == 'all' ? colors.experience : colors.lifeform[key]}`
            ">
                <template #cell-lifeform="{ value }">
                    <o-lifeform :lifeform="value" size="22px" />
                </template>
                <template #cell-amount="{ value }">
                    <span v-text="$i18n.$n(value)" />
                </template>
                <template #cell-date="{ value }">
                    <span v-text="$i18n.$d(value, 'date')" />
                </template>
            </grid-table>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import ExpeditionSizeIcon from '@/views/stats/components/expeditions/ExpeditionSizeIcon.vue';
    import { GridTableColumn } from '../../../components/common/GridTable.vue';
    import { SettingsDataModule } from '../../../data/SettingsDataModule';
    import { getRGBString } from '../../../utils/getRGBString';
    import { LifeformDiscoveryEventArtifactFindingSize } from '@/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize';
    import { LifeformType, ValidLifeformType, ValidLifeformTypes } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { createRecord } from '@/shared/utils/createRecord';
    import { LifeformDiscoveryDataModule } from '@/views/stats/data/LifeformDiscoveryDataModule';
    import { LifeformDiscoveryEventType } from '@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType';
    import { LifeformDiscoveryEventArtifacts, LifeformDiscoveryEventKnownLifeformFound } from '@/shared/models/lifeform-discoveries/LifeformDiscoveryEvent';

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
        artifacts: ArtifactsFind[];
        experience: Record<ValidLifeformType | 'all', ExperienceFind[]>;
    };

    @Component({
        components: {
            ExpeditionSizeIcon,
        }
    })
    export default class LargestFinds extends Vue {

        private readonly maxCount = 25;

        private loading = true;

        private largestFinds: Finds = {
            artifacts: [],
            experience: {
                ...createRecord(ValidLifeformTypes, () => []),
                all: [],
            },
        };
        private smallestFinds: Finds = {
            artifacts: [],
            experience: {
                ...createRecord(ValidLifeformTypes, () => []),
                all: [],
            },
        };

        private readonly experienceKeys: (keyof Finds['experience'])[] = ['all', ...ValidLifeformTypes];

        private get keyTranslations(): Record<keyof typeof this.largestFinds, string> {
            return {
                artifacts: this.$i18n.$t.extension.empire.lifeforms.topFinds.artifacts,
                experience: this.$i18n.$t.extension.empire.lifeforms.topFinds.experience,
            };
        }

        private get colors() {
            const colors = SettingsDataModule.settings.colors;

            return {
                artifacts: getRGBString(colors.lifeformDiscoveries.events.artifacts),
                lifeform: createRecord(ValidLifeformTypes, lifeform => getRGBString(colors.lifeforms[lifeform])),
                experience: getRGBString(colors.lifeformDiscoveries.events.knownLifeformFound),
            };
        }

        private get artifactColumns(): GridTableColumn<keyof ArtifactsFind>[] {
            return [
                {
                    key: 'size',
                    label: this.$i18n.$t.extension.empire.lifeforms.topFinds.size,
                },
                {
                    key: 'amount',
                    label: this.$i18n.$t.extension.empire.lifeforms.topFinds.amount,
                },
                {
                    key: 'date',
                    label: this.$i18n.$t.extension.empire.lifeforms.topFinds.date,
                },
            ];
        }

        private get experienceColumns(): GridTableColumn<keyof ExperienceFind>[] {
            return [
                {
                    key: 'lifeform',
                    label: this.$i18n.$t.extension.empire.lifeforms.lifeform,
                },
                {
                    key: 'amount',
                    label: this.$i18n.$t.extension.empire.lifeforms.topFinds.amount,
                },
                {
                    key: 'date',
                    label: this.$i18n.$t.extension.empire.lifeforms.topFinds.date,
                },
            ];
        }

        async mounted() {
            const discoveries = await LifeformDiscoveryDataModule.getRawData();

            discoveries.forEach(d => {
                if (d.type == LifeformDiscoveryEventType.artifacts) {
                    this.addArtifactFind(d);
                }
                else if (d.type == LifeformDiscoveryEventType.knownLifeformFound) {
                    this.addExperienceFind(d);
                    this.addExperienceFind(d, 'all');
                }
            });

            this.loading = false;
        }

        private addExperienceFind(discovery: LifeformDiscoveryEventKnownLifeformFound, lifeform: ValidLifeformType | 'all' = discovery.lifeform) {
            this._addExperienceFind(
                discovery, 
                this.largestFinds.experience[lifeform], 
                (worst, discovery) => worst.amount > discovery.experience,
                { amount: 0, date: 0, lifeform: LifeformType.humans },
            );

            this._addExperienceFind(
                discovery, 
                this.smallestFinds.experience[lifeform], 
                (worst, discovery) => worst.amount < discovery.experience,
                { amount: Number.MAX_SAFE_INTEGER, date: 0, lifeform: LifeformType.humans },
            );
        }

        private _addExperienceFind(
            discovery: LifeformDiscoveryEventKnownLifeformFound, 
            finds: ExperienceFind[], 
            isBetter: (worstBest: ExperienceFind, find: LifeformDiscoveryEventKnownLifeformFound) => boolean,
            defaultFind: ExperienceFind,
        ) {
            const smallestFind: ExperienceFind = finds[finds.length - 1] ?? defaultFind;
            if (!isBetter(smallestFind, discovery) && finds.length >= this.maxCount) {
                return;
            }

            const index = finds.findIndex(find => !isBetter(find, discovery));
            const newFind: ExperienceFind = {
                amount: discovery.experience,
                date: discovery.date,
                lifeform: discovery.lifeform,
            };
            if(index == -1) {
                finds.push(newFind);
            } 
            else {
                finds.splice(index, 0, newFind);
            }

            finds.splice(this.maxCount);
        }

        private addArtifactFind(discovery: LifeformDiscoveryEventArtifacts) {
            const finds = this.largestFinds.artifacts;
            const smallestFind: ArtifactsFind = finds[finds.length - 1] ?? {
                size: LifeformDiscoveryEventArtifactFindingSize.small,
                amount: 0,
                date: 0,
            };
            if (smallestFind.amount >= discovery.artifacts && finds.length >= this.maxCount) {
                return;
            }

            const index = finds.findIndex(find => find.amount < discovery.artifacts);
            const newFind = {
                size: discovery.size,
                amount: discovery.artifacts,
                date: discovery.date,
            };
            if(index == -1) {
                finds.push(newFind);
            } 
            else {
                finds.splice(index, 0, newFind);
            }

            this.largestFinds.artifacts = finds.slice(0, this.maxCount);
        }
    }
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