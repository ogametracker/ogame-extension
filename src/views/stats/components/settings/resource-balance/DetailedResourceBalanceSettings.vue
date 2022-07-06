<template>
    <div class="fake-table">
        <div class="fake-table-header">
            <span v-text="$i18n.$t.settings.resourceBalance.detailedResourceBalance.header" />
        </div>
        <div class="fake-table-body">
            <checkbox
                :value="showDetailedBreakdown"
                @input="toggleDetailedBreakdown($event)"
                :label="$i18n.$t.settings.resourceBalance.detailedResourceBalance.checkboxLabel"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { SettingsDataModule } from '../../../data/SettingsDataModule';

    @Component({})
    export default class DetailedResourceBalanceSettings extends Vue {

        private get showDetailedBreakdown() {
            return SettingsDataModule.settings.resourceBalance.showDetailedBreakdown;
        }

        private toggleDetailedBreakdown(showDetailedBreakdown: boolean) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                resourceBalance: {
                    ...SettingsDataModule.settings.resourceBalance,
                    showDetailedBreakdown,
                },
            });
        }

    }
</script>
<style lang="scss" scoped>
    .fake-table {
        border: 1px solid rgba(var(--color), 0.5);
        border-radius: 4px;
        display: grid;
        width: fit-content;
        max-width: 400px;

        &-header {
            background: black
                linear-gradient(
                    0deg,
                    rgba(var(--color), 0.5),
                    rgba(var(--color), 0.7)
                );
            justify-content: center;
        }

        &-header,
        &-body {
            height: 100%;
            padding: 8px;
            display: flex;
            align-items: center;
        }
    }
</style>