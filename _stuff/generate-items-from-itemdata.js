/**
 * Generates the missing entries for
 *   - src/shared/models/ogame/items/ItemHash.ts   (enum members + `_ItemHashes` record)
 *   - src/shared/models/ogame/items/Items.ts      (item metadata)
 *   - src/shared/models/ogame/items/ItemEffects.ts (what an item actually does)
 * from the item dump in `sources/itemdata.json`.
 *
 * The dump groups items by server generation. OGame issues a different uuid for the
 * same item on different generations, which is why one item shows up under several
 * hashes - all of them have to be known or the tracker will not recognise the item
 * as active.
 *
 * Usage (from the repository root):
 *   node _stuff/generate-items-from-itemdata.js          prints the blocks to insert
 *   node _stuff/generate-items-from-itemdata.js --check   only reports what is missing
 *
 * Existing enum members are never renamed or reordered - they are referenced all over
 * the codebase. Newly generated names that would collide with an existing member get a
 * numeric `_2`, `_3`, ... suffix.
 */
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const itemDataPath = path.join(repoRoot, 'sources/itemdata.json');
const itemHashPath = path.join(repoRoot, 'src/shared/models/ogame/items/ItemHash.ts');
const itemsPath = path.join(repoRoot, 'src/shared/models/ogame/items/Items.ts');

const checkOnly = process.argv.includes('--check');

//#region parsing the current state

/** @returns {Record<string, string>} enum member name -> hash */
function readExistingHashes() {
    const source = fs.readFileSync(itemHashPath, 'utf-8');
    const result = {};
    for (const match of source.matchAll(/^\s{4}(\w+)\s*=\s*'([^']+)',/gm)) {
        result[match[1]] = match[2];
    }
    return result;
}

function readExistingItemKeys() {
    const source = fs.readFileSync(itemsPath, 'utf-8');
    // some entries start on the line of the previous closing brace: `}, [ItemHash.x]: {`
    return new Set([...source.matchAll(/^\s{4}(?:\},\s*)?\[ItemHash\.(\w+)\]:/gm)].map(m => m[1]));
}

//#endregion

//#region classification

const durationNames = {
    3600: '1hour',
    86400: '1day',
    259200: '3days',
    604800: '7days',
    2592000: '30days',
    7776000: '90days',
};

const slotGrades = { 1: 'bronze', 2: 'silver', 3: 'gold' };
// the mine/energy boosters are named by grade in the existing enum, but OGame added
// tiers (50%, 60%) that have no grade - those keep the percentage in their name
const mineBoosterGrades = { 10: 'bronze', 20: 'silver', 30: 'gold', 40: 'platinum' };
const energyBoosterGrades = { 20: 'bronze', 40: 'silver', 60: 'gold', 80: 'platinum' };

