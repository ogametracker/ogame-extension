<template>
    <div
        class="o-ship"
        :class="{
            'o-ship--disabled': disabled,
        }"
        :style="{
            'background-image': `url(/img/ogame/ships/${image}.jpg)`,
            'font-size': size,
        }"
        v-on="$listeners"
        v-bind="{ ...$attrs, ...$props }"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';
    import { ShipType, ShipTypes } from '@/shared/models/ogame/ships/ShipType';

    @Component({})
    export default class OShip extends Vue {

        @Prop({
            required: true,
            type: Number as PropType<ShipType>,
            validator: (value: number) => (ShipTypes as number[]).includes(value),
        })
        private ship!: ShipType;

        @Prop({ required: false, type: String, default: '32px' })
        private size!: string;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;


        private get image() {
            return this.imageMap[this.ship];
        }
        private readonly imageMap: Record<ShipType, string> = {
            [ShipType.smallCargo]: 'small-cargo',
            [ShipType.largeCargo]: 'large-cargo',
            [ShipType.lightFighter]: 'light-fighter',
            [ShipType.heavyFighter]: 'heavy-fighter',
            [ShipType.cruiser]: 'cruiser',
            [ShipType.battleship]: 'battleship',
            [ShipType.colonyShip]: 'colony-ship',
            [ShipType.recycler]: 'recycler',
            [ShipType.espionageProbe]: 'espionage-probe',
            [ShipType.bomber]: 'bomber',
            [ShipType.solarSatellite]: 'solar-satellite',
            [ShipType.destroyer]: 'destroyer',
            [ShipType.deathStar]: 'death-star',
            [ShipType.battlecruiser]: 'battlecruiser',
            [ShipType.crawler]: 'crawler',
            [ShipType.reaper]: 'reaper',
            [ShipType.pathfinder]: 'pathfinder',
        };
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