<template>
    <div class="fake-table">
        <div class="fake-table-header">
            <span v-text="$i18n.$t.settings.accessibility.showSimplifiedResults.title" />
        </div>
        <div class="fake-table-body">
            <checkbox
                :value="showSimplifiedResults"
                @input="toggleShowSimplifiedResults($event)"
                :label="$i18n.$t.settings.accessibility.showSimplifiedResults.label"
            />
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class ShowSimplifiedResultsSettings extends Vue {

        private get showSimplifiedResults() {
            return SettingsDataModule.settings.messageTracking.showSimplifiedResults;
        }

        private toggleShowSimplifiedResults(showSimplifiedResults: boolean) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                messageTracking: {
                    ...SettingsDataModule.settings.messageTracking,
                    showSimplifiedResults,
                }
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