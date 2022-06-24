<template>
    <div
        class="o-ship"
        :class="{
            'o-ship--disabled': disabled,
        }"
        :style="{
            'background-image': `url(/img/ogame/ships/${ship}.jpg)`,
            'font-size': size,
        }"
        v-on="$listeners"
        v-bind="{ ...$attrs, ...$props }"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';

    export enum OShipType {
        "small-cargo" = "small-cargo",
        "large-cargo" = "large-cargo",
        "light-fighter" = "light-fighter",
        "heavy-fighter" = "heavy-fighter",
        "cruiser" = "cruiser",
        "battleship" = "battleship",
        "colony-ship" = "colony-ship",
        "recycler" = "recycler",
        "espionage-probe" = "espionage-probe",
        "bomber" = "bomber",
        "solar-satellite" = "solar-satellite",
        "destroyer" = "destroyer",
        "death-star" = "death-star",
        "battlecruiser" = "battlecruiser",
        "crawler" = "crawler",
        "reaper" = "reaper",
        "pathfinder" = "pathfinder",
    }

    @Component({})
    export default class OShip extends Vue {

        @Prop({
            required: true,
            type: String as PropType<OShipType>,
            validator: (value: string) => (Object.values(OShipType) as string[]).includes(value)
        })
        private ship!: OShipType;

        @Prop({ required: false, type: String, default: '32px' })
        private size!: string;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;
    }
</script>
<style lang="scss" scoped>
    .o-ship {
        width: 1em;
        height: 1em;
        display: inline-block;
        background-size: cover;
        background-position: center;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: -moz-crisp-edges;
        border-radius: 4px;

        &--disabled {
            filter: grayscale(1) brightness(0.7) contrast(1.2);
        }
    }
</style>