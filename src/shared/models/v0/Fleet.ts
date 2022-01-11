type Shipv0 = 'Leichter Jäger'
    | 'Schwerer Jäger'
    | 'Kreuzer'
    | 'Schlachtschiff'
    | 'Schlachtkreuzer'
    | 'Bomber'
    | 'Zerstörer'
    | 'Reaper'
    | 'Pathfinder'
    | 'Kleiner Transporter'
    | 'Großer Transporter'
    | 'Spionagesonde';

type Fleetv0 = Record<Shipv0, number | undefined>;
export default Fleetv0;