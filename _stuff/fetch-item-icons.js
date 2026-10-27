/**
 * Downloads the item icons referenced by `Items.ts` into `static/img/ogame/items/`.
 *
 * Only the `image` field is fetched - it is the one that gets rendered
 * (`OItem.vue` and the expedition message content both build
 * `/img/ogame/items/${item.image}.png`). `smallImage` exists solely to match an
 * item against the empire page's inline background URL, so it needs no file.
 *
 * Note on formats: newer items are served as JPEG even though the URL ends in
 * `.png` and the CDN reports `Content-Type: image/png`. That is OGame's own
 * behaviour, and browsers sniff image content rather than trusting the
 * extension, so the bytes are saved unchanged under `<hash>.png` to match the
 * path the code builds.
 *
 * Usage (from the repository root):
 *   node _stuff/fetch-item-icons.js            download what is missing
 *   node _stuff/fetch-item-icons.js --check    report only, write nothing
 */
const fs = require('fs');
const https = require('https');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const itemsPath = path.join(repoRoot, 'src/shared/models/ogame/items/Items.ts');
const iconDir = path.join(repoRoot, 'static/img/ogame/items');

const checkOnly = process.argv.includes('--check');
const concurrency = 8;

// item hashes are per server generation, and so are the images - a hash that
// 404s on one server may exist on another, so fall back through the list
const hosts = [
    's808-en.ogame.gameforge.com',
    's178-en.ogame.gameforge.com',
    's1-en.ogame.gameforge.com',
];

function imageFormat(buffer) {
    if (buffer.length < 12) {
        return null;
    }
    if (buffer.slice(0, 3).toString('hex') == 'ffd8ff') {
        return 'JPEG';
    }
    if (buffer.slice(1, 4).toString('latin1') == 'PNG') {
        return 'PNG';
    }
    if (buffer.slice(0, 4).toString('latin1') == 'RIFF' && buffer.slice(8, 12).toString('latin1') == 'WEBP') {
        return 'WEBP';
    }
    return null;
}

function fetchIcon(host, hash) {
    return new Promise(resolve => {
        const request = https.get(
            { host, path: `/cdn/img/item-images/${hash}.png`, timeout: 15_000 },
            response => {
                const chunks = [];
                response.on('data', chunk => chunks.push(chunk));
                response.on('end', () => resolve({ status: response.statusCode, buffer: Buffer.concat(chunks) }));
            },
        );
        request.on('error', error => resolve({ status: 0, error: error.code }));
        request.on('timeout', () => { request.destroy(); resolve({ status: 0, error: 'TIMEOUT' }); });
    });
}

async function downloadIcon(hash) {
    for (const host of hosts) {
        const { status, buffer, error } = await fetchIcon(host, hash);
        if (status != 200 || buffer == null) {
            continue;
        }

        const format = imageFormat(buffer);
        if (format == null) {
            // a 200 that isn't an image means an error page - try the next host
            continue;
        }

        return { buffer, format, host };
    }
    return null;
}

async function main() {
    const source = fs.readFileSync(itemsPath, 'utf-8');
    const entries = [...source.matchAll(/\[ItemHash\.(\w+)\]:\s*\{([\s\S]*?)\n    \},/g)]
        .map(match => ({
            key: match[1],
            image: match[2].match(/image:\s*['"]([0-9a-f]{40})['"]/)?.[1],
        }))
        .filter(entry => entry.image != null);

    const referenced = [...new Set(entries.map(entry => entry.image))].sort();
    const present = new Set(
        fs.readdirSync(iconDir).filter(file => file.endsWith('.png')).map(file => file.replace('.png', ''))
    );
    const missing = referenced.filter(hash => !present.has(hash));

    console.log(`items with an image: ${entries.length}`);
    console.log(`distinct image hashes: ${referenced.length}`);
    console.log(`already on disk: ${referenced.length - missing.length}`);
    console.log(`missing: ${missing.length}`);

    if (checkOnly || missing.length == 0) {
        return;
    }

    const results = { downloaded: 0, failed: [] };
    const formats = {};
    let next = 0;

    async function worker() {
        while (next < missing.length) {
            const hash = missing[next++];
            const icon = await downloadIcon(hash);

            if (icon == null) {
                results.failed.push(hash);
                continue;
            }

            fs.writeFileSync(path.join(iconDir, `${hash}.png`), icon.buffer);
            formats[icon.format] = (formats[icon.format] ?? 0) + 1;
            results.downloaded++;

            if (results.downloaded % 25 == 0) {
                console.log(`  ${results.downloaded}/${missing.length}`);
            }
        }
    }

    await Promise.all(Array.from({ length: concurrency }, worker));

    console.log(`\ndownloaded: ${results.downloaded}`);
    console.log(`formats: ${Object.entries(formats).map(([f, n]) => `${f} ${n}`).join(', ')}`);

    if (results.failed.length > 0) {
        console.log(`\nnot available on any server (${results.failed.length}):`);
        const byKey = {};
        for (const hash of results.failed) {
            for (const entry of entries.filter(e => e.image == hash)) {
                (byKey[hash] ??= []).push(entry.key);
            }
        }
        for (const [hash, keys] of Object.entries(byKey)) {
            console.log(`  ${hash}  ${keys.join(', ')}`);
        }
    }
}

main();
