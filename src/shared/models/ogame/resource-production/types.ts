export interface ProductionBreakdown {
    base: number;
    mine: number;
    crawlers: number;

    plasmaTechnology: number;
    playerClass: number;
    allianceClass: number;
    geologist: number;
    commandStaff: number;
    item: number;

    lifeformBuildings: number;
    lifeformTechnologies: number;

    get total(): number;
}