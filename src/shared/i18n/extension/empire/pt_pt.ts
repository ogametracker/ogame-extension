import { LifeformDiscoveryEventArtifactFindingSize } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize";
import { LifeformDiscoveryEventType } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType";
import { EmpireTranslations } from "./type";
import { RecursivePartial } from "@/shared/types/RecursivePartial";

export const pt_pt: RecursivePartial<EmpireTranslations> = {
    header: 'Império',
    planet: 'Planeta',
    production: {
        header: 'Produção',
        subHeaders: {
            resourceProduction: 'Produção de Recursos',
            mineOverview: 'Resumo das Minas',
        },
        averagePerHour: '⌀ por hora',
        totalPerHour: 'total por hora',
        totalPerDay: 'total por dia',
        totalPerWeek: 'total por semana',
        activeProductionSettings: 'Definições de Produção Activas',
        messageProduction100: 'Os valores apresentados são com base no factor de produção de 100% e não tem em conta a falta de energia.',

        mines: {
            crawlersAvailable: 'disponivel',
            crawlersToReachLimit: count => `${count} rastejadores para bonús máximo`,
        },
        items: 'Items Activos',
        breakdown: {
            basicIncome: 'Produção Básica',
            mineProduction: 'Produção da Mina',
            consumption: 'Consumo',
            lifeformBuildings: 'Edifícios de Forma de Vida',
            crawlers: 'Rastejadores',
            items: 'Items',
            geologist: 'Geólogo',
            commandStaff: 'Equipa de Comando',
            playerClass: 'Classe do Jogador',
            allianceClass: 'Classe da Aliança',
            lifeformTechnologies: 'Tecnologias de Forma de Vida',
        },

        settings: {
            reset: 'Reset',
            header: 'Definições de Produção',
            applyAndClose: 'Aplicar e fechar definições de produção',
        },
    },
    amortization: {
        header: 'Amortização',

        table: {
            cost: 'Custo',
            levels: 'Níveis',
            productionPlus: 'Diferença de Produção',
            amortizationTime: 'Tempo de Amortização',
            groupSelectedItems: 'Agrupar items selecionados',
            showOriginalItems: 'Mostrar todos os items individualmente',

            levelsOnPlanets: (levels, planets) => `${levels} ${levels == 1 ? 'nível' : 'níveis'} ${planets == 1 ? 'no' : 'nos'} ${planets} ${planets == 1 ? 'planeta' : 'planetas'}`,
        },

        settings: {
            header: 'Definições',
            applyAndClose: 'Aplicar definições e fechar',

            includeSettings: {
                header: 'Incluído no cálculo',

                mines: 'Minas',
                expeditions: 'Expedições',
                expeditionsRequirement: 'Nota: Requer tecnologias de forma de vida e/ou Astrofísica',
                lifeformBuildings: 'Edifícios de Forma de Vida',
                lifeformTechnologies: 'Tecnologias de Forma de Vida',
                astrophysicsAndColony: 'Astrofísica e novas colónias',
                astrophysicsPerformanceNote: 'Nota: Requer bastante processamento, irá afectar muito o desempenho',
            },
            playerSettings: {
                header: 'Definições Gerais',
                optimizeForResources: 'Optimizar para recursos selecionados',
                officers: 'Oficiais',
                playerClass: 'Classe do Jogador',
                allianceClass: 'Classe da Aliança',
                currentLevelOf: (name: string) => `Nível Actual de ${name}`,
                lifeformLevels: 'Níveis de Forma de Vida',

                unusedRaidColonySlots: 'Slots de colónias não usados actualmente',
            },
            astrophysicsSettings: {
                header: (name: string) => `${name} definições`,
                newColony: 'nova Colónia',
            },
            planetSettings: {
                header: 'Definições do Planeta',

                global: {
                    deselectItems: 'Desmarcar todos os items',
                    ignoreInactiveLifeformTechnologySlots: 'Ignorar slots de tecnologias inactivas de forma de vida para todos os planetas',
                },

                includeInResult: 'Incluir no cálculo',
                position: 'Posição',
                maxTemperature: 'Temp. Max.',
                activeItems: 'Items Activos',
                crawlers: {
                    title: 'Rastejadores',
                    percentage: '% Produção',
                    fixCount: 'Contagem Fixa',
                    maxCount: 'Contagem Max.',
                },
                mines: 'Nível Actual das Minas',

                lifeform: 'Forma de Vida',
                lifeformSettings: 'Definições de Forma de Vida',
                relevantLifeformBuildings: 'Edíficios Relevantes de Forma de Vida',
                lifeformTechnologies: 'Tecnologias de Forma de Vida',
                ignoreEmptySlots: 'Ignorar slots inactivos',
            },
            expeditionSettings: {
                header: 'Definições de Expedições',
                averageWavesPerDay: '⌀ Vagas por dia',
                items: 'Slots de item',
                averageExpeditionsPerDay: '⌀ Expedições por dia',
                shipUnitFactors: 'Factor de recurso de naves',
                topPlayerScore: 'Pontuação do Top player',
            },
        },

        info: {
            generatingItems: 'A calcular os próximos melhores items',

            slowCalculation: 'O cálculo da amortização ficará bastante mais lento agora que os edifícios e tecnologias das formas de vida foram incluídas. Isto será, provavelmente, optimizado no futuro.',
            ctrlClick: 'Ctrl + Click numa checkbox para (des)selecionar todos os item até ao selecionado.',
        },

        saveLoad: {
            saveButton: 'Gravar resultados do cálculo da amortização',
            loadButton: (date: string) => `Carregar gravação (${date})`,
            loadedSave: (date: string, hiddenItems: string) => `A ver os resultados guardados (${date}) - ${hiddenItems} entradas escondidas`,
            abandonedPlanet: 'Planeta Destruído',
        },

        generateItems: value => `${value} registos`,
    },
    lifeforms: {
        header: 'Formas de Vida',
        subHeaders: {
            overview: 'Resumo',
            progress: 'Progresso',
            discoveryMissions: 'Missões',

            discoveryResults: 'Resultados',
            experience: 'Experiência',
            researchBonuses: 'Bonus de Pesquisas',
        },

        planet: 'Planeta',
        lifeform: 'Forma de Vida',
        buildings: 'Edifícios de Forma de Vida',
        technologies: 'Tecnologias de Forma de Vida',
        tier: 'Escalão',
        level: 'Nível',
        totalLifeformExperience: 'Experiência (total)',
        discoveryDateUnknown: 'Desconhecido',
        notDiscoveredYet: 'Ainda não descoberto',
        discoveryMissions: 'Missões de Descoberta',
        eventTypes: {
            [LifeformDiscoveryEventType.nothing]: 'Nada encontrado',
            [LifeformDiscoveryEventType.lostShip]: 'Frota de exploração perdida',
            [LifeformDiscoveryEventType.newLifeformFound]: 'Nova Forma de Vida',
            [LifeformDiscoveryEventType.knownLifeformFound]: 'Experiência de Forma de Vida',
            [LifeformDiscoveryEventType.artifacts]: 'Artefactos encontrados',
        },
        artifactFindingSizes: {
            [LifeformDiscoveryEventArtifactFindingSize.small]: 'Descoberta Comum',
            [LifeformDiscoveryEventArtifactFindingSize.medium]: 'Descoberta Grande',
            [LifeformDiscoveryEventArtifactFindingSize.large]: 'Descoberta Enorme',
            [LifeformDiscoveryEventArtifactFindingSize.storageFull]: 'Armazenamento Cheio',
        },
        lifeformFound: 'Forma de Vida encontrada',
        alwaysAvailable: 'Sempre disponível',
        artifacts: 'Artefactos',

        experiencePoints: 'Pontos de Experiência',
        discoveredOn: 'Forma de Vida descoberta em',
        numberOfLifeformDiscoveries: 'Número de descobertas',

        researchBonuses: {
            breakdown: {
                slot: 'Slot',
                research: 'Pesquisa',
                bonus: 'Bónus',
                lifeformBuildingsBoost: (boost: string) => `Boost de Edifícios de Forma de Vida (${boost})`,
                lifeformLevelBoost: (lifeform: string, boost: string) => `Boost de Nível de Forma de Vida (${lifeform}: ${boost})`,
                bugBoost: 'Boost causado por bugs',
            },
            production: {
                header: 'Produção de Recursos',
            },
            expeditionFinds: {
                header: 'Descobertas das Expedições',
                resources: 'Recursos',
                ships: 'Naves',
                fleetLoss: 'Frotas Perdidas',
            },
            expeditionSpeed: {
                header: 'Média da elocidade de chegada das Expedições',
                bonus: 'Bónus de Velocidade',
            },
            ships: {
                header: 'Naves',
                armor: 'Blindagem',
                shield: 'Escudo',
                damage: 'Dano',
                cargo: 'Capacidade',
                speed: 'Velocidade',
            },
            defenses: {
                header: 'Defesas',
            },
            fuelConsumption: {
                header: 'Consumo de Deutério',
            },
            fuelReturn: {
                header: 'Deutério recuperado ao voltar para trás',
                bonus: 'Deutério recuperado',
            },
            buildingCostTime: {
                header: 'Custo&Tempo dos Edifícios',
                cost: 'Custo',
                time: 'Tempo',
            },
            researchCostTime: {
                header: 'Custo&Tempo das Pesquisas',
                researches: 'Pesquisas',
                lifeformResearches: 'Pesquisas de Formas de Vida',
            },
            crawlers: {
                header: 'Rastejadores',
                productionBonus: 'Produção de Recursos',
                energyConsumption: 'Consumo de Energia',
            },
            denCapacity: {
                header: 'Capacidade do Den',
            },
            phalanxRange: {
                header: 'Alcance do Phalanx',
            },
            discoveryMissions: {
                header: 'Velocidade de Missões de Descoberta',
            },
            playerClasses: {
                header: 'Classes de Jogador',

                collector: {
                    productionBonus: 'Aumenta a produção das minas',
                    energyProductionBonus: 'Aumenta a produção de Energia',
                    transporterSpeedBonus: 'Bónus de velocidade dos cargueiros',
                    transporterCargoBonus: 'Bónus de capacidade dos cargueiros',
                    crawlerProductionBonus: 'Bónus na produção dos Rastejadores',
                    geologistCrawlerAmountBonus: 'Mais capacidade para Rastejadores com o Geólogo',
                },
                discoverer: {
                    researchDuration: 'Reduz tempo de pesquisa',
                    increasedExpeditionFinds: 'Aumenta ganhos com expedições',
                    largerPlanets: 'Maiores planetas ao colonizar',
                    additionalExpeditionSlots: 'Slots adicionais para expedições',
                    reducedExpeditionCombatChance: 'Reduz probabilidade de inimigos na expedição',
                    phalanxRange: 'Maior alcance do Phalax',
                },
                general: {
                    combatShipSpeed: 'Bónus de velocidade em naves de combate',
                    recyclerSpeed: 'Bónus de velocidade nos recicladores',
                    fuelConsumption: 'Reduz o consumo de deutério em todas as naves',
                    increasedCargoRecyclersPathfinders: 'Aumenta a capacidade dos recicladores e exploradoras',
                    additionalCombatResearchLevels: 'Níveis adicionais nas pesquisas de combate',
                    additionalFleetSlots: 'Slots adicionais para frota',
                    additionalMoonFields: 'Campos adicionais nas luas',
                },

                classBonus: 'Bónus da Classe',
                bonus: 'Bónus',
                baseValue: 'Valor Base',
                valueWithBonuses: 'Valor com Bónus',
            },
        },
    },
};