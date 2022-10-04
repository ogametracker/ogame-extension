<template>
    <div class="fake-table">
        <div class="fake-table-header">
            <span v-text="$i18n.$t.extension.settings.debrisFields.separateExpeditionDebrisFields.title" />
        </div>
        <div class="fake-table-body">
            <checkbox
                :value="separateExpeditionDebrisFields"
                @input="toggle($event)"
                :label="$i18n.$t.extension.settings.debrisFields.separateExpeditionDebrisFields.label"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class SeparateExpeditionAndNormalDebrisFieldSettings extends Vue {

        private get separateExpeditionDebrisFields() {
            return SettingsDataModule.settings.debrisFields.separateExpeditionDebrisFields;
        }

        private toggle(separateExpeditionDebrisFields: boolean) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                debrisFields: {
                    ...SettingsDataModule.settings.debrisFields,
                    separateExpeditionDebrisFields,
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
            background: black linear-gradient(0deg, rgba(var(--color), 0.5), rgba(var(--color), 0.7));
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