function cleanEffect(rawEffect) {
    return (rawEffect ?? '')
        .replace(/&#43;/g, '+')
        .replace(/&amp;/g, '&')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Derives the enum member name (without collision suffix) and the item effect from the
 * OGame effect text. The effect text is the only reliable source - the display names mix
 * grade-as-strength (`Bronze Expedition Slots`) with grade-as-duration (`Bronze Expedition
 * Turbo`) and with meaningless suffixes (`Expedition Computer Bronze`).
 *
 * @returns {{ name: string, effect: object, grade: string } | null}
 */
function classify(item) {
    const effect = cleanEffect(item.effect);
    const duration = durationNames[item.durationSec];
    if (duration == null) {
        return null;
    }

    let match;

    if ((match = effect.match(/^\+(\d+)% expedition resources$/))) {
        const percent = parseInt(match[1], 10);
        return {
            name: `expedition_resourceBoost_${percent}percent_${duration}`,
            effect: { expeditionResourceBonus: percent / 100 },
            grade: 'none',
        };
    }

    if ((match = effect.match(/^\+(\d+) additional Expedition slots?$/))) {
        const slots = parseInt(match[1], 10);
        const grade = slotGrades[slots];
        if (grade == null) {
            return null;
        }
        return {
            name: `expeditionslots_${grade}_${duration}`,
            effect: { expeditionSlots: slots },
            grade,
        };
    }

    if (/^Increased chance of better expedition results$/.test(effect)) {
        return {
            name: `expedition_improvedChances_${duration}`,
            effect: { expeditionImprovedChances: true },
            grade: 'none',
        };
    }

    if ((match = effect.match(/^Reduces expedition delays by (\d+)%$/))) {
        const percent = parseInt(match[1], 10);
        return {
            name: `expedition_reducedDelayTime_${percent}percent_${duration}`,
            effect: { expeditionDelayReduction: percent / 100 },
            grade: 'none',
        };
    }

    const mineBoosters = [
        [/^\+(\d+)% more Metal Mine extraction on one planet$/, 'metal'],
        [/^\+(\d+)% more Crystal Mine production on one planet$/, 'crystal'],
        [/^\+(\d+)% more Deuterium Synthesizer harvest on one planet$/, 'deuterium'],
    ];
    for (const [regex, resource] of mineBoosters) {
        if ((match = effect.match(regex))) {
            const percent = parseInt(match[1], 10);
            const grade = mineBoosterGrades[percent];
            const tier = grade ?? `${percent}percent`;
            return {
                name: `${resource}Booster_${tier}_${duration}`,
                effect: { resourceProductionBonus: { [resource]: percent / 100 } },
                grade: grade ?? 'none',
            };
        }
    }

    if ((match = effect.match(/^\+(\d+)% more energy production on a planet$/))) {
        const percent = parseInt(match[1], 10);
        const grade = energyBoosterGrades[percent];
        const tier = grade ?? `${percent}percent`;
        return {
            name: `energyBooster_${tier}_${duration}`,
            effect: { energyProductionBonus: percent / 100 },
            grade: grade ?? 'none',
        };
    }

    if ((match = effect.match(/^\+(\d+)% more resource production \(Metal\/Crystal\/Deuterium\) on a planet$/))) {
        const percent = parseInt(match[1], 10);
        return {
            name: `resourceBooster_all_${percent}percent_${duration}`,
            effect: { allResourceProductionBonus: percent / 100 },
            grade: 'none',
        };
    }

    return null;
}

//#endregion

function imageHash(cdnPath) {
    const match = (cdnPath ?? '').match(/([0-9a-f]{40})\.png$/);
    return match?.[1] ?? null;
}

//#region ItemEffects.ts

/**
 * The enum member names encode what an item does, which makes them the single source of
 * truth for the effect table - including the `_pts` twins that never show up in the dump.
 *
 * @returns {object | null}
 */
function effectFromMemberName(name) {
    // strip the `_pts` / `_2` disambiguation suffixes, they carry no meaning for the effect
    const base = name.replace(/(_pts)?(_\d+)?$/, '');
    let match;

    if ((match = base.match(/^expedition_resourceBoost_(\d+)percent_/))) {
        return { expeditionResourceBonus: parseInt(match[1], 10) / 100 };
    }
    if ((match = base.match(/^expeditionslots_(bronze|silver|gold)_/))) {
        return { expeditionSlots: { bronze: 1, silver: 2, gold: 3 }[match[1]] };
    }
    if (/^expedition_improvedChances_/.test(base)) {
        return { expeditionImprovedChances: true };
    }
    if ((match = base.match(/^expedition_reducedDelayTime_(\d+)percent_/))) {
        return { expeditionDelayReduction: parseInt(match[1], 10) / 100 };
    }
    if ((match = base.match(/^(metal|crystal|deuterium)Booster_(bronze|silver|gold|platinum|\d+percent)_/))) {
        const percent = mineBoosterPercentages[match[2]] ?? parseInt(match[2], 10);
        return { resourceProductionBonus: { [match[1]]: percent / 100 } };
    }
    if ((match = base.match(/^energyBooster_(bronze|silver|gold|platinum|\d+percent)_/))) {
        const percent = energyBoosterPercentages[match[1]] ?? parseInt(match[1], 10);
        return { energyProductionBonus: percent / 100 };
    }
    if ((match = base.match(/^resourceBooster_all_(\d+)percent_/))) {
        return { allResourceProductionBonus: parseInt(match[1], 10) / 100 };
    }

    return null;
}

// reverse lookups, so a tier written as a grade word resolves back to its percentage
const mineBoosterPercentages = { bronze: 10, silver: 20, gold: 30, platinum: 40 };
const energyBoosterPercentages = { bronze: 20, silver: 40, gold: 60, platinum: 80 };

function formatEffect(effect) {
    const parts = [];
    if (effect.expeditionResourceBonus != null) {
        parts.push(`expeditionResourceBonus: ${effect.expeditionResourceBonus}`);
    }
    if (effect.expeditionSlots != null) {
        parts.push(`expeditionSlots: ${effect.expeditionSlots}`);
    }
    if (effect.expeditionImprovedChances != null) {
        parts.push(`expeditionImprovedChances: true`);
    }
    if (effect.expeditionDelayReduction != null) {
        parts.push(`expeditionDelayReduction: ${effect.expeditionDelayReduction}`);
    }
    if (effect.resourceProductionBonus != null) {
        const inner = Object.entries(effect.resourceProductionBonus)
            .map(([resource, bonus]) => `[ResourceType.${resource}]: ${bonus}`)
            .join(', ');
        parts.push(`resourceProductionBonus: { ${inner} }`);
    }
    if (effect.allResourceProductionBonus != null) {
        parts.push(`allResourceProductionBonus: ${effect.allResourceProductionBonus}`);
    }
    if (effect.energyProductionBonus != null) {
        parts.push(`energyProductionBonus: ${effect.energyProductionBonus}`);
    }
    return `{ ${parts.join(', ')} }`;
}

function generateItemEffects() {
    const memberNames = Object.keys(readExistingHashes());

    const lines = [];
    let count = 0;
    for (const name of memberNames) {
        const effect = effectFromMemberName(name);
        if (effect == null) {
            continue;
        }
        lines.push(`    [ItemHash.${name}]: ${formatEffect(effect)},`);
        count++;
    }

    const output = `import { ResourceType } from "../resources/ResourceType";
import { ItemHash } from "./ItemHash";

/**
 * What an item actually does.
 *
 * GENERATED by _stuff/generate-items-from-itemdata.js - do not edit by hand.
 *
 * Keeping the effects in one table (instead of a hand-written hash list per bonus
 * function) means a newly discovered item hash only has to be added to \`ItemHash\`
 * to be picked up everywhere.
 */
export interface ItemEffect {
    /** relative bonus on resources found on expeditions, e.g. 0.3 for "+30% expedition resources" */
    expeditionResourceBonus?: number;
    /** additional expedition slots */
    expeditionSlots?: number;
    /** expedition computer - OGame does not publish a number for this, so it is only tracked */
    expeditionImprovedChances?: boolean;
    /** relative reduction of expedition delays, e.g. 0.75 for "Reduces expedition delays by 75%" */
    expeditionDelayReduction?: number;
    /** relative bonus on the mine production of one resource on a planet */
    resourceProductionBonus?: Partial<Record<ResourceType, number>>;
    /**
     * relative bonus on the mine production of all three resources on a planet.
     *
     * Kept apart from \`resourceProductionBonus\` because the two stack: a 60% metal booster
     * together with a 40% all-resource booster yields +100% metal, not +60%.
     */
    allResourceProductionBonus?: number;
    /** relative bonus on the energy production of a single planet */
    energyProductionBonus?: number;
}

export const ItemEffects: Partial<Record<ItemHash, ItemEffect>> = {
${lines.join('\n')}
};
`;

    const target = path.join(repoRoot, 'src/shared/models/ogame/items/ItemEffects.ts');
    fs.writeFileSync(target, output, 'utf-8');
    console.log(`\ngenerated ItemEffects.ts with ${count} entries`);
}

//#endregion

function main() {
    const itemData = JSON.parse(fs.readFileSync(itemDataPath, 'utf-8'));
    const existingHashes = readExistingHashes();
    const existingItemKeys = readExistingItemKeys();

    const knownHashValues = new Set(Object.values(existingHashes));
    const usedNames = new Set(Object.keys(existingHashes));

    // flatten the per-server-generation groups, keeping the first occurrence of each hash
    const flattened = {};
    for (const serverItems of Object.values(itemData)) {
        for (const [hash, item] of Object.entries(serverItems)) {
            flattened[hash] ??= item;
        }
    }

    const additions = [];
    const skipped = [];

    // sort by hash so repeated runs produce identical output
    for (const hash of Object.keys(flattened).sort()) {
        if (knownHashValues.has(hash)) {
            continue;
        }

        const item = flattened[hash];
        // placeholders from the test server, e.g. LOCA_EXPEDITION_BOOSTER_ITEM_NAME
        if ((item.name ?? '').startsWith('LOCA_')) {
            continue;
        }

        const classified = classify(item);
        if (classified == null) {
            skipped.push({ hash, name: item.name, effect: cleanEffect(item.effect) });
            continue;
        }

        let name = classified.name;
        for (let suffix = 2; usedNames.has(name); suffix++) {
            name = `${classified.name}_${suffix}`;
        }
        usedNames.add(name);

        additions.push({
            hash,
            name,
            item,
            grade: classified.grade,
            effect: classified.effect,
            image: imageHash(item.imageLarge ?? item.image),
            smallImage: imageHash(item.imageSmall),
        });
    }

    console.log(`items in dump: ${Object.keys(flattened).length}`);
    console.log(`already known: ${Object.keys(flattened).filter(h => knownHashValues.has(h)).length}`);
    console.log(`new + in scope: ${additions.length}`);
    console.log(`new + out of scope (not generated): ${skipped.length}`);

    const missingItemEntries = Object.keys(existingHashes).filter(name => !existingItemKeys.has(name));
    if (missingItemEntries.length > 0) {
        console.log(`\nWARNING: enum members without an Items.ts entry: ${missingItemEntries.join(', ')}`);
    }

    if (checkOnly) {
        return;
    }

    const byFamily = {};
    for (const addition of additions) {
        const family = addition.name.replace(/_(1hour|1day|3days|7days|30days|90days)(_\d+)?$/, '');
        (byFamily[family] ??= []).push(addition);
    }

    let enumBlock = '';
    let recordBlock = '';
    let itemsBlock = '';
    for (const family of Object.keys(byFamily).sort()) {
        enumBlock += '\n';
        for (const addition of byFamily[family]) {
            enumBlock += `    ${addition.name} = '${addition.hash}',\n`;
            recordBlock += `    [ItemHash.${addition.name}]: 0,\n`;
            itemsBlock += `    [ItemHash.${addition.name}]: {\n`
                + `        name: ${JSON.stringify(addition.item.name)},\n`
                + `        image: '${addition.image}',\n`
                + `        smallImage: '${addition.smallImage}',\n`
                + `        hash: ItemHash.${addition.name},\n`
                + `        grade: ItemGrade.${addition.grade},\n`
                + `    },\n`;
        }
    }

    generateItemEffects();

    const outDir = path.join(__dirname, 'generated');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'ItemHash.enum-additions.txt'), enumBlock, 'utf-8');
    fs.writeFileSync(path.join(outDir, 'ItemHash.record-additions.txt'), recordBlock, 'utf-8');
    fs.writeFileSync(path.join(outDir, 'Items.additions.txt'), itemsBlock, 'utf-8');
    fs.writeFileSync(
        path.join(outDir, 'skipped.json'),
        JSON.stringify(skipped, null, 4),
        'utf-8',
    );

    console.log(`\nwrote generated blocks to ${path.relative(repoRoot, outDir)}`);
}

main();
