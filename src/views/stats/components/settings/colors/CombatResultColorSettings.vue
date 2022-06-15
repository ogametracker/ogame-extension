<template>
    <color-settings-table
        :header="$i18n.$t.settings.colors.combatResults"
        :labels="labels"
        :keys="keys"
        :value="colors"
        @input="updateColors($event)"
        @reset="resetColors()"
    />
</template>

<script lang="ts">
    import { CombatResultType } from '@/shared/models/combat-reports/CombatResultType';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import ColorSettingsTable from './ColorSettingsTable.vue';
    import { getDefaultSettings } from '@/shared/models/settings/getDefaultSettings';
    import { LanguageKey } from '@/shared/i18n/LanguageKey';

    @Component({
        components: {
            ColorSettingsTable,
        },
    })
    export default class CombatResultColorSettings extends Vue {
        private get labels(): Record<CombatResultType, string> {
            return this.$i18n.$t.combats.combatResults;
        }

        private readonly keys: CombatResultType[] = [
            CombatResultType.won,
            CombatResultType.lost,
            CombatResultType.draw,
        ];

        private get colors() {
            return SettingsDataModule.settings.colors.combatResults;
        }

        private updateColors(value: Record<CombatResultType, string>) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                colors: {
                    ...SettingsDataModule.settings.colors,
                    combatResults: value,
                },
            });
        }

        private resetColors() {
            const defaultColors = getDefaultSettings(LanguageKey.de).colors.combatResults;

            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                colors: {
                    ...SettingsDataModule.settings.colors,
                    combatResults: defaultColors,
                },
            });
        }
    }
</script>