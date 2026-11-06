/**
 * Updates the item catalog in Items.generated.ts from the s1 and s808 item dumps.
 *
 * The existing catalog supplies primary hashes and legacy entries. The English
 * dumps supply display names, bonus-based IDs, server hashes, and artwork.
 *
 * Usage (from the repository root):
 *   node _stuff/generate-items-from-itemdata.js          updates the catalog
 *   node _stuff/generate-items-from-itemdata.js --check   reports changes without writing
 */
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const itemDataPaths = ['Items-s1-en.json', 'Items-s808-en.json'].map(file => path.join(repoRoot, 'sources', file));
const itemsPath = path.join(repoRoot, 'src/shared/models/ogame/items/Items.generated.ts');

const checkOnly = process.argv.includes('--check');
const hashPattern = /^[0-9a-f]{40}$/;
const catalogPattern = /(?<=^const catalog = \{\n)[\s\S]*?(?=^} satisfies ItemCatalog;)/m;
const entryPattern = /^    (\w+): \{([\s\S]*?)^    \},\n/gm;
const effectFieldPattern = /^        effect: \{(?:[^\n]*\},|\n[\s\S]*?^        \},)\n/m;
const legacyGradeIdPattern = /_(?:bronze|silver|gold|platinum)(?:_|$)/;

//#region parsing the current state

function readCatalog(rowsByHash) {
    const source = fs.readFileSync(itemsPath, 'utf-8').replace(/\r\n/g, '\n');
    const catalog = source.match(catalogPattern)?.[0];
    if (!catalog) {
        throw new Error('Could not read item definitions from Items.generated.ts');
    }

    const entries = new Map();
    const idsByHash = new Map();
    for (const [entry, oldId, body] of catalog.matchAll(entryPattern)) {
        const hashes = readArray(body, 'hashes');
        const id = legacyGradeIdPattern.test(oldId) ? resolveBonusId(oldId, hashes, rowsByHash) : oldId;
        if (hashes.length === 0 || entries.has(id)) {
            throw new Error(`Invalid catalog entry '${id}'`);
        }
        for (const hash of hashes) {
            if (idsByHash.has(hash)) {
                throw new Error(`Duplicate OGame item hash '${hash}'`);
            }
            idsByHash.set(hash, id);
        }
        entries.set(id, {
            source: entry,
            hashes,
            image: body.match(/^        image: ['"]([^'"]*)['"]/m)?.[1],
            smallImage: body.match(/^        smallImage: ['"]([^'"]*)['"]/m)?.[1],
            smallImageAliases: readArray(body, 'smallImageAliases'),
        });
    }
    if ([...entries.values()].map(entry => entry.source).join('') !== catalog) {
        throw new Error('Could not read item definitions from Items.generated.ts');
    }
    return { entries, idsByHash };
}

function resolveBonusId(oldId, hashes, rowsByHash) {
    const ids = new Set();
    for (const hash of hashes) {
        for (const row of rowsByHash.get(hash) ?? []) {
            const classified = classify(row);
            if (classified != null) {
                ids.add(classified.id);
            }
        }
    }
    if (ids.size !== 1) {
        throw new Error('Could not determine a unique bonus for ' + oldId);
    }
    return [...ids][0];
}

function readArray(body, field) {
    const contents = body.match(new RegExp('^        ' + field + ': \\[([^\\]]*)\\]', 'm'))?.[1] ?? '';
    return [...contents.matchAll(/['"]([^'"]+)['"]/g)].map(([, value]) => value);
}

function readDumpRows() {
    const rowsByHash = new Map();
    for (const file of itemDataPaths) {
        const { items } = JSON.parse(fs.readFileSync(file, 'utf-8'));
        if (!Array.isArray(items)) {
            throw new Error('Missing items array in ' + path.basename(file));
        }
        for (const { item } of items) {
            if (!hashPattern.test(item?.ref) || typeof item.name !== 'string' || typeof item.effect !== 'string') {
                throw new Error('Invalid item record in ' + path.basename(file));
            }
            const rows = rowsByHash.get(item.ref) ?? [];
            rows.push(item);
            rowsByHash.set(item.ref, rows);
        }
    }
    return new Map([...rowsByHash].sort(([a], [b]) => a.localeCompare(b)));
}

//#endregion

//#region classification

const durationNames = {
    1800: '30minutes',
    3600: '1hour',
    5400: '90minutes',
    86400: '1day',
    259200: '3days',
    604800: '7days',
    2592000: '30days',
    7776000: '90days',
};

