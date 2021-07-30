<template>
    <o-image-base
        class="o-item"
        :size="size"
        :disabled="disabled"
        :style="{
            'background-image': `url(${$extBase}/img/ogame/items/${itemInfo.image}.png)`,
        }"
        :class="`grade-${itemInfo.grade}`"
    />
</template>

<script lang="ts">
    import items, { ItemHash } from '@/models/items';
    import Item from '@/models/items/Item';
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class OItem extends Vue {
        @Prop({ required: true, type: String as PropType<ItemHash> })
        private item!: ItemHash;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;

        @Prop({ required: false, type: Number })
        private size!: number | null;

        private get itemInfo(): Item {
            return items[this.item];
        }
    }
</script>
<style lang="scss" scoped>
    @import '@/styles/colors';

    .o-item {
        border: 2px solid;
        border-radius: 4px;

        &.grade-none {
            border-color: $ogame-item-grade-none;
        }

        &.grade-bronze {
            border-color: $ogame-item-grade-bronze;
        }

        &.grade-silver {
            border-color: $ogame-item-grade-silver;
        }

        &.grade-gold {
            border-color: $ogame-item-grade-gold;
        }

        &.grade-platinum {
            border-color: $ogame-item-grade-platinum;
        }
    }
</style>