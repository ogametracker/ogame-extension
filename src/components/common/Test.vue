<template>
    <div>
        <div v-for="item in items" :key="item.name + 'title'">
            <h3>{{ item.title }}</h3>
        </div>

        <div v-for="item in items" :key="item.name + 'slot'">
            <slot :name="item.name" />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';

    export interface TabItem {
        name: string;
        title: string;
    }

    @Component({})
    export default class Test extends Vue {
        @Prop({ required: true, type: Array as PropType<TabItem[]> })
        private items!: TabItem[];
    }
</script>