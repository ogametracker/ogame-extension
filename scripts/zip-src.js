const zipdir = require('zip-dir');
const path = require('path');
const process = require('process');

const version = process.argv.includes('--version') ? process.argv[process.argv.indexOf('--version') + 1] : null;
if(version == null) {
    throw new Error('no version provided');
}

const fixPath = path => path.replace(/\\/g, '/');

const ignoreDirs = [
    'node_modules',
    '.vscode',
    '.git',
    '_data',
    'dist',
    'publish',
].map(dir => path.resolve('./' + dir))
.map(dir => fixPath(dir));

zipdir('./', { 
    saveTo: `./publish/ogame-tracker-src--${version}.zip`,
    filter: (path, /** @type {import('fs').Stats} */stat) => {
        path = fixPath(path);
        if(stat.isDirectory()) {
            return !ignoreDirs.includes(path);
        }

        return !ignoreDirs.some(dir => fixPath(path).startsWith(dir + '/'));
    },
});