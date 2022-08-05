<template>
    <div class="fake-table">
        <div class="fake-table-header">
            <span v-text="$i18n.$t.settings.showConvertedUnitsInTables.title" />
        </div>
        <div class="fake-table-body">
            <checkbox :value="showCellsWithConvertedResourceUnits" @input="toggle($event)" :label="$i18n.$t.settings.showConvertedUnitsInTables.label" />
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { SettingsDataModule } from '../../data/SettingsDataModule';

    @Component({})
    export default class ShowConvertedResourcesInCellsSettings extends Vue {

        private get showCellsWithConvertedResourceUnits() {
            return SettingsDataModule.settings.showCellsWithConvertedResourceUnits;
        }

        private toggle(showCellsWithConvertedResourceUnits: boolean) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                showCellsWithConvertedResourceUnits,
            });
        }

    }
</script>
<style lang="scss" scoped>
    .fake-table {
        max-width: 400px;
        border: 1px solid rgba(var(--color), 0.5);
        border-radius: 4px;
        display: grid;
        width: fit-content;

        &-header {
            height: 100%;
            background: black linear-gradient(0deg, rgba(var(--color), 0.5), rgba(var(--color), 0.7));
            justify-content: center;
            align-items: center;
            padding: 8px;
            display: flex;
        }

        &-body {
            height: 100%;
            padding: 8px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
    }
</style>