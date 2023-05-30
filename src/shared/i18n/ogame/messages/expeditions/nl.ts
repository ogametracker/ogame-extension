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
            /*'Onze expeditie */'volbrengt een uniek experiment'/*. We hebben donkere materie weten te verkrijgen uit een exploderende ster.'*/,
            /*'Onze expeditie */'heeft een eeuwenoud ruimtestation waargenomen'/* , het lijkt ongecontroleerd in de ruimte rond te zweven... Het station zelf mag dan verouderd zijn, in de reactor lag een voorraad donkere materie. Onze technici proberen zoveel mogelijk te bergen.'*/,
            /*'De expeditie rapporteert een bijzonder fenomeen. Hieruit verkrijgen we donkere materie */'in de energiebuffers van de schilden van ons schip'/* . Onze technici proberen dit te stabiliseren, zodat we de kostbare donkere materie kunnen bewaren.'*/,
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
            'Mineraalgordels rondom een onbekende planeet'/* bevatten ontelbare grondstoffen. De expeditie komt volgeladen terug!'*/,
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
            /*'Op het eerste gezicht een */'onbewoonde planeet blijkt toch een beschaving te hebben gehad'/* . Een onbemand ruimtestation verraadt dat er ooit een ruimtereizende bevolking heeft gewoond. Op de planeet vinden we nog een aantal verlaten schepen.'*/,
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
        /*'Het laatste bericht dat we ontvingen, was */'een bijzonder fraaie closeup van een zwart gat',
        /*'Het enige dat is */'overgebleven van de expeditie is het volgende radiogram'/* : Zzzrrt Aaargh! Krrrzzzzt Dat zrrrtrzt lijkt krgzzzz wel Krzzzzzzzztzzzz...'*/,
        /*'Een */'ontploffing van de hyperruimtemotor veroorzaakt een kettingreactie'/* van explosies die heel de vloot vernietigt.'*/,
        /*'De */'expeditievloot kon niet terugvliegen'/* . Onze onderzoekers zijn nog steeds aan het speuren, maar ze hebben geen idee wat er gebeurd is, het lijkt er op dat we de vloot beter als verloren kunnen beschouwen.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*'Onze expeditievloot */'heeft contact gemaakt met verlegen buitenaardse wezens'/* . Ze komen met een diplomaat aan boord om handel te drijven tussen onze werelden.'*/,
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
        /*'De */'zonnewind van een rode reus verstoorde de sprong'/* van de expeditie en het zal geruime tijd duren voor de route voor de terugkeer berekend is. Er was niets dan leegte tussen de sterren in de sector. De vloot zal later dan verwacht terugkeren.'*/,
        /*'De */'nieuwe navigatiemodule heeft nog een aantal bugs'/* . De expeditiesprong ging niet alleen de volkomen verkeerde richting uit, maar ook al het deuterium is verbruikt. De sprong heeft de expeditie dicht bij de maan van de startplaneet gebracht. Jammer genoeg keert de expeditie op impuls terug. Daardoor is de terugkeer enigszins vertraagd.'*/,
        /*'Het moederschip van de expeditie is in */'botsing gekomen met een buitenlands schip op het moment dat het zonder'/* waarschuwing in de vloot sprong. Het buitenlandse schip is geëxplodeerd en de schade aan het moederschip is enorm. Zodra de noodzakelijke reparaties zijn uitgevoerd zal de vloot huiswaarts keren, omdat de expeditie helaas geen doorgang kan vinden als gevolg van de opgelopen schade.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /Een (?<name>.+) is aan je Inventaris toegevoegd/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*'Een paar */'wanhopige piraten hebben geprobeerd onze expeditievloot'/* te enteren.'*/,
            /*'Enkele */'primitieve barbaren vallen ons aan met ruimteschepen'/* die die naam nauwelijks verdienen. Als het gevecht zwaarder wordt, zullen we genoodzaakt zijn terug te vuren.'*/,
            /*'We vingen een */'radiobericht op van enkele dronken piraten'/* . Het lijkt erop dat we een aanval kunnen verwachten.'*/,
            /*'We */'moesten ons verdedigen tegen enkele piraten'/* die, gelukkig, niet al te talrijk waren.'*/,
            /* TODO: nl 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Je expeditie had een */'onaangename ontmoeting met enkele ruimtepiraten',
            /*'We liepen in een */'hinderlaag van een stel ruimterebellen'/* . Een gevecht was niet meer te voorkomen.'*/,
            /*'Het noodsignaal dat de expeditie volgde */'bleek in scene gezet te zijn door ruimtepiraten'/* . Een gevecht kon niet meer voorkomen worden.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /* TODO: nl 'Die aufgefangenen Signale stammten nicht von Fremdwesen, sondern */'von einer geheimen Piratenbasis'/* ! Die Piraten waren von unserer Anwesenheit in ihrem Sektor nicht besonders begeistert.'*/,
            /* TODO: nl 'Die Expeditionsflotte meldet */'schwere Kämpfe mit nicht-identifizierten Piratenschiffen'/*.'*/,
        ],
        'fled-death-star': [
            /*LOCA: nl 'Your expedition stumbled across some pirates, but overwhelmed by the magnitude of your Deathstar, they fled.' */
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
            /*'Een */'onbekende levensvorm valt onze expeditie'/* aan!'*/,
            /*'Je expeditie */'is het territorium van onbekende, zeer agressieve en oorlogszuchtige'/* ruimtewezens binnen gedrongen.'*/,
            /* TODO: nl 'Die Verbindung zu unserer Expeditionsflotte wurde kurzfristig gestört. Sofern wir die letzte Botschaft richtig entschlüsselt haben, steht die Flotte unter schwerem Feuer; die */'Aggressoren konnten nicht identifiziert werden'/*.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /* TODO: nl 'Deine Expedition ist in eine Alien-Invasions-Flotte geraten und */'meldet schwere Gefechte'/*.'*/,
            /* TODO: nl 'Wir hatten Mühe den korrekten */'Dialekt einer Alienrasse'/* auszusprechen. Unser Diplomat rief daher "Feuer!" statt "Friede!".'*/,
            /* TODO: nl 'Ein großer */'Verband kristalliner Schiffe unbekannter Herkunft'/* hält direkten Kollisionskurs mit unserer Expeditionsflotte. Wir müssen nun wohl vom Schlimmsten ausgehen.'*/,
        ],
        'fled-death-star': [
            /*LOCA: nl 'Your expedition stumbled across some aliens, but overwhelmed by the magnitude of your Deathstar, they fled.' */
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
            /*'Op een haar na hadden we een */'botsing met een andere expeditie'/* . Ik had niet verwacht hier andere schepen tegen te zullen komen.'*/,
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