<template>
    <div>
        <grid-table :columns="columns" :items="items" />
    </div>
</template>

<script lang="ts">
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { Component, Vue } from 'vue-property-decorator';
    import { ExpeditionDataModule } from '../../../data/ExpeditionDataModule';
    import { GridTableColumn } from '../../common/GridTable.vue';

    @Component({})
    export default class Tables extends Vue {
        private get columns(): GridTableColumn[] {
            return [
                {
                    key: 'type',
                    label: 'LOCA: Type',
                },
                {
                    key: 'count',
                    label: 'LOCA: Count in Range',
                },
            ];
        }

        private get items(): { type: ExpeditionEventType; count: number}[] {
            const expeditions = ExpeditionDataModule.expeditions;

            return Object.values(ExpeditionEventType).map(type => ({
                type,
                count: expeditions.filter(expo => expo.type == type).length,
            }));
        }
    }
</script>