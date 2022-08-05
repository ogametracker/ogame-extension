<template>
    <color-settings-table
        :header="$i18n.$t.settings.colors.resources"
        :labels="labels"
        :keys="keys"
        :value="colors"
        @input="updateColors($event)"
        @reset="resetColors()"
    />
</template>

<script lang="ts">
    import { LanguageKey } from '@/shared/i18n/LanguageKey';
    import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
    import { getDefaultSettings } from '@/shared/models/settings/getDefaultSettings';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import ColorSettingsTable from './ColorSettingsTable.vue';

    @Component({
        components: {
            ColorSettingsTable,
        },
    })
    export default class ResourceColorSettings extends Vue {

        private get labels(): Record<ResourceType | 'totalConverted', string> {
            return {
                [ResourceType.metal]: this.$i18n.$t.resources.metal,
                [ResourceType.crystal]: this.$i18n.$t.resources.crystal,
                [ResourceType.deuterium]: this.$i18n.$t.resources.deuterium,
                totalConverted: `${this.$i18n.$t.common.resourceUnits} (${this.$i18n.$t.common.msu}/${this.$i18n.$t.common.dsu})`,
            };
        }

        private readonly keys: (ResourceType | 'totalConverted')[] = [
            ResourceType.metal,
            ResourceType.crystal,
            ResourceType.deuterium,
            'totalConverted',
        ];

        private get colors() {
            return SettingsDataModule.settings.colors.resources;
        }

        private updateColors(value: Record<ResourceType | 'totalConverted', string>) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                colors: {
                    ...SettingsDataModule.settings.colors,
                    resources: value,
                },
            });
        }

        private resetColors() {
            const defaultColors = getDefaultSettings(LanguageKey.de).colors.resources;
            this.updateColors(defaultColors);
        }
    }
</script>