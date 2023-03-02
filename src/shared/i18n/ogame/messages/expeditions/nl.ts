import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const nl: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*'De expeditie */'heeft succesvol donkere materie verkregen',
            /*'Uit */'overblijfselen van een onbekend schip halen we een kleine container'/* met donkere materie.'*/,
            /*'Een vreemd */'buitenaards wezen in een heel klein ruimteschip gaf ons een klein kistje'/* donkere materie in ruil voor wat eenvoudige wiskundige berekeningen.'*/,
            /*'Onze expeditie */'stuitte onverwachts op een spookschip'/* . Wat er met het schip gebeurd is, en waar de bemanning is, blijft onduidelijk, maar onze technici hebben wel achtergebleven donkere materie weten te verzamelen.'*/,
            /*'De expeditie */'volgde zeldzame signalen en ontdekte zo een asteroïde'/* . In de kern van de asteroïde zit een kleine hoeveelheid donkere materie verborgen. De asteroïde is binnenboord gehaald en de onderzoekers proberen nu de donkere materie vrij te krijgen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /* TODO: nl 'Unserer Expedition ist */'ein einmaliges Experiment gelungen'/*:'*/,
            /*'Onze expeditie */'heeft een eeuwenoud ruimtestation waargenomen'/* , het lijkt ongecontroleerd in de ruimte rond te zweven... Het station zelf mag dan verouderd zijn, in de reactor lag een voorraad donkere materie. Onze technici proberen zoveel mogelijk te bergen.'*/,
            /* TODO: nl 'Unsere Expedition meldet ein seltsames spektrales Phänomen. Dies führte unter anderem dazu, dass sich in den */'Energiespeichern der Schiffsschilde Dunkle Materie'/* bildete. Unsere Techniker versuchen nun, solange das Phänomen noch anhält, möglichst viel dieser Dunklen Materie zu konservieren.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Uit */'spontane hyperruimtevervorming'/* ontstaat een grote hoeveelheid donkere materie!'*/,
            /* TODO: nl 'Unsere Expedition meldet einen ersten Kontakt der besonderen Art. Anscheinend hat */'eine Energiekreatur, die sich Legorianer nannte'/*, die Schiffe der Expedition durchflogen und dann beschlossen, der unterentwickelten Spezies ein wenig auszuhelfen - es materialisierte sich ein Behälter mit dunkler Materie an Bord der Brücke!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`Er is (?<name>${darkMatter}) (?<amount>[^\\s]+) buitgemaakt`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'Op een */'kleine astroïde vond je expeditievloot wat grondstoffen'/* die meegenomen konden worden.'*/,
            /*'Op een */'verdwaalde planetoïde lagen de grondstoffen'/* voor het oprapen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Je vloot stuitte op een eeuwenoud, */'volledig geladen en verlaten konvooi'/* . Natuurlijk ideaal om even wat in te laden.'*/,
            /*'Op een */'kleine maan met atmosfeer kon je expeditie landen'/* , op de grond kwam de bemanning volop grondstoffen tegen. De bemanning probeert zoveel mogelijk grondstof te verzamelen.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /* TODO: nl 'Ein */'Mineraliengürtel um einen unbekannten Planeten'/* enthielt Unmengen an Rohstoffen. Die Expeditionsflotte meldet volle Lager!'*/,
            /*'Je expeditievloot meldt de */'ontdekking van een gigantisch onbekend scheepswrak'/* . Ze waren niet in staat om te leren van hun technologieën, maar ze waren wel in staat om het schip op te delen in haar basisonderdelen en hebben er bruikbare grondstoffen van gemaakt.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`Er is (?<name>${resources.join('|')}) (?<amount>.+) buitgemaakt`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*'Onverwachts kwamen we de */'resten tegen van een oude verloren gegane expeditie'/* . Onze technici weten niet wat er precies gebeurd is, en proberen de schepen weer op te starten.'*/,
            /*'De expeditie is op een */'ruimtestation gestuit dat eeuwen geleden is verlaten'/* . In de werven van het ruimtestation worden een aantal schepen gevonden. De technici proberen er een paar weer aan het vliegen te krijgen.'*/,
            /*'Onze expeditie kwam op een */'planeet die totaal vernietigd lijkt door een intergalactische oorlog'/* . Verschillende schepen drijven onbemand in een baan om de planeet. Onze technici proberen ze te repareren, misschien komen we er achter wat er precies gebeurd is.'*/,
            /*'Op een */'verlaten piratenstation liggen nog diverse schepen'/* in de ruimtehangar. Onze technici proberen deze vreemde schepen te herkennen, wie weet kunnen we ze in gebruik nemen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Onze expeditie kwam een oude */'volautomatische scheepswerf'/* tegen, enkele schepen lijken midden in de productie te zitten. Door de generatoren op te starten kunnen we ze misschien afbouwen.'*/,
            /*'We */'liepen de resten van een oude oorlogsarmada'/* tegen het lijf. Technici vliegen direct op dit scheepskerkhof, wie weet zitten er nog bruikbare schepen tussen.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Op een */'enorm ruimtekerkhof vinden we duizenden schepen'/* . Enkele technici gaan op onderzoek uit, zo`n groot kerkhof heeft vast wel een paar bruikbare schepen.'*/,
            /* TODO: nl 'Wir haben einen Planeten mit */'Resten einer Zivilisation'/* entdeckt.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`De volgende schepen zijn nu een deel van de vloot:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
    },

    [ExpeditionEventType.nothing]: [
        /*'Ondanks de veelbelovende scans van deze sector, keren we */'jammer genoeg met lege handen terug',
        /*'Behalve een bijzonder */'vreemd klein dier van een onbekende planeet'/* , brengt deze expeditie niets bijzonders mee terug van de reis.'*/,
        /*'De expeditie heeft */'uitgebreid onderzoek gedaan naar oneindige leegte'/* in de ruimte. Er was niet eens een kleine asteroïde, straling of deeltje dat deze expeditie de moeite waard had kunnen maken.'*/,
        /*'Een */'levensvorm van pure energie hypnotiseerde de hele bemanning'/* . Nadat de vloot uren heeft rondgedobberd raakte hij buiten bereik. De expeditie moest worden afgebroken omdat het deuterium op was.'*/,
        /*'Een */'storing in de reactor van het moederschip vernietigde'/* bijna de totale expeditievloot. Gelukkig zijn de technici ervaren en hebben ze het ergste kunnen voorkomen. De reparatiewerkzaamheden namen nogal wat tijd in beslag en dwongen de expeditie huiswaarts te keren voor ze iets bereikt hadden.'*/,
        /*'Je expeditie heeft */'adembenemende foto`s gemaakt van een supernova'/* . Het zou best mogelijk zijn dat een van deze foto`s de een prijs wint in "beste foto van het universum"-competitie van dit jaar. Verder heeft de expeditie niets opgeleverd.'*/,
        /*'Je expeditievloot heeft korte tijd vreemde signalen gevolgd. Uiteindelijk ontdekten ze dat deze signalen */'uitgezonden werden door een oude sonde die generaties geleden verzonden'/* werd om buitenlandse soorten te groeten. De sonde is geborgen en verschillende musea op je thuisplaneet hebben al laten weten interesse in de sonde te hebben.'*/,
        /*'Hoe dan ook, we weten nu in ieder */'geval dat deze klasse 5 rariteit niet alleen'/* de sensoren in de war brengt, maar ook de bemanning tot hallucineren brengt. Verder brengt de expeditie echter niets terug.'*/,
        /*'Je expeditie kwam bijna in een */'zwaartekrachtveld van een neutronenster'/* terecht en had geruime tijd nodig om zich daaruit te bevrijden. Deze actie heeft veel deuterium gekost waardoor je expeditie terug moet keren zonder resultaat.'*/,
        /*'Een */'onbekend computervirus is in het navigatiesysteem'/* gedrongen kort na het verlaten van het zonnestelsel. Dit veroorzaakte dat de expeditie rond bleef cirkelen. Het is waarschijnlijk geen verrassing dat de expeditie op deze manier geen succes was.'*/,
        /*'Waarschijnlijk was het */'toch geen goed idee om de verjaardag van de expeditieleider'/* te vieren op die onherbergzame planeet. Een vreselijke koorts was de reden dat het merendeel van de bemanning hierna in de eerste hulppost moest verblijven gedurende de rest van de expeditie. Door personeelsgebrek moest de expeditie afgebroken worden.'*/,
        /*'Iemand heeft een oud */'strategiespel geïnstalleerd op de scheepscomputers'/* . De expeditievloot was weg voor een lange tijd, maar is niet echt zinvol bezig geweest als gevolg van dat spel.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /* TODO: nl 'Das Letzte, was von dieser Expedition noch gesendet wurde, waren einige unglaublich gut gelungene */'Nahaufnahmen eines sich öffnenden schwarzen Lochs'/*.'*/,
        /* TODO: nl 'Von der Expedition ist */'nur noch folgender Funkspruch übrig'/* geblieben: Zzzrrt Oh Gott! Krrrzzzzt dass zrrrtrzt sieht krgzzzz ja aus wie Krzzzzzzzztzzzz ...'*/,
        /* TODO: nl 'Ein Kernbruch des Führungsschiffes führte zu einer Kettenreaktion, die in einer durchaus */'spektakulären Explosion die gesamte Expedition'/* vernichtete.'*/,
        /* TODO: nl 'Die Expeditionsflotte ist */'nicht mehr aus dem Sprung in den Normalraum'/* zurückgekehrt. Unsere Wissenschaftler rätseln noch immer, was geschehen sein könnte, jedoch scheint die Flotte endgültig verloren zu sein.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /* TODO: nl 'Deine Expeditionsflotte hatte kurzen */'Kontakt zu einer scheuen Alien-Rasse'/*.'*/,
        /*'Een noodoproep bereikte je expeditie. Een enorm transportschip raakte gevangen door een krachtig gravitonveld van een grote planeet. Nadat we het schip hebben */'losgetrokken biedt de kapitein een exclusief handelscontract'/* aan.'*/,
    ],

    [ExpeditionEventType.early]: [
        /*'Een */'onverwachte terugkoppeling in de energiespoelen'/* van de motoren maakt het doorzetten van de expeditie onmogelijk, de vloot komt eerder terug dan verwacht. Zo te zien hebben ze verder weinig spannends meegemaakt.'*/,
        /*'Je expeditie */'heeft geen rariteiten gevonden in de te verkennen sector'/* . Op de terugweg kon er wel gebruik gemaakt worden van een sterke zonnewind, waardoor de vloot wat sneller thuis is dan gepland.'*/,
        /*'Je nieuwe en */'ongeremde vlootcommandant heeft de vloot door een onstabiel wormgat'/* gestuurd, verbazingwekkend genoeg blijft de vloot onbeschadigd, en komt in zijn geheel wat eerder terug.'*/,
    ],

    [ExpeditionEventType.delay]: [
        /*'De */'navigatieleider had een slechte dag waardoor de vlucht'/* van de expeditie verkeerd berekend was. Niet alleen landde de vloot op een volkomen verkeerde plaats, de terugweg van de vloot heeft nu ook nog veel meer tijd nodig dan de bedoeling was.'*/,
        /*'Je expeditie komt */'terecht in een sector waar een heftige deeltjesstorm woedt'/* . Deze storm overbelast je energieopslag waardoor de hoofdsystemen van je schepen defect zijn geraakt. Je technici waren in staat om ergere schade te voorkomen, maar de expeditie heeft wel een vertraging opgelopen. De thuiskomst zal later zijn dan de planning was.'*/,
        /*'Door */'onbekende oorzaak is de expeditiesprong volkomen mislukt'/* . De expeditie landde bijna in de kern van een zon. Gelukkig landde de expeditie wel in een bekend stelsel, maar de sprong huiswaarts zal meer tijd in beslag nemen dan gedacht werd.'*/,
        /* TODO: nl 'Der */'Sternwind eines roten Riesen'/* verfälschte den Sprung der Expedition dermaßen, dass es einige Zeit dauerte, den Rücksprung zu berechnen. Davon abgesehen gab es in dem Sektor, in dem die Expedition ankam, nichts außer der Leere zwischen den Sternen.'*/,
        /* TODO: nl 'Das neue */'Navigationsmodul hat wohl doch noch mit einigen Bugs'/* zu kämpfen. Nicht nur ging der Sprung der Expeditionsflotte in die völlig falsche Richtung, auch wurde das gesamte Deuterium verbraucht, wobei der Sprung der Flotte nur knapp hinter dem Mond des Startplaneten endete. Etwas enttäuscht kehrt die Expedition nun auf Impuls zurück. Dadurch wird die Rückkehr wohl ein wenig verzögert.'*/,
        /*'Het moederschip van de expeditie is in */'botsing gekomen met een buitenlands schip op het moment dat het zonder'/* waarschuwing in de vloot sprong. Het buitenlandse schip is geëxplodeerd en de schade aan het moederschip is enorm. Zodra de noodzakelijke reparaties zijn uitgevoerd zal de vloot huiswaarts keren, omdat de expeditie helaas geen doorgang kan vinden als gevolg van de opgelopen schade.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /Een (?<name>.+) is aan je Inventaris toegevoegd/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /* TODO: nl 'Ein paar anscheinend */'sehr verzweifelte Weltraumpiraten'/* haben versucht,'*/,
            /*'Enkele */'primitieve barbaren vallen ons aan met ruimteschepen'/* die die naam nauwelijks verdienen. Als het gevecht zwaarder wordt, zullen we genoodzaakt zijn terug te vuren.'*/,
            /*'We vingen een */'radiobericht op van enkele dronken piraten'/* . Het lijkt erop dat we een aanval kunnen verwachten.'*/,
            /*'We */'moesten ons verdedigen tegen enkele piraten'/* die, gelukkig, niet al te talrijk waren.'*/,
            /* TODO: nl 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /* TODO: nl 'Deine Expeditionsflotte hatte ein */'unschönes Zusammentreffen mit einigen Weltraumpiraten'/*.'*/,
            /* TODO: nl 'Wir sind in den */'Hinterhalt einiger Sternen-Freibeuter'/* geraten!'*/,
            /* TODO: nl 'Der Hilferuf, dem die Expedition folgte, stellte sich als */'böse Falle einiger arglistiger Sternen-Freibeuter'/* heraus. Ein Gefecht war unvermeidlich.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /* TODO: nl 'Die aufgefangenen Signale stammten nicht von Fremdwesen, sondern */'von einer geheimen Piratenbasis'/* ! Die Piraten waren von unserer Anwesenheit in ihrem Sektor nicht besonders begeistert.'*/,
            /* TODO: nl 'Die Expeditionsflotte meldet */'schwere Kämpfe mit nicht-identifizierten Piratenschiffen'/*.'*/,
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*'Onbekende */'exotisch ogende schepen vallen de expeditie'/* zonder waarschuwing aan.'*/,
            /*'Je expeditievloot heeft een */'onvriendelijk eerste contact gemaakt'/* met een onbekende levensvorm.'*/,
            /*'Onze expeditie is */'aangevallen door een kleine vloot onbekende schepen',
            /* TODO: nl 'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /* TODO: nl 'Eine */'unbekannte Spezies greift unsere Expedition'/* an!'*/,
            /* TODO: nl 'Deine */'Expeditionsflotte hat anscheinend das Hoheitsgebiet'/* einer bisher unbekannten, aber äußerst aggressiven und kriegerischen Alienrasse verletzt.'*/,
            /* TODO: nl 'Die Verbindung zu unserer Expeditionsflotte wurde kurzfristig gestört. Sofern wir die letzte Botschaft richtig entschlüsselt haben, steht die Flotte unter schwerem Feuer; die */'Aggressoren konnten nicht identifiziert werden'/*.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /* TODO: nl 'Deine Expedition ist in eine Alien-Invasions-Flotte geraten und */'meldet schwere Gefechte'/*.'*/,
            /* TODO: nl 'Wir hatten Mühe den korrekten */'Dialekt einer Alienrasse'/* auszusprechen. Unser Diplomat rief daher "Feuer!" statt "Friede!".'*/,
            /* TODO: nl 'Ein großer */'Verband kristalliner Schiffe unbekannter Herkunft'/* hält direkten Kollisionskurs mit unserer Expeditionsflotte. Wir müssen nun wohl vom Schlimmsten ausgehen.'*/,
        ],
    },

    logbookRegex: /Logboek van de communicatieofficier:(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'Deze */'sector lijkt nog niet eerder verkend'/* te zijn.'*/,
            /*'Het voelt altijd */'heerlijk als je een van de eersten bent'/* die ooit een sector binnen vliegt.'*/,
        ],
        [ExpeditionDepletionLevel.low]: [
            /*'Het lijkt er op dat */'geen mens ooit in deze uithoek van de melkweg'/* is geweest.'*/,
            /*'Onverwacht */'komen we puin van oude schepen tegen'/* , iemand is hier eerder geweest.'*/,
            /* TODO: nl 'Wir hatten beinahe eine */'Kollision mit einer anderen Expeditionsflotte'/*. Hätte nicht gedacht, dass sich hier noch andere herumtreiben.'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /* TODO: nl 'Wir haben den Abschluss der Expedition mit den Crewmitgliedern einer zweiten Expeditionsflotte, die im selben Sektor unterwegs war, gefeiert. */'Die haben auch nichts Spannendes zu berichten',
            /* TODO: nl 'Es wurden */'Anzeichen für die Präsenz anderer Expeditionsflotten'/* gefunden.'*/,
            /* TODO: nl 'Es wurde */'friedlicher Funkkontakt zu einigen anderen Expeditionen'/* in diesem Sektor hergestellt.'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /* TODO: nl 'Wenn wir uns zu unsicher fühlen, können wir uns ja */'mit all den anderen Expeditionen'/*, die hier herum fliegen, zusammen tun.'*/,
            /* TODO: nl 'Vielleicht wäre es sinnvoller, hier */'eine Souvenir-Station zu errichten'/* , anstatt noch eine Expedition loszuschicken.'*/,
            /* TODO: nl 'Wenn das so weitergeht, sollte man */'bei all dem Verkehr hier Navigationsbojen'/* aussetzen.'*/,
        ],
    },
};