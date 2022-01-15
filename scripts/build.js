const { execSync } = require('child_process');
const process = require('process');
const fs = require('fs');

const isDev = process.argv.includes('--dev');
const browser = process.argv.find(arg => arg.startsWith('--browser='))?.split('=')?.[1];
if (browser == null) {
    throw new Error('No browser provided. Build with option --browser=<chrome|firefox>');
}

process.stdout.write(`Building OGame Tracker (browser=${browser}, dev=${isDev})\n`);

// build content script + service worker
process.stdout.write(`Building content scripts and service worker`);
execSync(`npx webpack --mode=production --node-env=production --env browser=${browser} ${isDev ? 'dev=true' : ''}`, { stdio: 'inherit' });

// build vue views
process.stdout.write(`Building views\n`);
// create .env file with VUE_APP_BROWSER environment variable
fs.writeFileSync(`.env`, `VUE_APP_BROWSER=${browser}`, 'utf-8');
execSync(`vue-cli-service build --modern`, { stdio: 'inherit' });

// copy favicon to output dir
process.stdout.write(`Copying favicon\n`);
fs.copyFileSync(`static/icon128${isDev ? '-dev' : ''}.png`, 'dist/favicon.png');

// generate manifest
process.stdout.write(`Generating manifest\n`);
execSync(`node scripts/generate-manifest.js ${isDev ? '--dev' : ''}`, { stdio: 'inherit' });

process.stdout.write(`Done\n`);