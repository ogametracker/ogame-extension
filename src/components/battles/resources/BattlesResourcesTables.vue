<template>
    <div>
        <battles-ranged-table :items="items" no-percentage show-total />
    </div>
</template>
 
<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import Resource from "@/models/Resource";
    import BattlesRangedTable, { BattlesRangedTableItem } from '@/components/battles/BattlesRangedTable.vue';
    import i18n from "@/i18n";

    @Component({
        components: {
            BattlesRangedTable,
        },
    })
    export default class BattlesResourcesTables extends Vue {
        private get items(): BattlesRangedTableItem[] {
            return Object.keys(Resource).map(resourceName => {
                const resource = resourceName as Resource;
                return {
                    label: i18n.messages.ogame.resources[resource],
                    getValue: (reports) => reports.reduce((acc, cur) => acc + cur.loot[resource], 0),
                };
            });
        }
    }
</script>