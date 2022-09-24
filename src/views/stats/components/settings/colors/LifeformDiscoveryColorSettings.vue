<template>
    <color-settings-table
        :header="$i18n.$t.extension.settings.colors.lifeformDiscoveries"
        :labels="labels"
        :keys="keys"
        :value="colors"
        @input="updateColors($event)"
        @reset="resetColors()"
    />
</template>

<script lang="ts">
    import { LanguageKey } from '@/shared/i18n/LanguageKey';
    import { LifeformDiscoveryEventType } from '@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType';
    import { getDefaultSettings } from '@/shared/models/settings/getDefaultSettings';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import ColorSettingsTable from './ColorSettingsTable.vue';

    @Component({
        components: {
            ColorSettingsTable,
        },
    })
    export default class LifeformDiscoveryColorSettings extends Vue {

        private get labels(): Record<Exclude<LifeformDiscoveryEventType, LifeformDiscoveryEventType.newLifeformFound>, string> {
            return {
                [LifeformDiscoveryEventType.nothing]: this.$i18n.$t.extension.empire.lifeforms.eventTypes.nothing,
                [LifeformDiscoveryEventType.lostShip]: this.$i18n.$t.extension.empire.lifeforms.eventTypes.lostShip,
                [LifeformDiscoveryEventType.knownLifeformFound]: this.$i18n.$t.extension.empire.lifeforms.lifeformFound,
            };
        }

        private readonly keys: LifeformDiscoveryEventType[] = [
            LifeformDiscoveryEventType.nothing,
            LifeformDiscoveryEventType.lostShip,
            LifeformDiscoveryEventType.knownLifeformFound,
        ];

        private get colors() {
            return SettingsDataModule.settings.colors.lifeformDiscoveries;
        }

        private updateColors(value: Record<LifeformDiscoveryEventType, string>) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                colors: {
                    ...SettingsDataModule.settings.colors,
                    lifeformDiscoveries: value,
                },
            });
        }

        private resetColors() {
            const defaultColors = getDefaultSettings(LanguageKey.de).colors.lifeformDiscoveries;
            this.updateColors(defaultColors);
        }
    }
</script>