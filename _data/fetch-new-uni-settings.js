x = await fetch('https://lobby.ogame.gameforge.com/api/servers').then(r => r.json());
grouped = x.reduce((groups, cur) => {
    groups[cur.language] ??= [];
    groups[cur.language].push(cur);
    return groups;
}, {});
potentialNextUnis = Object.values(grouped).map(group => group.filter(s => s.settings.serverCategory != 'graveyard').sort((a, b) => b.number - a.number)[0]);
const newUniSettings = [];

for (const uni of potentialNextUnis) {
    const nextUni = {
        language: uni.language,
        number: uni.number + 1,
    };
    const url = `https://s${nextUni.number}-${nextUni.language}.ogame.gameforge.com/api/serverData.xml`;
    try {
        const xml = await fetch(url).then(r => r.text());

        nextUni.name = xml.match(/<name>([^<]+)<\/name>/)[1];
        nextUni.ecoSpeed = parseFloat(xml.match(/<speed>([^<]+)<\/speed>/)[1]);
        nextUni.researchSpeed = parseFloat(xml.match(/<speed>([^<]+)<\/speed>/)[1]) * parseFloat(xml.match(/<researchDurationDivisor>([^<]+)<\/researchDurationDivisor>/)[1]);

        nextUni.fleetSpeedPeaceful = parseFloat(xml.match(/<speedFleetPeaceful>([^<]+)<\/speedFleetPeaceful>/)[1]);
        nextUni.fleetSpeedWar = parseFloat(xml.match(/<speedFleetWar>([^<]+)<\/speedFleetWar>/)[1]);
        nextUni.fleetSpeedHolding = parseFloat(xml.match(/<speedFleetHolding>([^<]+)<\/speedFleetHolding>/)[1]);

        nextUni.galaxies = parseInt(xml.match(/<galaxies>([^<]+)<\/galaxies>/)[1]);
        nextUni.tf = parseFloat(xml.match(/<debrisFactor>([^<]+)<\/debrisFactor>/)[1]) * 100 + '%';
        nextUni.deutInTf = xml.match(/<deuteriumInDebris>([^<]+)<\/deuteriumInDebris>/)[1] == '1';
        nextUni.ditf = parseFloat(xml.match(/<debrisFactorDef>([^<]+)<\/debrisFactorDef>/)[1]) * 100 + '%';
        nextUni.bonusFields = parseInt(xml.match(/<bonusFields>([^<]+)<\/bonusFields>/)[1]);
        nextUni.ignoreEmptySystems = xml.match(/<fleetIgnoreEmptySystems>([^<]+)<\/fleetIgnoreEmptySystems>/)?.[1] == '1'; 
        nextUni.ignoreInactiveSystems = xml.match(/<fleetIgnoreInactiveSystems>([^<]+)<\/fleetIgnoreInactiveSystems>/)?.[1] == '1'; 
        nextUni.aks = xml.match(/<acs>([^<]+)<\/acs>/)[1] == '1';
        nextUni.probeCargo = parseInt(xml.match(/<probeCargo>([^<]+)<\/probeCargo>/)[1]);

        newUniSettings.push(nextUni);
    } catch (e) { console.warn(e); }
}
console.table(newUniSettings)
