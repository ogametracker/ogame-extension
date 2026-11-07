const { execFileSync } = require('child_process');
const fs = require('fs');
const { generateVersion } = require('./_generateVersion');

const versionIndex = process.argv.indexOf('--version');
const version = versionIndex === -1 ? generateVersion() : process.argv[versionIndex + 1];
const noTag = process.argv.includes('--no-tag');
if (!version || !/^(0|[1-9]\d*)(\.(0|[1-9]\d*)){0,3}$/.test(version)
    || version.split('.').some(part => Number(part) > 65535)
    || version.split('.').every(part => Number(part) === 0)) {
    throw new Error('Version must contain 1 to 4 dot-separated integers from 0 to 65535, without leading zeros, and cannot be all zeros.');
}

if (fs.existsSync('./publish')) {
    console.log('cleaning "publish" directory');
    fs.rmSync('./publish', { force: true, recursive: true });
}

console.log(`using version number '${version}'`);
console.log(`creating Chrome build`);
build('chrome', version);
console.log(`creating Firefox build`);
build('firefox', version);

execFileSync(process.execPath, ['./scripts/zip-src.js', '--version', version], { stdio: 'inherit' });

if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\n`);
}

function build(browser, version) {
    const args = ['./scripts/build.js', `--browser=${browser}`, '--version', version];
    if (noTag) args.push('--no-tag');
    execFileSync(process.execPath, args, { stdio: 'inherit' });
}
