<template>
    <div>
        <span v-for="(row, i) in rows" :key="i">
            {{ row[0] }}: {{ row[1] }}
        </span>
    </div>
</template>

<script lang="ts">
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { ExpeditionDataModule } from '../../../data/ExpeditionDataModule';

    @Component({})
    export default class Tables extends Vue {
        private readonly manager = new ExpeditionDataModule();

        private get rows(): [string, number][] {
            return Object.values(ExpeditionEventType).map(type =>
                [
                    type as string,
                    this.manager.expeditions.filter(expo => expo.type == type).length
                ]
            );
        }
    }
</script>