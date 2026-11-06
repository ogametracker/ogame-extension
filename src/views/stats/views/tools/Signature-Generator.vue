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

<script setup lang="ts">
import { onMounted, ref, shallowRef, useTemplateRef } from 'vue';
import { translations, formatNumber, getLocale } from '@stats/i18n';
import { ResourceType, ResourceTypes } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import { _throw } from '@ogame-tracker/shared/utils/_throw';
import { useCombatReportStore } from '../../data/CombatReportDataModule';
import { useDebrisFieldReportStore } from '../../data/DebrisFieldReportDataModule';
import { useEmpireStore } from '../../data/EmpireDataModule';
import { useExpeditionStore } from '../../data/ExpeditionDataModule';
import { useLifeformDiscoveryStore } from '../../data/LifeformDiscoveryDataModule';
import { useServerSettingsStore } from '../../data/ServerSettingsDataModule';
import { useUniversesAndAccountsStore } from '../../data/UniversesAndAccountsDataModule';
import { getProductionBreakdowns } from '../../models/empire/production';
import type { EmpireProductionBreakdowns } from '../../models/empire/production';

const empireStore = useEmpireStore();

const serverSettingsStore = useServerSettingsStore();

const expeditionStore = useExpeditionStore();

const lifeformDiscoveryStore = useLifeformDiscoveryStore();

const combatReportStore = useCombatReportStore();

const debrisFieldReportStore = useDebrisFieldReportStore();

const universesAndAccountsStore = useUniversesAndAccountsStore();

const canvas = useTemplateRef<HTMLCanvasElement>('canvas');

