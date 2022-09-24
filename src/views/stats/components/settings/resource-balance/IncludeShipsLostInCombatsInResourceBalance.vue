<template>
    <div class="fake-table">
        <div class="fake-table-header">
            <span v-text="$i18n.$t.extension.settings.resourceBalance.includeShipsLostInCombats.header" />
        </div>
        <div class="fake-table-body">
            <checkbox
                :value="include"
                @input="toggleInclude($event)"
                :label="$i18n.$t.extension.settings.resourceBalance.includeShipsLostInCombats.checkboxLabel"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { SettingsDataModule } from '../../../data/SettingsDataModule';

    @Component({})
    export default class IncludeShipsLostInCombatsInResourceBalance extends Vue {

        private get include() {
            return SettingsDataModule.settings.resourceBalance.includeLostShipsResourceUnits;
        }

        private toggleInclude(includeLostShipsResourceUnits: boolean) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                resourceBalance: {
                    ...SettingsDataModule.settings.resourceBalance,
                    includeLostShipsResourceUnits,
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