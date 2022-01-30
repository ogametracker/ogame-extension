<template>
    <div class="tab-view">
        <header :style="{ '--tab-count': tabs.length }">
            <router-link
                v-for="(tab, i) in tabs"
                :key="i"
                :to="tab.to"
                class="tab"
                active-class="tab--active"
            >
                <span v-if="tab.icon != null" :class="tab.icon" />
                <span v-if="tab.label != null" v-text="tab.label" />
            </router-link>
        </header>
        <main>
            <router-view />
        </main>
    </div>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import { RawLocation } from 'vue-router';

    export interface Tab {
        icon?: string;
        label?: string;
        to: RawLocation;
    }

    @Component({})
    export default class TabView extends Vue {
        @Prop({ required: true, type: Array as PropType<Tab[]>, validator: (tabs: Tab[]) => tabs.length > 0 })
        private tabs!: Tab[];
    }
</script>
<style lang="scss" scoped>
    .tab-view {
        display: grid;
        grid-template-rows: auto 1fr;
        height: 100%;

        > header {
            display: grid;
            grid-template-columns: repeat(var(--tab-count), 1fr);
            text-align: center;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            overflow: hidden;

            > .tab {
                text-decoration: none;
                padding: 8px;

                background-color: rgba(var(--color), 0.15);
                &:not(.tab--active):hover {
                    background-color: rgba(var(--color), 0.25);
                }

                &.tab--active {
                    background-color: rgba(var(--color), 0.5);
                }

                &::v-deep {
                    .mdi::before, .ogti::before {
                        transform: scale(1.5) translateX(-25%);
                    }
                }

            }
        }

        > main {
            border: 1px solid rgba(var(--color), 0.5);
            padding: 12px;
            overflow: auto;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
        }
    }
</style>