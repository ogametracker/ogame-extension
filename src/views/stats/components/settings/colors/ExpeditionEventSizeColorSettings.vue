<template>
    <color-settings-table
        :header="$i18n.$t.settings.colors.expeditionEventSizes"
        :labels="labels"
        :keys="keys"
        :value="colors"
        @input="updateColors($event)"
        @reset="resetColors()"
    />
</template>

<script lang="ts">
    import { LanguageKey } from '@/shared/i18n/LanguageKey';
    import { ExpeditionEventSize } from '@/shared/models/expeditions/ExpeditionEventSize';
    import { getDefaultSettings } from '@/shared/models/settings/getDefaultSettings';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { Component, Vue } from 'vue-property-decorator';
    import ColorSettingsTable from './ColorSettingsTable.vue';

    @Component({
        components: {
            ColorSettingsTable,
        },
    })
    export default class ExpeditionEventSizeColorSettings extends Vue {

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

        private updateColors(value: Record<ExpeditionEventSize, string>) {
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

        private resetColors() {
            const defaultColors = getDefaultSettings(LanguageKey.de).colors.expeditions.sizes;

            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                colors: {
                    ...SettingsDataModule.settings.colors,
                    expeditions: {
                        ...SettingsDataModule.settings.colors.expeditions,
                        sizes: defaultColors,
                    },
                },
            });
        }
    }
</script>