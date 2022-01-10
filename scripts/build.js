const { execSync } = require('child_process');
const process = require('process');
const fs = require('fs');
const bash = require('shelljs');

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
const viewsDir = './src/views';
const views = fs.readdirSync(viewsDir, { withFileTypes: true })
    .filter(file => file.isDirectory())
    .map(dir => dir.name);

views.forEach(view => {
    process.stdout.write(`Building view '${view}'\n`);
    const viewDir = `${viewsDir}/${view}`;

    // create .env file with VUE_APP_BROWSER environment variable
    fs.writeFileSync(`${viewDir}/.env`, `VUE_APP_BROWSER=${browser}`, 'utf-8');

    execSync(`cd ${viewDir} && npm run build`, { stdio: 'inherit' });
});

// copy vue views to output directory
process.stdout.write(`Copying view files to dist\n`);
fs.mkdirSync('./dist/views');
views.forEach(view => {
    const result = bash.cp('-rf', `${viewsDir}/${view}/dist`, `./dist/views/${view}`);
    if(result.code != 0) {
        throw new Error(result.stderr);
    }
});

// generate manifest
process.stdout.write(`Generating manifest\n`);
execSync(`node scripts/generate-manifest.js ${isDev ? '--dev' : ''}`, { stdio: 'inherit' });

process.stdout.write(`Done\n`);