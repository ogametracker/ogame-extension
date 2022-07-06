<template>
    <div class="fake-table">
        <div class="fake-table-header">
            <span v-text="$i18n.$t.settings.showMsuInTables.title" />
        </div>
        <div class="fake-table-body">
            <checkbox :value="showMsuCells" @input="toggleMsuCells($event)" :label="$i18n.$t.settings.showMsuInTables.label" />
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { SettingsDataModule } from '../../data/SettingsDataModule';

    @Component({})
    export default class ShowMsuCellsSettings extends Vue {

        private get showMsuCells() {
            return SettingsDataModule.settings.showMsuCells;
        }

        private toggleMsuCells(showMsuCells: boolean) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                showMsuCells,
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