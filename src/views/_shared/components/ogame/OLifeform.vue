<template>
    <div
        class="o-lifeform"
        :class="{
            'o-lifeform--disabled': disabled,
        }"
        :style="{
            'background-image': `url(/img/ogame/lifeforms/${image}.png)`,
            'font-size': size,
        }"
        v-on="$listeners"
        v-bind="{ ...$attrs, ...$props }"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';
    import { LifeformType, LifeformTypes } from '@/shared/models/ogame/lifeforms/LifeformType';

    @Component({})
    export default class OLifeform extends Vue {
        @Prop({
            required: true,
            type: String as PropType<LifeformType>,
            validator: (value: string) => (LifeformTypes as string[]).includes(value)
        })
        private lifeform!: LifeformType;

        @Prop({ required: false, type: String, default: '32px' })
        private size!: string;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;

        private get image() {
            return this.imageMap[this.lifeform];
        }
        private readonly imageMap: Record<LifeformType, string> = {
            [LifeformType.humans]: 'humans',
            [LifeformType.rocktal]: 'rocktal',
            [LifeformType.mechas]: 'mechas',
            [LifeformType.kaelesh]: 'kaelesh',
            [LifeformType.none]: 'none',
        };
    }
</script>
<style lang="scss" scoped>
    .o-lifeform {
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