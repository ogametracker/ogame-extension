<template>
    <div class="generator">
        <div>
            <canvas width="600" height="300" ref="canvas" />
        </div>
        <div class="generator-settings">
            <div class="background-previews">
                <div
                    v-for="background in backgrounds"
                    :key="background"
                    class="background-preview"
                    :class="{ 'background-preview--active': background == selectedBackground }"
                    :style="{ 'background-image': `url(${getBackgroundImgUrl(background)})` }"
                    @click="setBackgroundImage(background)"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { ResourceType, ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';
    import { _throw } from '@/shared/utils/_throw';
    import { Component, Ref, Vue } from 'vue-property-decorator';
    import { CombatReportDataModule } from '../../data/CombatReportDataModule';
    import { DebrisFieldReportDataModule } from '../../data/DebrisFieldReportDataModule';
    import { EmpireDataModule } from '../../data/EmpireDataModule';
    import { ExpeditionDataModule } from '../../data/ExpeditionDataModule';
    import { LifeformDiscoveryDataModule } from '../../data/LifeformDiscoveryDataModule';
    import { ServerSettingsDataModule } from '../../data/ServerSettingsDataModule';
    import { UniversesAndAccountsDataModule } from '../../data/UniversesAndAccountsDataModule';
    import { EmpireProductionBreakdowns, getProductionBreakdowns } from '../../models/empire/production';

    @Component({})
    export default class SignatureGenerator extends Vue {
        @Ref('canvas')
        private canvas!: HTMLCanvasElement;

        private readonly backgrounds: string[] = [
            'alliance',
            'cruiser',
            'defenses',
            'exodus',
            'facilities',
            'fleet',
            'heavy-fighter',
            'heavy-fighter2',
            'intergalactic-research-network',
            'lf-artifacts',
            'light-fighter',
            'light-fighter2',
            'new-universe',
            'recycler',
            'rewards',
            'shipyard',
            'space',
            'space-dock',
            'supplies',
        ];
        private readonly backgroundImages: Record<string, HTMLImageElement> = {};
        private readonly resourceImages: Record<ResourceType, HTMLImageElement> = {} as Record<ResourceType, HTMLImageElement>;

        private selectedBackground = 'exodus';
        private readonly width = 600;
        private readonly height = 300;

        private productionBreakdowns: EmpireProductionBreakdowns = null!;

        private async mounted() {
            await EmpireDataModule.ready;
            await ServerSettingsDataModule.ready;

            this.productionBreakdowns = getProductionBreakdowns(EmpireDataModule.empire, EmpireDataModule.lifeformExperience);

            await this.initImages();
            this.draw();
        }

        private async initImages() {
            const promises: Promise<void>[] = [];

            this.backgrounds.forEach(bg => {
                promises.push(new Promise<void>(resolve => {
                    const img = new Image();
                    img.addEventListener('load', () => {
                        this.backgroundImages[bg] = img;
                        resolve();
                    });
                    img.src = this.getBackgroundImgUrl(bg);
                }));
            });

            ResourceTypes.forEach(resource => {
                promises.push(new Promise<void>(resolve => {
                    const img = new Image();
                    img.addEventListener('load', () => {
                        this.resourceImages[resource] = img;
                        resolve();
                    });
                    img.src = this.getResourceImgUrl(resource);
                }));
            });

            await Promise.all(promises);
        }

        private getBackgroundImgUrl(bg: string) {
            return `/img/ogame/misc/tools/signature-generator/${bg}.png`;
        }
        private getResourceImgUrl(resource: ResourceType) {
            return `/img/ogame/resources/${resource}.upscaled.png`;
        }

        private setBackgroundImage(bg: string) {
            this.selectedBackground = bg;

            this.draw();
        }

        private ctx = null as CanvasRenderingContext2D | null;

        private readonly shadowColor = 'rgba(0, 0, 0, 0.7)';
        private readonly shadowColorWide = 'black';
        private readonly textColor = 'white';
        private readonly font = '"Segoe UI",Tahoma,Verdana,Arial,sans-serif';
        private readonly shadowBlur = 2;
        private readonly shadowBlurWide = 10;
        private readonly shadowLineWidth = 2;
        private readonly shadowLineWidthWide = 2;

        private draw() {
            const ctx = (this.ctx ??= this.canvas.getContext('2d')) ?? _throw('no 2d context found');

            const numberFormat: Intl.NumberFormatOptions = { maximumFractionDigits: 0 };
            const yStep = 25;
            const padding = 16;
            const resourceImgSize = 30;
            const colWidth = (this.width - 2 * padding) / 4;


            const drawBackground = () => {
                ctx.drawImage(this.backgroundImages[this.selectedBackground], 0, 0, this.width, this.height);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(0, 0, this.width, this.height);
            };
            const drawTextWithShadow = (options: {
                text: string;
                x: number;
                y: number;
                maxWidth?: number;
                alignRight?: boolean;
                baseline?: CanvasTextBaseline;
            }) => {
                let { x, y, text, maxWidth, alignRight, baseline } = options;

                if (alignRight && maxWidth != null) {
                    const measurement = ctx.measureText(text);
                    x = Math.max(x, x + maxWidth - measurement.width);
                };

                ctx.font = `16px ${this.font}`;
                ctx.textBaseline = baseline ?? 'bottom';

                ctx.shadowColor = this.shadowColor;
                ctx.shadowBlur = this.shadowBlur;
                ctx.lineWidth = this.shadowLineWidth;
                ctx.strokeText(text, x, y, maxWidth);

                ctx.shadowColor = this.shadowColorWide;
                ctx.shadowBlur = this.shadowBlurWide;
                ctx.lineWidth = this.shadowLineWidthWide;
                ctx.strokeText(text, x, y, maxWidth);

                ctx.shadowBlur = 0;
                ctx.fillStyle = this.textColor;
                ctx.fillText(text, x, y, maxWidth);
            };
            const drawAddonName = () => {
                drawTextWithShadow({
                    text: 'OGame Tracker by Wonkydonky',
                    x: padding,
                    y: this.height - padding,
                });
            };
            const drawProduction = () => {
                const fixResourceHeaderOffset = 2;

                drawTextWithShadow({
                    text: this.$i18n.$t.extension.tools.signatureGenerator.production,
                    x: padding,
                    y: padding + resourceImgSize / 2 + fixResourceHeaderOffset,
                    baseline: 'middle',
                    maxWidth: colWidth,
                    alignRight: true,
                });
                const cells1 = [
                    this.$i18n.$t.extension.tools.signatureGenerator.averagePerHour,
                    this.$i18n.$t.extension.tools.signatureGenerator.totalPerHour,
                    this.$i18n.$t.extension.tools.signatureGenerator.totalPerDay,
                    this.$i18n.$t.extension.tools.signatureGenerator.totalPerWeek,
                ];
                cells1.forEach((text, i) => drawTextWithShadow({
                    text,
                    x: padding,
                    y: padding + resourceImgSize + (i + 1) * yStep,
                    maxWidth: colWidth,
                    alignRight: true,
                }));

                const xMetal = padding + colWidth;
                drawTextWithShadow({
                    text: this.$i18n.$t.extension.resources.metal,
                    x: xMetal,
                    y: padding + resourceImgSize / 2 + fixResourceHeaderOffset,
                    baseline: 'middle',
                    maxWidth: colWidth - resourceImgSize - 5,
                    alignRight: true,
                });
                ctx.drawImage(this.resourceImages.metal, xMetal + colWidth - resourceImgSize, padding, resourceImgSize, resourceImgSize);
                const totalMetal = this.productionBreakdowns.metal.getTotal();
                const cellsMetal = [
                    this.$i18n.$n(this.productionBreakdowns.metal.getAverage(), numberFormat),
                    this.$i18n.$n(totalMetal, numberFormat),
                    this.$i18n.$n(totalMetal * 24, numberFormat),
                    this.$i18n.$n(totalMetal * 24 * 7, numberFormat),
                ];
                cellsMetal.forEach((text, i) => drawTextWithShadow({
                    text,
                    x: xMetal,
                    y: padding + resourceImgSize + (i + 1) * yStep,
                    maxWidth: colWidth,
                    alignRight: true
                }));

                const xCrystal = padding + 2 * colWidth;
                drawTextWithShadow({
                    text: this.$i18n.$t.extension.resources.crystal,
                    x: xCrystal,
                    y: padding + resourceImgSize / 2 + fixResourceHeaderOffset,
                    baseline: 'middle',
                    maxWidth: colWidth - resourceImgSize - 5,
                    alignRight: true,
                });
                ctx.drawImage(this.resourceImages.crystal, xCrystal + colWidth - resourceImgSize, padding, resourceImgSize, resourceImgSize);
                const totalCrystal = this.productionBreakdowns.crystal.getTotal();
                const cellsCrystal = [
                    this.$i18n.$n(this.productionBreakdowns.crystal.getAverage(), numberFormat),
                    this.$i18n.$n(totalCrystal, numberFormat),
                    this.$i18n.$n(totalCrystal * 24, numberFormat),
                    this.$i18n.$n(totalCrystal * 24 * 7, numberFormat),
                ];
                cellsCrystal.forEach((text, i) => drawTextWithShadow({
                    text,
                    x: xCrystal,
                    y: padding + resourceImgSize + (i + 1) * yStep,
                    maxWidth: colWidth,
                    alignRight: true
                }));

                const xDeut = padding + 3 * colWidth;
                drawTextWithShadow({
                    text: this.$i18n.$t.extension.resources.deuterium,
                    x: xDeut,
                    y: padding + resourceImgSize / 2 + fixResourceHeaderOffset,
                    baseline: 'middle',
                    maxWidth: colWidth - resourceImgSize - 5,
                    alignRight: true,
                });
                ctx.drawImage(this.resourceImages.deuterium, xDeut + colWidth - resourceImgSize, padding, resourceImgSize, resourceImgSize);
                const totalDeut = this.productionBreakdowns.deuterium.getTotal(true);
                const cellsDeut = [
                    this.$i18n.$n(this.productionBreakdowns.deuterium.getAverage(true), numberFormat),
                    this.$i18n.$n(totalDeut, numberFormat),
                    this.$i18n.$n(totalDeut * 24, numberFormat),
                    this.$i18n.$n(totalDeut * 24 * 7, numberFormat),
                ];
                cellsDeut.forEach((text, i) => drawTextWithShadow({
                    text,
                    x: xDeut,
                    y: padding + resourceImgSize + (i + 1) * yStep,
                    maxWidth: colWidth,
                    alignRight: true,
                }));
            };
            const drawDivider = () => {
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.fillRect(padding, 160, this.width - 2 * padding, 1);
            };
            const drawNumberOfTrackedEvents = () => {
                const yStart = 190;
                const events = [
                    this.$i18n.$t.extension.tools.signatureGenerator.expeditions,
                    this.$i18n.$t.extension.tools.signatureGenerator.lifeformDiscoveries,
                    this.$i18n.$t.extension.tools.signatureGenerator.combats,
                    this.$i18n.$t.extension.tools.signatureGenerator.debrisFieldReports,
                ];
                events.forEach((text, i) => drawTextWithShadow({
                    text,
                    x: padding + i * colWidth,
                    y: yStart,
                    maxWidth: colWidth,
                    alignRight: true,
                }));

                const numbers = [
                    this.$i18n.$n(ExpeditionDataModule.count),
                    this.$i18n.$n(LifeformDiscoveryDataModule.count),
                    this.$i18n.$n(CombatReportDataModule.count),
                    this.$i18n.$n(DebrisFieldReportDataModule.count),
                ];
                numbers.forEach((text, i) => drawTextWithShadow({
                    text,
                    x: padding + i * colWidth,
                    y: yStart + yStep,
                    maxWidth: colWidth,
                    alignRight: true,
                }));
            };
            const drawPlayerName = () => {
                const curAccount = UniversesAndAccountsDataModule.currentAccount;
                const curServer = UniversesAndAccountsDataModule.currentServer;
                const nameAndServer = `${curAccount.name} - ${curServer.language.toUpperCase()} ${curServer.name}`;

                drawTextWithShadow({
                    text: nameAndServer,
                    x: this.width / 2,
                    y: this.height - padding,
                    maxWidth: this.width / 2 - padding,
                    alignRight: true,
                });
            };

            drawBackground();
            drawAddonName();
            drawPlayerName();
            drawProduction();
            drawDivider();
            drawNumberOfTrackedEvents();
        }
    }
</script>
<style lang="scss" scoped>
    .canvas-container {
        width: 600px;
        height: 300px;
    }

    .generator {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 16px;
        height: 100%;

        &-settings {
            border-left: 1px solid rgba(var(--color), 0.5);
            padding-left: 16px;
            overflow: auto;
        }
    }

    .background-previews {
        padding-top: 2px;
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 8px;
    }

    .background-preview {
        background-size: cover;
        background-position: center;
        border-radius: 4px;
        width: 100%;
        min-width: 200px;
        max-width: 400px;
        aspect-ratio: 2 / 1;

        &--active {
            outline: 2px solid red;
        }
    }
</style>