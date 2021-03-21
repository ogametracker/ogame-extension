<template>
    <b-row class="min-max-h-100 flex-grow-1 flex-nowrap">
        <b-col md="auto" class="min-max-h-100">
            <b-nav vertical pills>
                <b-nav-item
                    v-for="(item, index) in items"
                    :key="item.name + 'nav-item'"
                    :active="index == activeIndex"
                    @click="setActiveIndex(index)"
                >
                    {{ item.title }}
                </b-nav-item>
            </b-nav>
        </b-col>

        <b-col
            class="min-max-h-100"
            :class="{
                'overflow-auto': overflow,
            }"
        >
            <div
                class="min-max-h-100 tab-content-wrapper"
                :class="{
                    'd-flex': index == activeIndex,
                    'tab-content-vertical': verticalContent,
                }"
                v-for="(item, index) in items"
                :key="item.name + 'slot'"
                v-show="index == activeIndex"
            >
                <slot :name="item.name" v-if="isSlotRendered(index)" />
            </div>
        </b-col>
    </b-row>
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
<style lang="scss" scoped>
    .tab-content-wrapper > * {
        display: flex;
        flex-grow: 1;
    }

    .tab-content-wrapper.tab-content-vertical > * {
        flex-direction: column;
    }
</style>