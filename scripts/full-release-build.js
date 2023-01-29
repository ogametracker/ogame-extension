const { execSync } = require('child_process');
const fs = require('fs');
const zipdir = require('zip-dir');
const { generateVersion } = require('./_generateVersion');

if (fs.existsSync('./publish')) {
    console.log('cleaning "publish" directory');
    fs.rmSync('./publish', { force: true, recursive: true });
}

const version = generateVersion();
console.log(`generated version number '${version}'`);
console.log(`creating Chrome build`);
build('chrome', version);
console.log(`creating Firefox build`);
build('firefox', version);

execSync(`node ./scripts/zip-src.js --version ${version}`);

function build(browser, version) {
    execSync(`node ./scripts/build.js --browser=${browser} --version ${version}`);
}