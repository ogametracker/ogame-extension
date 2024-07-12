export enum LifeformDiscoveryEventArtifactFindingSize {
    storageFull = 'full',
    small = 'normal',
    medium = 'big',
    large = 'huge', 
}

export const LifeformDiscoveryEventArtifactFindingSizes: LifeformDiscoveryEventArtifactFindingSize[] = [
    LifeformDiscoveryEventArtifactFindingSize.small,
    LifeformDiscoveryEventArtifactFindingSize.medium,
    LifeformDiscoveryEventArtifactFindingSize.large,
    LifeformDiscoveryEventArtifactFindingSize.storageFull,
];