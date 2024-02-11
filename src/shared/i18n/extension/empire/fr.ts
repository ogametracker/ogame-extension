import { LifeformDiscoveryEventArtifactFindingSize } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize";
import { LifeformDiscoveryEventType } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType";
import { EmpireTranslations } from "./type";
import { RecursivePartial } from "@/shared/types/RecursivePartial";

export const fr: RecursivePartial<EmpireTranslations> = {
    header: 'Empire',
    planet: 'Planète',
    production: {
        header: 'Production',
        subHeaders: {
            resourceProduction: 'Production de ressources',
            mineOverview: 'Vue d\'ensemble des mines',
        },
        averagePerHour: '⌀ par heure',
        totalPerHour: 'total par heure',
        totalPerDay: 'total par jour',
        totalPerWeek: 'total par semaine',
        activeProductionSettings: 'Paramètres de production actifs',
        messageProduction100: 'Les valeurs affichées se réfèrent à un facteur de production de 100% et ne tiennent pas compte du manque d\'énergie.',

        mines: {
            crawlersAvailable: 'disponibles',
            crawlersToReachLimit: count => `${count} foreuses pour le bonus maximum`,
        },
        items: 'Objets actifs',
        breakdown: {
            basicIncome: 'Revenu de base',
            mineProduction: 'Production de mine',
            consumption: 'Consommation',
            lifeformBuildings: 'Bâtiments formes de vie',
            crawlers: 'Foreuses',
            items: 'Objets',
            geologist: 'Géologue',
            commandStaff: 'Conseil d\'officiers',
            playerClass: 'Classe de joueur',
            allianceClass: 'Classe d\'alliance',
            lifeformTechnologies: 'Technologies formes de vie',
        },

        settings: {
            reset: 'Réinitialiser',
            header: 'Paramètres de production',
            applyAndClose: 'Appliquer et fermer les paramètres de production',
        },
    },
    amortization: {
        header: 'Amortissement',

        table: {
            cost: 'Coût',
            levels: 'Niveaux',
            productionPlus: 'Production en plus',
            amortizationTime: 'Temps d\'amortissement',
            groupSelectedItems: 'Regrouper les objets sélectionnés',
            showOriginalItems: 'Afficher tous les objets individuellement',

            levelsOnPlanets: (levels, planets) => `${levels} ${levels == 1 ? 'niveau' : 'niveaux'} sur ${planets} ${planets == 1 ? 'planète' : 'planètes'}`,
        },

        settings: {
            header: 'Paramètres',
            applyAndClose: 'Appliquer les paramètres et fermer',

            includeSettings: {
                header: 'Inclure dans le calcul',

                mines: 'Mines',
                expeditions: 'Expéditions',
                expeditionsRequirement: 'Remarque : Nécessite "Recherche des formes de vie" et/ou "Astrophysique" activée',
                astrophysicsAndColony: 'Astrophysique et nouvelles colonies',
                astrophysicsPerformanceNote: 'Remarque : Intensif en calcul, affectera considérablement les performances',
            },
            playerSettings: {
                header: 'Paramètres généraux',
                optimizeForResources: 'Optimiser pour les ressources sélectionnées',
                officers: 'Officiers',
                playerClass: 'Classe de joueur',
                allianceClass: 'Classe d\'alliance',
                currentLevelOf: (name: string) => `Niveau actuel de ${name}`,
                lifeformLevels: 'Niveaux de la forme de vie',

                unusedRaidColonySlots: 'Emplacements de colonie à réserver pour le raid ("volante")',
            },
            astrophysicsSettings: {
                header: (name: string) => `Paramètres ${name}`,
                newColony: 'Nouvelle colonie',
            },
            planetSettings: {
                header: 'Paramètres de la planète',

                global: {
                    deselectItems: 'Désélectionner tous les éléments',
                    ignoreInactiveLifeformTechnologySlots: 'Ignorer les emplacements inactifs des technologies forme de vie pour toutes les planètes',
                    deselectAllPlanets: 'Désélectionner toutes les planètes',
                },

                includeInResult: 'Inclure dans le calcul',
                position: 'Position',
                maxTemperature: 'Température max',
                activeItems: 'Objets actifs',
                crawlers: {
                    title: 'Foreuses',
                    percentage: '% Production',
                    fixCount: 'Compte fixe',
                    maxCount: 'Compte max',
                },
                mines: 'Niveaux actuels des mines',

                lifeform: 'Forme de vie',
                lifeformSettings: 'Paramètres de la forme de vie',
                relevantLifeformBuildings: 'Bâtiments pertinents de la forme de vie',
                lifeformTechnologies: 'Technologies de la forme de vie',
                ignoreEmptySlots: 'Ignorer les emplacements inactifs',
            },
            expeditionSettings: {
                header: 'Paramètres d\'expédition',
                averageWavesPerDay: '⌀ Vagues par jour',
                items: 'Objets d\'expédition',
                averageExpeditionsPerDay: '⌀ Expéditions par jour',
                shipUnitFactors: 'Facteurs d\'unité de ressources des vaisseaux',
                topPlayerScore: 'Score du meilleur joueur',
            },
        },

        info: {
            generatingItems: 'Calcul des prochains meilleurs investissements',

            slowCalculation: 'Le calcul d\'amortissement est devenu assez lent maintenant qu\'il inclut les bâtiments et technologies formes de vie. Cela devrait être amélioré à l\'avenir.',
            ctrlClick: 'Ctrl + Clic sur une case pour (dé)sélectionner tous les éléments jusqu\'à celui sélectionné.',
        },

        saveLoad: {
            saveButton: 'Enregistrer les résultats d\'amortissement calculés',
            loadButton: (date: string) => `Charger la sauvegarde (${date})`,
            loadedSave: (date: string, hiddenItems: string) => `Affichage des résultats sauvegardés (${date}) - ${hiddenItems} lignes masquées`,
            abandonedPlanet: 'Planète abandonnée',
        },

        generateItems: value => `${value} entrées`,
    },
    lifeforms: {
        header: 'Formes de vie',
        subHeaders: {
            overview: 'Vue d\'ensemble',
            progress: 'Progression',
            discoveryMissions: 'Missions de découverte',

            discoveryResults: 'Résultats',
            experience: 'Expérience',
            researchBonuses: 'Bonus de recherche globaux',
            planetBonuses: 'Bonus de planète effectifs',
        },

        planet: 'Planète',
        lifeform: 'Forme de vie',
        buildings: 'Bâtiments forme de vie',
        technologies: 'Technologies forme de vie',
        tier: 'Tier',
        level: 'Niveau',
        totalLifeformExperience: 'Expérience totale de la forme de vie',
        discoveryDateUnknown: 'Inconnue',
        notDiscoveredYet: 'Pas encore découverte',
        discoveryMissions: 'Missions de découverte',
        eventTypes: {
            [LifeformDiscoveryEventType.nothing]: 'Aucune découverte',
            [LifeformDiscoveryEventType.lostShip]: 'Vaisseau d\'exploration perdu',
            [LifeformDiscoveryEventType.newLifeformFound]: 'Nouvelle forme de vie',
            [LifeformDiscoveryEventType.knownLifeformFound]: 'Expérience de la forme de vie',
            [LifeformDiscoveryEventType.artifacts]: 'Artéfacts trouvés',
        },
        artifactFindingSizes: {
            [LifeformDiscoveryEventArtifactFindingSize.small]: 'Découverte commune',
            [LifeformDiscoveryEventArtifactFindingSize.medium]: 'Découverte importante',
            [LifeformDiscoveryEventArtifactFindingSize.large]: 'Découverte énorme',
            [LifeformDiscoveryEventArtifactFindingSize.storageFull]: 'Stockage plein',
        },
        lifeformFound: 'Forme de vie trouvée',
        alwaysAvailable: 'Toujours disponible',
        artifacts: 'Artéfacts',

        experiencePoints: 'Points d\'expérience',
        discoveredOn: 'Forme de vie découverte le',
        numberOfLifeformDiscoveries: 'Nombre de découvertes de formes de vie',

        globalResearchBonus: 'Bonus de recherche global',

        researchBonuses: {
            breakdown: {
                slot: 'Emplacement',
                research: 'Recherche',
                bonus: 'Bonus',
                lifeformBuildingsBoost: (boost: string) => `Amélioration des bâtiments de la forme de vie (${boost})`,
                lifeformLevelBoost: (lifeform: string, boost: string) => `Amélioration du niveau de la forme de vie (${lifeform} : ${boost})`,
                bugBoost: 'Bonus causé par des bugs',
            },
            production: {
                header: 'Production de ressources',
            },
            expeditionFinds: {
                header: 'Découvertes d\'expédition',
                resources: 'Ressources',
                ships: 'Vaisseaux',
                fleetLoss: 'Pertes de flotte',
            },
            expeditionSpeed: {
                header: 'Vitesse d\'arrivée en expédition',
                bonus: 'Bonus de vitesse',
            },
            ships: {
                header: 'Vaisseaux',
                armor: 'Armure',
                shield: 'Bouclier',
                damage: 'Dégâts',
                cargo: 'Fret',
                speed: 'Vitesse',
            },
            defenses: {
                header: 'Défenses',
            },
            fuelConsumption: {
                header: 'Consommation de carburant',
            },
            fuelReturn: {
                header: 'Retour de carburant lors du rappel',
                bonus: 'Retour de carburant',
            },
            buildingCostTime: {
                header: 'Coût et temps de construction',
                cost: 'Coût',
                time: 'Temps',
            },
            researchCostTime: {
                header: 'Coût et temps de recherche',
                researches: 'Recherches',
                lifeformResearches: 'Recherches forme de vie',
            },
            crawlers: {
                header: 'Foreuses',
                productionBonus: 'Production de ressources',
                energyConsumption: 'Consommation d\'énergie',
            },
            denCapacity: {
                header: 'Capacité de la cachette',
            },
            phalanxRange: {
                header: 'Portée de la phalange',
            },
            discoveryMissions: {
                header: 'Vitesse des missions de découverte',
            },
            playerClasses: {
                header: 'Classes de joueur',

                collector: {
                    productionBonus: 'Augmentation de la production des mines',
                    energyProductionBonus: 'Augmentation de la production d\'énergie',
                    transporterSpeedBonus: 'Bonus de vitesse pour les transporteurs',
                    transporterCargoBonus: 'Bonus de cargo pour les transporteurs',
                    crawlerProductionBonus: 'Bonus de production des foreuses',
                    geologistCrawlerAmountBonus: 'Bonus de foreuses utilisables avec le géologue',
                },
                discoverer: {
                    researchDuration: 'Durée des recherches',
                    increasedExpeditionFinds: 'Gain accru lors des expéditions',
                    largerPlanets: 'Planètes plus grandes lors de la colonisation',
                    additionalExpeditionSlots: 'Slot d\'expédition supplémentaires',
                    reducedExpeditionCombatChance: 'Réduction du risque de combats lors des expéditions',
                    phalanxRange: 'Augmentation de la portée de la phalange',
                },
                general: {
                    combatShipSpeed: 'Bonus de vitesse des vaisseaux de combat',
                    recyclerSpeed: 'Bonus de vitesse des recycleurs',
                    fuelConsumption: 'Consommation de carburant pour tous les vaisseaux',
                    increasedCargoRecyclersPathfinders: 'Augmentation de la capacité de charge des recycleurs/éclaireurs',
                    additionalCombatResearchLevels: 'Niveaux des recherches de combat supplémentaires',
                    additionalFleetSlots: 'Flottes supplémentaires',
                    additionalMoonFields: 'Champs de lune supplémentaires',
                },

                classBonus: 'Bonus de classe',
                bonus: 'Bonus',
                baseValue: 'Valeur de base',
                valueWithBonuses: 'Valeur avec bonus',
            },
        },
        planetBonuses: {
            resourceProduction: {
                header: 'Production de ressources',
            },
            lifeformResearchCostTime: {
                header: 'Coût et temps de recherche des formes de vie',
            },
            wreckfield: {
                header: 'Champ de débris',
            },
        },

        topFinds: {
            topFinds: 'Meilleures découvertes',
            worstFinds: 'Pires découvertes',

            size: 'Taille',
            amount: 'Quantité',
            date: 'Date',
            artifacts: 'Artéfacts',
            experience: 'Expérience',
        },
    },
};
