<template>
    <div class="fake-table">
        <div class="fake-table-header">
            <span v-text="$i18n.$t.settings.misc.detailedResourceBalance.header" />
        </div>
        <div class="fake-table-body">
            <checkbox
                :value="showDetailedBreakdown"
                @input="toggleDetailedBreakdown($event)"
                :label="$i18n.$t.settings.misc.detailedResourceBalance.checkboxLabel"
            />
        </div>
    </div>
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
<style lang="scss" scoped>
    .fake-table {
        border: 1px solid rgba(var(--color), 0.5);
        border-radius: 4px;
        display: grid;
        width: fit-content;

        &-header {
            background: black
                linear-gradient(
                    0deg,
                    rgba(var(--color), 0.5),
                    rgba(var(--color), 0.5)
                );
            justify-content: center;
        }

        &-header,
        &-body {
            padding: 8px;
            display: flex;
            align-items: center;
        }
    }
</style>