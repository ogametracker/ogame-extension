<template>
    <loading-spinner v-if="loading" />
    <page v-else :nav-items="navItems" root-route-name="lifeforms" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '@/views/stats/components/common/ListNav.vue';
    import { EmpireDataModule } from '../../data/EmpireDataModule';
    import { ServerSettingsDataModule } from '../../data/ServerSettingsDataModule';

    @Component({})
    export default class Index extends Vue {
        private loading = true;

        async mounted() {
            await EmpireDataModule.ready;
            await ServerSettingsDataModule.ready;

            this.loading = false;
        }
        
        private get navItems(): ListNavItem[] {
            return [
                {
                    to: { name: 'lifeforms/overview' },
                    label: this.$i18n.$t.extension.empire.lifeforms.subHeaders.overview,
                },
                {
                    to: { name: 'lifeforms/bonus-breakdown' },
                    label: this.$i18n.$t.extension.empire.lifeforms.subHeaders.researchBonuses,
                },
                {
                    to: { name: 'lifeforms/progress' },
                    label: this.$i18n.$t.extension.empire.lifeforms.subHeaders.progress,
                },
                {
                    to: { name: 'lifeforms/discoveries' },
                    label: this.$i18n.$t.extension.empire.lifeforms.subHeaders.discoveryMissions,
                },
            ];
        }
    }
</script>