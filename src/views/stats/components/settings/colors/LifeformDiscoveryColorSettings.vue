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
    import { LanguageKey } from '@ogame-tracker/shared/i18n/LanguageKey';
    import { LifeformDiscoveryEventType } from '@ogame-tracker/shared/models/lifeform-discoveries/LifeformDiscoveryEventType';
    import { getDefaultSettings } from '@ogame-tracker/shared/models/settings/getDefaultSettings';
    import { SettingsDataModule } from '@stats/data/SettingsDataModule';
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
                [LifeformDiscoveryEventType.artifacts]: this.$i18n.$t.extension.empire.lifeforms.eventTypes.artifacts,
            };
        }

        private readonly keys: LifeformDiscoveryEventType[] = [
            LifeformDiscoveryEventType.nothing,
            LifeformDiscoveryEventType.lostShip,
            LifeformDiscoveryEventType.knownLifeformFound,
        ];

        private get colors() {
            return SettingsDataModule.settings.colors.lifeformDiscoveries.events;
        }

        private updateColors(value: Record<LifeformDiscoveryEventType, string>) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                colors: {
                    ...SettingsDataModule.settings.colors,
                    lifeformDiscoveries: {
                        ...SettingsDataModule.settings.colors.lifeformDiscoveries,
                        events: value,
                    },
                },
            });
        }

        private resetColors() {
            const defaultColors = getDefaultSettings(LanguageKey.de).colors.lifeformDiscoveries.events;
            this.updateColors(defaultColors);
        }
    }
</script>