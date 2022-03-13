<template>
    <color-settings-table
        :header="header"
        :labels="labels"
        :keys="keys"
        v-model="colors"
    />
</template>

<script lang="ts">
    import { CombatResultType } from '@/shared/models/v1/combat-reports/CombatResultType';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import ColorSettingsTable from './ColorSettingsTable.vue';

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
    }
</script>