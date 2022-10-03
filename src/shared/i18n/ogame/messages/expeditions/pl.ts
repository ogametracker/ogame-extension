import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const pl: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            'Ekspedycja znalazła trochę Antymaterii',
            /*LOCA: pl 'Wir haben die */'Überreste eines Alien-Schiffes'/* gefunden. An Bord war ein kleiner Behälter mit Dunkler Materie!'*/,
            /*LOCA: pl 'Wir trafen auf ein */'seltsames Alien an Bord eines kleinen Schiffes'/*, das uns im Austausch für ein paar simple, mathematische Berechnungen einen kleinen Behälter mit Dunkler Materie überließ.'*/,
            /*LOCA: pl 'Unsere Expedition ist auf ein */'Geisterschiff gestoßen'/*, das eine kleine Menge Dunkler Materie transportierte. Wir haben zwar keinerlei Hinweise finden können, was der ursprünglichen Crew zugestoßen ist. Dennoch gelang es unseren Technikern, die Dunkle Materie zu bergen.'*/,
            /*'Ekspedycja podążyła za */'dziwnym sygnałem pochodzącym z asteroidy'/* . W jej jądrze znaleziono małą ilość antymaterii. Asteroida została odholowana, a odkrywcy próbują wydobyć antymaterię.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*LOCA: pl 'Unserer Expedition ist */'ein einmaliges Experiment gelungen'/*:'*/,
            /*LOCA: pl 'Unsere Expedition hat eine */'uralte Raumstation gefunden'/*, die wohl schon seit langer Zeit unkontrolliert durch das All schwebt. Die Station selbst war komplett unbrauchbar, jedoch lagerte in einem ihrer Reaktoren noch ein wenig Dunkler Materie. Unsere Techniker versuchen, so viel wie möglich davon zu bergen.'*/,
            /*LOCA: pl 'Unsere Expedition meldet ein seltsames spektrales Phänomen. Dies führte unter anderem dazu, dass sich in den */'Energiespeichern der Schiffsschilde Dunkle Materie'/* bildete. Unsere Techniker versuchen nun, solange das Phänomen noch anhält, möglichst viel dieser Dunklen Materie zu konservieren.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: pl 'Eine */'spontane Hyperraumverzerrung'/* hat es deiner Expedition ermöglicht, eine große Menge dunkler Materie sicherzustellen!'*/,
            /*LOCA: pl 'Unsere Expedition meldet einen ersten Kontakt der besonderen Art. Anscheinend hat */'eine Energiekreatur, die sich Legorianer nannte'/*, die Schiffe der Expedition durchflogen und dann beschlossen, der unterentwickelten Spezies ein wenig auszuhelfen - es materialisierte sich ein Behälter mit dunkler Materie an Bord der Brücke!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`Zrabowano: (?<amount>[^\\s]+) (?<name>${darkMatter})`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'Twoja */'ekspedycja natrafiła na małą asteroidę'/* , z której można pozyskać trochę surowców.'*/,
            /*'Znaleźliśmy łatwo dostępne pola */'surowców na odległej planetoidzie'/* i wydobyliśmy pewną ich ilość.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Twoja ekspedycja przez przypadek natrafiła na w */'pełni załadowany, ale opuszczony konwój fregat'/* . Udało się odzyskać część surowców.'*/,
            /*LOCA: pl 'Auf einem kleinen Mond mit eigener Atmosphäre fand deine Expedition */'große Rohstoffvorkommen'/*. Die Bodencrews sind dabei, diese natürlichen Schätze zu heben.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Pierścienie */'minerałów wokół nieznanej planety zawierają niezliczone'/* ilości surowców. Statki wracają z pełnymi ładowniami.'*/,
            /*LOCA: pl 'Deine Expeditionsflotte meldet den */'Fund eines riesigen Alien-Schiffswracks'/*. Mit der Technologie konnten sie zwar nichts anfangen, aber das Schiff ließ sich in seine Einzelteile zerlegen, wodurch man wertvolle Rohstoffe gewinnen konnte.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`Zrabowano: (?<amount>.+) (?<name>${resources.join('|')})`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*'Natknęliśmy się na */'pozostałości po poprzedniej ekspedycji'/* . Nasi technicy postarają się uruchomić część statków.'*/,
            /*'Twoja ekspedycja natknęła się na */'twierdzę starożytnego imperatora opuszczoną wiele'/* lat temu. W jej hangarach znaleziono statki, które technicy usiłują ponownie uruchomić.'*/,
            /*'Ekspedycja natknęła się na */'planetę niemalże całkowicie zniszczoną przez wojny'/* . Różne statki krążą na orbicie. Technicy starają się naprawić niektóre z nich. Może uda się również uzyskać informacje, co się tu wydarzyło.'*/,
            /*'Znaleźliśmy */'opuszczoną stację piratów'/* , a w jej hangarach stare statki. Technicy dokonują oględzin i sprawdzają, czy niektóre z nich mogą zostać wykorzystane.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*LOCA: pl 'Unsere Expedition stieß auf eine */'alte automatische Schiffswerft'/*. Einige Schiffe sind noch in der Produktionsphase und unsere Techniker versuchen, die Energieversorgung der Werft wiederherzustellen.'*/,
            /*LOCA: pl 'Wir haben die */'Reste einer Armada'/* gefunden. Die Techniker der Expeditionsflotte haben sich sofort auf die halbwegs intakten Schiffe begeben und versuchen, diese wieder instand zu setzen.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: pl 'Wir haben einen */'riesigen Raumschiffsfriedhof'/* gefunden. Einigen Technikern der Expeditionsflotte ist es gelungen, das ein oder andere Schiff wieder in Betrieb zu nehmen.'*/,
            /*LOCA: pl 'Wir haben einen Planeten mit */'Resten einer Zivilisation'/* entdeckt.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`Następujące statki dołączyły do floty:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
    },

    [ExpeditionEventType.nothing]: [
        /*'Mimo pierwszych o*/'biecujących skanów tego sektora'/* , ekspedycja powróciła z pustymi rękami.'*/,
        /*'Poza osobliwymi małymi */'zwierzętami pochodzącymi z nieznanej bagiennej planety'/* ekspedycja nie przywiozła z wyprawy niczego groźnego.'*/,
        /*'Ekspedycja napotkała na */'rozległą pustkę w przestrzeni'/* , w której nie było nawet małej asteroidy, promieniowania lub czegokolwiek, co mogłoby zagrozić ekspedycji.'*/,
        /*'Żywa istota */'zbudowana z czystej energii spowodowała'/* , że wszyscy członkowie ekspedycji zaczęli wpatrywać się w hipnotyzujące wzory na ekranach. Gdy załoga się ocknęła, okazało się, że ekspedycja musi zostać przerwana z powodu małej ilości deuteru.'*/,
        /*'Awaria */'reaktora głównego statku ekspedycji niemalże zniszczyła'/* całą flotę. Na szczęście technicy byli bardzo kompetentni i udało się uniknąć najgorszego. Naprawa zabrała sporo czasu i ekspedycja musiała wrócić nie wykonawszy zadania.'*/,
        /*'Podczas */'wyprawy zrobiono wspaniałe zdjęcia supernowej'/* . Niestety nic innego nie udało się przywieźć, lecz przynajmniej są spore szanse na wygranie tegorocznego konkursu "Fotografia Roku Wszechświata".'*/,
        /*'Ekspedycja */'śledziła dziwny sygnał od jakiegoś czasu'/* . W końcu okazało się, że sygnał nadawany był ze starej sondy wysłanej pokolenia temu celem przywitania się z innymi gatunkami. Sondę uratowano, a wiele muzeów na Twojej rodzinnej planecie wyraziło zainteresowanie nią.'*/,
        /*'Teraz wiemy, że czerwone */'anomalie klasy 5 nie tylko destabilizują'/* systemy nawigacyjne statków, ale także powodują halucynacje u wielu członków załogi. Ekspedycja nie przywiozła niczego z wyprawy.'*/,
        /*LOCA: pl 'Deine Expeditionsflotte geriet gefährlich nahe an */'das Gravitationsfeld eines Neutronensterns'/* und musste einige Zeit kämpfen, um sich daraus zu befreien. Dadurch wurde sehr viel Deuterium verbraucht und die Expeditionsflotte kehrte schließlich unverrichteter Dinge zurück.'*/,
        /*'Dziwny */'wirus komputerowy zaatakował system nawigacji'/* krótko po tym, jak ekspedycja opuściła rodzimy układ słoneczny. Spowodowało to, że ekspedycja zaczęła zataczać okręgi. Rzecz jasna, ekspedycja nie należała do udanych.'*/,
        /*LOCA: pl 'Vielleicht hätte man den */'Geburtstag des Captains'/* nicht auf diesem abgelegenen Planeten feiern sollen. Ein fieses Dschungelfieber hat große Teile der Crew gezwungen, die Reise in der Krankenstation zu verbringen. Der unerwartete Personalausfall führte dazu, dass die Expedition scheiterte.'*/,
        /*'Ktoś zainstalował w */'komputerach statku starą grę strategiczną'/* . Misja ekspedycji trwała długo, lecz nie była zbyt owocna.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*LOCA: pl 'Das Letzte, was von dieser Expedition noch gesendet wurde, waren einige unglaublich gut gelungene */'Nahaufnahmen eines sich öffnenden schwarzen Lochs'/*.'*/,
        /*LOCA: pl 'Von der Expedition ist */'nur noch folgender Funkspruch übrig'/* geblieben: Zzzrrt Oh Gott! Krrrzzzzt dass zrrrtrzt sieht krgzzzz ja aus wie Krzzzzzzzztzzzz ...'*/,
        /*LOCA: pl 'Ein Kernbruch des Führungsschiffes führte zu einer Kettenreaktion, die in einer durchaus */'spektakulären Explosion die gesamte Expedition'/* vernichtete.'*/,
        /*LOCA: pl 'Die Expeditionsflotte ist */'nicht mehr aus dem Sprung in den Normalraum'/* zurückgekehrt. Unsere Wissenschaftler rätseln noch immer, was geschehen sein könnte, jedoch scheint die Flotte endgültig verloren zu sein.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*LOCA: pl 'Deine Expeditionsflotte hatte kurzen */'Kontakt zu einer scheuen Alien-Rasse'/*.'*/,
        /*LOCA: pl 'Deine Expeditionsflotte hatte ein Notsignal aufgefangen. Es handelte sich um einen Megafrachter, der im starken Gravitationsfeld eines Planetoiden gefangen war. Nachdem der Frachter erfolgreich befreit worden war, verkündete der Frachterkapitän feierlich, seine Befreier als bevorzugte Exklusivkunden */'in sein schwarzes Buch'/* aufzunehmen.'*/,
    ],

    [ExpeditionEventType.early]: [
        /*LOCA: pl 'Eine unvorhergesehene */'Rückkopplung in den Energiespulen'/* der Antriebsaggregate beschleunigte den Rücksprung der Expedition, so dass sie nun früher als erwartet zurückkehrt. Ersten Meldungen zufolge hat sie jedoch nichts Spannendes zu berichten.'*/,
        /*'Twoja ekspedycja nie wykryła żadnych anomalii w badanym rejonie. Jednak flota */'wpadła w wiatr słoneczny podczas powrotu'/* . Z tego powodu podróż uległa znacznemu skróceniu. Twoja ekspedycja wróci do domu nieco wcześniej.'*/,
        /*LOCA: pl 'Der etwas wagemutige neue */'Kommandant nutzte ein instabiles Wurmloch'/*, um den Rückflug zu verkürzen - mit Erfolg! Jedoch hat die Expedition selbst keine neuen Erkenntnisse gebracht.'*/,
    ],

    [ExpeditionEventType.delay]: [
        /*LOCA: pl 'Ein böser Patzer des Navigators führte zu einer */'Fehlkalkulation beim Sprung'/* der Expedition.'*/,
        /*LOCA: pl 'Deine Expedition geriet in einen */'Sektor mit verstärkten Partikelstürmen'/*. Dadurch überluden sich die Energiespeicher der Flotte und bei sämtlichen Schiffen fielen die Hauptsysteme aus. Deine Mechaniker konnten das Schlimmste verhindern, jedoch wird die Expedition nun mit einiger Verspätung zurückkehren.'*/,
        /*LOCA: pl 'Aus bisher unbekannten Gründen ging der */'Sprung der Expeditionsflotte völlig daneben'/*. Beinahe wären die Schiffe im Herzen einer Sonne angekommen. Zum Glück ist man in einem bekannten System gelandet, jedoch wird der Rücksprung länger dauern als ursprünglich gedacht.'*/,
        /*'Gwiezdny wiatr */'wiejący ze strony czerwonego giganta uniemożliwił skok'/* ekspedycji w nadprzestrzeń, przez co wydłuży się obliczenie skoku powrotnego. W tym sektorze nie było niczego poza pustką między gwiazdami. Flota wróci później, niż oczekiwano.'*/,
        /*LOCA: pl 'Das neue */'Navigationsmodul hat wohl doch noch mit einigen Bugs'/* zu kämpfen. Nicht nur ging der Sprung der Expeditionsflotte in die völlig falsche Richtung, auch wurde das gesamte Deuterium verbraucht, wobei der Sprung der Flotte nur knapp hinter dem Mond des Startplaneten endete. Etwas enttäuscht kehrt die Expedition nun auf Impuls zurück. Dadurch wird die Rückkehr wohl ein wenig verzögert.'*/,
        /*'Główny */'statek ekspedycyjny zderzył się z nieznanym statkiem'/* , który nagle wpadł w lecącą flotę. Ów statek wybuchł poważnie uszkadzając statek ekspedycyjny. Jak tylko zostaną przeprowadzone potrzebne naprawy, flota zawróci na planetę startową, ponieważ dalszy lot w takich warunkach nie jest możliwy.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /Do ekwipunku dodano (?<name>.+)/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*LOCA: pl 'Ein paar anscheinend */'sehr verzweifelte Weltraumpiraten'/* haben versucht,'*/,
            /*'Jacyś */'prymitywni barbarzyńcy atakują nas z użyciem pojazdów'/* , których nie można nazwać statkami kosmicznymi. Jeżeli ostrzał z ich strony będzie się nasilać, będziemy zmuszeni odpowiedzieć ogniem.'*/,
            /*LOCA: pl 'Wir haben ein paar */'Funksprüche sehr betrunkener Piraten'/* aufgefangen.'*/,
            /*LOCA: pl 'Wir */'mussten uns gegen einige Piraten wehren'/*, die zum Glück nicht allzu zahlreich waren.'*/,
            /*LOCA: pl 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*LOCA: pl 'Deine Expeditionsflotte hatte ein */'unschönes Zusammentreffen mit einigen Weltraumpiraten'/*.'*/,
            /*LOCA: pl 'Wir sind in den */'Hinterhalt einiger Sternen-Freibeuter'/* geraten!'*/,
            /*LOCA: pl 'Der Hilferuf, dem die Expedition folgte, stellte sich als */'böse Falle einiger arglistiger Sternen-Freibeuter'/* heraus. Ein Gefecht war unvermeidlich.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: pl 'Die aufgefangenen Signale stammten nicht von Fremdwesen, sondern */'von einer geheimen Piratenbasis'/* ! Die Piraten waren von unserer Anwesenheit in ihrem Sektor nicht besonders begeistert.'*/,
            /*LOCA: pl 'Die Expeditionsflotte meldet */'schwere Kämpfe mit nicht-identifizierten Piratenschiffen'/*.'*/,
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*'Kilka */'egzotycznie wyglądających statków zaatakowało twoją ekspedycję'/* bez żadnego ostrzeżenia'*/,
            /*'Twoja ekspedycja */'napotkała niezbyt przyjazną rasę obcych'/* ...'*/,
            /*LOCA: pl 'Unsere Expedition wurde von einer */'kleinen Gruppe unbekannter Schiffe'/* angegriffen.'*/,
            /*LOCA: pl 'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*LOCA: pl 'Eine */'unbekannte Spezies greift unsere Expedition'/* an!'*/,
            /*LOCA: pl 'Deine */'Expeditionsflotte hat anscheinend das Hoheitsgebiet'/* einer bisher unbekannten, aber äußerst aggressiven und kriegerischen Alienrasse verletzt.'*/,
            /*LOCA: pl 'Die Verbindung zu unserer Expeditionsflotte wurde kurzfristig gestört. Sofern wir die letzte Botschaft richtig entschlüsselt haben, steht die Flotte unter schwerem Feuer; die */'Aggressoren konnten nicht identifiziert werden'/*.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: pl 'Deine Expedition ist in eine Alien-Invasions-Flotte geraten und */'meldet schwere Gefechte'/*.'*/,
            /*LOCA: pl 'Wir hatten Mühe den korrekten */'Dialekt einer Alienrasse'/* auszusprechen. Unser Diplomat rief daher "Feuer!" statt "Friede!".'*/,
            /*LOCA: pl 'Ein großer */'Verband kristalliner Schiffe unbekannter Herkunft'/* hält direkten Kollisionskurs mit unserer Expeditionsflotte. Wir müssen nun wohl vom Schlimmsten ausgehen.'*/,
        ],
    },

    logbookRegex: /*LOCA: pl *//Logbuchnachtrag des Kommunikationsoffiziers:(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*LOCA: pl 'Dieser Bereich des Universums ist */'wohl noch nicht erkundet worden',
            /*LOCA: pl 'Es ist ein erhebendes Gefühl, der */'Erste in einem unerforschten Sektor'/* zu sein'*/,
        ],
        [ExpeditionDepletionLevel.low]: [
            /*LOCA: pl 'Es scheint nicht so, als ob */'jemals ein Mensch in diesem Bereich der Galaxis'/* gewesen wäre.'*/,
            /*LOCA: pl 'Es wurden */'sehr alte Signaturen von Raumschiffen'/* entdeckt. Wir sind also nicht die Ersten hier.'*/,
            /*LOCA: pl 'Wir hatten beinahe eine */'Kollision mit einer anderen Expeditionsflotte'/*. Hätte nicht gedacht, dass sich hier noch andere herumtreiben.'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*LOCA: pl 'Wir haben den Abschluss der Expedition mit den Crewmitgliedern einer zweiten Expeditionsflotte, die im selben Sektor unterwegs war, gefeiert. */'Die haben auch nichts Spannendes zu berichten',
            /*LOCA: pl 'Es wurden */'Anzeichen für die Präsenz anderer Expeditionsflotten'/* gefunden.'*/,
            /*LOCA: pl 'Es wurde */'friedlicher Funkkontakt zu einigen anderen Expeditionen'/* in diesem Sektor hergestellt.'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /*LOCA: pl 'Wenn wir uns zu unsicher fühlen, können wir uns ja */'mit all den anderen Expeditionen'/*, die hier herum fliegen, zusammen tun.'*/,
        ],
    },
};