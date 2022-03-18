<template>
    <checkbox
        :value="showDetailedBreakdown"
        @input="toggleDetailedBreakdown($event)"
        :label="'LOCA: Show detailed breakdown in resource balance'"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { SettingsDataModule } from '../../data/SettingsDataModule';

    @Component({})
    export default class DetailedResourceBalanceSettings extends Vue {

        private get showDetailedBreakdown() {
            return SettingsDataModule.settings.showDetailedResourceBalance;
        }

        private toggleDetailedBreakdown(showDetailedResourceBalance: boolean) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                showDetailedResourceBalance,
            });
        }

    }
</script>