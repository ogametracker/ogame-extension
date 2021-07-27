<template>
    <div
        class="grid-table"
        :class="{
            'sticky-header': stickyHeader,
        }"
        :style="{
            'grid-template-columns': columns.join(' '),
        }"
    >
        <slot />
    </div>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class GridTable extends Vue {
        @Prop({ type: Array as PropType<string[]>, required: true })
        private columns!: string[];

        @Prop({ type: Boolean, required: false })
        private stickyHeader!: boolean;

    }
</script>