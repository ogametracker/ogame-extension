import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const hr: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*'Ekspedicija */'je uspjela pronaći i sačuvati Crnu Materiju',
            /*'Pronašli smo */'ostatke vanzemaljskog broda'/* . Na njemu je bilo malo spremište Crne Materije.'*/,
            /*LOCA: hr 'Wir trafen auf ein */'seltsames Alien an Bord eines kleinen Schiffes'/*, das uns im Austausch für ein paar simple, mathematische Berechnungen einen kleinen Behälter mit Dunkler Materie überließ.'*/,
            /*'Naša*/' ekspedicija je zauzela napušteni brod s kojeg je transportirala'/* malu količinu Crne Materije. Ne pronalazimo nikakve tragove šta se dogodilo posadi ovog broda, ali tehničari su uspjeli spasiti Crnu Materiju.'*/,
            /*'Ekspedicija je pratila neke */'čudne signale prema jednom asteroidu'/*. U jezgri samog asteroida je pronađena mala količina Crne Materije. Istraživači su uzeli asteroid radi daljnjeg istraivanja i izvlačenja Crne Materije.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*LOCA: hr 'Unserer Expedition ist */'ein einmaliges Experiment gelungen'/*:'*/,
            /*LOCA: hr 'Unsere Expedition hat eine */'uralte Raumstation gefunden'/*, die wohl schon seit langer Zeit unkontrolliert durch das All schwebt. Die Station selbst war komplett unbrauchbar, jedoch lagerte in einem ihrer Reaktoren noch ein wenig Dunkler Materie. Unsere Techniker versuchen, so viel wie möglich davon zu bergen.'*/,
            /*LOCA: hr 'Unsere Expedition meldet ein seltsames spektrales Phänomen. Dies führte unter anderem dazu, dass sich in den */'Energiespeichern der Schiffsschilde Dunkle Materie'/* bildete. Unsere Techniker versuchen nun, solange das Phänomen noch anhält, möglichst viel dieser Dunklen Materie zu konservieren.'*/,
        ],
        [ExpeditionEventSize.large]: [
            'Spontana deformacija svemira'/* omogućila je tvojoj ekspediciji da pronađe velike količine Crne Materije.'*/,
            /*LOCA: hr 'Unsere Expedition meldet einen ersten Kontakt der besonderen Art. Anscheinend hat */'eine Energiekreatur, die sich Legorianer nannte'/*, die Schiffe der Expedition durchflogen und dann beschlossen, der unterentwickelten Spezies ein wenig auszuhelfen - es materialisierte sich ein Behälter mit dunkler Materie an Bord der Brücke!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`(?<amount>[^\\s]+) (?<name>${darkMatter}) je ukradeno`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'Tvoja ekspedicija je */'pronašla mali asteroid'/* iz kojeg se mogu izvaditi neki resursi.'*/,
            /*'Na nekom */'izoliranom planetoidu'/* našli smo lako dostupne resurse koje smo uspjeli opljačkati'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Vaša ekspedicija je pronašla prastari, */'pun resursa napušteni konvoj'/*. Nešto novih resursa je moglo biti spašeno.'*/,
            /*'Tvoja ekspedicija je na */'malom mjesecu nšla ogromna spremišta resursa'/* . Posada na mjesecu pokušava utovariti sve resurse u brodove.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: hr 'Ein */'Mineraliengürtel'/* um einen unbekannten Planeten enthielt Unmengen an Rohstoffen. Die Expeditionsflotte meldet volle Lager!'*/,
            /*LOCA: hr 'Deine Expeditionsflotte meldet den */'Fund eines riesigen Alien-Schiffswracks'/*. Mit der Technologie konnten sie zwar nichts anfangen, aber das Schiff ließ sich in seine Einzelteile zerlegen, wodurch man wertvolle Rohstoffe gewinnen konnte.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`(?<amount>.+) (?<name>${resources.join('|')}) je ukradeno`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*'Našli */'smo ostatke prijašnje ekspedicije'/* ! Naši tehničari će pokušati popraviti neke brodove.'*/,
            /*'Vaša ekspedicija je */'pronašla staru tvrđavu koja je napuštena prije par godina'/* . U hangaru su pronađeni neki brodovi. Tehničari pokušavaju osposobiti te brodove za let.'*/,
            /*'Naša ekspedicija je */'pronašla planet koji je skoro uništen u prijašnjim ratovima'/* . U njegovoj orbiti plutaju neki brodovi koje naši tehničari pokušavaju popraviti.'*/,
            /*'Našli smo */'staru piratsku stanicu'/* u kojoj su neki brodovi. Naši tehničari pokušavaju utvrditi jesu li još neki brodovi korisni ili ne.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Naša ekspedicija je našla */'staro automatsko brodogradilište'/*. Neki od brodova su još uvijek u produkciji pa naši tehničari pokušavaju popraviti brodogradilite da se ti brodovi dovrše.'*/,
            /*LOCA: hr 'Wir haben die */'Reste einer Armada'/* gefunden. Die Techniker der Expeditionsflotte haben sich sofort auf die halbwegs intakten Schiffe begeben und versuchen, diese wieder instand zu setzen.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: hr 'Wir haben einen */'riesigen Raumschiffsfriedhof'/* gefunden. Einigen Technikern der Expeditionsflotte ist es gelungen, das ein oder andere Schiff wieder in Betrieb zu nehmen.'*/,
            /*LOCA: hr 'Wir haben einen Planeten mit */'Resten einer Zivilisation'/* entdeckt.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`Sljedeći brodovi su sada dio vaše flote:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
    },

    [ExpeditionEventType.nothing]: [
        /*'Iako su prva skeniranja sektora bila dobra flota se nažalost */'vratila praznih ruku'/*.'*/,
        /*'Ekspedicija nije vratila ništa drugo osim nekih čudnih i malih stvorenja sa */'nepoznatog močvarnog planeta'/*.'*/,
        /*'Vaša ekspedicija je */'prikupila nova saznanja o praznini univerzuma'/* . Nije bilo čak niti jednog malo asteroida koji bi mogao učiniti ovu ekspediciju uzbudljivom.'*/,
        /*'Živo */'biće napravljeno od čiste energije se potrudilo'/* da svi članovi ekspedicije budu hipnotizirani tokom putovanja. Kada se većina njih osvijestila shvatili su da su potrošili previše deuterija i da se moraju vratiti nazad.'*/,
        /*'Zbog otkazivanja */'brodskog reaktora jednog od brodova skoro je došlo'/* do uništenja cijele flote. Na svu sreću tehničari su uspjeli spriječiti najgore. Dosta vremena je potrošeno na popravak i zbog toga se ekspedicija vratila bez rezultata.'*/,
        /*'Vasa ekspedicija je snimila */'prelijepe slike super nove'/*. Ništa novo nije moglo biti prikupljeno na ekspediciji osim dobre šanse da se pobijedi na takmičenju za "Najbolju sliku univerzuma".'*/,
        /*'Ekspedicijska */'flota je pratila čudan signal neko vrijeme'/* . Na kraju su oktrili da taj signal dolazi od stare sonde koju su poslale prijašnje generacije da dočekuje strane brodove. Sonda je sačuvana i neki muzeji na vašem matičnom planetu su pokazali interes za nju.'*/,
        /*'Sada znamo da te crvene */'anomalije klase 5'/* nemaju samo kaotične efekte za brodsku navigaciju nego i hipnotiziraju cijelu posadu. Ekspedicija nije vratila ništa natrag.'*/,
        /*'Vaša ekspedicija je naletjela u */'gravitacijsko polje neutronske'/* zvijezde i bilo joj je potrebno vremena da se oslobodi. Zbog toga je flota potrošila sav Deuterij i morala se vratiti bez rezultata.'*/,
        /*'Čudni računalni */'virus je zarazio brodsku navigaciju'/* ubrzo nakon počekta ekspedicije. To je uzrokovalo da se ekspedicijska flota vrti u krug. Suvišno je spominjati kako misija nije bila uspješna.'*/,
        /*'Naš ekspedicijski tim je naišao na čudnu koloniju koja je već jako dugo napuštena. Nakon slijetanja našu ekipu je pogodila */'velika temperatura od stranog virusa'/*. Kasnije su saznali da je taj virus pobio cijelu kolonizaciju koja je živjela na koloniji. Naš tim se sada vraća doma, i nažalos ne nosi ništa nazad.'*/,
        /*'Netko je */'instalirao staru stratešku'/* igru u brodsko računalo. Ekspedicijska flota je bila dugo odsutna ali zbog igre nije vratila ništa produktivno.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*'Jedina stvar koja je ostala od cijele ekspedicije je vrlo dobra slika */'crne rupe koja se stvara'/*.'*/,
        /*LOCA: hr 'Von der Expedition ist */'nur noch folgender Funkspruch übrig'/* geblieben: Zzzrrt Oh Gott! Krrrzzzzt dass zrrrtrzt sieht krgzzzz ja aus wie Krzzzzzzzztzzzz ...'*/,
        /*LOCA: hr 'Ein Kernbruch des Führungsschiffes führte zu einer Kettenreaktion, die in einer durchaus */'spektakulären Explosion die gesamte Expedition'/* vernichtete.'*/,
        /*LOCA: hr 'Die Expeditionsflotte ist */'nicht mehr aus dem Sprung in den Normalraum'/* zurückgekehrt. Unsere Wissenschaftler rätseln noch immer, was geschehen sein könnte, jedoch scheint die Flotte endgültig verloren zu sein.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*LOCA: hr 'Deine Expeditionsflotte hatte kurzen */'Kontakt zu einer scheuen Alien-Rasse'/*.'*/,
        /*'Vaša ekspedicija je primila signal za hitne slučajeve. Ogroman transporter je upao u gravitacijsko polje jednog planetoida. Nakon to je transporter spašen njihov kapetan je izjavio da će */'osoba koja ih je spasila odsada biti njihov poseban klijent',
    ],

    [ExpeditionEventType.early]: [
        /*LOCA: hr 'Eine unvorhergesehene */'Rückkopplung in den Energiespulen'/* der Antriebsaggregate beschleunigte den Rücksprung der Expedition, so dass sie nun früher als erwartet zurückkehrt. Ersten Meldungen zufolge hat sie jedoch nichts Spannendes zu berichten.'*/,
        /*LOCA: hr 'Deine Expedition meldet keine Besonderheiten in dem erforschten Sektor. Jedoch geriet die Flotte */'beim Rücksprung in einen Sonnenwind'/*. Dadurch wurde der Sprung beschleunigt. Deine Expedition kehrt nun etwas früher nach Hause.'*/,
        /*'*/'Novi i odvažni komander'/* je uspješno putovao kroz crvotočinu da skrati put povratka flote. Međutim, ekspedicija nije donjela ništa novo.'*/,
    ],

    [ExpeditionEventType.delay]: [
        'Navigator glavnog broda je imao loš dan i krivo izračunao'/* koordinate na koje treba ići. Ne samo da je flota krivo sletila negdje drugdje, nego joj i treba više vremena za povratak natrag.'*/,
        /*'Ekspedicija je završila u */'sektoru sa olujama'/*. To je potaklo spremnike energije na preopterećenje i većina sistema u brodu se srušilo. Mehaničari su uspjeli izbjeći najgore ali povratak ekspedicije će se znatno odužiti.'*/,
        /*LOCA: hr 'Aus bisher unbekannten Gründen ging der */'Sprung der Expeditionsflotte völlig daneben'/*. Beinahe wären die Schiffe im Herzen einer Sonne angekommen. Zum Glück ist man in einem bekannten System gelandet, jedoch wird der Rücksprung länger dauern als ursprünglich gedacht.'*/,
        /*'Gravitacija */'crvenog diva uništila je skok ekspedicijske'/* flote i trebati će malo vremena da se flota vrati nazad, stoga će joj trebati više vremena nego očekivano.'*/,
        /*'Novi */'navigacijski modul još uvijek ima nekih problema'/* . Ne samo da je ekspedicijski skok završio na krivom mjestu nego je i potrošio sav Deuterij. Bitno razočarana ekspedicijska flota se vraća bez impulsa. Povratak će trajati duže nego očekivano.'*/,
        /*'Ekspedicijska flota se susrela sa neprijateljskim brodom koji je pojavio bez ikakvog upozorenja. */'Neprijateljski brod je eksplodirao'/* i eksplozijom uzrokovao štetu na vašim brodovima. Dok god se ne poprave svi brodovi ekspedicijska flota ne može ići natrag pa će zbog toga povratak potrajati duže.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /*LOCA: hr */ /Ein (?<name>.+) wurde dem Inventar hinzugefügt/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*LOCA: hr 'Ein paar anscheinend */'sehr verzweifelte Weltraumpiraten'/* haben versucht,'*/,
            /*LOCA: hr 'Einige */'primitive Barbaren greifen uns mit Raumschiffen'/* an, die nicht einmal ansatzweise die Bezeichnung Raumschiff verdient haben. Sollte der Beschuss ernstzunehmende Ausmaße annehmen, sehen wir uns gezwungen, das Feuer zu erwidern.'*/,
            /*LOCA: hr 'Wir haben ein paar */'Funksprüche sehr betrunkener Piraten'/* aufgefangen.'*/,
            /*'Flota se morala */'boriti protiv nekoliko pirata'/* kojih je na sreću bilo jako malo.'*/,
            /*LOCA: hr 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*LOCA: hr 'Deine Expeditionsflotte hatte ein */'unschönes Zusammentreffen mit einigen Weltraumpiraten'/*.'*/,
            /*LOCA: hr 'Wir sind in den */'Hinterhalt einiger Sternen-Freibeuter'/* geraten!'*/,
            /*LOCA: hr 'Der Hilferuf, dem die Expedition folgte, stellte sich als */'böse Falle einiger arglistiger Sternen-Freibeuter'/* heraus. Ein Gefecht war unvermeidlich.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: hr 'Die aufgefangenen Signale stammten nicht von Fremdwesen, sondern */'von einer geheimen Piratenbasis'/* ! Die Piraten waren von unserer Anwesenheit in ihrem Sektor nicht besonders begeistert.'*/,
            /*LOCA: hr 'Die Expeditionsflotte meldet */'schwere Kämpfe mit nicht-identifizierten Piratenschiffen'/*.'*/,
        ],
        'fled-death-star': [
            /*LOCA: hr 'Your expedition stumbled across some pirates, but overwhelmed by the magnitude of your Deathstar, they fled.' */
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*LOCA: hr 'Einige */'fremdartig anmutende Schiffe'/* haben ohne Vorwarnung die Expeditionsflotte angegriffen.'*/,
            /*LOCA: hr 'Deine Expeditionsflotte hatte einen */'nicht besonders freundlichen Erstkontakt'/* mit einer unbekannten Spezies.'*/,
            /*LOCA: hr 'Unsere Expedition wurde von einer */'kleinen Gruppe unbekannter Schiffe'/* angegriffen.'*/,
            /*LOCA: hr 'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*LOCA: hr 'Eine */'unbekannte Spezies greift unsere Expedition'/* an!'*/,
            /*LOCA: hr 'Deine */'Expeditionsflotte hat anscheinend das Hoheitsgebiet'/* einer bisher unbekannten, aber äußerst aggressiven und kriegerischen Alienrasse verletzt.'*/,
            /*LOCA: hr 'Die Verbindung zu unserer Expeditionsflotte wurde kurzfristig gestört. Sofern wir die letzte Botschaft richtig entschlüsselt haben, steht die Flotte unter schwerem Feuer; die */'Aggressoren konnten nicht identifiziert werden'/*.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: hr 'Deine Expedition ist in eine Alien-Invasions-Flotte geraten und */'meldet schwere Gefechte'/*.'*/,
            /*LOCA: hr 'Wir hatten Mühe den korrekten */'Dialekt einer Alienrasse'/* auszusprechen. Unser Diplomat rief daher "Feuer!" statt "Friede!".'*/,
            /*LOCA: hr 'Ein großer */'Verband kristalliner Schiffe unbekannter Herkunft'/* hält direkten Kollisionskurs mit unserer Expeditionsflotte. Wir müssen nun wohl vom Schlimmsten ausgehen.'*/,
        ],
        'fled-death-star': [
            /*LOCA: hr 'Your expedition stumbled across some aliens, but overwhelmed by the magnitude of your Deathstar, they fled.' */
        ],
    },

    logbookRegex: /Izvadak iz dnevnika oficira za komunikaciju:(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'Izgleda da */'ovaj dio univerzuma nije još istražen',
            /*'Izvandredan je osjećaj */'putovati dijelom sektora koji'/* jo nije istraen'*/,
        ],
        [ExpeditionDepletionLevel.low]: [
            /*'Izgleda da */'nijedan čovjek nije bio u ovom dijelu galaksije'/* prije nas'*/,
            /*'Nali smo ostatke prastarih svemirskih brodova. */'Netko je bio ovdje prije nas',
            /*'Skoro smo se susreli sa drugom ekspedicijskom flotom. */'Nisam očekivao da bi nekoga'/* moglo biti ovdje'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*'Susreli smo članove druge ekspedicijske flote. */'Nisu nam rekli ništa korisno',
            /*'Našli smo dokaz da ima još */'ekspedicijskih flota prisutnih ovdije',
            /*'Uspostavili smo */'prijateljski kontakt sa drugom ekspedicijskom flotom',
        ],
        [ExpeditionDepletionLevel.high]: [
            /*LOCA: hr 'Wenn wir uns zu unsicher fühlen, können wir uns ja */'mit all den anderen Expeditionen'/*, die hier herum fliegen, zusammen tun.'*/,
            /*LOCA: hr 'Vielleicht wäre es sinnvoller, hier */'eine Souvenir-Station zu errichten'/* , anstatt noch eine Expedition loszuschicken.'*/,
            /*LOCA: hr 'Wenn das so weitergeht, sollte man */'bei all dem Verkehr hier Navigationsbojen'/* aussetzen.'*/,
        ],
    },
};