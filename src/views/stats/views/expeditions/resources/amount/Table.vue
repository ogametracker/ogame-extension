<template>
    <ranged-expedition-table
        :filter="(expo) => filterExpo(expo)"
        :items="items"
        :footerItems="footerItems"
        show-average
    />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedExpeditionTable, { RangedExpeditionTableItem } from '@stats/components/expeditions/RangedExpeditionTable.vue';
    import { ExpeditionEvent, ExpeditionEventResources } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { ResourceType } from '@/shared/models/v1/ogame/resources/ResourceType';

    @Component({
        components: {
            RangedExpeditionTable,
        },
    })
    export default class Table extends Vue {
        private filterExpo(expo: ExpeditionEvent): boolean {
            return expo.type == ExpeditionEventType.resources;
        }

        private get items(): RangedExpeditionTableItem[] {
            return Object.values(ResourceType).map(resource => ({
                label: `LOCA: ${resource}`,
                getValue: expos => (expos as ExpeditionEventResources[])
                    .reduce((acc, expo) => acc + expo.resources[resource], 0),
            }));
        }

        private get footerItems(): RangedExpeditionTableItem[] {
            return [
                {
                    label: `LOCA: Total`,
                    getValue: expos => (expos as ExpeditionEventResources[]).reduce(
                        (acc, expo) => acc + expo.resources.metal + expo.resources.crystal + expo.resources.deuterium
                        , 0),
                },
                {
                    label: `LOCA: Total (MSU)`,
                    getValue: expos => (expos as ExpeditionEventResources[]).reduce(
                        (acc, expo) => acc + expo.resources.metal + expo.resources.crystal * 2 + expo.resources.deuterium * 3 //TODO: MSU from settings
                        , 0),
                },
            ];
        }
    }
</script>