<template>
    <color-settings-table
        :header="header"
        :labels="labels"
        :keys="keys"
        v-model="colors"
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
        private get header() {
            return 'LOCA: Combat Result';
        }

        private get labels(): Record<CombatResultType, string> {
            return {
                [CombatResultType.won]: 'LOCA: won',
                [CombatResultType.lost]: 'LOCA: lost',
                [CombatResultType.draw]: 'LOCA: draw',
            };
        }

        private readonly keys: CombatResultType[] = [
            CombatResultType.won,
            CombatResultType.lost,
            CombatResultType.draw,
        ];

        private get colors() {
            return SettingsDataModule.settings.colors.combatResults;
        }

        private set colors(value: Record<CombatResultType, string>) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                colors: {
                    ...SettingsDataModule.settings.colors,
                    combatResults: value,
                },
            });
        }

        public resetColors(): void {
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