const backgrounds: string[] = [
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

const backgroundImages: Record<string, HTMLImageElement> = {};

const resourceImages: Record<ResourceType, HTMLImageElement> = {} as Record<ResourceType, HTMLImageElement>;

const selectedBackground = ref('exodus');

const width = 600;

const height = 300;

const productionBreakdowns = shallowRef<EmpireProductionBreakdowns>(null!);

async function initImages() {
    const promises: Promise<void>[] = [];

    backgrounds.forEach(bg => {
        promises.push(new Promise<void>(resolve => {
            const img = new Image();
            img.addEventListener('load', () => {
                backgroundImages[bg] = img;
                resolve();
            });
            img.src = getBackgroundImgUrl(bg);
        }));
    });

    ResourceTypes.forEach(resource => {
        promises.push(new Promise<void>(resolve => {
            const img = new Image();
            img.addEventListener('load', () => {
                resourceImages[resource] = img;
                resolve();
            });
            img.src = getResourceImgUrl(resource);
        }));
    });

    await Promise.all(promises);
}

function getBackgroundImgUrl(bg: string) {
    return `/img/ogame/misc/tools/signature-generator/${bg}.png`;
}

function getResourceImgUrl(resource: ResourceType) {
    return `/img/ogame/resources/${resource}.upscaled.png`;
}

function setBackgroundImage(bg: string) {
    selectedBackground.value = bg;

    draw();
}

const ctx = ref(null as CanvasRenderingContext2D | null);

const textColor = 'white';

const font = '"Segoe UI",Tahoma,Verdana,Arial,sans-serif';

const shadows = [
    {
        opacity: 0.8,
        width: 2,
        blur: 4,
    },
    {
        opacity: 0.7,
        width: 2,
        blur: 8,
    },
    {
        opacity: 0.7,
        width: 1,
        blur: 16,
    },
    {
        opacity: 0.7,
        width: 1,
        blur: 24,
    },
    {
        opacity: 0.8,
        width: 1,
        blur: 48,
    },
];

let imagesReady = false;

function draw() {
    const target = canvas.value;
    if (!target || !imagesReady) {
        return;
    }

    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.height = target.height;
    shadowCanvas.width = target.width;
    const shadowCtx = shadowCanvas.getContext('2d') ?? _throw('no 2d context found');

    const textCanvas = document.createElement('canvas');
    textCanvas.height = target.height;
    textCanvas.width = target.width;
    const textCtx = textCanvas.getContext('2d') ?? _throw('no 2d context found');

    const localCtx = (ctx.value ??= target.getContext('2d')) ?? _throw('no 2d context found');

    const numberFormat: Intl.NumberFormatOptions = { maximumFractionDigits: 0 };
    const yStep = 25;
    const padding = 12;
    const resourceImgSize = 30;
    const colWidth = (width - 2 * padding) / 4;

    const drawBackground = () => {
        localCtx.drawImage(backgroundImages[selectedBackground.value], 0, 0, width, height);
        localCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        localCtx.fillRect(0, 0, width, height);
    };
    const drawTextWithShadow = (options: {
        text: string;
        x: number;
        y: number;
        maxWidth?: number;
        alignRight?: boolean;
        baseline?: CanvasTextBaseline;
        fontSize?: number;
    }) => {
        let { x, y, text, maxWidth, alignRight, baseline, fontSize } = options;

        textCtx.font = shadowCtx.font = `${fontSize ?? 16}px ${font}`;
        textCtx.textBaseline = shadowCtx.textBaseline = baseline ?? 'bottom';

        if (alignRight && maxWidth != null) {
            const measurement = textCtx.measureText(text);
            x = Math.max(x, x + maxWidth - measurement.width);
        };

        for (const shadow of shadows) {
            shadowCtx.shadowColor = `rgba(0, 0, 0, ${shadow.opacity})`;
            shadowCtx.shadowBlur = shadow.blur;
            shadowCtx.lineWidth = shadow.width;
            shadowCtx.strokeText(text, x, y, maxWidth);
        }

        textCtx.fillStyle = textColor;
        textCtx.fillText(text, x, y, maxWidth);
    };
    const drawAddonName = () => {
        drawTextWithShadow({
            text: 'OGame Tracker by Wonkydonky',
            x: padding,
            y: height - padding,
        });
    };
    const drawProduction = (yOffset: number) => {
        const fixResourceHeaderOffset = 2;

        drawTextWithShadow({
            text: translations().extension.tools.signatureGenerator.production,
            x: padding,
            y: padding + resourceImgSize / 2 + fixResourceHeaderOffset + yOffset,
            baseline: 'middle',
            maxWidth: colWidth,
            alignRight: true,
        });
        const cells1 = [
            translations().extension.tools.signatureGenerator.averagePerHour,
            translations().extension.tools.signatureGenerator.totalPerHour,
            translations().extension.tools.signatureGenerator.totalPerDay,
            translations().extension.tools.signatureGenerator.totalPerWeek,
        ];
        cells1.forEach((text, i) => drawTextWithShadow({
            text,
            x: padding,
            y: padding + resourceImgSize + (i + 1) * yStep + yOffset,
            maxWidth: colWidth,
            alignRight: true,
        }));

        const xMetal = padding + colWidth;
        drawTextWithShadow({
            text: translations().extension.resources.metal,
            x: xMetal,
            y: padding + resourceImgSize / 2 + fixResourceHeaderOffset + yOffset,
            baseline: 'middle',
            maxWidth: colWidth - resourceImgSize - 5,
            alignRight: true,
        });
        localCtx.drawImage(resourceImages.metal, xMetal + colWidth - resourceImgSize, padding + yOffset, resourceImgSize, resourceImgSize);
        const totalMetal = productionBreakdowns.value.metal.getTotal();
        const cellsMetal = [
            formatNumber(productionBreakdowns.value.metal.getAverage(), numberFormat),
            formatNumber(totalMetal, numberFormat),
            formatNumber(totalMetal * 24, numberFormat),
            formatNumber(totalMetal * 24 * 7, numberFormat),
        ];
        cellsMetal.forEach((text, i) => drawTextWithShadow({
            text,
            x: xMetal,
            y: padding + resourceImgSize + (i + 1) * yStep + yOffset,
            maxWidth: colWidth,
            alignRight: true
        }));

        const xCrystal = padding + 2 * colWidth;
        drawTextWithShadow({
            text: translations().extension.resources.crystal,
            x: xCrystal,
            y: padding + resourceImgSize / 2 + fixResourceHeaderOffset + yOffset,
            baseline: 'middle',
            maxWidth: colWidth - resourceImgSize - 5,
            alignRight: true,
        });
        localCtx.drawImage(resourceImages.crystal, xCrystal + colWidth - resourceImgSize, padding + yOffset, resourceImgSize, resourceImgSize);
        const totalCrystal = productionBreakdowns.value.crystal.getTotal();
        const cellsCrystal = [
            formatNumber(productionBreakdowns.value.crystal.getAverage(), numberFormat),
            formatNumber(totalCrystal, numberFormat),
            formatNumber(totalCrystal * 24, numberFormat),
            formatNumber(totalCrystal * 24 * 7, numberFormat),
        ];
        cellsCrystal.forEach((text, i) => drawTextWithShadow({
            text,
            x: xCrystal,
            y: padding + resourceImgSize + (i + 1) * yStep + yOffset,
            maxWidth: colWidth,
            alignRight: true
        }));

        const xDeut = padding + 3 * colWidth;
        drawTextWithShadow({
            text: translations().extension.resources.deuterium,
            x: xDeut,
            y: padding + resourceImgSize / 2 + fixResourceHeaderOffset + yOffset,
            baseline: 'middle',
            maxWidth: colWidth - resourceImgSize - 5,
            alignRight: true,
        });
        localCtx.drawImage(resourceImages.deuterium, xDeut + colWidth - resourceImgSize, padding + yOffset, resourceImgSize, resourceImgSize);
        const totalDeut = productionBreakdowns.value.deuterium.getTotal(true);
        const cellsDeut = [
            formatNumber(productionBreakdowns.value.deuterium.getAverage(true), numberFormat),
            formatNumber(totalDeut, numberFormat),
            formatNumber(totalDeut * 24, numberFormat),
            formatNumber(totalDeut * 24 * 7, numberFormat),
        ];
        cellsDeut.forEach((text, i) => drawTextWithShadow({
            text,
            x: xDeut,
            y: padding + resourceImgSize + (i + 1) * yStep + yOffset,
            maxWidth: colWidth,
            alignRight: true,
        }));
    };
    const drawDivider = (yOffset: number) => {
        localCtx.fillStyle = 'rgba(255,255,255,0.5)';
        localCtx.fillRect(padding, 160 + yOffset, width - 2 * padding, 1);
    };
    const drawNumberOfTrackedEvents = (yOffset: number) => {
        const yStart = 190;
        const events = [
            translations().extension.tools.signatureGenerator.expeditions,
            translations().extension.tools.signatureGenerator.lifeformDiscoveries,
            translations().extension.tools.signatureGenerator.combats,
            translations().extension.tools.signatureGenerator.debrisFieldReports,
        ];
        events.forEach((text, i) => drawTextWithShadow({
            text,
            x: padding + i * colWidth,
            y: yStart + yOffset,
            maxWidth: colWidth,
            alignRight: true,
        }));

        const numbers = [
            formatNumber(expeditionStore.count),
            formatNumber(lifeformDiscoveryStore.count),
            formatNumber(combatReportStore.count),
            formatNumber(debrisFieldReportStore.count),
        ];
        numbers.forEach((text, i) => drawTextWithShadow({
            text,
            x: padding + i * colWidth,
            y: yStart + yStep + yOffset,
            maxWidth: colWidth,
            alignRight: true,
        }));
    };
    const drawPlayerName = () => {
        const curAccount = universesAndAccountsStore.currentAccount;
        const curServer = universesAndAccountsStore.currentServer;
        const nameAndServer = `${curAccount.name} - ${curServer.language.toUpperCase()} ${curServer.name}`;

        drawTextWithShadow({
            text: nameAndServer,
            x: padding,
            y: padding,
            maxWidth: width / 2 - padding,
            baseline: 'top',
        });
    };
    const drawDate = () => {
        const dateTimeFormat = new Intl.DateTimeFormat(getLocale(), {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        drawTextWithShadow({
            text: dateTimeFormat.format(Date.now()),
            x: width / 2,
            maxWidth: width / 2 - padding,
            y: padding,
            alignRight: true,
            baseline: 'top',
        });
    };

    drawBackground();

    drawAddonName();
    drawPlayerName();
    drawDate();

    drawProduction(32);
    drawDivider(32);
    drawNumberOfTrackedEvents(32);

    localCtx.drawImage(shadowCanvas, 0, 0);
    localCtx.drawImage(textCanvas, 0, 0);
}

onMounted(async () => {
    await empireStore.ready;
    await serverSettingsStore.ready;

    productionBreakdowns.value = getProductionBreakdowns(empireStore.empire, empireStore.lifeformExperience);

    await initImages();
    imagesReady = true;
    draw();
});
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
