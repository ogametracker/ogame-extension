<template>
    <div
        class="o-alliance-class"
        :class="{
            'o-alliance-class--disabled': disabled,
        }"
        :style="{
            'background-image': `url(/img/ogame/alliance-classes/${image}.png)`,
            'font-size': size,
        }"
        v-on="$listeners"
        v-bind="{ ...$attrs, ...$props }"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';
    import { AllianceClass, AllianceClasses } from '@/shared/models/ogame/classes/AllianceClass';

    @Component({})
    export default class OAllianceClass extends Vue {

        @Prop({
            required: true,
            type: String as PropType<AllianceClass>,
            validator: (value: string) => (AllianceClasses as string[]).includes(value)
        })
        private allianceClass!: AllianceClass;

        @Prop({ required: false, type: String, default: '32px' })
        private size!: string;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;


        private get image() {
            return this.imageMap[this.allianceClass];
        }
        private readonly imageMap: Record<AllianceClass, string> = {
            [AllianceClass.none]: 'none',
            [AllianceClass.researcher]: 'researcher',
            [AllianceClass.trader]: 'trader',
            [AllianceClass.warrior]: 'warrior',
        };
    }
</script>
<style lang="scss" scoped>
    .o-alliance-class {
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