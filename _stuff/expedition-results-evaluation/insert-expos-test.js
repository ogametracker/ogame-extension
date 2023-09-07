function mapExpo(expo) {
    return {
        serverId: 115,
        language: 'de',
        messageId: expo.id,
        date: new Date(expo.date).toISOString(),
        type: expo.type,
        depletionLevel: expo.depletion,
        size: expo.size,
        amount: expo.darkMatter ?? (
            expo.type == 'resources' 
                ? Math.max(expo.resources.metal, expo.resources.crystal, expo.resources.deuterium) 
                : null
        ),
        resource: expo.type == 'resources' 
            ? (Object.keys(expo.resources ?? {}).find(r => expo.resources[r] > 0) ?? 'metal')
            : null,
        itemHash: expo.itemHash,
        fleet: expo.type != 'fleet' ? null : {
            lightFighter: expo.fleet?.[204] ?? 0,
            heavyFighter: expo.fleet?.[205] ?? 0,
            cruiser: expo.fleet?.[206] ?? 0,
            battleship: expo.fleet?.[207] ?? 0,
            bomber: expo.fleet?.[211] ?? 0,
            battlecruiser: expo.fleet?.[213] ?? 0,
            destroyer: expo.fleet?.[215] ?? 0,
            reaper: expo.fleet?.[218] ?? 0,
            pathfinder: expo.fleet?.[219] ?? 0,
            smallCargo: expo.fleet?.[202] ?? 0,
            largeCargo: expo.fleet?.[203] ?? 0,
            espionageProbe: expo.fleet?.[210] ?? 0,
        },
    };
}

for(const expo of window.expeditions) {
    await fetch('https://localhost:7136/api/results/expedition', { 
        method: 'POST',
        body: JSON.stringify(mapExpo(expo)),
        headers: { 'content-type': 'application/json' },
    });
}