<template>
    <loading-spinner v-if="loading" />
    <div v-else class="status-history-grid">
        <div class="y-ticks">
            <span v-for="(label, i) in statusHistoryLabels" :key="`status-label-${i}`" v-text="label" />
        </div>

        <div class="graph">
            <div
                v-for="(_, i) in statusHistoryLabels"
                :key="`status-label-${i}.2`"
                class="y-tick"
                :style="`--y-tick: ${i}; width: ${statusHistoryWidth * 100}%`"
            />
            <div
                class="bars"
                :style="{
                    left: `${statusHistoryGraphOffset}px`,
                }"
            >
                <div v-for="tick in statusHistoryTicks" :key="`x-tick-line-${tick.date}`" class="x-tick-line" :style="`--x-tick: ${tick.position}`" />

                <div
                    v-for="(item, i) in statusHistoryItems"
                    :key="`status-item-${i}`"
                    :style="{
                        left: `${100 * item.start}%`,
                        width: `${100 * (item.end - item.start)}%`,
                    }"
                    class="bar"
                    :class="item.class"
                />
            </div>
        </div>

        <div class="x-ticks">
            <div
                class="x-ticks-container"
                :style="{
                    left: `${statusHistoryGraphOffset}px`,
                }"
            >
                <div
                    v-for="tick in statusHistoryTicks"
                    :key="tick.date"
                    class="x-tick"
                    :style="`--x-tick: ${tick.position}`"
                    v-text="$i18n.$d(tick.date, 'date')"
                />
            </div>
        </div>

        <div class="scrollbar" ref="statusHistoryXTicks" @scroll="onStatusHistoryScroll($event)">
            <div
                :style="{
                    width: `${statusHistoryWidth * 100}%`,
                }"
                style="height: 1px"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { DbUniverseHistoryPlayerStateItem, OgameTrackerUniverseHistoryPlayerAlliance, OgameTrackerUniverseHistoryPlayerState } from '@/shared/db/schema/universe-history';
    import { addDays, startOfDay, subDays } from 'date-fns';
    import { Component, Prop, Vue, Ref } from 'vue-property-decorator';
    import { UniverseHistoryDataModule } from '../../data/UniverseHistoryDataModule';

    interface StatusHistoryItem {
        status: string | null;
        start: number;
        end: number;
        class: StatusHistoryItemClass;
    }
    type StatusHistoryItemClass = 'active' | DbUniverseHistoryPlayerStateItem | 'deleted';

    @Component({})
    export default class StatusHistoryChart extends Vue {

        @Prop({ required: true, type: Number })
        private playerId!: number;

        private history: OgameTrackerUniverseHistoryPlayerState[] = [];
        private loading = true;

        private readonly statusHistoryTickCount = 30;
        private statusHistoryGraphOffset = 0;

        private get statusHistoryStartDate(): Date {
            const nowMinusTicks = subDays(Date.now(), this.statusHistoryTickCount - 2);
            if (this.history.length == 0) {
                return nowMinusTicks;
            }

            const firstDay = startOfDay(this.history[0].date);
            return firstDay < nowMinusTicks ? firstDay : nowMinusTicks;
        }

        private get statusHistoryItems(): StatusHistoryItem[] {
            const ticks = (this.statusHistoryTickCount - 1) * 24 * 60 * 60 * 1000;
            const startDate = this.statusHistoryStartDate.getTime();

            return this.history.flatMap<StatusHistoryItem>((item, i, history) => {
                const start = (item.date - startDate) / ticks;
                const end = ((history[i + 1]?.date ?? Date.now()) - startDate) / ticks;

                if (item.state == 'deleted' || item.state == null) {
                    return [{
                        status: item.state,
                        start,
                        end,
                        class: item.state ?? 'active',
                    }];
                }

                return item.state.map(state => ({
                    status: state,
                    start,
                    end,
                    class: state,
                }));
            });
        }

        private get statusHistoryWidth(): number {
            const time = Date.now() - this.statusHistoryStartDate.getTime();
            const ticks = (this.statusHistoryTickCount - 1) * 24 * 60 * 60 * 1000;

            return time / ticks;
        }

        private get statusHistoryLabels(): string[] {
            return [
                this.$i18n.$t.universeHistory.status.active,
                this.$i18n.$t.universeHistory.status.vacation,
                this.$i18n.$t.universeHistory.status.inactive,
                this.$i18n.$t.universeHistory.status.inactiveLong,
                this.$i18n.$t.universeHistory.status.banned,
                this.$i18n.$t.universeHistory.status.outlaw,
                this.$i18n.$t.universeHistory.status.deleted,
                this.$i18n.$t.universeHistory.status.admin,
            ];
        }

        private get statusHistoryTicks(): { date: number; position: number }[] {
            const now = Date.now();
            const start = this.statusHistoryStartDate.getTime();
            let cur = start;
            const ticks = (this.statusHistoryTickCount - 1) * 24 * 60 * 60 * 1000;
            const result: { date: number; position: number }[] = [];

            while (cur <= now) {
                result.push({
                    date: cur,
                    position: (cur - start) / ticks,
                });

                cur = addDays(cur, 1).getTime();
            }

            return result;
        }

        private async mounted() {
            this.history = await UniverseHistoryDataModule.getPlayerStateHistory(this.playerId);
            this.loading = false;

            await this.$nextTick();
            this.statusHistoryXTicks!.scrollLeft = this.statusHistoryXTicks!.scrollWidth;
        }

        private onStatusHistoryScroll(event: Event) {
            if (event.target == null) {
                return;
            }

            const elem = event.target as HTMLElement;
            this.statusHistoryGraphOffset = -elem.scrollLeft;
        }

        @Ref('statusHistoryXTicks')
        private statusHistoryXTicks!: HTMLElement | null;
    }
