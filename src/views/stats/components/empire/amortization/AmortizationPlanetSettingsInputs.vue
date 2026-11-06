<template>
    <div class="planet-settings" :class="{ disabled: settings.include == false }">
        <div class="header">
            <span v-text="settings.name" />
            <span v-if="settings.coordinates != null">
                [{{ settings.coordinates.galaxy }}:{{ settings.coordinates.system }}:{{
                    settings.coordinates.position
                }}]
            </span>
        </div>

        <div class="body">
            <template v-if="toggleable">
                <span v-text="translations().extension.empire.amortization.settings.planetSettings.includeInResult" />
                <Checkbox v-model="settings.include" />
            </template>

            <span v-text="translations().extension.empire.amortization.settings.planetSettings.position" />
            <span>
                <input type="number" v-model.number="settings.position" min="1" max="15" step="1" />
            </span>

            <span v-text="translations().extension.empire.amortization.settings.planetSettings.maxTemperature" />
            <span>
                <input type="number" v-model.number="settings.maxTemperature" min="-130" max="260" step="1" />
            </span>

            <span v-text="translations().extension.empire.amortization.settings.planetSettings.activeItems" />
            <span class="item-grid">
                <OItem
                    v-for="item in boosterItems.metal"
                    :key="item"
                    :item="item"
                    :disabled="item != activeBooster.metal"
                    @click="toggleBooster(item, boosterItems.metal)"
                />
                <OItem
                    v-for="item in boosterItems.crystal"
                    :key="item"
                    :item="item"
                    :disabled="item != activeBooster.crystal"
                    @click="toggleBooster(item, boosterItems.crystal)"
                />
                <OItem
                    v-for="item in boosterItems.deuterium"
                    :key="item"
                    :item="item"
                    :disabled="item != activeBooster.deuterium"
                    @click="toggleBooster(item, boosterItems.deuterium)"
                />
            </span>

            <span v-text="translations().extension.empire.amortization.settings.planetSettings.crawlers.title" />
            <span class="crawler-grid">
                <div class="crawler-grid-row">
                    <input type="number" v-model.number="settings.crawlers.percentage" step="10" min="0" max="150" />
                    <span
                        v-text="
                            translations().extension.empire.amortization.settings.planetSettings.crawlers.percentage
                        "
                    />
                </div>
                <div class="crawler-grid-row">
                    <CheckboxButton
                        v-model="settings.crawlers.max"
                        :unchecked-color="null"
                        :style="{
                            '--color': settings.crawlers.max ? '0, 255, 0' : null,
                        }"
                    >
                        <span
                            v-if="settings.crawlers.max"
                            v-text="
                                translations().extension.empire.amortization.settings.planetSettings.crawlers.maxCount
                            "
                        />
                        <span
                            v-else
                            v-text="
                                translations().extension.empire.amortization.settings.planetSettings.crawlers.fixCount
                            "
                        />
                    </CheckboxButton>
                    <input type="number" v-model.number="settings.crawlers.count" :disabled="settings.crawlers.max" />
                </div>
            </span>

            <template v-if="settings.mines != null">
                <span v-text="translations().extension.empire.amortization.settings.planetSettings.mines" />
                <span class="mine-grid">
                    <OBuilding :building="BuildingType.metalMine" />
                    <input type="number" v-model.number="settings.mines.metalMine" />

                    <OBuilding :building="BuildingType.crystalMine" />
                    <input type="number" v-model.number="settings.mines.crystalMine" />

                    <OBuilding :building="BuildingType.deuteriumSynthesizer" />
                    <input type="number" v-model.number="settings.mines.deuteriumSynthesizer" />
                </span>
            </template>

            <span v-text="translations().extension.empire.amortization.settings.planetSettings.lifeform" />
            <span class="lifeform-grid">
                <OLifeform
                    v-for="lifeform in lifeforms"
                    :key="lifeform"
                    :lifeform="lifeform"
                    :disabled="lifeform != settings.lifeform"
                    @click="toggleLifeform(lifeform)"
                />
            </span>

            <template v-if="planetData != null && !productionMode">
                <span />
                <span>
                    <Checkbox
                        v-model="settings.ignoreEmptyLifeformTechnologySlots"
                        :label="translations().extension.empire.amortization.settings.planetSettings.ignoreEmptySlots"
                    />
                </span>
            </template>

            <span />
            <span>
                <button
                    class="toggle-lifeform-settings"
                    @click="showLifeformSettings = !showLifeformSettings"
                    :disabled="settings.lifeform == 'none'"
                >
                    <span class="mdi" :class="showLifeformSettings ? 'mdi-menu-up' : 'mdi-menu-down'" />
                    <span
                        v-text="translations().extension.empire.amortization.settings.planetSettings.lifeformSettings"
                    />
                </button>
            </span>

            <template v-if="showLifeformSettings">
                <template v-if="settings.lifeformTechnologyLevels != null">
                    <span
                        v-text="
                            translations().extension.empire.amortization.settings.planetSettings
                                .relevantLifeformBuildings
                        "
                    />
                    <span class="lifeform-building-grid">
                        <template v-for="building in applicableLifeformBuildings" :key="building">
                            <OLifeformBuilding :building="building" />
                            <input type="number" v-model.number="settings.lifeformBuildingLevels![building]" />
                        </template>
                    </span>
                </template>

                <span
                    v-text="translations().extension.empire.amortization.settings.planetSettings.lifeformTechnologies"
                />
                <span>
                    <span class="lifeform-tech-grid">
                        <span
                            v-for="slot in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]"
                            :key="`slot-${slot}`"
                            class="row"
                        >
                            <hr v-if="slot == 7 || slot == 13" />

                            <OLifeformTechnology
                                v-for="lifeform in lifeforms"
                                :key="lifeformTechBySlot[slot][lifeform]"
                                :technology="lifeformTechBySlot[slot][lifeform]"
                                :disabled="getSelectedLifeformTechBySlot(slot) != lifeformTechBySlot[slot][lifeform]"
                                @click="toggleLifeformTech(lifeformTechBySlot[slot][lifeform])"
                            />

                            <span v-if="settings.lifeformTechnologyLevels == null" />
                            <input
                                v-else-if="getSelectedLifeformTechBySlot(slot) != null"
                                type="number"
                                v-model.number="settings.lifeformTechnologyLevels[getSelectedLifeformTechBySlot(slot)!]"
                            />
                            <input v-else type="number" disabled />
                        </span>
                    </span>
                </span>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import Checkbox from '@stats/components/common/Checkbox.vue';
