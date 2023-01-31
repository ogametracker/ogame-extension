const { execSync } = require('child_process');
const process = require('process');
const fs = require('fs');

const isDev = process.argv.includes('--dev');
const noTag = process.argv.includes('--no-tag');
const manualVersion = process.argv.includes('--version') ? process.argv[process.argv.indexOf('--version') + 1] : null;
const browser = process.argv.find(arg => arg.startsWith('--browser='))?.split('=')?.[1];
if (browser == null) {
    throw new Error('No browser provided. Build with option --browser=<chrome|firefox>');
}

console.log(`Building OGame Tracker (browser=${browser}, dev=${isDev})`);
// run _build-hook.js files in view directories (if exist)
const viewsDir = './src/views';
const viewBuildHooks = fs.readdirSync(viewsDir, { withFileTypes: true })
    // only directories that have a main.ts
    .filter(file => file.isDirectory()
        && fs.readdirSync(`${viewsDir}/${file.name}`, { withFileTypes: true })
            .some(f => f.isFile() && f.name == '_build-hook.js')
    )
    .map(dir => `${viewsDir}/${dir.name}/_build-hook.js`);

viewBuildHooks.forEach(hookPath => {
    console.log(`\tRunning hook '${hookPath}'`);
    const output = execSync(`node ${hookPath}`);
    console.log(output.toString());
});

// build content script + service worker
console.log(`Building content scripts and service worker`);
const webpackBuildMode = isDev ? 'development' : 'production';
execSync(`npx webpack --mode=${webpackBuildMode} --node-env=${webpackBuildMode} --env browser=${browser} ${isDev ? 'dev=true' : ''}`, { stdio: 'inherit' });

// build vue views
console.log('building views');
// create .env file with VUE_APP_BROWSER environment variable
console.log('creating Vue build');
fs.writeFileSync(`.env.local`, `VUE_APP_BROWSER=${browser}`, 'utf-8');
const vueBuildMode = isDev ? 'development' : 'production';
execSync(`vue-cli-service build --modern --mode ${vueBuildMode}`, { stdio: 'inherit' });

// copy favicon to output dir
console.log(`Copying favicon`);
fs.copyFileSync(`static/icon128${isDev ? '-dev' : ''}.png`, 'dist/favicon.png');

// generate manifest
console.log(`Generating manifest`);
execSync(`node scripts/generate-manifest.js ${isDev ? '--dev' : ''} --browser=${browser} ${manualVersion != null ? `--version ${manualVersion}` : ''}`, { stdio: 'inherit' });

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
            execSync(`git tag ${tagName}`);
            execSync(`git push origin ${tagName}`);
            console.log('created tag successfully');
        } catch (e) {
            console.log('FAILED to add git tag');
            console.log(e);
        }
    }
}

console.log('Done');