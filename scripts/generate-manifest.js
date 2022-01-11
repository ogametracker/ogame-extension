const fs = require('fs');
const process = require('process');

const isDev = process.argv.includes('--dev');

const contentScriptDir = './src/content-scripts';
const contentScripts = fs.readdirSync(contentScriptDir, { withFileTypes: true })
    .filter(file => file.isDirectory())
    .map(dir => dir.name)
    .map(dirName => {
        const files = fs.readdirSync('./dist/content-scripts', { withFileTypes: true })
            .filter(file => file.isFile())
            .map(file => file.name)
            .filter(fileName => fileName.startsWith(dirName) && !fileName.endsWith('.map'));

        const options = JSON.parse(fs.readFileSync(`${contentScriptDir}/${dirName}/options.json`, 'utf-8'));

        ['js', 'css'].forEach(type => {
            const file = files.find(file => file.endsWith(`.${type}`));
            if (file == null) {
                return;
            }

            options[type] = [`content-scripts/${file}`];
        });

        return options;
    });

const now = new Date();
const manifest = {
    name: 'OGame Tracker' + (isDev ? ' DEV' : ''),
    description: '__MSG_appDesc__',
    manifest_version: 3,
    default_locale: 'de',
    version: `${now.getFullYear()
        }.${now.getMonth() + 1
        }.${now.getDate()
        }.${Math.trunc((now.getHours() * 24 * 60 + now.getMinutes() * 60 + now.getSeconds()) / 2)
        }`,
    icons: {
        [128]: isDev ? 'icon128-dev.png' : 'icon128.png',
    },
    permissions: [
        'storage',
        'unlimitedStorage',
    ],
    web_accessible_resources: [
        {
            resources: ['views/*'],
            matches: ['https://*.ogame.gameforge.com/*'],
        },
    ],
    content_scripts: [
        ...contentScripts,
    ],
    background: {
        service_worker: 'service-worker.js',
    },
};

fs.writeFileSync('./dist/manifest.json', JSON.stringify(manifest, null, 4), 'utf-8');