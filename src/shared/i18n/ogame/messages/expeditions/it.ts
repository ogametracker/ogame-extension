import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const it: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*'La spedizione è stata in */'grado di catturare e conservare della Materia Oscura',
            /*'Abbiamo */'trovato i resti di una nave aliena'/*. Nella stiva vi era un piccolo container con della Materia Oscura!'*/,
            /*TODO: it 'Wir trafen auf ein */'seltsames Alien an Bord eines kleinen Schiffes'/*, das uns im Austausch für ein paar simple, mathematische Berechnungen einen kleinen Behälter mit Dunkler Materie überließ.'*/,
            /*'La nostra spedizione si è imbattuta in una */'nave fantasma che trasportava un piccolo carico di Materia Oscura'/*. Non abbiamo scoperto cosa possa essere successo all`equipaggio della nave, ma i nostri tecnici sono stati in grado di recuperare la Materia Oscura.'*/,
            /*'La spedizione ha seguito alcuni */'deboli segnali e ha trovato un asteroide'/*. Nel cuore dell`asteroide era racchiusa una piccola quantità di Materia Oscura. L`asteroide è stato rimorchiato e successivamente la Materia Oscura è stata estratta.'*/,
            /*wtf? :D*/ /*'Durante la nostra spedizione */'odierna siamo passati vicini ad un pianeta intorno al quale carcasse'/* di navi distrutte, e uno sciame di meteore restavano a testimoniare una recente e catastrofica battaglia. Dalla superficie del pianeta proveniva un segnale che non siamo riusciti a decifrare molto bene, spero che non ci sia un guasto ai nostri sofisticati sistemi di comunicazione... Con il caro deuterio, il mutuo per acquistare la morte nera, l`ipoteca sulle navi da battaglia per pagare gli stipendi ai vostri ufficiali, non ci potremmo permettere di sostituire il walkie talkie attuale con uno nuovo... Comunque i nostri tecnici sono già al lavoro per verificare la cosa e credo che non sia il caso di tediarla oltre con i problemi economici del nostro impero, li conoscete senz`altro meglio di me. Ritornando al rapporto della nostra missione di esplorazione, questo è il messaggio che abbiamo intercettato: "@°[*+£ la mia flotta... @°[*+£ la mia luna (versi simili a urla di rabbia e pianti)". Poiché quei versi erano così strazianti abbiamo deciso di atterrare sul pianeta e portare aiuto agli abitanti del luogo. Qui abbiamo incontrato uno strano alieno, molto probabilmente l`imperatore di quello che un tempo era un piccolo ma prospero regno e che ora è un cumulo di macerie. Alla nostra richiesta di spiegarci cosa fosse accaduto, cosa avesse creato un disastro di proporzioni così immani, ci ha risposto che un marrano, che un codardo e vigliacco imperatore nemico aveva razziato i suoi pianeti e distrutto le sue flotte mentre lui si trovava altrove, a riposarsi su un noto pianeta di villeggiatura "Mondo Reale" assieme alla sua mezza dozzina di concubine. Mentre l`alieno ci raccontava queste cose, il nostro ufologo, grazie ai dati che gli inviavamo dalla superficie è riuscito a scoprire che l`alieno appartiene alla razza dei "Castori Minori" meglio nota come "Niubbus Rosikantes". Così provando una gran pena per la razza dell`alieno, prima di ripartire gli abbiamo donato un manualetto "OGame for Dummies" e gli abbiamo spiegato le leggi fisiche alla base del fleetsave; ci siamo rovinati e gli abbiamo lasciato anche un bignamino intitolato "Fleetsave: 1001 modi per non farsi piallare quando si va al bagno". L`alieno, visibilmente commosso dalla nostra generosità, per ringraziarci ci ha dato un cofanetto contenente un discreto quantitativo di Materia Oscura. Dalla nave ammiraglia "I love n00bs" passo e chiudo.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*TODO: it 'Unserer Expedition ist */'ein einmaliges Experiment gelungen'/*:'*/,
            /*TODO: it 'Unsere Expedition hat eine */'uralte Raumstation gefunden'/*, die wohl schon seit langer Zeit unkontrolliert durch das All schwebt. Die Station selbst war komplett unbrauchbar, jedoch lagerte in einem ihrer Reaktoren noch ein wenig Dunkler Materie. Unsere Techniker versuchen, so viel wie möglich davon zu bergen.'*/,
            /*'La nostra spedizione riporta un inusuale quanto spettacolare fenomeno. Questo ha portato della Materia Oscura ad */'accumularsi nelle riserve di energia per gli scudi'/* della nave. I nostri tecnici, finché il fenomeno è durato, hanno cercato di conservare tutta la Materia Oscura che potevano.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*TODO: it 'Eine */'spontane Hyperraumverzerrung'/* hat es deiner Expedition ermöglicht, eine große Menge dunkler Materie sicherzustellen!'*/,
            /*TODO: it 'Unsere Expedition meldet einen ersten Kontakt der besonderen Art. Anscheinend hat */'eine Energiekreatur, die sich Legorianer nannte'/*, die Schiffe der Expedition durchflogen und dann beschlossen, der unterentwickelten Spezies ein wenig auszuhelfen - es materialisierte sich ein Behälter mit dunkler Materie an Bord der Brücke!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`(?<name>${darkMatter}) (?<amount>[^\\s]+) è stato razziato`),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'La tua spedizione ha */'scoperto un piccolo asteroide'/* dal quale si sono potute estrarre alcune risorse'*/,
            /*'Su un */'planetoide isolato abbiamo trovato alcuni campi di risorse'/* facilmente accessibili e ne abbiamo raccolte alcune'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'La tua spedizione ha trovato un antico convoglio, */'deserto ma carico di risorse'/*. Alcune risorse sono state recuperate.'*/,
            /*'Su una piccola luna con la sua atmosfera, la tua spedizione ha trovato alcuni */'grandi giacimenti di risorse grezze'/*. L`equipaggio sta cercando di estrarre e caricare quel tesoro naturale.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Anelli */'di minerali in orbita attorno ad un pianeta'/* contenevano risorse incalcolabili. Le navi della spedizione stanno tornando e hanno le stive piene!'*/,
            /*'La tua spedizione si è */'imbattuta nel relitto di un`enorme nave aliena'/* . Non sono stati in grado di apprendere le loro tecnologie, ma sono riusciti a dividere la nave in varie parti e a trasformare i suoi componenti in utili risorse.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`(?<name>${resources.join('|')}) (?<amount>.+) è stato razziato`),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*'Ci siamo imbattuti nei */'resti di una precedente spedizione'/* ! I nostri tecnici stanno cercando di rimettere in funzione alcune navi.'*/,
            /*'La tua spedizione si è */'imbattuta in un avamposto abbandonato'/* da molto tempo. Nell`hangar dell`avamposto ci sono ancora alcune navi che i nostri tecnici stanno cercando di far volare.'*/,
            /*'La nostra spedizione ha trovato un pianeta che fu quasi */'completamente distrutto durante una serie di guerre'/*. Ci sono numerose navi abbandonate in orbita. I tecnici stanno cercando di ripararne alcune. Forse riusciremo ad ottenere anche informazioni su che cosa è accaduto.'*/,
            /*'Abbiamo */'trovato una stazione pirata deserta'/*. Ci sono alcune vecchie navi che giacciono nell`hangar. I nostri tecnici stanno cercando di capire se sono ancora utilizzabili o meno.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'La nostra spedizione si è imbattuta in un */'vecchio Cantiere Spaziale automatizzato'/* . Alcune navi sono ancora nella fase di produzione e i nostri tecnici stanno cercando di riattivare i generatori del cantiere'*/,
            /*'Abbiamo */'trovato i resti di un`armata'/*. I tecnici si sono diretti verso le navi più intatte e le hanno rimesse in funzione.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*TODO: it 'Wir haben einen */'riesigen Raumschiffsfriedhof'/* gefunden. Einigen Technikern der Expeditionsflotte ist es gelungen, das ein oder andere Schiff wieder in Betrieb zu nehmen.'*/,
            /*TODO: it 'Wir haben einen Planeten mit */'Resten einer Zivilisation'/* entdeckt.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`Le seguenti navi sono ora parte della flotta:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`),
    },

    [ExpeditionEventType.nothing]: [
        /*'Nonostante la prima scansione mostrasse questo settore ricco di risorse, */'sfortunatamente siamo tornati a mani vuote'/*.'*/,
        /*'Eccetto alcuni quaint, piccoli */'animali provenienti da uno sconosciuto pianeta paludoso'/*, la spedizione non ha portato nulla di interessante dal viaggio.'*/,
        /*'La tua spedizione si è */'imbattuta nel vuoto cosmico'/*. Non vi era nemmeno una particella di sodio, o qualsiasi altra cosa potesse rendere interessante la spedizione...'*/,
        /*'Una */'forma di vita di pura energia'/* ha fatto sì che tutti i membri della spedizione rimanessero ipnotizzati dai loro schermi. Fortunatamente alcuni sono riusciti a riprendere il controllo della propria mente appena in tempo per interrompere la missione e far ritorno con il poco deuterio rimasto.'*/,
        /*'Un */'problema al reattore della nave ammiraglia'/* ha quasi distrutto l`intera spedizione. Fortunatamente i tecnici erano molto più che competenti e sono riusciti ad evitare il peggio. La riparazione ha richiesto così tanto tempo che la spedizione è ritornata senza aver fatto nulla.'*/,
        /*'La tua spedizione ha */'fatto stupende fotografie di una supernova'/*. In realtà non possono essere tratte nuove informazioni da quelle immagini, ma ci sono buone probabilità di vincere il concorso "Miglior Immagine dell`Universo".'*/,
        /*'La tua flotta in */'esplorazione ha seguito alcuni deboli segnali'/* per un po` di tempo. Alla fine hanno notato che quei segnali erano inviati da un`antica sonda che era stata inviata alcune generazioni fa per dare il benvenuto a specie aliene. La sonda è stata recuperata e alcuni musei del tuo pianeta madre hanno già mostrato interesse.'*/,
        /*'Bene, ora sappiamo che le */'anomalie rosse di classe 5'/* non hanno solo effetti caotici sui sistemi delle navi, ma inducono anche allucinazioni nell`equipaggio. La spedizione non ha riportato altro.'*/,
        /*'La tua spedizione si è imbattuta nel campo */'gravitazionale di una stella di neutroni'/* e ha impiegato un po` di tempo per liberarsi. Per questo molto deuterio è stato usato e la spedizione ritorna indietro senza alcun risultato.'*/,
        /*'Uno */'strano virus per computer'/* ha intaccato il sistema di navigazione appena lasciato il sistema solare. Questo ha fatto sì che la flotta volasse in tondo tutto il tempo. Inutile dire che la spedizione non ha avuto successo...'*/,
        /*'Forse le */'celebrazioni per il compleanno del capitano'/* non si sarebbero dovute tenere su quel pianeta isolato. Una febbre malarica ha colpito gran parte dell`equipaggio costringendolo a cavalcare innumerevoli volte il bianco destriero. A causa della grave mancanza di personale dovuta alle interminabili code davanti ai bagni delle navi, la spedizione è stata annullata.'*/,
        /*'Qualcuno ha */'installato un antico gioco di strategia su tutti i computers'/* della nave. La flotta in esplorazione è rimasta via a lungo, ma non è stata molto produttiva poiché quasi tutto l`equipaggio non ha assolto ai suoi compiti...'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*'L`ultima cosa che ci è stata inviata dalla spedizione era una bellissima e */'ravvicinata fotografia di un buco nero'/* che si stava aprendo.'*/,
        /*'L`unica cosa che */'rimane dalla spedizione è il seguente radiogramma'/*: Zzzrrt Gosh! Krrrzzzzt Questo zrrrtrzt sembra krgzzzz Krzzzzzzzztzzzz ...'*/,
        /*'Una rottura nel nucleo della nave ammiraglia ha causato una reazione a catena che, in */'una spettacolare esplosione ha distrutto'/* l`intera spedizione.'*/,
        /*'La spedizione */'non è ritornata dal salto nell`iperspazio'/*. I nostri scienziati stanno ancora cercando di capire cosa sia accaduto, ma sembra che la flotta sia persa per sempre.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*'La tua spedizione ha */'avuto contatto con un`amichevole razza aliena'/*. Hanno annunciato che manderanno un rappresentante con merci da scambiare con il tuo mondo.'*/,
        /*'La tua spedizione ha */'ricevuto un segnale di emergenza'/*. Un grande cargo era stato catturato da un potente campo gravitazionale generato da un planetoide. Dopo aver liberato il cargo, il capitano ha annunciato che la persona che li ha salvati sarà il loro solo cliente preferito.'*/,
    ],

    [ExpeditionEventType.early]: [
        /*'Un */'componente inserito nel generatore di energia'/* durante l`assemblaggio ha inaspettatamente accelerato il ritorno della spedizione, così tornerà al pianeta di origine prima del previsto. I primi rapporti dicono che non hanno nulla di emozionante da raccontare.'*/,
        /*'La tua spedizione non riporta alcuna anomalia nel settore esplorato. La flotta però ha incontrato un */'forte vento solare al momento del salto di ritorno'/*. Per questo motivo il salto è stato accelerato notevolmente. La tua spedizione tornerà al pianeta di partenza con un po` di anticipo.'*/,
        /*'Il nuovo e */'audace comandante ha usato con successo un buco nero alquanto'/* instabile per accorciare il viaggio di ritorno! Comunque la spedizione non ha trovato nulla di interessante durante la ricognizione.'*/,
    ],

    [ExpeditionEventType.delay]: [
        /*'Una */'svista commessa dal capo-navigazione ha causato un errore'/* nei calcoli al momento del salto nell`iperspazio. La flotta non è solamente atterrata in un posto totalmente sbagliato, ma ora il viaggio di ritorno richiederà molto più tempo.'*/,
        /*'La tua spedizione è */'andata in un settore colpito da una tempesta di particelle'/*. A causa di ciò le riserve di energia della flotta si sono sovraccaricate e tutti i sistemi principali delle navi si sono bloccati. I tuoi tecnici sono riusciti ad evitare il peggio, ma la spedizione ritornerà con molto ritardo.'*/,
        /*'Per */'ragioni sconosciute il salto nell`iperspazio'/* è stato completamente sbagliato. E` quasi finito nel cuore di un sole. Fortunatamente sono atterrati in un sistema conosciuto; nonostante ciò, il salto di ritorno richiederà più tempo di quanto si era previsto.'*/,
        /*'Il */'vento-stellare di una gigante rossa'/* ha compromesso il salto nell`iperspazio della spedizione che ora impiegherà molto tempo per calcolare il salto di ritorno. Oltre a ciò, non vi era nulla in quel settore, eccetto il vuoto tra le stelle.'*/,
        /*'Il */'nuovo modulo di navigazione sta ancora combattendo'/* con alcuni bugs. Il salto fatto dalla spedizione non solo ha condotto in una direzione totalmente sbagliata, ma è stato consumato anche quasi tutto il deuterio. Comunque il salto iperspaziale ha fatto finire la flotta nei pressi di una luna vicina al pianeta di partenza. Un po` disorientata la spedizione ritorna utilizzando i motori ad impulso. A causa di ciò il ritorno richiederà un po` più di tempo.'*/,
        /*'La */'nave ammiraglia della tua spedizione si è scontrata con una nave straniera'/* che si è diretta verso la flotta senza alcun avvertimento . La nave straniera è esplosa e i danni riportati dalla nave ammiraglia erano gravi. Appena le necessarie riparazioni saranno terminate, la flotta inizierà il viaggio di ritorno dal momento che la spedizione non può essere portata a termine in quelle condizioni.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /seguente oggetto: (?<name>.+)/,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*'Alcuni */'pirati dello spazio decisamente disperati'/* hanno cercato di catturare la nostra spedizione.'*/,
            /*'Alcuni */'barbari primitivi ci stanno attaccando con delle navi spaziali'/* che non sono degne di tale nome...'*/,
            /*'Abbiamo intercettato */'messaggi di alcuni pirati ubriachi'/*. Sembra che saremo presto sotto attacco.'*/,
            'Abbiamo dovuto combattere alcuni pirati'/*, fortunatamente erano pochi.'*/,
            /*TODO: it 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'La tua spedizione ha */'avuto uno spiacevole incontro con alcuni pirati dello spazio',
            /*'Siamo incappati in */'un`imboscata tesa da alcuni pirati dello spazio'/* ! Non è stato possibile evitare il combattimento.'*/,
            /*'La richiesta di aiuto a cui la spedizione ha risposto si è */'rivelata essere una trappola di alcuni bucanieri'/* dello spazio. Non abbiamo potuto evitare il combattimento.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'I segnali registrati non provenivano da un */'alieno ma da una base spaziale pirata'/* ! Non erano nemmeno sorpresi dalla nostra presenza nel loro settore...'*/,
            /*'La spedizione riporta */'feroci scontri contro delle navi pirata non identificate',
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*'Alcune */'navi straniere hanno attaccato la spedizione'/* senza alcun avviso!'*/,
            /*'La tua flotta in esplorazione */'non ha avuto un amichevole primo contatto con una specie'/* sconosciuta.'*/,
            /*'La nostra spedizione è */'stata attaccata da un piccolo gruppo di navi',
            /*TODO: it 'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Una */'specie sconosciuta sta attaccando'/* la nostra spedizione!'*/,
            /*'La tua flotta in spedizione sembra aver sconfinato nel */'territorio di una razza aliena sconosciuta ma molto aggressiva',
            /*'Il collegamento con la nostra spedizione si è interrotto per un breve periodo. Da quello che abbiamo potuto decifrare dall`ultimo messaggio, stanno subendo un duro attacco - */'gli aggressori non sono stati identificati'/*.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*TODO: it 'Deine Expedition ist in eine Alien-Invasions-Flotte geraten und */'meldet schwere Gefechte'/*.'*/,
            /*'Abbiamo */'avuto difficoltà a pronunciare correttamente il dialetto'/* della razza aliena. Il nostro diplomatico ha detto "fate fuoco" anziché "non fate fuoco"!'*/,
            /*'Una grande */'formazione di navi cristalline di origine sconosciuta'/* ha avuto una collisione diretta con la nostra flotta in spedizione. Dobbiamo prepararci al peggio.'*/,
        ],
    },

    
    logbookRegex: /Rapporto dell`ufficiale alle comunicazioni:(?<text>.+)/,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'Sembra che questa parte di */'universo non sia ancora stata esplorata',
            /*'E` emozionante essere i */'primi ad attraversare un settore inesplorato',
        ],
        [ExpeditionDepletionLevel.low]: [
            /*'Sembra che nessun */'umano sia stato in questa parte della galassia',
            /*'Abbiamo */'trovato i detriti di un`antica nave spaziale'/*. Non siamo i primi ad essere stati qui.'*/,
            /*'abbiamo quasi avuto */'una collisione con un`altra flotta in spedizione'/*. Non pensavo che ci sarebbe stato qualcun altro qui.'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*TODO it: 'Wir haben den Abschluss der Expedition mit den Crewmitgliedern einer zweiten Expeditionsflotte, die im selben Sektor unterwegs war, gefeiert. */'Die haben auch nichts Spannendes zu berichten',
            /*TODO it: 'Es wurden */'Anzeichen für die Präsenz anderer Expeditionsflotten'/* gefunden.'*/,
            /*TODO it: 'Es wurde */'friedlicher Funkkontakt zu einigen anderen Expeditionen'/* in diesem Sektor hergestellt.'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /*TODO it: 'Wenn wir uns zu unsicher fühlen, können wir uns ja */'mit all den anderen Expeditionen'/*, die hier herum fliegen, zusammen tun.'*/,
        ],
    },
};