<template>
    <div class="scrapyard-merchant">
        <div>
            <input
                type="number"
                min="35"
                max="75"
                step="1"
                :value="percentage"
                @input="setPercentage($event)"
            />
            <span v-text="$i18n.$t.extension.tools.scrapyardMerchant.percentage" />
        </div>

        <grid-table
            class="scrap-table"
            :columns="columns"
            :items="items"
            :footer-items="footerItems"
            sticky
            sticky-footer
        >
            <template #cell-type="{ item }">
                <template v-if="item.type in ships">
                    <span v-text="$i18n.$t.ogame.ships[item.type]" class="mr-2" />
                    <o-ship :ship="item.type" size="24px" />
                </template>

                <template v-else-if="item.type in defenses">
                    <span v-text="$i18n.$t.ogame.defenses[item.type]" class="mr-2" />
                    <o-defense :defense="item.type" size="24px" />
                </template>
            </template>
            <template #cell-count="{ item }">
                <input
                    v-if="item.type in ships"
                    type="number"
                    min="0"
                    step="1"
                    v-model.number="ships[item.type]"
                />
                <input
                    v-else-if="item.type in defenses"
                    type="number"
                    min="0"
                    step="1"
                    v-model.number="defenses[item.type]"
                />
            </template>
            <template #[`(cell|footer)-${resourcesRegex}`]="{ match, item }">
                <span
                    v-text="$i18n.$n(getTotalCost(item)[match.groups.resource])"
                />
            </template>
            <template #[`(cell|footer)-msu-dsu`]="{ item }">
                <span v-text="$i18n.$n(getMsuOrDsu(getTotalCost(item)))" />
            </template>
        </grid-table>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
import { Defense } from '@/shared/models/ogame/defenses/Defense';
import { DefenseType } from '@/shared/models/ogame/defenses/DefenseType';
import { DefenseByTypes, DefenseTypes } from '@/shared/models/ogame/defenses/DefenseTypes';
import { Ship } from '@/shared/models/ogame/ships/Ship';
import { ShipType } from '@/shared/models/ogame/ships/ShipType';
import { ShipByTypes, ShipTypes } from '@/shared/models/ogame/ships/ShipTypes';
import { createRecord } from '@/shared/utils/createRecord';
import { GridTableColumn } from '../../components/common/GridTable.vue';
import { addCost, Cost, multiplyCost } from '@/shared/models/ogame/common/Cost';
import { getMsuOrDsu } from '../../models/settings/getMsuOrDsu';
import { SettingsDataModule } from '../../data/SettingsDataModule';


@Component({})
export default class ScrapyardMerchant extends Vue {
    private readonly resourcesRegex = '(?<resource>metal|crystal|deuterium)';

    private percentage = 35;
    private get percentageComputed() {
        return this.percentage;
    }
    private set percentageComputed(value: number) {
        this.percentage = Math.max(35, Math.min(75, Math.trunc(value)));
    }

    private readonly ships: Record<ShipType, number> = createRecord(ShipTypes, 0);
    private readonly defenses: Record<DefenseType, number> = createRecord(DefenseTypes, 0);

    private get columns(): GridTableColumn[] {
        return [
            {
                key: 'type',
            },
            {
                key: 'count',
                label: this.$i18n.$t.extension.tools.scrapyardMerchant.count,
            },
            {
                key: 'metal',
                label: this.$i18n.$t.ogame.resources.metal,
            },
            {
                key: 'crystal',
                label: this.$i18n.$t.ogame.resources.crystal,
            },
            {
                key: 'deuterium',
                label: this.$i18n.$t.ogame.resources.deuterium,
            },
            {
                key: 'msu-dsu',
                label: `${this.$i18n.$t.extension.common.resourceUnits} (${this.conversionModeText})`,
            },
        ];
    }

    private get conversionModeText() {
        return SettingsDataModule.settings.conversionRates.mode == 'msu'
            ? this.$i18n.$t.extension.common.msu
            : this.$i18n.$t.extension.common.dsu;
    }

    private getTotalCost(item: Ship | Defense | {}): Cost {
        const factor = this.percentage / 100;

        if ('type' in item) {
            const count = 'baseSpeed' in item ? this.ships[item.type] : this.defenses[item.type];
            return multiplyCost(item.cost, count * factor);
        }

        return addCost(
            ...ShipTypes.map(ship => multiplyCost(ShipByTypes[ship].cost, this.ships[ship] * factor)),
            ...DefenseTypes.map(def => multiplyCost(DefenseByTypes[def].cost, this.defenses[def] * factor)),
        );
    }

    private getMsuOrDsu(cost: Cost) {
        return getMsuOrDsu(cost);
    }

    private readonly footerItems = [{}];

    private get items(): (Ship | Defense)[] {
        return [
            ...ShipTypes.map(type => ShipByTypes[type]),
            ...DefenseTypes.map(type => DefenseByTypes[type]),
        ];
    }

    private async setPercentage(event: InputEvent) {
        const input = event.target as HTMLInputElement;
        const value = parseInt(input.value);

        const percentage = isNaN(value)
            ? 0
            : Math.max(35, Math.min(75, Math.trunc(value)));

        this.percentage = value;
        await this.$nextTick();
        this.percentage = percentage;
    }
}
</script>

<style lang="scss" scoped>
.scrapyard-merchant {
    display: grid;
    justify-items: start;
    grid-template-rows: auto 1fr;
    max-height: 100%;
}

.scrap-table::v-deep {
    .grid-table-body .grid-table-cell {
        padding: 4px 8px;
    }
}
</style>