<template>
    <div
        class="o-player-class"
        :class="{
            'o-player-class--disabled': disabled,
        }"
        :style="{
            'background-image': `url(/img/ogame/player-classes/${image}.png)`,
            'font-size': size,
        }"
        v-on="$listeners"
        v-bind="{ ...$attrs, ...$props }"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';
    import { PlayerClass, PlayerClasses } from '@/shared/models/ogame/classes/PlayerClass';

    @Component({})
    export default class OPlayerClass extends Vue {
        @Prop({
            required: true,
            type: String as PropType<PlayerClass>,
            validator: (value: string) => (PlayerClasses as string[]).includes(value)
        })
        private playerClass!: PlayerClass;

        @Prop({ required: false, type: String, default: '32px' })
        private size!: string;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;


        private get image() {
            return this.imageMap[this.playerClass];
        }
        private readonly imageMap: Record<PlayerClass, string> = {
            [PlayerClass.collector]: 'collector',
            [PlayerClass.discoverer]: 'explorer',
            [PlayerClass.general]: 'general',
            [PlayerClass.none]: 'none',
        };
    }
</script>
<style lang="scss" scoped>
    .o-player-class {
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