const mineBoosterGrades = { 10: 'bronze', 20: 'silver', 30: 'gold', 40: 'platinum' };
const energyBoosterGrades = { 20: 'bronze', 40: 'silver', 60: 'gold', 80: 'platinum' };
const speedupTypes = {
    KRAKEN: { standard: 'kraken', Lifeforms: 'lifeformKraken' },
    DETROID: { standard: 'detroid', 'Mecha Shipyard': 'detroid_mechaShipyard' },
    NEWTRON: { standard: 'newtron', Lifeforms: 'lifeformNewtron' },
};
const speedupUnits = { m: 'minute', h: 'hour', d: 'day' };

// an all-resource booster is a mine booster with the same bonus on every resource
function allResourcesBonus(bonus) {
    return { metal: bonus, crystal: bonus, deuterium: bonus };
}

function cleanEffect(rawEffect) {
    return (rawEffect ?? '')
        .replace(/&#43;/g, '+')
        .replace(/&amp;/g, '&')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function classifySpeedup(name, effect) {
    const kind = name.match(
        /^(KRAKEN|DETROID|NEWTRON) (Bronze|Silver|Gold|Platinum)(?: \((Lifeforms|Mecha Shipyard)\))?$/,
    );
    const reduction = effect.match(/^Reduces .+ by (\d+)([mhd])\s*\.$/);
    if (kind == null || reduction == null) {
        return null;
    }

    const prefix = speedupTypes[kind[1]][kind[3] ?? 'standard'];
    if (prefix == null) {
        return null;
    }

    const amount = Number(reduction[1]);
    const unit = speedupUnits[reduction[2]];
    return { id: `${prefix}_${amount}${unit}${amount === 1 ? '' : 's'}`, grade: kind[2].toLowerCase() };
}

/**
 * Derives the item ID from the bonus and duration. The name distinguishes
 * speedups for different queues that otherwise have identical effect text.
 *
 * @returns {{ id: string, grade: string } | null}
 */
function classify(item) {
    const effect = cleanEffect(item.effect);
    const grade = item.name.match(/^(Bronze|Silver|Gold|Platinum) /)?.[1].toLowerCase() ?? 'none';
    const fields = effect.match(/^\+(\d+) additional fields on a (moon|planet)\.?$/);
    if (fields != null) {
        return { id: `${fields[2]}Fields_${fields[1]}fields`, grade };
    }

    const speedup = classifySpeedup(item.name, effect);
    if (speedup != null) {
        return speedup;
    }

    const duration = durationNames[item.duration];
    if (duration == null) {
        return null;
    }

    let match;

    if ((match = effect.match(/^\+(\d+)% expedition resources$/))) {
        const percent = parseInt(match[1], 10);
        return {
            id: `expedition_resourceBoost_${percent}percent_${duration}`,
            grade: 'none',
        };
    }

    if ((match = effect.match(/^\+(\d+) additional (Expedition|Fleet) slots?$/))) {
        const slots = Number(match[1]);
        const prefix = match[2] === 'Expedition' ? 'expeditionslots' : 'fleetSlots';
        return {
            id: `${prefix}_${slots}${slots === 1 ? 'slot' : 'slots'}_${duration}`,
            grade,
        };
    }

    if (effect === 'Increased chance of better expedition results') {
        return {
            id: `expedition_improvedChances_${duration}`,
            grade: 'none',
        };
    }

    if ((match = effect.match(/^Reduces expedition delays by (\d+)%$/))) {
        const percent = parseInt(match[1], 10);
        return {
            id: `expedition_reducedDelayTime_${percent}percent_${duration}`,
            grade: 'none',
        };
    }

    if (effect === 'Start an attack on your planet to create a moon.') {
        return { id: `moonShot_${duration}`, grade };
    }

    const mineBoosters = [
        [/^\+(\d+)% more Metal Mine extraction on one planet$/, 'metal'],
        [/^\+(\d+)% more Crystal Mine production on one planet$/, 'crystal'],
        [/^\+(\d+)% more Deuterium Synthesizer harvest on one planet$/, 'deuterium'],
    ];
    for (const [regex, resource] of mineBoosters) {
        if ((match = effect.match(regex))) {
            const percent = parseInt(match[1], 10);
            return {
                id: `${resource}Booster_${percent}percent_${duration}`,
                grade: mineBoosterGrades[percent] ?? 'none',
            };
        }
    }

    if ((match = effect.match(/^\+(\d+)% more energy production on a planet$/))) {
        const percent = parseInt(match[1], 10);
        return {
            id: `energyBooster_${percent}percent_${duration}`,
            grade: energyBoosterGrades[percent] ?? 'none',
        };
    }

    if ((match = effect.match(/^\+(\d+)% more resource production \(Metal\/Crystal\/Deuterium\) on a planet$/))) {
        const percent = parseInt(match[1], 10);
        return {
            id: `resourceBooster_all_${percent}percent_${duration}`,
            grade: 'none',
        };
    }

    return null;
}

//#endregion

//#region item effects

/**
 * Item IDs encode the effects understood by the tracker.
 *
 * @returns {object | null}
 */
function effectFromItemId(id) {
    let match;

    if ((match = id.match(/^expedition_resourceBoost_(\d+)percent_/))) {
        return { type: 'expeditionResourceBonus', value: parseInt(match[1], 10) / 100 };
    }
    if ((match = id.match(/^expeditionslots_(\d+)slots?_/))) {
        return { type: 'expeditionSlots', value: Number(match[1]) };
    }
    if (id.startsWith('expedition_improvedChances_')) {
        return { type: 'expeditionImprovedChances' };
    }
    if ((match = id.match(/^expedition_reducedDelayTime_(\d+)percent_/))) {
        return { type: 'expeditionDelayReduction', value: parseInt(match[1], 10) / 100 };
    }
    if ((match = id.match(/^(metal|crystal|deuterium)Booster_(\d+)percent_/))) {
        return { type: 'resourceProductionBonus', value: { [match[1]]: Number(match[2]) / 100 } };
    }
    if ((match = id.match(/^energyBooster_(\d+)percent_/))) {
        return { type: 'energyProductionBonus', value: Number(match[1]) / 100 };
    }
    if ((match = id.match(/^resourceBooster_all_(\d+)percent_/))) {
        return { type: 'resourceProductionBonus', value: allResourcesBonus(parseInt(match[1], 10) / 100) };
    }

    return null;
}

function formatEffectField(effect) {
    if (effect == null) {
        return '';
    }

    const type = `type: '${effect.type}'`;
    if (effect.type === 'resourceProductionBonus') {
        const bonuses = Object.entries(effect.value).map(([resource, bonus]) => `[ResourceType.${resource}]: ${bonus}`);
        if (bonuses.length === 1) {
            return `        effect: { ${type}, value: { ${bonuses[0]} } },\n`;
        }
        return `        effect: {
            ${type},
            value: {
${bonuses.map(bonus => `                ${bonus},\n`).join('')}            },
        },
`;
    }

    const value = effect.value == null ? '' : `, value: ${effect.value}`;
    return `        effect: { ${type}${value} },\n`;
}

//#endregion

function hasDisplayName(item) {
    return item.name.length > 0 && !/^(?:LOCA|LANG)_/.test(item.name);
}

function detailsKey(item) {
    return hasDisplayName(item) ? JSON.stringify([item.name, cleanEffect(item.effect), item.duration]) : undefined;
}

function resolveDumpItems(rowsByHash, entries, idsByHash) {
    const matches = new Map();
    const idsByDetails = new Map();
    const unresolved = new Map();

    for (const [hash, rows] of rowsByHash) {
        const knownId = idsByHash.get(hash);
        const classified = rows.map(classify).filter(Boolean);
        const candidates = new Set(classified.map(item => item.id));
        if (knownId != null) {
            candidates.add(knownId);
            if (candidates.size > 1) {
                throw new Error('Dump effect disagrees with catalog for ' + knownId + ' (' + hash + ')');
            }
        }
        if (candidates.size === 0) {
            unresolved.set(hash, rows);
            continue;
        }
        if (candidates.size > 1) {
            continue;
        }

        const [id] = candidates;
        if (!entries.has(id)) {
            const item = rows.find(row => hasDisplayName(row) && hasArtwork(row));
            if (item == null) {
                continue;
            }
            entries.set(id, {
                name: item.name,
                grade: classified[0].grade,
                duration: item.duration,
                hashes: [],
                smallImageAliases: [],
            });
        }
        matches.set(hash, id);

        for (const row of rows) {
            const key = detailsKey(row);
            if (key != null) {
                const ids = idsByDetails.get(key) ?? new Set();
                ids.add(id);
                idsByDetails.set(key, ids);
            }
        }
    }

    // Match alternate hashes for unclassified items using their English name,
    // effect, and duration. Artwork alone can be shared.
    for (const [hash, rows] of unresolved) {
        const candidates = new Set();
        for (const row of rows) {
            for (const id of idsByDetails.get(detailsKey(row)) ?? []) {
                candidates.add(id);
            }
        }
        if (candidates.size === 1) {
            matches.set(hash, [...candidates][0]);
        }
    }

    return matches;
}

function hasArtwork(item) {
    return hashPattern.test(item.imageLarge) && hashPattern.test(item.image);
}

function arrayField(field, values) {
    const quoted = values.map(value => "'" + value + "'");
    const line = '        ' + field + ': [' + quoted.join(', ') + '],';
    if (line.length <= 120) {
        return line;
    }
    return '        ' + field + ': [\n' + quoted.map(value => '            ' + value + ',\n').join('') + '        ],';
}

function renderEntry(id, entry, hashes, rows) {
    const name = rows.find(hasDisplayName)?.name ?? entry.name;
    const nameField =
        name == null ? null : "        name: '" + JSON.stringify(name).slice(1, -1).replace(/'/g, "\\'") + "',";
    const artwork = rows.find(hasArtwork);
    const image = artwork?.imageLarge ?? entry.image;
    const smallImage = artwork?.image ?? entry.smallImage;
    const smallImageAliases = [
        ...new Set([...entry.smallImageAliases, entry.smallImage, ...rows.map(row => row.image)]),
    ].filter(alias => alias !== smallImage && hashPattern.test(alias));
    const effectField = formatEffectField(effectFromItemId(id));

    if (entry.source == null) {
        return [
            '    ' + id + ': {',
            nameField,
            "        image: '" + image + "',",
            "        smallImage: '" + smallImage + "',",
            '        grade: ItemGrade.' + entry.grade + ',',
            arrayField('hashes', hashes),
            ...(entry.duration == null ? [] : ['        durationSeconds: ' + entry.duration + ',']),
            ...(smallImageAliases.length === 0 ? [] : [arrayField('smallImageAliases', smallImageAliases)]),
            effectField + '    },\n',
        ].join('\n');
    }

    let source = entry.source.replace(/^    \w+: \{/, '    ' + id + ': {').replace(effectFieldPattern, '');
    if (nameField != null) {
        source = source.replace(/^        name: .*,$/m, () => nameField);
    }
    if (image !== entry.image) {
        source = source.replace(/^        image: .*,$/m, "        image: '" + image + "',");
    }
    if (smallImage !== entry.smallImage) {
        source = source.replace(/^        smallImage: .*,$/m, "        smallImage: '" + smallImage + "',");
    }
    if (hashes.length !== entry.hashes.length) {
        source = source.replace(/^        hashes: \[[^\]]*\],$/m, arrayField('hashes', hashes));
    }
    if (smallImageAliases.join(',') !== entry.smallImageAliases.join(',')) {
        const aliasField = /^        smallImageAliases: \[[^\]]*\],\n/m;
        const aliases = smallImageAliases.length === 0 ? '' : arrayField('smallImageAliases', smallImageAliases) + '\n';
        source = aliasField.test(source)
            ? source.replace(aliasField, aliases)
            : source.replace(/^    \},$/m, aliases + '    },');
    }
    return source.replace(/^    \},$/m, effectField + '    },');
}

