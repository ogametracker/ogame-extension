const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');

let data;
run();


async function run() {
    await init();
    collectStatistics();
}

function collectStatistics() {
    const allExpos = Object.values(data).flatMap(expos => expos);
    const totalCount = allExpos.length;

    // number by type + size
    const byType = {};
    const byTypeSize = {};
    allExpos.forEach(expo => {
        byType[expo.type] ??= 0;
        byType[expo.type]++;

        if ('size' in expo) {
            const key = `${expo.type}-${expo.size}`;
            byTypeSize[key] ??= 0;
            byTypeSize[key]++;
        }
    });

    console.log(totalCount);
    console.log(byType);
    console.log(byTypeSize);
}

async function init() {
    const dataFile = `${__dirname}/data.json`;
    data = JSON.parse(fs.readFileSync(dataFile));

    const serverSettings = {};
    const promises = Object.keys(data).map(id => {
        const url = `https://s${id}.ogame.gameforge.com/api/serverData.xml`;

        return new Promise(async resolve => {
            try {
                const xml = await fetch(url).then(r => r.text());
                const serverData = new XMLParser().parse(xml);
                serverSettings[id] = serverData;
            } catch(e) {
                console.log(`ERROR on loading server data for 's${id}':`);
                console.log(e);
            } finally {
                resolve();
            }
        });
    });
    await Promise.all(promises);
}