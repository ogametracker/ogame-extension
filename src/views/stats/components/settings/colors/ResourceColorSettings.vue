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

        private get labels(): Record<ResourceType | 'totalMsu', string> {
            return {
                [ResourceType.metal]: this.$i18n.$t.resources.metal,
                [ResourceType.crystal]: this.$i18n.$t.resources.crystal,
                [ResourceType.deuterium]: this.$i18n.$t.resources.deuterium,
                totalMsu: this.$i18n.$t.common.resourceUnitsMsu,
            };
        }

        private readonly keys: (ResourceType | 'totalMsu')[] = [
            ResourceType.metal,
            ResourceType.crystal,
            ResourceType.deuterium,
            'totalMsu',
        ];

        private get colors() {
            return SettingsDataModule.settings.colors.resources;
        }

        private updateColors(value: Record<ResourceType | 'totalMsu', string>) {
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

            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                colors: {
                    ...SettingsDataModule.settings.colors,
                    resources: defaultColors,
                },
            });
        }
    }
</script>