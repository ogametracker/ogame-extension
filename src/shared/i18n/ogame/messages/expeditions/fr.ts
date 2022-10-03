import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const fr: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*LOCA: fr 'Der Expedition ist es gelungen, */'ein wenig Dunkle Materie einzufangen'/* und zu konservieren.'*/,
            /*'Nous avons */'trouvé l’épave d’un vaisseau extra-terrestre'/* avec à son bord un récipient contenant de l’antimatière !'*/,
            /*LOCA: fr 'Wir trafen auf ein */'seltsames Alien an Bord eines kleinen Schiffes'/*, das uns im Austausch für ein paar simple, mathematische Berechnungen einen kleinen Behälter mit Dunkler Materie überließ.'*/,
            /*'Notre expédition a rencontré un */'vaisseau fantôme qui transportait un peu d`antimatière'/* . Nous ne savons pas ce qui est arrivé à l`équipage de ce vaisseau, mais nous avons réussi à récupérer l`antimatière qui se trouvait à bord.'*/,
            /*'L`expédition a été attirée par des */'signaux bizarres et a découvert un astéroïde'/* , dont le noyau contenait de l`antimatière. L`astéroïde se trouve désormais à bord de notre vaisseau et nos chercheurs sont en train d`essayer d`en extraire l`antimatière.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*LOCA: fr 'Unserer Expedition ist */'ein einmaliges Experiment gelungen'/*:'*/,
            /*LOCA: fr 'Unsere Expedition hat eine */'uralte Raumstation gefunden'/*, die wohl schon seit langer Zeit unkontrolliert durch das All schwebt. Die Station selbst war komplett unbrauchbar, jedoch lagerte in einem ihrer Reaktoren noch ein wenig Dunkler Materie. Unsere Techniker versuchen, so viel wie möglich davon zu bergen.'*/,
            /*LOCA: fr 'Unsere Expedition meldet ein seltsames spektrales Phänomen. Dies führte unter anderem dazu, dass sich in den */'Energiespeichern der Schiffsschilde Dunkle Materie'/* bildete. Unsere Techniker versuchen nun, solange das Phänomen noch anhält, möglichst viel dieser Dunklen Materie zu konservieren.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: fr 'Eine */'spontane Hyperraumverzerrung'/* hat es deiner Expedition ermöglicht, eine große Menge dunkler Materie sicherzustellen!'*/,
            /*LOCA: fr 'Unsere Expedition meldet einen ersten Kontakt der besonderen Art. Anscheinend hat */'eine Energiekreatur, die sich Legorianer nannte'/*, die Schiffe der Expedition durchflogen und dann beschlossen, der unterentwickelten Spezies ein wenig auszuhelfen - es materialisierte sich ein Behälter mit dunkler Materie an Bord der Brücke!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`L\`attaquant obtient (?<name>${darkMatter}) (?<amount>[^\\s]+)`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'Votre expédition a */'découvert un champ d`astéroides duquel'/* elle a pû extraire un certain nombre de ressources.'*/,
            /*'Sur cette planète complètement isolée, nos chercheurs */'ont découvert des champs de ressources facilement exploitables'/* et ont pû collecter un nombre non négligeable de matières premières.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Votre expédition a trouvé un vieux */'convoi de transporteurs abandonnés remplis de ressources'/* . Elle a pu en récupérer une partie.'*/,
            /*'Votre expédition a */'découvert des ressources en quantité importantes'/* sur une lune possédant sa propre atmosphère. Vos équipes au sol sont en train de récupérer ces trésors de la nature.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: fr 'Ein */'Mineraliengürtel um einen unbekannten Planeten'/* enthielt Unmengen an Rohstoffen. Die Expeditionsflotte meldet volle Lager!'*/,
            /*LOCA: fr 'Deine Expeditionsflotte meldet den */'Fund eines riesigen Alien-Schiffswracks'/*. Mit der Technologie konnten sie zwar nichts anfangen, aber das Schiff ließ sich in seine Einzelteile zerlegen, wodurch man wertvolle Rohstoffe gewinnen konnte.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`L\`attaquant obtient (?<name>${resources.join('|')}) (?<amount>.+)`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*'Nous avons retrouvé les */'restes d`une expédition précédente'/* . Nos techniciens sont en train de vérifier si nous pouvons sauver quelques vaisseaux.'*/,
            /*'Votre expédition a */'découvert une forteresse stellaire'/* , qui doit être abandonnée depuis très longtemps. Les techniciens ont découvert quelques vaisseaux dans les hangars et essaient de les remettre en marche.'*/,
            /*'Notre expédition a */'découvert une planète que des guerres interminables'/* ont plus ou moins complètement détruite. Nous avons découvert beaucoup d`épaves de vaisseaux dans l`orbite de cette planète. Nos techniciens essaient d`en réparer quelques-unes. Peut-être saurons nous ainsi ce qui s`est passé ici.'*/,
            /*'Nous avons */'découvert une base de pirates abandonnée'/* . Il y a encore des vaisseaux dans les hangars. Nos techniciens sont en train de vérifier si nous pouvons en utiliser certains à nos fins.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Notre expédition a */'découvert un chantier spatial automatisé'/* . Il y a encore quelques vaisseaux en production, nos techniciens essaient de rétablir l`alimentation en énergie du chantier.'*/,
            /*LOCA: fr 'Wir haben die */'Reste einer Armada'/* gefunden. Die Techniker der Expeditionsflotte haben sich sofort auf die halbwegs intakten Schiffe begeben und versuchen, diese wieder instand zu setzen.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: fr 'Wir haben einen */'riesigen Raumschiffsfriedhof'/* gefunden. Einigen Technikern der Expeditionsflotte ist es gelungen, das ein oder andere Schiff wieder in Betrieb zu nehmen.'*/,
            /*LOCA: fr 'Wir haben einen Planeten mit */'Resten einer Zivilisation'/* entdeckt.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`Votre flotte s\`est agrandie, voici les nouveaux vaisseaux qui s\`y sont joints\\s*:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
    },

    [ExpeditionEventType.nothing]: [
        /*'Malgré un scan du secteur assez prometteur, */'l`expédition revient les mains et les soutes vides'/* .'*/,
        /*'Mis à part quelques */'petits animaux provenant d`une planète marécageuse'/* jusque là inconnue, votre expédition ne ramène rien de spécial'*/,
        /*'Votre expédition */'a découvert... le vide'/*. Pas de météorite, aucune radiation, aucune particule, il n`y avait rien qui aurait pu être utile pour votre expédition.'*/,
        /*'Une */'forme de vie composée d`énergie pure'/* a plongé pendant des jours tous les membres de votre expédition dans une hypnose profonde en diffusant un motif hypnotique sur les écrans des ordinateurs de bord. Lorsque la plupart d`entre eux sont enfin sortis de cet état second, les réserves de deutérium étaient si basses que l`expédition a dû être interrompue.'*/,
        /*'Un */'problème de réacteur a failli détruire toute l`expédition'/*. Heureusement que les techniciens ont fait du bon travail et ont pu éviter le pire. La réparation a cependant pris beaucoup de temps et l`expédition revient donc sans résultat aucun.'*/,
        /*'Votre expédition a */'fait de superbes images d`une supernova'/* . Mis à part, aucune information vraiment passionnante, mais votre photographe a de bonnes chances de remporter le Prix Meilleur Image de l`univers de l`année.'*/,
        /*'Votre expédition a */'suivi la trace de signaux bizarres'/* . Apparemment, ces signaux provenaient d`une très vielle sonde lancée dans l`espace il y a plusieurs générations pour envoyer un message à des espèces inconnues. La sonde a été récupérée, plusieurs musées de la planète-mère sont déjà intéressés pour l`exposer.'*/,
        /*'Bien, nous savons désormais que les */'anomalies de classe 5 ne causent pas seulement'/* un chaos total dans les systèmes de vos vaisseaux, mais qu`elles ont aussi un effet hallucinogène sur l`équipage. En dehors de cette constatation, cette expédition ne nous a pas apporté grand chose.'*/,
        /*'Votre flotte d`expédition a eu chaud, elle s`est en effet */'retrouvée dans le champ de gravité d`une étoile à neutrons'/* et a mis beaucoup de temps à s`en libérer. Ceci a coûté énormément de deutérium et la flotte d`expédition revient donc sans aucun résultat.'*/,
        /*'Un */'virus informatique a fait planter votre système de navigation'/* peu après que vous ayez quitté votre système solaire. Du coup, votre flotte a tourné en rond, inutile de préciser que cette expédition n`a donc fourni aucun résultat intéressant.'*/,
        /*'Nous n`aurions peut-être pas dû */'fêter l`anniversaire du capitaine sur cette planète isolée'/* . L`équipage a contracté une espèce de paludisme qui a envoyé une bonne partie de l`équipage à l`infirmerie. Ce manque de personnel inattendu à fait échouer la mission.'*/,
        /*'Quelqu`un a installé un */'jeu de stratégie sur les ordinateurs de bord'/* de votre expédition. Du coup, la flotte a fait un long voyage, mais sans résultat aucun.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*'L`expédition nous a envoyé des clichés extrêmement précis et */'détaillés d`un trou noir en cours de formation'/* . Malheureusement, peu après, nous avons perdu le contact avec notre flotte'*/,
        /*'Voici le */'dernier signe de vie de l`expédition'/* : ZZZrrt Oh mon dieu ! krrzrzzzt Cela zrrrtrzt ressemble krgzzz à un krzzzzzzzzz....'*/,
        /*'Un incident dans le noyau atomique d`un des vaisseaux a provoqué une réaction en chaîne, détruisant */'toute l`expédition dans une explosion immense et spectaculaire'/* .'*/,
        /*'Notre flotte d`expédition a */'disparu après être passé en mode hyperespace'/* et n`est jamais réapparue. Nos scientifiques n`ont aucune idée de ce qui a pu se passer, mais la flotte semble perdue.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*'Votre expédition a eu un */'bref contact avec une espèce alien visiblement très timide'/* . Ils vous ont annoncé qu`ils enverraient dans votre empire un représentant chargé de ressources à échanger.'*/,
        /*'Votre flotte d`expédition a */'recueilli un signal d`urgence'/* . Il s`agissait d`un supertransporteur pris dans le fort champ de gravité d`une planète hostile. Après que vous l`ayez aidé à libérer son vaisseau du champ, le capitaine du supertransporteur vous annonce qu`il vous ajoute dans sa liste de clients privilégiés.'*/,
    ],

    [ExpeditionEventType.early]: [
        /*'Un petit */'défaut dans les réacteurs de votre flotte l`a fait voyager'/* à une vitesse supérieure à la vitesse normale, ce qui fait que votre flotte rentre avec un peu d`avance sur ce qui était initialement prévu. A part cela, vos chercheurs n`ont rien découvert de spécial.'*/,
        /*'Votre expédition ne signale aucune particularité dans le secteur exploré. Au retour, votre */'flotte a été poussée par un vent solaire'/* , lui permettant ainsi de rentrer à bon port avec un peu d`avance.'*/,
        /*'Votre nouveau */'commandant de bord étant assez courageux'/* , il a utilisé une irrégularité dans l`espace pour accélérer son retour. Il a réussi, mais pour le reste, l`expédition rentre bredouille.'*/,
    ],

    [ExpeditionEventType.delay]: [
        /*'Une erreur de calcul de votre officier de navigation vous a */'fait faire un saut vers une destination complètement erronée'/* , retardant ainsi le retour de votre flotte.'*/,
        /*'Votre expédition a dû */'faire face à plusieurs vents de particule'/* . Du coup, les systèmes d`énergie ont surchauffé, causant des pannes importantes sur les systèmes principaux de vos vaisseaux. Les mécaniciens ont pu éviter le pire, cependant votre flotte reviendra avec un retard assez conséquent.'*/,
        /*'Pour une raison inconnue, le saut spatial a complètement raté, */'l`expédition a failli se retrouver au centre d`un soleil'/*, ce qui aurait entraîné sa perte. Heureusement, elle s`est retrouvée dans un système solaire connu, mais le voyage du retour dure plus longtemps qu`initialement prévu.'*/,
        /*'Le */'vent solaire causé par une supernova'/* a complètement faussé le saut spatial de votre expédition, il a donc fallu plus de temps pour effectuer les calculs nécessaires au saut pour rentrer à domicile. Cette fausse route est d`ailleurs le seul résultat notable de votre expédition.'*/,
        /*'Votre */'module de navigation semble avoir quelques soucis'/* , malgré une phase de test approfondie, il reste un certain nombre de bugs inexplicables et inexpliqués. Non seulement le saut spatial a eu lieu dans la mauvaise direction, mais tout le deutérium a été consommé, et votre flotte n`est arrivée que peu derrière la lune de la planète de départ. Les réservoirs étant vides, la flotte va devoir rentrer avec l`aide des générateurs de secours, causant ainsi un retard important par rapport à la date de retour initialement prévue.'*/,
        /*'Un de vos */'vaisseaux est entré en collision avec un vaisseau inconnu'/* qui a foncé dans votre convoi sans aucune raison apparente. Le vaisseau inconnu a explosé, causant de sérieux dommages à vos vaisseaux. Dès les réparations d`urgence achevées, votre flotte fera demi-tour, l`expédition ne pouvant être continuée avec des vaisseaux dans cet état.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /*LOCA: fr *//Ein (?<name>.+) wurde dem Inventar hinzugefügt/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*'Quelques */'pirates, apparemment complètement désespérés'/* , ont tenté d`attaquer notre flotte d`expédition.'*/,
            /*'Des */'barbares primitifs nous attaquent avec des vaisseaux'/* qui n`ont même pas mérité le nom "vaisseau", tellement ils sont ridicules. Si ces attaques continuent, nous nous verrons obligés de riposter.'*/,
            /*'Nous avons capté des */'messages provenant de pirates fortement alcoolisés'/* . Apparemment, ils veulent nous détrousser.'*/,
            /*'Nous */'avons dû nous défendre contre des pirates'/* , heureusement qu`ils n`étaient pas trop nombreux.'*/,
            /*LOCA: fr 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Votre flotte d`expédition a fait */'une rencontre fort peu agréable avec des pirates'/* de l`espace.'*/,
            /*'Nous sommes tombés */'dans un piège tendu par des pirates de l`espace'/* ! Le combat n`a pû être évité.'*/,
            /*'Le message de */'secours était en fait un guet-apens'/* , le combat avec les pirates était inévitable.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Les signaux que nous ne pouvions identifier ne provenaient pas d`une espèce */'inconnue mais d`une base de pirates secrète'/* ! Ils n`ont apparemment pas vraiment été ravis de découvrir que nous étions dans leur secteur.'*/,
            /*'Votre flotte d`expédition nous */'signale de lourds combats avec une flotte de pirates'/* non identifiés.'*/,
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*'Des vaisseaux */'inconnus ont attaqué la flotte d`expédition'/* , sans avertissement et sans raison !'*/,
            /*'La flotte d`expédition a */'eu une rencontre peu amicale avec une espèce'/* inconnue'*/,
            /*'Notre expédition a été */'attaquée par un petit groupe de vaisseaux'/* inconnus !'*/,
            /*LOCA: fr 'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Une */'espèce inconnue attaque notre expédition'/* !'*/,
            /*'Votre */'flotte d`expédition a manifestement enfreint les espaces territoriaux'/* d`une espèce inconnue jusqu`à présent mais qui semble extrêmement agressive.'*/,
            /*'Nous avons */'perdu temporairement le contact avec notre flotte d`expédition'/* . Si nous avons déchiffré correctement le dernier message, la flotte est en train d`être attaquée - les agresseurs n`ont pas pu être identifiés.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Votre mission d`expédition a */'rencontré une flotte d`invasion alien'/* et vous annonce qu`elle est engagée dans un combat féroce.'*/,
            /*'Nous avons rencontré */'quelques difficultés à prononcer correctement ce dialecte'/* extraterrestre et notre diplomate a crié "faisons feu !" au lieu de "faisons la paix !"'*/,
            /*'Une flotte de */'vaisseaux cristallins va entrer en collision'/* avec notre flotte d`expédition d`ici peu. Nous devons nous préparer au pire.'*/,
        ],
    },

    logbookRegex: /Extrait du journal de bord d`un officier de communication\s*:(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'Cette */'partie de l`univers n`a apparemment encore'/* jamais été explorée.'*/,
            /*'C`est un sentiment assez */'unique de se savoir le premier à explorer'/* ce coin perdu de la galaxie. '*/,
        ],
        [ExpeditionDepletionLevel.low]: [
            /*LOCA: fr 'Es scheint nicht so, als ob */'jemals ein Mensch in diesem Bereich der Galaxis'/* gewesen wäre.'*/,
            /*'Nous avons */'découvert de très vieilles traces d`autres vaisseaux'/* , nous ne sommes donc pas les premiers à venir ici. '*/,
            /*'Nous avons failli entrer en */'collision avec une autre flotte d`expédition'/* . Je ne pensais pas qu`il y avait d`autres expéditions qui traînaient par ici.'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*LOCA: fr 'Wir haben den Abschluss der Expedition mit den Crewmitgliedern einer zweiten Expeditionsflotte, die im selben Sektor unterwegs war, gefeiert. */'Die haben auch nichts Spannendes zu berichten',
            /*LOCA: fr 'Es wurden */'Anzeichen für die Präsenz anderer Expeditionsflotten'/* gefunden.'*/,
            /*LOCA: fr 'Es wurde */'friedlicher Funkkontakt zu einigen anderen Expeditionen'/* in diesem Sektor hergestellt.'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /*LOCA: fr 'Wenn wir uns zu unsicher fühlen, können wir uns ja */'mit all den anderen Expeditionen'/*, die hier herum fliegen, zusammen tun.'*/,
        ],
    },
};