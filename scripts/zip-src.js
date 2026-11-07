const zipdir = require('zip-dir');
const path = require('path');
const process = require('process');

const version = process.argv.includes('--version') ? process.argv[process.argv.indexOf('--version') + 1] : null;
if(version == null) {
    throw new Error('no version provided');
}

const fixPath = path => path.replace(/\\/g, '/');

const ignoreDirs = [
    '.vscode',
    '.git',
    '_data',
    'publish',
].map(dir => path.resolve('./' + dir))
.map(dir => fixPath(dir));

zipdir('./', { 
    saveTo: `./publish/ogame-tracker-src--${version}.zip`,
    filter: (path, /** @type {import('fs').Stats} */stat) => {
        path = fixPath(path);
        const segments = path.slice(fixPath(process.cwd()).length + 1).split('/');
        if (segments.includes('node_modules') || segments.includes('dist')) {
            return false;
        }
        if(stat.isDirectory()) {
            return !ignoreDirs.includes(path);
        }

        return !ignoreDirs.some(dir => path.startsWith(dir + '/'));
    },
});