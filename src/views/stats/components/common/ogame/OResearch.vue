<template>
    <div
        class="o-research"
        :class="{
            'o-research--disabled': disabled,
        }"
        :style="{
            'background-image': `url(/img/ogame/research/${research}.jpg)`,
            'font-size': size,
        }"
        v-on="$listeners"
        v-bind="{ ...$attrs, ...$props }"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';

    export enum OResearchType {
        'espionage-technology' = 'espionage-technology',
        'computer-technology' = 'computer-technology',
        'weapons-technology' = 'weapons-technology',
        'shielding-technology' = 'shielding-technology',
        'armor-technology' = 'armor-technology',
        'energy-technology' = 'energy-technology',
        'hyperspace-technology' = 'hyperspace-technology',
        'combustion-drive' = 'combustion-drive',
        'impulse-drive' = 'impulse-drive',
        'hyperspace-drive' = 'hyperspace-drive',
        'laser-technology' = 'laser-technology',
        'ion-technology' = 'ion-technology',
        'plasma-technology' = 'plasma-technology',
        'intergalactic-research-network' = 'intergalactic-research-network',
        'astrophysics' = 'astrophysics',
        'graviton-technology' = 'graviton-technology',
    }

    @Component({})
    export default class OResearch extends Vue {

        @Prop({
            required: true,
            type: String as PropType<OResearchType>,
            validator: (value: string) => (Object.values(OResearchType) as string[]).includes(value)
        })
        private research!: OResearchType;

        @Prop({ required: false, type: String, default: '32px' })
        private size!: string;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;
    }
</script>
<style lang="scss" scoped>
    .o-research {
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