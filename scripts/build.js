const { execSync } = require('child_process');
const process = require('process');
const fs = require('fs');

const isDev = process.argv.includes('--dev');
const browser = process.argv.find(arg => arg.startsWith('--browser='))?.split('=')?.[1];
if (browser == null) {
    throw new Error('No browser provided. Build with option --browser=<chrome|firefox>');
}

console.log(`Building OGame Tracker (browser=${browser}, dev=${isDev})`);

// build content script + service worker
console.log(`Building content scripts and service worker`);
execSync(`npx webpack --mode=production --node-env=production --env browser=${browser} ${isDev ? 'dev=true' : ''}`, { stdio: 'inherit' });

// build vue views
console.log('building views');
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

// create .env file with VUE_APP_BROWSER environment variable
console.log('creating Vue build');
fs.writeFileSync(`.env`, `VUE_APP_BROWSER=${browser}`, 'utf-8');
execSync(`vue-cli-service build --modern`, { stdio: 'inherit' });

// copy favicon to output dir
console.log(`Copying favicon`);
fs.copyFileSync(`static/icon128${isDev ? '-dev' : ''}.png`, 'dist/favicon.png');

// generate manifest
console.log(`Generating manifest`);
execSync(`node scripts/generate-manifest.js ${isDev ? '--dev' : ''}`, { stdio: 'inherit' });

console.log(`Done`);