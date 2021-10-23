<template>
    <div v-if="player != null">
        <span
            v-text="$i18n.$t.empire.productionOverview.productionInfoMessage"
        />
        <hr />
        <table>
            <colgroup>
                <col width="auto" />
                <col width="100px" />
                <col width="auto" />
                <col width="auto" />
            </colgroup>
            <thead>
                <tr>
                    <th v-text="$i18n.$t.empire.productionOverview.planet" />
                    <th />
                    <th>
                        <o-resource type="metal" :size="50" />
                    </th>
                    <th>
                        <o-resource type="crystal" :size="50" />
                    </th>
                    <th>
                        <o-resource type="deuterium" :size="50" />
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="planet in planets" :key="planet.id">
                    <td v-text="planet.name" />
                    <td>
                        [{{ planet.coordinates.galaxy }}:{{
                            planet.coordinates.system
                        }}:{{ planet.coordinates.position }}]
                    </td>
                    <td v-text="$i18n.$n(getProduction(planet).metal)" />
                    <td v-text="$i18n.$n(getProduction(planet).crystal)" />
                    <td v-text="$i18n.$n(getProduction(planet).deuterium)" />
                </tr>
                <tr
                    class="total-row"
                    v-for="totalRow in totalRows"
                    :key="totalRow.key"
                >
                    <th colspan="2">
                        <span class="average-icon" v-if="totalRow.isAverage" />
                        <span
                            :style="totalRow.titleStyle"
                            v-text="totalRow.title"
                        />
                    </th>

                    <td v-text="totalRow.metal" />
                    <td v-text="totalRow.crystal" />
                    <td v-text="totalRow.deuterium" />
                </tr>
            </tbody>
        </table>

        <hr />

        <h4
            v-text="
                $i18n.$t.empire.productionOverview
                    .titleCalculatorRessourcePackages
            "
        />
        <table>
            <colgroup>
                <col width="40%" />
                <col width="20%" />
                <col width="20%" />
                <col width="20%" />
            </colgroup>
            <thead>
                <tr>
                    <th />
                    <th>
                        <o-resource type="metal" :size="50" />
                    </th>
                    <th>
                        <o-resource type="crystal" :size="50" />
                    </th>
                    <th>
                        <o-resource type="deuterium" :size="50" />
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="resourcePackage in resourcePackages"
                    :key="resourcePackage.item"
                >
                    <td>
                        <div class="resource-package-count">
                            <o-item
                                :item="resourcePackage.item"
                                :size="64"
                                style="border: none;"
                            />
                            <input
                                style="width: 64px"
                                type="number"
                                min="0"
                                step="1"
                                :value="resourcePackage.count"
                                v-debounce:10ms="
                                    val => {
                                        resourcePackage.count = Math.max(
                                            0,
                                            parseIntSafe(val)
                                        );
                                    }
                                "
                            />
                        </div>
                    </td>
                    <td
                        v-text="
                            $i18n.$n(
                                totalProduction.metal *
                                    24 *
                                    resourcePackage.factor.metal *
                                    resourcePackage.count
                            )
                        "
                    />
                    <td
                        v-text="
                            $i18n.$n(
                                totalProduction.crystal *
                                    24 *
                                    resourcePackage.factor.crystal *
                                    resourcePackage.count
                            )
                        "
                    />
                    <td
                        v-text="
                            $i18n.$n(
                                totalProduction.deuterium *
                                    24 *
                                    resourcePackage.factor.deuterium *
                                    resourcePackage.count
                            )
                        "
                    />
                </tr>
                <tr class="total-row">
                    <td />
                    <td
                        v-text="
                            $i18n.$n(
                                totalProduction.metal *
                                    24 *
                                    resourcePackageCountMetal
                            )
                        "
                    />
                    <td
                        v-text="
                            $i18n.$n(
                                totalProduction.crystal *
                                    24 *
                                    resourcePackageCountCrystal
                            )
                        "
                    />
                    <td
                        v-text="
                            $i18n.$n(
                                totalProduction.deuterium *
                                    24 *
                                    resourcePackageCountDeuterium
                            )
                        "
                    />
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
    import Building from '@/models/Building';
    import LocalPlayerModule, { LocalPlayerData, PlanetData, PlayerClass } from '@/store/modules/LocalPlayerModule';
    import { Component, Vue } from 'vue-property-decorator';
    import SettingsModule from '@/store/modules/SettingsModule';
    import _throw from '@/utils/throw';
    import MetalMine from '@/models/ogame/buildables/buildings/MetalMine';
    import { ProductionInject } from '@/models/ogame/buildables/buildings/ProductionBuilding';
    import OgameMetaData from '@/models/ogame/OgameMetaData';
    import CrystalMine from '@/models/ogame/buildables/buildings/CrystalMine';
    import DeuteriumSynthesizer from '@/models/ogame/buildables/buildings/DeuteriumSynthesizer';
    import clone from '@/utils/clone';
    import Cost from '@/models/ogame/buildables/Cost';
    import Ship from '@/models/Ship';
    import { ItemHash } from '@/models/items';
    import { parseIntSafe } from '@/utils/parseNumbersSafe';

    interface TotalRow {
        key: string | number;
        title: string;
        metal: string;
        crystal: string;
        deuterium: string;

        isAverage?: true;
        titleStyle?: any;
    }

    interface ResourcePackageRow {
        item: ItemHash;
        count: number;
        factor: Cost;
    }

    @Component({})
    export default class EmpireProductionResources extends Vue {
        private player: LocalPlayerData = null!;

        private readonly parseIntSafe = parseIntSafe;

        private getProduction(planet: PlanetData) {
            const inject: ProductionInject = {
                player: this.player,
                currentPlanet: clone(planet),
                ecoSpeed: OgameMetaData.universeSpeed,
            };

            // make sure to output values for 100% production
            inject.currentPlanet.productionSettings[Building.metalMine] = 100;
            inject.currentPlanet.productionSettings[Building.crystalMine] = 100;
            inject.currentPlanet.productionSettings[Building.deuteriumSynthesizer] = 100;
            inject.currentPlanet.productionSettings[Building.solarPlant] = 100;
            inject.currentPlanet.buildings.production[Building.solarPlant] = 100;
            inject.currentPlanet.productionSettings[Ship.crawler] = this.player.playerClass == PlayerClass.collector ? 150 : 100;

            return {
                metal: MetalMine.getProduction(planet.buildings.production[Building.metalMine], inject).metal,
                crystal: CrystalMine.getProduction(planet.buildings.production[Building.crystalMine], inject).crystal,
                deuterium: DeuteriumSynthesizer.getProduction(planet.buildings.production[Building.deuteriumSynthesizer], inject).deuterium,
            };
        }

        private get planets(): PlanetData[] {
            const planets = Object.values(this.player.planets)
                .filter(p => !p.isMoon) as PlanetData[];

            return planets.sort((a, b) => {
                const gala = a.coordinates.galaxy - b.coordinates.galaxy;
                if (gala != 0) {
                    return gala;
                }

                const system = a.coordinates.system - b.coordinates.system;
                if (system != 0) {
                    return system;
                }

                return a.coordinates.position - b.coordinates.position;
            });
        }

        private get totalProduction() {
            return this.planets.reduce((total, p) => {
                const prod = this.getProduction(p);
                total.metal += prod.metal;
                total.crystal += prod.crystal;
                total.deuterium += prod.deuterium;
                return total;
            }, {
                metal: 0,
                crystal: 0,
                deuterium: 0,
            } as Cost);
        }

        private get totalRows(): TotalRow[] {
            const totalProduction = this.totalProduction;

            const averageFormat: Intl.NumberFormatOptions = {
                maximumFractionDigits: 0,
            };

            return [
                {
                    key: 'average',
                    title: this.$i18n.$t.empire.productionOverview.perHour,
                    isAverage: true,
                    metal: this.$i18n.$n(totalProduction.metal / this.planets.length, averageFormat),
                    crystal: this.$i18n.$n(totalProduction.crystal / this.planets.length, averageFormat),
                    deuterium: this.$i18n.$n(totalProduction.deuterium / this.planets.length, averageFormat),
                },
                {
                    key: 'per hour',
                    title: this.$i18n.$t.empire.productionOverview.totalPerHour,
                    metal: this.$i18n.$n(totalProduction.metal),
                    crystal: this.$i18n.$n(totalProduction.crystal),
                    deuterium: this.$i18n.$n(totalProduction.deuterium),
                },
                {
                    key: 'per day',
                    title: this.$i18n.$t.empire.productionOverview.totalPerDay,
                    metal: this.$i18n.$n(totalProduction.metal * 24),
                    crystal: this.$i18n.$n(totalProduction.crystal * 24),
                    deuterium: this.$i18n.$n(totalProduction.deuterium * 24),
                },
                {
                    key: 'per week',
                    title: this.$i18n.$t.empire.productionOverview.totalPerWeek,
                    metal: this.$i18n.$n(totalProduction.metal * 24 * 7),
                    crystal: this.$i18n.$n(totalProduction.crystal * 24 * 7),
                    deuterium: this.$i18n.$n(totalProduction.deuterium * 24 * 7),
                },
            ];
        }

        private get settings() {
            return SettingsModule.settings;
        }

        private async mounted() {
            this.player = await LocalPlayerModule.getData();
        }

        private readonly resourcePackages: ResourcePackageRow[] = [
            {
                item: ItemHash.resourcePackage_all,
                count: 0,
                factor: {
                    metal: 1,
                    crystal: 1,
                    deuterium: 1,
                    energy: 0,
                },
            },
            {
                item: ItemHash.resourcePackage_metal,
                count: 0,
                factor: {
                    metal: 1,
                    crystal: 0,
                    deuterium: 0,
                    energy: 0,
                },
            },
            {
                item: ItemHash.resourcePackage_crystal,
                count: 0,
                factor: {
                    metal: 0,
                    crystal: 1,
                    deuterium: 0,
                    energy: 0,
                },
            },
            {
                item: ItemHash.resourcePackage_deuterium,
                count: 0,
                factor: {
                    metal: 0,
                    crystal: 0,
                    deuterium: 1,
                    energy: 0,
                },
            },
        ];

        private get resourcePackageCountMetal() {
            return this.resourcePackages.reduce((acc, cur) => acc + cur.count * cur.factor.metal, 0);
        }
        private get resourcePackageCountCrystal() {
            return this.resourcePackages.reduce((acc, cur) => acc + cur.count * cur.factor.crystal, 0);
        }
        private get resourcePackageCountDeuterium() {
            return this.resourcePackages.reduce((acc, cur) => acc + cur.count * cur.factor.deuterium, 0);
        }
    }
</script>
<style lang="scss" scoped>
    .chart-container {
        max-width: 400px;
        max-height: 400px;
    }

    .resource-package-count {
        display: inline-flex;
        flex-direction: row;
        align-items: center;
    }
</style>