<template>
    <div v-text="settings" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { SettingsDataModule } from '../../data/SettingsDataModule';

    @Component({})
    export default class Index extends Vue {
        private readonly settings = SettingsDataModule.settings;
    }
</script>