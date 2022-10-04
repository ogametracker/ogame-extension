<template>
    <div class="chart-container">
        <stats-chart
            :firstDay="firstDay"
            :itemsPerDay="exposPerDay"
            :datasets="datasets"
            stacked
            show-average
            no-legend
            no-tooltip-footer
        />

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <expedition-event-color-settings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { ExpeditionEvent, ExpeditionEventDarkMatter } from '@/shared/models/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { Component, Vue } from 'vue-property-decorator';
    import StatsChart, { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
    import { DailyExpeditionResult, ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import ExpeditionEventColorSettings from '@stats/components/settings/colors/ExpeditionEventColorSettings.vue';

    @Component({
        components: {
            StatsChart,
            ExpeditionEventColorSettings,
        },
    })
    export default class Charts extends Vue {

        private showSettings = false;

        private get color() {
            return SettingsDataModule.settings.colors.expeditions.events.darkMatter;
        }

        private get datasets(): StatsChartDataset<DailyExpeditionResult>[] {
            return [{
                key: 'dark-matter',
                label: this.$i18n.$t.ogame.premium.darkMatter,
                color: this.color,
                filled: true,
                getValue: (result: DailyExpeditionResult) => result.findings.darkMatter,
                showAverage: true,
            }];
        }

        private get firstDay() {
            return ExpeditionDataModule.firstDay;
        }

        private get exposPerDay() {
            return ExpeditionDataModule.dailyResults;
        }
    }
</script>
<style lang="scss" scoped>
    .chart-container {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: start;
        height: 100%;
    }
</style>