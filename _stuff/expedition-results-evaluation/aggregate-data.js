const fs = require('fs');

const dataDir = `${__dirname}/data`;
const entries = fs.readdirSync(dataDir, { withFileTypes: true });
const files = entries.filter(e => e.isFile() && e.name.endsWith('.json'));

/** @type {Record<`${number}-${string}`, Record<number, any>} */
const expeditionsByServer = {};

const addExpeditions = (serverId, language, expeditions) => {
    const key = `${serverId}-${language}`;
    expeditionsByServer[key] ??= {};

    expeditions.forEach(expo => {
        if(expeditionsByServer[key][expo.id] != null) {
            console.log('overwriting existing expedition', key, expo.id);
        }

        expeditionsByServer[key][expo.id] = expo;
    });
};

const v1Regex = /OGameTracker-s(?<serverId>\d+)-(?<language>\w+)/;
files.forEach(file => {
    console.log(`importing file '${file.name}'`);
    
    const v1Match = file.name.match(v1Regex);
    if (v1Match != null) {
        console.log('importing as v1');
        const expeditions = JSON.parse(fs.readFileSync(`${dataDir}/${file.name}`)).expeditions;
        addExpeditions(v1Match.groups.serverId, v1Match.groups.language, expeditions);
    }
    else {
        console.log('importing as v2');
        const accounts = JSON.parse(fs.readFileSync(`${dataDir}/${file.name}`)).accounts;
        accounts.forEach(acc => {
            addExpeditions(acc.serverId, acc.language, acc.expeditions);
        });
    }
});

fs.writeFileSync(`${__dirname}/data.json`, JSON.stringify(expeditionsByServer, null, 4), 'utf-8');