<template>
    <div
        class="o-item"
        :class="{
            [`o-item--grade-${fullItem.grade}`]: !hideItemGrade,
            'o-item--disabled': disabled,
            'o-item--hide-grade': hideItemGrade,
        }"
        :style="{
            'background-image': `url(/img/ogame/items/${fullItem.image}.png)`,
            'font-size': size,
        }"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';
    import { ItemHash } from '@/shared/models/v1/ogame/items/ItemHash';
    import { Items } from '@/shared/models/v1/ogame/items/Items';
    import { Item } from '@/shared/models/v1/ogame/items/Item';

    @Component({})
    export default class OItem extends Vue {

        @Prop({ required: true, type: String as PropType<ItemHash> })
        private item!: ItemHash;

        @Prop({ required: false, type: Boolean, default: false })
        private hideItemGrade!: boolean;

        @Prop({ required: false, type: String, default: '32px' })
        private size!: string;

        @Prop({ required: false, type: Boolean, default: false })
        private disabled!: boolean;

        @Prop({ required: false, type: Boolean, default: false })
        private showTooltip!: boolean; //TODO: item tooltip


        private get fullItem(): Item {
            return Items[this.item];
        }
    }
</script>
<style lang="scss" scoped>
    $ogame-item-grades: (
        none: #2374ba,
        bronze: #834b2d,
        silver: #8d939c,
        gold: #ffb84a,
        platinum: #7e3d8e,
    );

    .o-item {
        width: 1em;
        height: 1em;
        display: inline-block;
        background-size: cover;
        background-position: center;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: -moz-crisp-edges;
        border-radius: 4px;

        border: 2px solid transparent;

        &--hide-grade {
            border: none;
        }

        &--disabled {
            filter: grayscale(1) brightness(0.7) contrast(1.2);
        }
    }

    @each $grade, $color in $ogame-item-grades {
        .o-item--grade-#{$grade} {
            border-color: $color;
        }
    }
</style>