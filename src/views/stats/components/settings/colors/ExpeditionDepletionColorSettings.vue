<template>
    <color-settings-table
        :header="$i18n.$t.extension.settings.colors.expeditionDepletionLevels"
        :labels="labels"
        :keys="keys"
        :value="colors"
        @input="updateColors($event)"
        @reset="resetColors()"
    />
</template>

<script lang="ts">
    import { LanguageKey } from '@ogame-tracker/shared/i18n/LanguageKey';
    import { ExpeditionDepletionLevel, ExpeditionDepletionLevels } from '@ogame-tracker/shared/models/expeditions/ExpeditionDepletionLevel';
    import { getDefaultSettings } from '@ogame-tracker/shared/models/settings/getDefaultSettings';
    import { createRecord } from '@ogame-tracker/shared/utils/createRecord';
    import { SettingsDataModule } from '@stats/data/SettingsDataModule';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import ColorSettingsTable from './ColorSettingsTable.vue';

    @Component({
        components: {
            ColorSettingsTable,
        },
    })
    export default class ExpeditionDepletionColorSettings extends Vue {

        private readonly depletionLevels: (ExpeditionDepletionLevel | 'unknown')[] = [...ExpeditionDepletionLevels, 'unknown'];

        private get labels(): Record<ExpeditionDepletionLevel | 'unknown', string> {
            return createRecord(this.depletionLevels, level => this.$i18n.$t.extension.expeditions.depletionLevels[level]);
        }

        private readonly keys = this.depletionLevels;

        private get colors() {
            return SettingsDataModule.settings.colors.expeditions.depletion;
        }

        private updateColors(value: Record<ExpeditionDepletionLevel | 'unknown', string>) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                colors: {
                    ...SettingsDataModule.settings.colors,
                    expeditions: {
                        ...SettingsDataModule.settings.colors.expeditions,
                        depletion: value,
                    },
                },
            });
        }

        private resetColors() {
            const defaultColors = getDefaultSettings(LanguageKey.de).colors.expeditions.depletion;
            this.updateColors(defaultColors);
        }
    }
</script>