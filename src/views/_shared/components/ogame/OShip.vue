<template>
    <div
        class="o-ship"
        :class="{
            'o-ship--disabled': disabled,
            'o-ship--fade': fade,
        }"
        :style="{
            'background-image': `url(/img/ogame/ships/${image}.jpg)`,
            'font-size': size,
        }"

    />
</template>

<script lang="ts">
    import { computed, defineComponent } from 'vue';
    import type { PropType } from 'vue';
    import { ShipType } from '@ogame-tracker/shared/models/ogame/ships/ShipType';
    import { ShipTypes } from '@ogame-tracker/shared/models/ogame/ships/ShipTypes';

    const imageMap: Record<ShipType, string> = {
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

    export default defineComponent({
        props: {
            ship: {
                required: true,
                type: Number as PropType<ShipType>,
                validator: (value: number) => (ShipTypes as number[]).includes(value),
            },
            size: { required: false, type: String, default: '32px' },
            disabled: { required: false, type: Boolean },
            fade: { required: false, type: Boolean },
        },
        setup(props) {
            const image = computed(() => imageMap[props.ship]);
            return { image };
        },
    });
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
        &--fade {
            opacity: 0.3;
        }
    }
</style>