function generateItems(entries, rowsByHash, matches) {
    const aliasesById = new Map();
    for (const [hash, id] of matches) {
        const aliases = aliasesById.get(id) ?? [];
        aliases.push(hash);
        aliasesById.set(id, aliases);
    }

    const catalog = [];
    for (const [id, entry] of entries) {
        const hashes = [...new Set([...entry.hashes, ...(aliasesById.get(id) ?? []).sort()])];
        const rows = hashes.flatMap(hash => rowsByHash.get(hash) ?? []);
        catalog.push(renderEntry(id, entry, hashes, rows));
    }
    return `// Generated by _stuff/generate-items-from-itemdata.js.
import { ResourceType } from '../resources/ResourceType';
import type { ItemCatalog } from './Item';
import { ItemGrade } from './ItemGrade';

const catalog = {
${catalog.join('')}} satisfies ItemCatalog;

export type ItemId = keyof typeof catalog;
export const Items: ItemCatalog<ItemId> = catalog;
export const ItemIds = Object.keys(Items) as ItemId[];
`;
}

function writeMap(target, output) {
    const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf-8') : '';
    const changed = current.replace(/\r\n/g, '\n') !== output;
    if (changed && !checkOnly) {
        fs.writeFileSync(target, current.includes('\r\n') ? output.replace(/\n/g, '\r\n') : output, 'utf-8');
    }
    console.log(path.basename(target) + (changed ? (checkOnly ? ' would change' : ' updated') : ' is up to date'));
}

function main() {
    const rowsByHash = readDumpRows();
    const { entries, idsByHash } = readCatalog(rowsByHash);
    const matches = resolveDumpItems(rowsByHash, entries, idsByHash);
    const items = generateItems(entries, rowsByHash, matches);

    console.log(entries.size + ' catalog items, ' + matches.size + ' matched dump hashes');
    console.log(rowsByHash.size - matches.size + ' dump hashes without an unambiguous catalog match');
    writeMap(itemsPath, items);
}

main();
