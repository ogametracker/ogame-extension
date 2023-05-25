<template>
    <span v-if="size == ExpeditionEventSize.small" class="mdi mdi-hexagon-slice-1" :style="{ color: colors.small }" />
    <span v-else-if="size == ExpeditionEventSize.medium" class="mdi mdi-hexagon-slice-3" :style="{ color: colors.medium }" />
    <span v-else-if="size == ExpeditionEventSize.large" class="mdi mdi-hexagon-slice-5" :style="{ color: colors.large }" />
</template>

<script lang="ts">
    import { ExpeditionEventSize } from '@/shared/models/expeditions/ExpeditionEventSize';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';
    import { SettingsDataModule } from '../../data/SettingsDataModule';

    @Component({})
    export default class ExpeditionSizeIcon extends Vue {
        @Prop({ required: true, type: String as PropType<ExpeditionEventSize> })
        private size!: ExpeditionEventSize;

        private readonly ExpeditionEventSize = ExpeditionEventSize;

        private get colors() {
            return SettingsDataModule.settings.colors.expeditions.sizes;
        }
    }
</script>