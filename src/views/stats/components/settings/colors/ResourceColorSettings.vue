<template>
    <color-settings-table
        :header="header"
        :labels="labels"
        :keys="keys"
        v-model="colors"
    />
</template>

<script lang="ts">
    import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import ColorSettingsTable from './ColorSettingsTable.vue';

    @Component({
        components: {
            ColorSettingsTable,
        },
    })
    export default class ResourceColorSettings extends Vue {
        private get header() {
            return 'LOCA: Resource';
        }

        private get labels(): Record<ResourceType | 'totalMsu', string> {
            return {
                [ResourceType.metal]: 'LOCA: metal',
                [ResourceType.crystal]: 'LOCA: crystal',
                [ResourceType.deuterium]: 'LOCA: deuterium',
                totalMsu: 'LOCA: totalMsu',
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

        private set colors(value: Record<ResourceType | 'totalMsu', string>) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                colors: {
                    ...SettingsDataModule.settings.colors,
                    resources: value,
                },
            });
        }
    }
</script>