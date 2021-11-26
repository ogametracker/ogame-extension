const fs = require('fs');
const dateFns = require('date-fns');

const args = process.argv.slice(2);
const isDev = args.includes('--dev');
const browser = args.includes('--firefox') ? 'firefox' : 'chrome';

run();

async function run() {
    console.log(`building for ${browser} (dev mode: ${isDev ? 'yes' : 'no'})`);

    updateManifest();
    updateExtensionName();
    removeVueServeSpecificFiles();
    
    if(!isDev){
        await createUploadArchive();
    }
    console.log('done');
}

function updateManifest() {
    console.log('update manifest');

    const distFiles = fs.readdirSync('./dist', {
        encoding: 'utf8',
        withFileTypes: true
    }).filter(f => f.isFile())
        .map(f => f.name);

    const now = Date.now();
    const patchVersion = Math.trunc(
        (
            dateFns.getHours(now) * 60 * 60
            + dateFns.getMinutes(now) * 60
            + dateFns.getSeconds(now)
        ) / 2
    );
    const manifestContent = fs.readFileSync('./dist/manifest.json', 'utf8');
    const manifest = JSON.parse(manifestContent);

    // set extension version
    manifest.version = manifest.version
        .replace('[major-version]', dateFns.format(now, 'yyyy'))
        .replace('[minor-version]', dateFns.format(now, 'MM'))
        .replace('[revision-version]', dateFns.format(now, 'DDD'))
        .replace('[patch-version]', patchVersion);

    // set icon
    if (isDev) {
        manifest.icons[128] = 'icon128-dev.png';
    }

    // replace content scripts
    manifest.content_scripts.forEach(cs => {
        ['js', 'css'].forEach(key => {
            if (cs[key] != null) {
                const regex = new RegExp(cs[key]);
                cs[key] = distFiles.filter(file => regex.test(file));
            }
        });
    });

    const newManifestContent = JSON.stringify(manifest, null, 4);
    fs.writeFileSync('./dist/manifest.json', newManifestContent, 'utf8');
}

function updateExtensionName() {
    console.log('update extension name');

    const localeJsonFiles = readFilesRecursive('./dist/_locales')
        .filter(file => file.endsWith('.json'));

    localeJsonFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        if (isDev) {
            content = content.replace('[name-suffix]', ' DEV')
        } else {
            content = content.replace('[name-suffix]', '');
        }
        fs.writeFileSync(file, content);
    });
}

function readFilesRecursive(path) {
    const files = [];
    for (const file of fs.readdirSync(path, { withFileTypes: true })) {
        const fullPath = path + '/' + file.name;

        if (file.isDirectory()) {
            files.push(...readFilesRecursive(fullPath));
        }
        else if (file.isFile()) {
            files.push(fullPath);
        }
    }

    return files;
}

function removeVueServeSpecificFiles() {
    console.log('remove dev files');

    const files = [
        './dist/index.html',
        './dist/ogame-fake.js'
    ];

    files.forEach(file => {
        if (fs.existsSync(file)) {
            fs.rmSync(file);
        }
    });
}

async function createUploadArchive() {
    console.log('create archive');

    const zipdir = require('zip-dir');
    await zipdir('./dist', { saveTo: `./dist/ogame-tracker-${browser}.zip` });
}