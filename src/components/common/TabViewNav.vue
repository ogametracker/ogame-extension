<template>
    <div>
        <div v-for="(item, index) in items" :key="item.name + 'nav-item'">
            <div
                @click="$emit('update:activeIndex', index)"
                class="tab-nav-item"
                :class="{ active: activeIndex == index }"
            >
                {{ item.title }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { TabViewItem } from './TabView.vue';

    @Component({})
    export default class TabViewNav extends Vue {
        @Prop({ required: true, type: Array as PropType<TabViewItem[]> })
        private items!: TabViewItem[];

        @Prop({ required: true, type: Number })
        private activeIndex!: number;


    }
</script>