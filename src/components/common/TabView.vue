<template>
    <div class="tab-view" :class="{ 'tab-view-vertical': vertical }">
        <div class="tab-nav-list">
            <div
                v-for="(item, index) in items"
                :key="item.name + 'nav-item'"
                @click="setActiveIndex(index)"
                class="tab-nav-item"
                :class="{ active: activeIndex == index }"
            >
                {{ item.title }}
            </div>
        </div>

        <div
            v-for="(item, index) in items"
            :key="item.name + 'content'"
            v-show="activeIndex == index"
            class="tab-content"
        >
            <slot :name="item.name" v-if="isSlotRendered(index)" />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';

    export interface TabViewItem {
        name: string;
        title: string;
    }

    @Component({})
    export default class TabView extends Vue {
        @Prop({ required: true, type: Array as PropType<TabViewItem[]> })
        private items!: TabViewItem[];

        @Prop({ required: false, type: Boolean, default: false })
        private overflow!: boolean;

        @Prop({ required: false, type: Boolean, default: false })
        private vertical!: boolean;

        @Prop({ required: false, type: Boolean, default: false })
        private verticalContent!: boolean;

        private activeIndex = 0;
        private renderedSlots: boolean[] = [];

        private mounted() {
            this.renderSlot(0);
        }

        private isSlotRendered(index: number) {
            if (this.renderedSlots.length != this.items.length) {
                this.renderedSlots = this.items.map((_, i) => this.renderedSlots[i] ?? false);
            }

            return this.renderedSlots[index];
        }

        private renderSlot(index: number) {
            if (this.renderedSlots.length != this.items.length) {
                this.renderedSlots = this.items.map((_, i) => this.renderedSlots[i] ?? false);
            }
            this.renderedSlots[index] = true;
        }

        private setActiveIndex(index: number) {
            this.activeIndex = index;
            this.renderSlot(index);
        }
    }
</script>
<style lang="scss">
    $vertical-tab-nav-width: 150px;
    $horizontal-tab-nav-height: 40px;

    .tab-view {
        display: grid;

        width: 100%;
        height: 100%;

        grid-template-columns: auto;
        grid-template-rows: $horizontal-tab-nav-height 1fr;

        .tab-nav-item {
            padding: 16px;
            border-radius: 4px;
            cursor: pointer;

            &:hover {
                background: rgba(blue, 0.5);
            }

            &.active,
            &.active:hover {
                background: blue;
            }
        }
    }

    .tab-view.tab-view-vertical {
        grid-template-rows: auto;
        grid-template-columns: $vertical-tab-nav-width 1fr;
    }

    .tab-content {
        padding: 0 16px;
    }

    .tab-content,
    .tab-nav-list {
        height: 100%;
        max-height: 100%;
        overflow: auto;
    }
</style>