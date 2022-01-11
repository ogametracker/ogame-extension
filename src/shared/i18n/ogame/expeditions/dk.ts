import { ExpeditionEventSize } from "../../../models/v1/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../models/v1/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const dk: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*'Det var muligt for din */'ekspedition at indfange og konservere'/* en del Mørk Materie.'*/,
            /*'Vi har fundet resterne af et */'rumskib af ukendt oprindelse'/*. På skibet var der en lille beholder med Mørk Materie!'*/,
            /*'Vi mødte et */'oldgammelt væsen'/* af ukendt race, i et mindre rumskib. Han gav os en lille kasse med Mørk Materie i bytte for nogle simple matematiske udregninger.'*/,
            /*'Din ekspedition har */'fundet et spøgelsesskib'/* som transporterede en mindre mængde Mørk Materie. De fandt ikke ud af hvad der var sket med besætningen, men dine ingeniører har indsamlet det Mørke Materie.'*/,
            /*'Din ekspedition fulgte */'nogle gamle signaler'/* og fandt en asteroide. I kernen af asteroiden var en mindre mængde Mørk Materie indkapslet. Dine ingeniører prøver at udvinde det Mørke Materie.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Vores ekspedition gennemførte et */'unikt eksperiment'/*. Det var muligt at høste Mørk Materie fra en døende stjerne.'*/,
            /*'Unsere Expedition hat eine */'uralte Raumstation gefunden'/*, die wohl schon seit langer Zeit unkontrolliert durch das All schwebt. Die Station selbst war komplett unbrauchbar, jedoch lagerte in einem ihrer Reaktoren noch ein wenig Dunkler Materie. Unsere Techniker versuchen, so viel wie möglich davon zu bergen.'*/,
            /*'Unsere Expedition meldet ein seltsames spektrales Phänomen. Dies führte unter anderem dazu, dass sich in den */'Energiespeichern der Schiffsschilde Dunkle Materie'/* bildete. Unsere Techniker versuchen nun, solange das Phänomen noch anhält, möglichst viel dieser Dunklen Materie zu konservieren.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Eine */'spontane Hyperraumverzerrung'/* hat es deiner Expedition ermöglicht, eine große Menge dunkler Materie sicherzustellen!'*/,
            /*'Unsere Expedition meldet einen ersten Kontakt der besonderen Art. Anscheinend hat */'eine Energiekreatur, die sich Legorianer nannte'/*, die Schiffe der Expedition durchflogen und dann beschlossen, der unterentwickelten Spezies ein wenig auszuhelfen - es materialisierte sich ein Behälter mit dunkler Materie an Bord der Brücke!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`(?<name>${darkMatter}) (?<amount>[^\\s]+) er blevet taget`),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'Din ekspedition fandt en */'lille asteroide'/*, hvorfra nogle ressourcer kunne opsamles.'*/,
            /*'På en */'isoleret planet'/*, fandt vi nogle let tilgængelige ressourceområder og høstede dem.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Din ekspedition fandt en gammel, fuldt lastet og */'forladt konvoj af transportskibe'/*. Nogen af ressourcerne kunne reddes.'*/,
            /*'På en */'lille måne med egen atmosfære'/*, fandt din ekspedition nogle store ressourcelagre. Mandskabet prøver at laste ressourcerne.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Ein */'Mineraliengürtel'/* um einen unbekannten Planeten enthielt Unmengen an Rohstoffen. Die Expeditionsflotte meldet volle Lager!'*/,
            /*'Deine Expeditionsflotte meldet den */'Fund eines riesigen Alien-Schiffswracks'/*. Mit der Technologie konnten sie zwar nichts anfangen, aber das Schiff ließ sich in seine Einzelteile zerlegen, wodurch man wertvolle Rohstoffe gewinnen konnte.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`(?<name>${resources.join('|')}) (?<amount>.+) er blevet taget.`),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*'Vi kom forbi resterne af en */'tidligere ekspedition'/*. Vores teknikere vil forsøge at få nogle af skibene til at virke igen.'*/,
            /*'Vores ekspedition har fundet en */'forladt stjernefæstning'/*. I hangaren fandt vi nogle skibe. Vores tekniker prøver at få dem i gang igen.'*/,
            /*'Vores ekspedition fandt en planet, som næsten var */'blevet ødelagt af konstante angreb'/*. I omløbsbanen lå diverse skibsruiner. Vores tekniker prøver at reparere nogle af dem. Måske kan vi på denne måde få informationer om, hvad der er sket i området.'*/,
            /*'Vi har fundet en */'forladt piratbase'/*. I deres hangar lå nogle gamle skibe. Vores tekniker er på vej for at finde ud om de kan genbruges.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Ekspeditionen rendte ind i et gammel */'automatisk rumskibsværft'/*. Nogen af skibene er stadig i produktionsfasen og vores teknikere forsøger at genaktivere værftets generatorer.'*/,
            /*'Vi fandt resterne af en flåde. */'Teknikerne tog direkte hen ti'/*l de næsten intakte skibe for at se om de kunne få dem til at virke igen.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Vi fandt en */'enorm rumskibs gravplads'/*. Nogle af teknikerne fra ekspeditionen fik en del af skibene til at virke igen.'*/,
            /*'Wir haben einen Planeten mit */'Resten einer Zivilisation'/* entdeckt.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`e følgende skibe er nu del af flåden.(<br>|\\s*)(?<ships>((${ships.join('|')}):\\s*\\d+(<br>|\\s*)?)+)?`),
    },

    [ExpeditionEventType.nothing]: [
        /*'Trods det første, meget lovende skan af sektoren kom vi */'desværre tilbage'/* uden noget.'*/,
        /*'Udover nogle underlige, smådyr på en ukendt */'sumpplanet'/* skete der ikke noget spændende.'*/,
        /*'Din ekspedition har */'lært om de store tomrum'/* i rummet. Der var ikke engang en lille asteroide eller en radioaktiv partikel, der kunne have gjort denne ekspedition spændende.'*/,
        /*'En */'skabelse af ren energi sikrede'/* at ekspeditionsmedlemmerne stirrede på hypnotiserende skærmbilleder. Da de fleste af dem kom til sig selv igen, var de nødt til at afbryde ekspeditionen grundet for lidt deuterium.'*/,
        /*'En fejl i */'moderskibets reaktor'/* ødelagde næsten hele ekspeditionsflåden. Heldigvis var teknikerne kompetente og kunne afværge de fleste problemer. Reparationen tog noget tid og tvang ekspeditionen til at returnere uden resultat.'*/,
        /*'Din ekspedition tog */'fantastiske billeder af en Super nova'/*. Ekspeditionen fandt intet nyt, men der burde være en god chance for at vinde "Det bedste billede af universet" i år.'*/,
        /*'Din ekspeditionsflåde */'opsnapper nogle underlige signaler'/*, som de finder ud af kommerfra en gammel sonde, der er blevet sendt afsted for flere årtier siden for at søge efter fremmede livsformer. Den gamle sonde bliver opsamlet og transporteret med hjem. Nogle gamle museer har nok interesse i den!'*/,
        /*'Tja, nu ved vi at de der */'røde klasse 5 uregelmæssigheder'/* ikke kun har en kaotisk effekt på navigationssystemet, men også giver massiv hallucination blandt besætningen. Ekspeditionen fandt ikke noget nyt'*/,
        /*'Ekspeditionsflåden kom tæt på */'gravitationsfeltet af en neutronstjerne'/* og brugte lang tid på at komme ud af den. Andet kom flåden ikke til at opleve.'*/,
        /*'En */'underlig computervirus'/* angreb navigationssystemet kort efter afgang. Dette gjorde at ekspeditionsflåden fløj i cirkler, Unødvendigt at sige den ikke rigtig var succesfuld.'*/,
        /*'*/'Kaptajnens fødselsdagsfest'/* burde nok ikke være blevet holdt på den isolerede planet. En ukendt feber gjorde, at hospitalet var overbooket under resten af ekspeditionen. Grundet mandskabsmangel kollapsede ekspeditionen.'*/,
        /*'På grund af en fejl i det */'centrale computersystem på moderskibet'/*, måtte ekspeditionen afbrydes. Beklageligvis returnerer flåden tomhændet.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*'Den sidste radiotransmission vi modtog fra ekspeditionsflåden var, at de var i gang med at tage billeder af et */'nyt sort hul'/*.'*/,
        /*'Von der Expedition ist */'nur noch folgender Funkspruch übrig'/* geblieben: Zzzrrt Oh Gott! Krrrzzzzt dass zrrrtrzt sieht krgzzzz ja aus wie Krzzzzzzzztzzzz ...'*/,
        /*'Ein Kernbruch des Führungsschiffes führte zu einer Kettenreaktion, die in einer durchaus */'spektakulären Explosion die gesamte Expedition'/* vernichtete.'*/,
        /*'*/'Ekspeditionsflåden kom ikke tilbage'/*. Vores flådeadmiraler prøver stadig at finde ud af hvad der er sket, men det ser ud til at flåden er tabt for evigt.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*'Din ekspeditionsflåde har opnået kontakt med en hidtil ukendt race. De meddeler at de vil sende en af */'deres repræsentanter til din verden'/*, som du kan handle råstoffer med.'*/,
        /*'Deine Expeditionsflotte hatte ein Notsignal aufgefangen. Es handelte sich um einen Megafrachter, der im starken Gravitationsfeld eines Planetoiden gefangen war. Nachdem der Frachter erfolgreich befreit worden war, verkündete der Frachterkapitän feierlich, seine Befreier als bevorzugte Exklusivkunden */'in sein schwarzes Buch'/* aufzunehmen.'*/,
    ],

    [ExpeditionEventType.early]: [
        /*'En */'uforudset tilbagekobling i energispolen'/* på motoren gør, at din ekspedition vender tilbage tidligere end forventet. Den første rapport fortæller, at der ikke er nogen forklaring på fejlen.'*/,
        /*'Deine Expedition meldet keine Besonderheiten in dem erforschten Sektor. Jedoch geriet die Flotte */'beim Rücksprung in einen Sonnenwind'/*. Dadurch wurde der Sprung beschleunigt. Deine Expedition kehrt nun etwas früher nach Hause.'*/,
        /*'Den nye og vovede kommandør har med succes */'rejst til et ustabilt ormehul'/* for at gøre rejsen hjem kortere! Dog bringer selve ekspedition intet nyt.'*/,
    ],

    [ExpeditionEventType.delay]: [
        /*'Din */'navigationschef havde en dårlig dag'/* og fik lavet en fejl i ekspeditionsrutens udregninger. Udover at din flåde er endt et ukendt sted, vil det også tage længere tid at flyve hjem.'*/,
        /*'Din ekspedition er kommet ind i en */'partikelstorm'/*. Dette overbelastede energisystemet og det meste af skibets hovedsystem er derfor brudt sammen. Dine mekanikere fik afværget det værste. Din ekspedition vender tilbage med stor forsinkelse.'*/,
        /*'På grund af en ukendt fejl gik ekspeditionen helt galt. Den */'landede næsten i hjertet af solen'/*. Heldigvis landede den i et kendt system, men tilbageturen vil tage lidt længere tid end beregnet.'*/,
        /*'*/'Stjernevinden i en gigantisk rød stjerne'/* ødelagde ekspeditionen. Det vil tage lidt længere tid at udregne ruten tilbage. Der var iøvrigt ikke andet end tomhed mellem stjernerne i denne sektor. Flåden vil returnere senere end forventet.'*/,
        /*'Det */'nye navigationsmodul har stadigvæk nogle fejl'/*. Ekspeditionshoppet medførte ikke alene at din ekspedition er endt på en helt forkert kurs, men alt deuteriummet er også blevet opbrugt. Heldigvis fik hoppet bragt dig tæt på en nærliggende måne, hvis tiltrækningskraft kan udnyttes til at komme på rette kurs hjem mod planeten. En skuffet besætning flyver nu tilbage uden impuls. Rejsen vil derfor tage del længere tid end først antaget.'*/,
        /*'Ekspeditionens moderskib havde et */'sammenstød med et fremmed skib'/*. Det fremmede skib eksploderede og den efterfølgende skade på moderskibet var omfattende. Det kan ikke flyve videre i nuværende tilstand. Lige så snart de nødvendige reparationer er lavet, vil dit skib flyve tilbage.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /(?<name>.+) er blevet tilføjet til inventaret/,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*'Nogle øjensynligt */'fortvivlede pirater'/*, har prøvet at kapre vores ekspeditions flåde.'*/,
            /*'Einige */'primitive Barbaren greifen uns mit Raumschiffen'/* an, die nicht einmal ansatzweise die Bezeichnung Raumschiff verdient haben. Sollte der Beschuss ernstzunehmende Ausmaße annehmen, sehen wir uns gezwungen, das Feuer zu erwidern.'*/,
            /*'Vi har sporet */'nogle berusede pirater'/*, der planlægger at overfalde os.'*/,
            /*'Under ekspeditionen blev vi nødt til at */'kæmpe mod nogle få piratskibe'/*.'*/,
            /*'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Deine Expeditionsflotte hatte ein */'unschönes Zusammentreffen mit einigen Weltraumpiraten'/*.'*/,
            /*'Wir sind in den */'Hinterhalt einiger Sternen-Freibeuter'/* geraten!'*/,
            /*'Vi faldt i baghold af */'nogle piratskibe'/*! En kamp var uundgåelig.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Die aufgefangenen Signale stammten nicht von Fremdwesen, sondern */'von einer geheimen Piratenbasis'/*! Die Piraten waren von unserer Anwesenheit in ihrem Sektor nicht besonders begeistert.'*/,
            /*'Die Expeditionsflotte meldet */'schwere Kämpfe mit nicht-identifizierten Piratenschiffen'/*.'*/,
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*'Einige */'fremdartig anmutende Schiffe'/* haben ohne Vorwarnung die Expeditionsflotte angegriffen.'*/,
            /*'Din ekspeditionsflåde havde ikke en */'venlig første kontakt'/* med en ukendt race.'*/,
            /*'Vores ekspedition blev angrebet af en */'mindre gruppe af ukendte skibe'/*!'*/,
            /*'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Et */'fremmedartet skib angriber din ekspeditionsflåde'/* uden varsel!'*/,
            /*'Deine */'Expeditionsflotte hat anscheinend das Hoheitsgebiet'/* einer bisher unbekannten, aber äußerst aggressiven und kriegerischen Alienrasse verletzt.'*/,
            /*'Die Verbindung zu unserer Expeditionsflotte wurde kurzfristig gestört. Sofern wir die letzte Botschaft richtig entschlüsselt haben, steht die Flotte unter schwerem Feuer; die */'Aggressoren konnten nicht identifiziert werden'/*.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Deine Expedition ist in eine Alien-Invasions-Flotte geraten und */'meldet schwere Gefechte'/*.'*/,
            /*'Wir hatten Mühe den korrekten */'Dialekt einer Alienrasse'/* auszusprechen. Unser Diplomat rief daher "Feuer!" statt "Friede!".'*/,
            /*'Ein großer */'Verband kristalliner Schiffe unbekannter Herkunft'/* hält direkten Kollisionskurs mit unserer Expeditionsflotte. Wir müssen nun wohl vom Schlimmsten ausgehen.'*/,
        ],
    },
};