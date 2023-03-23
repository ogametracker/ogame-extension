<template>
    <color-settings-table
        :header="$i18n.$t.extension.settings.colors.expeditionEventSizes"
        :labels="labels"
        :keys="keys"
        :value="colors"
        @input="updateColors($event)"
        @reset="resetColors()"
    />
</template>

<script lang="ts">
    import { LanguageKey } from '@/shared/i18n/LanguageKey';
    import { ExpeditionEventCombatSize } from '@/shared/models/expeditions/ExpeditionEvents';
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
            return this.$i18n.$t.extension.expeditions.expeditionEventSizes;
        }

        private readonly keys: (ExpeditionEventSize | ExpeditionEventCombatSize)[] = [
            ExpeditionEventSize.small,
            ExpeditionEventSize.medium,
            ExpeditionEventSize.large,
            'fled-death-star',
        ];

        private get colors() {
            return SettingsDataModule.settings.colors.expeditions.sizes;
        }

        private updateColors(value: Record<ExpeditionEventSize | ExpeditionEventCombatSize, string>) {
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
            this.updateColors(defaultColors);
        }
    }
</script>