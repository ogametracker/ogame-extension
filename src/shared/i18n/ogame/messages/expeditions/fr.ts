import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const fr: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*'Votre expédition a */'réussi à collecter de l`antimatière'/* et à la conserver.'*/,
            /*'Nous avons */'trouvé l’épave d’un vaisseau extra-terrestre'/* avec à son bord un récipient contenant de l’antimatière !'*/,
            /*'Nous avons */'rencontré un alien assez bizarre'/* qui voyageait à bord d`un petit vaisseau. En échange de quelques simples calculs mathématiques, il nous a cédé un récipient contenant de l`antimatière.'*/,
            /*'Notre expédition a rencontré un */'vaisseau fantôme qui transportait un peu d`antimatière'/* . Nous ne savons pas ce qui est arrivé à l`équipage de ce vaisseau, mais nous avons réussi à récupérer l`antimatière qui se trouvait à bord.'*/,
            /*'L`expédition a été attirée par des */'signaux bizarres et a découvert un astéroïde'/* , dont le noyau contenait de l`antimatière. L`astéroïde se trouve désormais à bord de notre vaisseau et nos chercheurs sont en train d`essayer d`en extraire l`antimatière.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Notre */'expédition a réussi une expérience unique'/* . Les chercheurs ont réussi à gagner de l`antimatière à partir du matériel projeté par une supernova.'*/,
            /*'Notre expédition a */'découvert une vielle station orbitale qui apparemment'/* navigue dans l`espace abandonnée depuis longtemps. La station est inutilisable, mais il y avait encore de l`antimatière stockée dans ses réacteurs. Nos techniciens essayent de récupérer autant d`antimatière qu`ils peuvent.'*/,
            /*'Notre expédition nous signale un phénomène spectral assez surprenant. Il a */'provoqué la formation d`antimatière dans les réservoirs d`énergie'/* de la protection de nos vaisseaux. Nos techniciens essaient de conserver un maximum d`antimatière tant que le phénomène perdure.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: fr 'Eine */'spontane Hyperraumverzerrung'/* hat es deiner Expedition ermöglicht, eine große Menge dunkler Materie sicherzustellen!'*/,
            /*'Notre expédition nous a signalé un contact quelque peu particulier. Apparemment des créatures énergétiques, qui se */'sont présentées sous le nom de légoriens'/* , ont traversé les vaisseaux de l`expédition et ont décidé d`aider l`espèce sous-développée que nous sommes - un récipient contenant de l`antimatière est apparu dans le poste de commande de nos vaisseaux.'*/,
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
            /*'Une */'ceinture de minerai autour d`une planète'/* jusque là inconnue vous a procuré des tonnes de matières premiÈres. Vos soutes sont pleines à craquer !'*/,
            /*'Votre flotte d`expédition vous informe */'qu`elle a découvert l`épave d`un vaisseau alien'/* . Vos chercheurs n`ont pas su utiliser les technologies de ce vaisseau, par contre il a pû être démantelé, vous procurant un nombre important de ressources.'*/,
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
            /*'Nous avons */'retrouvé les restes d`une armada'/* . Les techniciens se sont immédiatement rendus sur les vaisseaux les mieux conservés et essaient de les remettre en état.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Nous avons */'découvert un immense cimetière de vaisseaux'/* . Nos techniciens ont réussi à remettre quelques vaisseaux en état.'*/,
            /*'Nous avons */'découvert une planète avec les restes d`une civilisation'/* . Depuis l`orbite, nous avons pu découvrir une aire intacte de stationnement de vaisseaux. Nos techniciens et des pilotes se sont rendus à la surface de cette planète pour vérifier ce que valent les vaisseaux stationnés.'*/,
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
        regex: /L`objet (?<name>.+) a été ajouté à l`inventaire/i,
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

    logbookRegex: /(Extrait du journal de bord d`un officier de communication|Message du carnet de bord d`un officier de communication|Extrait du carnet de bord d`un officier de communication)\s*:(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'Cette */'partie de l`univers n`a apparemment encore'/* jamais été explorée.'*/,
            /*'C`est un sentiment assez */'unique de se savoir le premier à explorer'/* ce coin perdu de la galaxie. '*/,
        ],
        [ExpeditionDepletionLevel.low]: [
            /*'Il semblerait que personne */'ne soit jamais venu jusqu`à ce coin reculé'/* de la galaxie.'*/,
            /*'Nous avons */'découvert de très vieilles traces d`autres vaisseaux'/* , nous ne sommes donc pas les premiers à venir ici. '*/,
            /*'Nous avons failli entrer en */'collision avec une autre flotte d`expédition'/* . Je ne pensais pas qu`il y avait d`autres expéditions qui traînaient par ici.'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*'Nous avons fêté la fin de notre expédition avec l`équipage d`une autre flotte d`expédition qui se trouvait dans le même secteur que nous. Eux */'non plus n`avaient rien découvert d`extraordinaire',
            /*'Nous avons */'découvert des signes indiquant la présence d`autres flottes'/* d`expédition dans ce secteur.'*/,
            /*'Nous avons établi un */'contact radio amical avec d`autres flottes d`expédition'/* dans ce secteur.'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /*LOCA: fr 'Wenn wir uns zu unsicher fühlen, können wir uns ja */'mit all den anderen Expeditionen'/*, die hier herum fliegen, zusammen tun.'*/,
            /*'Si cela continue comme ca, vu le trafic qu`il y a ici, */'il va falloir songer à installer des feux de signalisation',
            /*'Il serait peut être plus */'judicieux d`installer une stèle du souvenir'/* à cet endroit plutôt que de continuer d`y envoyer des expéditions.'*/,
        ],
    },
};