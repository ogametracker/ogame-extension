<template>
    <div class="grid-table-row" :class="{ 'grid-table-row-hidden': !show }">
        <slot />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class GridCell extends Vue {
        @Prop({ required: false, type: Boolean, default: true })
        private show!: boolean;
    }
</script>