import CheckboxButton from '@stats/components/common/CheckboxButton.vue';
import OBuilding from '@stats/components/ogame/OBuilding.vue';
import OItem from '@ogame-tracker/view-shared/components/ogame/OItem.vue';
import OLifeform from '@ogame-tracker/view-shared/components/ogame/OLifeform.vue';
import OLifeformBuilding from '@stats/components/ogame/OLifeformBuilding.vue';
import OLifeformTechnology from '@stats/components/ogame/OLifeformTechnology.vue';
import { computed, ref, watch } from 'vue';
import { translations } from '@stats/i18n';
import { BuildingType } from '@ogame-tracker/shared/models/ogame/buildings/BuildingType';
import { ItemHash } from '@ogame-tracker/shared/models/ogame/items/ItemHash';
import {
    AnyBuildingCostAndTimeReductionLifeformBuildings,
    LifeformTechnologyBonusLifeformBuildings,
    LifeformTechnologyResearchBuildings,
    ResourceProductionBonusLifeformBuildings,
} from '@ogame-tracker/shared/models/ogame/lifeforms/buildings/LifeformBuildings';
import {
    LifeformBuildingType,
    LifeformBuildingTypesByLifeform,
} from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBuildingType';
import {
    LifeformTechnologySlots,
    LifeformTechnologyType,
    LifeformTechnologyTypesByLifeform,
} from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformTechnologyType';
import { LifeformType, ValidLifeformTypes } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import type { ValidLifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import { createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { _throw } from '@ogame-tracker/shared/utils/_throw';
import { useServerSettingsStore } from '@stats/data/ServerSettingsDataModule';
import type { PropType } from 'vue';
import { getAverageTemperature } from '@ogame-tracker/shared/models/ogame/resource-production/getAverageTemperature';
import type { AmortizationPlanetSettings } from '@ogame-tracker/shared/models/empire/amortization/AmortizationPlanetSettings';
import type { PlanetData } from '@ogame-tracker/shared/models/empire/PlanetData';
import { ResourceTypes } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';

const props = defineProps({
    planetData: { required: false, type: Object as PropType<PlanetData | null> },
    productionMode: { required: false, type: Boolean },
    toggleable: { required: false, type: Boolean },
});

const serverSettingsStore = useServerSettingsStore();

const lifeforms = ValidLifeformTypes;

const slots: number[] = Array.from({ length: 18 }).map((_, i) => i + 1);

const lifeformTechBySlot: Record<number, Record<ValidLifeformType, LifeformTechnologyType>> = createRecord(
    slots,
    slot =>
        createRecord(
            ValidLifeformTypes,
            lf =>
                LifeformTechnologyTypesByLifeform[lf].find(tech => LifeformTechnologySlots[tech] == slot) ??
                _throw('invalid slot'),
        ),
);

function getSelectedLifeformTechBySlot(slot: number): LifeformTechnologyType | null {
    const techs = Object.values(lifeformTechBySlot[slot]);
    return techs.find(tech => settings.value.activeLifeformTechnologies.includes(tech)) ?? null;
}

const applicableBuildingTypes = [
    ...ResourceProductionBonusLifeformBuildings.filter(b => ResourceTypes.some(resource => b.appliesTo(resource))),
    ...LifeformTechnologyBonusLifeformBuildings,
    ...AnyBuildingCostAndTimeReductionLifeformBuildings,
    ...LifeformTechnologyResearchBuildings,
].map(b => b.type);

const applicableLifeformBuildings = computed<LifeformBuildingType[]>(() => {
    const lfBuildings = LifeformBuildingTypesByLifeform[settings.value.lifeform];
    return lfBuildings.filter(building => applicableBuildingTypes.includes(building));
});

const settings = defineModel<AmortizationPlanetSettings>({
    required: true,
    type: Object as PropType<AmortizationPlanetSettings>,
});

function onSettingsChanged() {
    const lifeform = settings.value.lifeform;
    if (lifeform == LifeformType.none) {
        return;
    }

    const planetData = props.planetData;
    if (settings.value.ignoreEmptyLifeformTechnologySlots && planetData != null) {
        const remove = settings.value.activeLifeformTechnologies.filter(tech => {
            const slot = LifeformTechnologySlots[tech];

            return !planetData.activeLifeformTechnologies.some(
                planetTech => slot == LifeformTechnologySlots[planetTech],
            );
        });

        if (remove.length > 0) {
            settings.value.activeLifeformTechnologies = settings.value.activeLifeformTechnologies.filter(
                tech => !remove.includes(tech),
            );
        }
    }
}

function onAstrophysicsSettingsPlanetPositionChanged(newPosition: number) {
    settings.value.maxTemperature = getAverageTemperature(newPosition);
}

const boosterItems = {
    metal: [
        ItemHash.metalBooster_bronze_7days,
        ItemHash.metalBooster_silver_7days,
        ItemHash.metalBooster_gold_7days,
        ItemHash.metalBooster_platinum_7days,
    ],
    crystal: [
        ItemHash.crystalBooster_bronze_7days,
        ItemHash.crystalBooster_silver_7days,
        ItemHash.crystalBooster_gold_7days,
        ItemHash.crystalBooster_platinum_7days,
    ],
    deuterium: [
        ItemHash.deuteriumBooster_bronze_7days,
        ItemHash.deuteriumBooster_silver_7days,
        ItemHash.deuteriumBooster_gold_7days,
        ItemHash.deuteriumBooster_platinum_7days,
    ],
};

const boosterItemsMap: Partial<Record<ItemHash, ItemHash>> = {
    //metal
    [ItemHash.metalBooster_bronze_7days]: ItemHash.metalBooster_bronze_7days,
    [ItemHash.metalBooster_silver_7days]: ItemHash.metalBooster_silver_7days,
    [ItemHash.metalBooster_gold_7days]: ItemHash.metalBooster_gold_7days,
    [ItemHash.metalBooster_platinum_7days]: ItemHash.metalBooster_platinum_7days,

    [ItemHash.metalBooster_silver_30days]: ItemHash.metalBooster_silver_7days,
    [ItemHash.metalBooster_gold_30days]: ItemHash.metalBooster_gold_7days,
    [ItemHash.metalBooster_platinum_30days]: ItemHash.metalBooster_platinum_7days,

    [ItemHash.metalBooster_silver_90days]: ItemHash.metalBooster_silver_7days,
    [ItemHash.metalBooster_gold_90days]: ItemHash.metalBooster_gold_7days,
    [ItemHash.metalBooster_platinum_90days]: ItemHash.metalBooster_platinum_7days,

    //crystal
    [ItemHash.crystalBooster_bronze_7days]: ItemHash.crystalBooster_bronze_7days,
    [ItemHash.crystalBooster_silver_7days]: ItemHash.crystalBooster_silver_7days,
    [ItemHash.crystalBooster_gold_7days]: ItemHash.crystalBooster_gold_7days,
    [ItemHash.crystalBooster_platinum_7days]: ItemHash.crystalBooster_platinum_7days,

    [ItemHash.crystalBooster_silver_30days]: ItemHash.crystalBooster_silver_7days,
    [ItemHash.crystalBooster_gold_30days]: ItemHash.crystalBooster_gold_7days,
    [ItemHash.crystalBooster_platinum_30days]: ItemHash.crystalBooster_platinum_7days,

    [ItemHash.crystalBooster_silver_90days]: ItemHash.crystalBooster_silver_7days,
    [ItemHash.crystalBooster_gold_90days]: ItemHash.crystalBooster_gold_7days,
    [ItemHash.crystalBooster_platinum_90days]: ItemHash.crystalBooster_platinum_7days,

    // deuterium
    [ItemHash.deuteriumBooster_bronze_7days]: ItemHash.deuteriumBooster_bronze_7days,
    [ItemHash.deuteriumBooster_silver_7days]: ItemHash.deuteriumBooster_silver_7days,
    [ItemHash.deuteriumBooster_gold_7days]: ItemHash.deuteriumBooster_gold_7days,
    [ItemHash.deuteriumBooster_platinum_7days]: ItemHash.deuteriumBooster_platinum_7days,

    [ItemHash.deuteriumBooster_silver_30days]: ItemHash.deuteriumBooster_silver_7days,
    [ItemHash.deuteriumBooster_gold_30days]: ItemHash.deuteriumBooster_gold_7days,
    [ItemHash.deuteriumBooster_platinum_30days]: ItemHash.deuteriumBooster_platinum_7days,

    [ItemHash.deuteriumBooster_silver_90days]: ItemHash.deuteriumBooster_silver_7days,
    [ItemHash.deuteriumBooster_gold_90days]: ItemHash.deuteriumBooster_gold_7days,
    [ItemHash.deuteriumBooster_platinum_90days]: ItemHash.deuteriumBooster_platinum_7days,
};

const showLifeformSettings = ref(false);

const isCrawlerOverloadEnabled = computed(
    () => serverSettingsStore.serverSettings.playerClasses.collector.crawlers.isOverloadEnabled,
);

const activeBooster = computed(() => {
    return {
        metal: boosterItems.metal.find(item =>
            settings.value.activeItems.map(item => boosterItemsMap[item]).includes(item),
        ),
        crystal: boosterItems.crystal.find(item =>
            settings.value.activeItems.map(item => boosterItemsMap[item]).includes(item),
        ),
        deuterium: boosterItems.deuterium.find(item =>
            settings.value.activeItems.map(item => boosterItemsMap[item]).includes(item),
        ),
    };
});

function toggleBooster(item: ItemHash, exclude: ItemHash[]) {
    const active = settings.value.activeItems
        .map(i => boosterItemsMap[i] as ItemHash)
        .filter(i => i == item || !exclude.includes(i));

    if (active.includes(item)) {
        settings.value.activeItems = active.filter(i => i != item);
    } else {
        settings.value.activeItems = [...active, item];
    }
}

function toggleLifeform(lifeform: LifeformType) {
    if (settings.value.lifeform == lifeform) {
        settings.value.lifeform = LifeformType.none;
        settings.value.activeLifeformTechnologies = [];
        showLifeformSettings.value = false;
        return;
    }

    settings.value.lifeform = lifeform;
    settings.value.activeLifeformTechnologies = LifeformTechnologyTypesByLifeform[settings.value.lifeform];
}

function toggleLifeformTech(tech: LifeformTechnologyType) {
    if (settings.value.activeLifeformTechnologies.includes(tech)) {
        settings.value.activeLifeformTechnologies = settings.value.activeLifeformTechnologies.filter(t => t != tech);
    } else {
        settings.value.activeLifeformTechnologies = settings.value.activeLifeformTechnologies.filter(
            t => LifeformTechnologySlots[t] != LifeformTechnologySlots[tech],
        );
        settings.value.activeLifeformTechnologies.push(tech);
    }
}

watch(() => settings.value, onSettingsChanged, { immediate: true, deep: true });

watch(() => settings.value.position, onAstrophysicsSettingsPlanetPositionChanged);
</script>

<style lang="scss" scoped>
.planet-settings {
    width: 330px;
    border: 1px solid rgba(var(--color), 0.5);
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    overflow: hidden;

    &.disabled {
        --color: 80, 80, 80;
        backdrop-filter: grayscale(0.5);
    }
}

.header {
    background: black linear-gradient(0deg, rgba(var(--color), 0.5), rgba(var(--color), 0.7));
    text-align: center;
}

.header,
.body {
    padding: 8px;
}

.body {
    display: grid;
    grid-template-columns: minmax(auto, 100px) 1fr;
    align-items: center;
    gap: 8px 16px;
}

input[type='number'] {
    width: 60px;
}

.item-grid {
    display: grid;
    grid-template-columns: repeat(4, auto);
    width: max-content;
    gap: 4px;

    > .o-item {
        cursor: pointer;
    }
}

.mine-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    row-gap: 4px;
    align-items: stretch;
}

.crawler-grid {
    display: grid;
    gap: 4px;

    &-row {
        display: flex;
        column-gap: 4px;
        align-items: center;
    }
}

.lifeform-grid {
    display: grid;
    gap: 4px;
    grid-template-columns: repeat(4, auto);
    width: max-content;

    .o-lifeform {
        cursor: pointer;
    }
}

.lifeform-tech-grid {
    display: grid;
    grid-template-columns: repeat(4, auto) 1fr;
    width: max-content;
    gap: 4px;

    .row {
        display: contents;
    }

    hr {
        grid-column: 1 / 6;
        width: 100%;
    }

    .o-lifeform-technology {
        cursor: pointer;
    }

    input[type='number'] {
        width: 50px;
    }
}

.lifeform-building-grid {
    display: grid;
    grid-template-columns: repeat(2, auto);
    width: max-content;
    gap: 4px;
}
</style>
