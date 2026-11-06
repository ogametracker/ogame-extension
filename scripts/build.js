const { execFileSync, execSync } = require('child_process');
const process = require('process');
const fs = require('fs');
const path = require('node:path');

const isDev = process.argv.includes('--dev');
const noTag = process.argv.includes('--no-tag');
const manualVersion = process.argv.includes('--version') ? process.argv[process.argv.indexOf('--version') + 1] : null;
const browser = process.argv.find(arg => arg.startsWith('--browser='))?.split('=')?.[1];
if (browser !== 'chrome' && browser !== 'firefox') {
    throw new Error('No browser provided. Build with option --browser=<chrome|firefox>');
}

console.log(`Building OGame Tracker (browser=${browser}, dev=${isDev})`);
const mode = isDev ? 'development' : 'production';
const buildEnv = { ...process.env, BROWSER: browser, NODE_ENV: mode };
const contentScripts = 'src/content-scripts';
const views = ['src/views/stats', 'src/views/notifications'];
const serviceWorker = 'src/service-worker';

execSync('npm run build --workspaces --if-present', { stdio: 'inherit', env: buildEnv });

// Assemble the extension only after each workspace has built successfully.
const dist = path.resolve(__dirname, '../dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync('static', dist, { recursive: true });
fs.cpSync(`${contentScripts}/dist`, path.join(dist, 'content-scripts'), { recursive: true });
fs.cpSync(`${serviceWorker}/dist`, dist, { recursive: true });
for (const workspace of views) {
    fs.cpSync(`${workspace}/dist`, path.join(dist, 'views'), { recursive: true });
}

// copy favicon to output dir
console.log(`Copying favicon`);
fs.copyFileSync(`static/icon128${isDev ? '-dev' : ''}.png`, 'dist/favicon.png');

// generate manifest
console.log(`Generating manifest`);
const manifestArgs = ['scripts/generate-manifest.js', '--browser=' + browser];
if (isDev) manifestArgs.push('--dev');
if (manualVersion != null) manifestArgs.push('--version', manualVersion);
execFileSync(process.execPath, manifestArgs, { stdio: 'inherit' });

const manifest = JSON.parse(fs.readFileSync('./dist/manifest.json'));
const version = manifest.version;
const dateFormat = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',

    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
});
console.log(`Build ready (version ${version}, ${dateFormat.format(new Date())})`);

if (!isDev) {
    console.log('Creating zip-archive');

    if (!fs.existsSync('./publish')) {
        fs.mkdirSync('./publish');
    }

    const zipdir = require('zip-dir');
    zipdir('./dist', { saveTo: `./publish/ogame-tracker-${browser}--${version}.zip` });

    if (!noTag) {
        const tagName = `${manifest.name.replace(/\s/g, '_')}/${browser}/${version}`;
        try {
            console.log(`creating git tag '${tagName}'`);
            execFileSync('git', ['tag', tagName]);
            execFileSync('git', ['push', 'origin', tagName]);
            console.log('created tag successfully');
        } catch (e) {
            console.log('FAILED to add git tag');
            console.log(e);
        }
    }
}

console.log('Done');