</script>

<style lang="scss" scoped>
    $status-bar-height: 40px;
    $status-bar-margin: 5px;
    $status: (
        admin: #f48406,
        banned: #ffffff,
        vacation: #00ffff,
        inactive: #6e6e6e,
        inactive-long: #4f4f4f,
        outlaw: #ff33ff,
        active: #7aff43,
        deleted: #880000,
    );
    $status-count: 8;
    $status-offset: (
        active: 0,
        vacation: 1,
        inactive: 2,
        inactive-long: 3,
        banned: 4,
        outlaw: 5,
        deleted: 6,
        admin: 7,
    );

    .status-history-grid {
        display: grid;
        grid-template-columns: 100px 1fr;
        grid-template-rows: #{$status-count * $status-bar-height + ($status-count - 1) * $status-bar-margin} 100px;

        > .graph,
        > .x-ticks {
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
        }

        > .graph {
            > .bars {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;

                > .bar {
                    position: absolute;
                    height: $status-bar-height;
                    border-radius: 4px;

                    @each $name, $color in $status {
                        &.#{$name} {
                            background: $color;
                            top: #{($status-bar-height + $status-bar-margin) * map-get($status-offset, $name)};
                        }
                    }
                }

                > .x-tick-line {
                    height: 100%;
                    left: calc(var(--x-tick) * 100%);
                    top: 0;
                    width: 1px;
                    position: absolute;
                    background: rgba(white, 0.15);
                }
            }

            > .y-tick {
                height: $status-bar-height;
                left: 0;
                width: 100%;
                top: calc(var(--y-tick) * #{$status-bar-height + $status-bar-margin});
                position: absolute;

                &::before {
                    position: absolute;
                    content: "";
                    height: 1px;
                    top: calc(50% - 0.5px);
                    width: 100%;
                    display: block;
                    background: rgba(white, 0.2);
                }
            }
        }

        > .y-ticks {
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-rows: repeat($status-count, $status-bar-height);
            row-gap: $status-bar-margin;
            align-items: center;
            color: #888;
            font-size: 12px;
        }

        > .x-ticks {
            grid-column: 1 / span 2;
            clip-path: polygon(100px 0, 100% 0, 100% 100%, 0 100%);

            > .x-ticks-container {
                position: absolute;
                top: 0;
                width: 100%;

                > .x-tick {
                    position: absolute;
                    top: 0;
                    transform-origin: top right;
                    transform: translateY(10px) translateX(-100%) translateX(-5px) rotate(-45deg);
                    left: calc(100px + var(--x-tick) * (100% - 100px));
                    color: #888;
                    font-size: 12px;
                }
            }
        }

        > .scrollbar {
            overflow: auto;
            grid-column: 2;
        }
    }
</style>