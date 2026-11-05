<template>
    <color-settings-table
        :header="$i18n.$t.extension.settings.colors.lifeforms"
        :labels="labels"
        :keys="keys"
        :value="colors"
        @input="updateColors($event)"
        @reset="resetColors()"
    />
</template>

<script lang="ts">
    import { LanguageKey } from '@ogame-tracker/shared/i18n/LanguageKey';
    import { LifeformType, ValidLifeformType, ValidLifeformTypes } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
    import { getDefaultSettings } from '@ogame-tracker/shared/models/settings/getDefaultSettings';
    import { SettingsDataModule } from '@stats/data/SettingsDataModule';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import ColorSettingsTable from './ColorSettingsTable.vue';

    @Component({
        components: {
            ColorSettingsTable,
        },
    })
    export default class LifeformColorSettings extends Vue {

        private get labels(): Record<LifeformType, string> {
            return this.$i18n.$t.ogame.lifeforms;
        }

        private readonly keys = ValidLifeformTypes;

        private get colors() {
            return SettingsDataModule.settings.colors.lifeforms;
        }

        private updateColors(value: Record<ValidLifeformType, string>) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                colors: {
                    ...SettingsDataModule.settings.colors,
                    lifeforms: value,
                },
            });
        }

        private resetColors() {
            const defaultColors = getDefaultSettings(LanguageKey.de).colors.lifeforms;
            this.updateColors(defaultColors);
        }
    }
</script>