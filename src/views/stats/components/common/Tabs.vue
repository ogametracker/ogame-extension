<template>
    <div class="tabs">
        <header :style="{ '--tab-count': tabs.length }">
            <div
                class="tab"
                v-for="(tab, i) in tabs"
                :key="i"
                :class="{
                    'tab--active': tab == activeTab,
                }"
                @click="setActiveTab(tab)"
            >
                <span class="tab-content">
                    <span v-text="tab.label" />
                </span>
            </div>
        </header>
        <main>
            <slot :name="`tab-content-${activeTab.key}`" />
        </main>
    </div>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

    export interface Tab {
        key: string | number;
        label: string;
    }

    @Component({})
    export default class Tabs extends Vue {

        @Prop({ required: true, type: Array as PropType<Tab[]>, validator: (tabs: Tab[]) => tabs.length > 0 })
        private tabs!: Tab[];

        private activeTab: Tab = null!;

        @Watch('tabs', { immediate: true })
        private onTabsChanged() {
            if (this.tabs.includes(this.activeTab)) {
                return;
            }

            this.setActiveTab(this.tabs[0]);
        }

        private setActiveTab(tab: Tab) {
            this.activeTab = tab;
            this.$emit('tab-selected', tab);
        }
    }
</script>
<style lang="scss" scoped>
    .tabs {
        display: grid;
        grid-template-rows: auto 1fr;
        height: 100%;

        > header {
            display: grid;
            grid-template-columns: repeat(var(--tab-count), 1fr);
            text-align: center;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;

            > .tab {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                text-decoration: none;
                padding: 8px;
                cursor: pointer;

                background-color: rgba(var(--color), 0.15);

                &:not(.tab--active):hover {
                    background-color: rgba(var(--color), 0.25);
                }

                &.tab--active {
                    background: linear-gradient(
                        135deg,
                        rgba(var(--color), 0.4),
                        rgba(var(--color), 0.7)
                    );
                }

                &::v-deep {
                    .mdi::before,
                    .ogti::before {
                        transform: scale(1.5) translateX(-25%);
                    }
                }
            }
        }

        > main {
            border: 1px solid rgba(var(--color), 0.25);
            padding: 12px;
            overflow: auto;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            background: rgba(var(--color), 0.05);
        }
    }
</style>