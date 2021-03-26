<template>
    <div class="tab-view" :class="{ 'tab-view-vertical': vertical }">
        <tab-view-nav
            class="tab-nav-list"
            :items="items"
            :active-index="activeIndex"
            @update:activeIndex="setActiveIndex($event)"
        />
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
    import TabViewNav from './TabViewNav.vue';
import { HexColor } from '@/utils/colors';

    export interface TabViewItem {
        name: string;
        title: string;
    }

    @Component({
        components: {
            TabViewNav,
        },
    })
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