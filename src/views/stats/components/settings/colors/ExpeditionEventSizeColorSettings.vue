<template>
    <color-settings-table
        :header="header"
        :labels="labels"
        :keys="keys"
        v-model="colors"
    />
</template>

<script lang="ts">
    import { ExpeditionEventSize } from '@/shared/models/v1/expeditions/ExpeditionEventSize';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { Component, Vue } from 'vue-property-decorator';
    import ColorSettingsTable from './ColorSettingsTable.vue';

    @Component({
        components: {
            ColorSettingsTable,
        },
    })
    export default class ExpeditionEventSizeColorSettings extends Vue {
        private get header() {
            return 'LOCA: Expedition Event Sizes';
        }

        private get labels(): Record<ExpeditionEventSize, string> {
            return {
                [ExpeditionEventSize.small]: 'LOCA: small',
                [ExpeditionEventSize.medium]: 'LOCA: medium',
                [ExpeditionEventSize.large]: 'LOCA: large',
            };
        }

        private readonly keys: ExpeditionEventSize[] = [
            ExpeditionEventSize.small,
            ExpeditionEventSize.medium,
            ExpeditionEventSize.large,
        ];

        private get colors() {
            return SettingsDataModule.settings.colors.expeditions.sizes;
        }

        private set colors(value: Record<ExpeditionEventSize, string>) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                colors: {
                    ...SettingsDataModule.settings.colors,
                    expeditions: {
                        ...SettingsDataModule.settings.colors.expeditions,
                        sizes: value,
                    },
                },
            });
        }
    }
</script>