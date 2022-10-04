<template>
    <div
        class="o-defense"
        :class="{
            'o-defense--disabled': disabled,
            'o-defense--fade': fade,
        }"
        :style="{
            'background-image': `url(/img/ogame/defense/${image}.jpg)`,
            'font-size': size,
        }"
        v-on="$listeners"
        v-bind="{ ...$attrs, ...$props }"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';
    import { DefenseType } from '@/shared/models/ogame/defenses/DefenseType';
    import { DefenseTypes } from '@/shared/models/ogame/defenses/DefenseTypes';

    @Component({})
    export default class ODefense extends Vue {

        @Prop({
            required: true,
            type: Number as PropType<DefenseType>,
            validator: (value: number) => (DefenseTypes as number[]).includes(value),
        })
        private defense!: DefenseType;

        @Prop({ required: false, type: String, default: '32px' })
        private size!: string;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;

        @Prop({ required: false, type: Boolean })
        private fade!: boolean;


        private get image() {
            return this.imageMap[this.defense];
        }
        private readonly imageMap: Record<DefenseType, string> = {
            [DefenseType.rocketLauncher]: 'rocket-launcher',
            [DefenseType.lightLaser]: 'light-laser',
            [DefenseType.heavyLaser]: 'heavy-laser',
            [DefenseType.gaussCannon]: 'gauss-cannon',
            [DefenseType.ionCannon]: 'ion-cannon',
            [DefenseType.plasmaTurret]: 'plasma-turret',
            [DefenseType.smallShieldDome]: 'small-shield-dome',
            [DefenseType.largeShieldDome]: 'large-shield-dome',
        };
    }
</script>
<style lang="scss" scoped>
    .o-defense {
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