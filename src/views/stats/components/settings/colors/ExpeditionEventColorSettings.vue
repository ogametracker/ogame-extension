<template>
    <color-settings-table
        :header="header"
        :labels="labels"
        :keys="keys"
        v-model="colors"
    />
</template>

<script lang="ts">
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import ColorSettingsTable from './ColorSettingsTable.vue';

    @Component({
        components: {
            ColorSettingsTable,
        },
    })
    export default class ExpeditionEventColorSettings extends Vue {
        private get header() {
            return 'LOCA: Expedition Events';
        }

        private get labels(): Record<ExpeditionEventType, string> {
            return {
                [ExpeditionEventType.nothing]: 'LOCA: nothing',
                [ExpeditionEventType.resources]: 'LOCA: resources',
                [ExpeditionEventType.fleet]: 'LOCA: fleet',
                [ExpeditionEventType.delay]: 'LOCA: delay',
                [ExpeditionEventType.early]: 'LOCA: early',
                [ExpeditionEventType.darkMatter]: 'LOCA: darkMatter',
                [ExpeditionEventType.pirates]: 'LOCA: pirates',
                [ExpeditionEventType.aliens]: 'LOCA: aliens',
                [ExpeditionEventType.item]: 'LOCA: item',
                [ExpeditionEventType.trader]: 'LOCA: trader',
                [ExpeditionEventType.lostFleet]: 'LOCA: lostFleet',
            };
        }

        private readonly keys: ExpeditionEventType[] = [
            ExpeditionEventType.nothing,
            ExpeditionEventType.resources,
            ExpeditionEventType.fleet,
            ExpeditionEventType.delay,
            ExpeditionEventType.early,
            ExpeditionEventType.darkMatter,
            ExpeditionEventType.pirates,
            ExpeditionEventType.aliens,
            ExpeditionEventType.item,
            ExpeditionEventType.trader,
            ExpeditionEventType.lostFleet,
        ];

        private get colors() {
            return SettingsDataModule.settings.colors.expeditions.events;
        }

        private set colors(value: Record<ExpeditionEventType, string>) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                colors: {
                    ...SettingsDataModule.settings.colors,
                    expeditions: {
                        ...SettingsDataModule.settings.colors.expeditions,
                        events: value,
                    },
                },
            });
        }
    }
</script>