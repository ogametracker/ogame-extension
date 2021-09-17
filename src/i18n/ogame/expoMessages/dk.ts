import ExpoSize from "@/models/expeditions/ExpoSize";
import ExpoType from "@/models/expeditions/ExpoType";
import { I18nOgamePremium } from "../premium";
import { I18nOgameResources } from "../resources";
import { I18nOgameShips } from "../ships";

export default {
    [ExpoType.darkMatter]: {
        [ExpoSize.small]: [
            /*'Det var muligt for din */'ekspedition at indfange og konservere'/* en del Mørk Materie.'*/,
            /*'Vi har fundet resterne af et */'rumskib af ukendt oprindelse'/*. På skibet var der en lille beholder med Mørk Materie!'*/,
            /*'Vi mødte et */'oldgammelt væsen'/* af ukendt race, i et mindre rumskib. Han gav os en lille kasse med Mørk Materie i bytte for nogle simple matematiske udregninger.'*/,
            /*'Din ekspedition har */'fundet et spøgelsesskib'/* som transporterede en mindre mængde Mørk Materie. De fandt ikke ud af hvad der var sket med besætningen, men dine ingeniører har indsamlet det Mørke Materie.'*/,
            /*'Din ekspedition fulgte */'nogle gamle signaler'/* og fandt en asteroide. I kernen af asteroiden var en mindre mængde Mørk Materie indkapslet. Dine ingeniører prøver at udvinde det Mørke Materie.'*/,
        ],
        [ExpoSize.medium]: [
            /*'Vores ekspedition gennemførte et */'unikt eksperiment'/*. Det var muligt at høste Mørk Materie fra en døende stjerne.'*/,
            /*'Unsere Expedition hat eine */'uralte Raumstation gefunden'/*, die wohl schon seit langer Zeit unkontrolliert durch das All schwebt. Die Station selbst war komplett unbrauchbar, jedoch lagerte in einem ihrer Reaktoren noch ein wenig Dunkler Materie. Unsere Techniker versuchen, so viel wie möglich davon zu bergen.'*/,
            /*'Unsere Expedition meldet ein seltsames spektrales Phänomen. Dies führte unter anderem dazu, dass sich in den */'Energiespeichern der Schiffsschilde Dunkle Materie'/* bildete. Unsere Techniker versuchen nun, solange das Phänomen noch anhält, möglichst viel dieser Dunklen Materie zu konservieren.'*/,
        ],
        [ExpoSize.large]: [
            /*'Eine */'spontane Hyperraumverzerrung'/* hat es deiner Expedition ermöglicht, eine große Menge dunkler Materie sicherzustellen!'*/,
            /*'Unsere Expedition meldet einen ersten Kontakt der besonderen Art. Anscheinend hat */'eine Energiekreatur, die sich Legorianer nannte'/*, die Schiffe der Expedition durchflogen und dann beschlossen, der unterentwickelten Spezies ein wenig auszuhelfen - es materialisierte sich ein Behälter mit dunkler Materie an Bord der Brücke!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`(?<name>${darkMatter}) (?<amount>[^\\s]+) er blevet taget`),
    },

    [ExpoType.resources]: {
        [ExpoSize.small]: [
            /*'Din ekspedition fandt en */'lille asteroide'/*, hvorfra nogle ressourcer kunne opsamles.'*/,
            /*'På en */'isoleret planet'/*, fandt vi nogle let tilgængelige ressourceområder og høstede dem.'*/,
        ],
        [ExpoSize.medium]: [
            /*'Din ekspedition fandt en gammel, fuldt lastet og */'forladt konvoj af transportskibe'/*. Nogen af ressourcerne kunne reddes.'*/,
            /*'På en */'lille måne med egen atmosfære'/*, fandt din ekspedition nogle store ressourcelagre. Mandskabet prøver at laste ressourcerne.'*/,
        ],
        [ExpoSize.large]: [
            /*'Ein */'Mineraliengürtel'/* um einen unbekannten Planeten enthielt Unmengen an Rohstoffen. Die Expeditionsflotte meldet volle Lager!'*/,
            /*'Deine Expeditionsflotte meldet den */'Fund eines riesigen Alien-Schiffswracks'/*. Mit der Technologie konnten sie zwar nichts anfangen, aber das Schiff ließ sich in seine Einzelteile zerlegen, wodurch man wertvolle Rohstoffe gewinnen konnte.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`(?<name>${resources.join('|')}) (?<amount>.+) er blevet taget.`),
    },

    [ExpoType.fleet]: {
        [ExpoSize.small]: [
            /*'Vi kom forbi resterne af en */'tidligere ekspedition'/*. Vores teknikere vil forsøge at få nogle af skibene til at virke igen.'*/,
            /*'Vores ekspedition har fundet en */'forladt stjernefæstning'/*. I hangaren fandt vi nogle skibe. Vores tekniker prøver at få dem i gang igen.'*/,
            /*'Vores ekspedition fandt en planet, som næsten var */'blevet ødelagt af konstante angreb'/*. I omløbsbanen lå diverse skibsruiner. Vores tekniker prøver at reparere nogle af dem. Måske kan vi på denne måde få informationer om, hvad der er sket i området.'*/,
            /*'Vi har fundet en */'forladt piratbase'/*. I deres hangar lå nogle gamle skibe. Vores tekniker er på vej for at finde ud om de kan genbruges.'*/,
        ],
        [ExpoSize.medium]: [
            /*'Ekspeditionen rendte ind i et gammel */'automatisk rumskibsværft'/*. Nogen af skibene er stadig i produktionsfasen og vores teknikere forsøger at genaktivere værftets generatorer.'*/,
            /*'Vi fandt resterne af en flåde. */'Teknikerne tog direkte hen ti'/*l de næsten intakte skibe for at se om de kunne få dem til at virke igen.'*/,
        ],
        [ExpoSize.large]: [
            /*'Vi fandt en */'enorm rumskibs gravplads'/*. Nogle af teknikerne fra ekspeditionen fik en del af skibene til at virke igen.'*/,
            /*'Wir haben einen Planeten mit */'Resten einer Zivilisation'/* entdeckt.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`e følgende skibe er nu del af flåden.(<br>|\\s*)(?<ships>((${ships.join('|')}):\\s*\\d+(<br>|\\s*)?)+)?`),
    },

    [ExpoType.nothing]: [
        /*'Trods det første, meget lovende skan af sektoren kom vi */'desværre tilbage'/* uden noget.'*/,
        /*'Udover nogle underlige, smådyr på en ukendt */'sumpplanet'/* skete der ikke noget spændende.'*/,
        /*'Deine Expedition hat wortwörtlich mit der */'Leere des Alls'/* Bekanntschaft gemacht. Es gab nicht einmal einen kleinen Asteroiden oder Strahlung oder Partikel oder irgendetwas, das diese Expedition aufregend gestaltet hätte.'*/,
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

    [ExpoType.lostFleet]: [
        /*'Den sidste radiotransmission vi modtog fra ekspeditionsflåden var, at de var i gang med at tage billeder af et */'nyt sort hul'/*.'*/,
        /*'Von der Expedition ist */'nur noch folgender Funkspruch übrig'/* geblieben: Zzzrrt Oh Gott! Krrrzzzzt dass zrrrtrzt sieht krgzzzz ja aus wie Krzzzzzzzztzzzz ...'*/,
        /*'Ein Kernbruch des Führungsschiffes führte zu einer Kettenreaktion, die in einer durchaus */'spektakulären Explosion die gesamte Expedition'/* vernichtete.'*/,
        /*'Die Expeditionsflotte ist */'nicht mehr aus dem Sprung in den Normalraum'/* zurückgekehrt. Unsere Wissenschaftler rätseln noch immer, was geschehen sein könnte, jedoch scheint die Flotte endgültig verloren zu sein.'*/,
    ],

    [ExpoType.trader]: [
        /*'Deine Expeditionsflotte hatte kurzen */'Kontakt zu einer scheuen Alien-Rasse'/*.'*/,
        /*'Deine Expeditionsflotte hatte ein Notsignal aufgefangen. Es handelte sich um einen Megafrachter, der im starken Gravitationsfeld eines Planetoiden gefangen war. Nachdem der Frachter erfolgreich befreit worden war, verkündete der Frachterkapitän feierlich, seine Befreier als bevorzugte Exklusivkunden */'in sein schwarzes Buch'/* aufzunehmen.'*/,
    ],

    [ExpoType.early]: [
        /*'En */'uforudset tilbagekobling i energispolen'/* på motoren gør, at din ekspedition vender tilbage tidligere end forventet. Den første rapport fortæller, at der ikke er nogen forklaring på fejlen.'*/,
        /*'Deine Expedition meldet keine Besonderheiten in dem erforschten Sektor. Jedoch geriet die Flotte */'beim Rücksprung in einen Sonnenwind'/*. Dadurch wurde der Sprung beschleunigt. Deine Expedition kehrt nun etwas früher nach Hause.'*/,
        /*'Der etwas wagemutige neue */'Kommandant nutzte ein instabiles Wurmloch'/*, um den Rückflug zu verkürzen - mit Erfolg! Jedoch hat die Expedition selbst keine neuen Erkenntnisse gebracht.'*/,
    ],

    [ExpoType.delay]: [
        /*'Din */'navigationschef havde en dårlig dag'/* og fik lavet en fejl i ekspeditionsrutens udregninger. Udover at din flåde er endt et ukendt sted, vil det også tage længere tid at flyve hjem.'*/,
        /*'Din ekspedition er kommet ind i en */'partikelstorm'/*. Dette overbelastede energisystemet og det meste af skibets hovedsystem er derfor brudt sammen. Dine mekanikere fik afværget det værste. Din ekspedition vender tilbage med stor forsinkelse.'*/,
        /*'På grund af en ukendt fejl gik ekspeditionen helt galt. Den */'landede næsten i hjertet af solen'/*. Heldigvis landede den i et kendt system, men tilbageturen vil tage lidt længere tid end beregnet.'*/,
        /*'*/'Stjernevinden i en gigantisk rød stjerne'/* ødelagde ekspeditionen. Det vil tage lidt længere tid at udregne ruten tilbage. Der var iøvrigt ikke andet end tomhed mellem stjernerne i denne sektor. Flåden vil returnere senere end forventet.'*/,
        /*'Det */'nye navigationsmodul har stadigvæk nogle fejl'/*. Ekspeditionshoppet medførte ikke alene at din ekspedition er endt på en helt forkert kurs, men alt deuteriummet er også blevet opbrugt. Heldigvis fik hoppet bragt dig tæt på en nærliggende måne, hvis tiltrækningskraft kan udnyttes til at komme på rette kurs hjem mod planeten. En skuffet besætning flyver nu tilbage uden impuls. Rejsen vil derfor tage del længere tid end først antaget.'*/,
        /*'Ekspeditionens moderskib havde et */'sammenstød med et fremmed skib'/*. Det fremmede skib eksploderede og den efterfølgende skade på moderskibet var omfattende. Det kan ikke flyve videre i nuværende tilstand. Lige så snart de nødvendige reparationer er lavet, vil dit skib flyve tilbage.'*/,
    ],

    [ExpoType.item]: {
        regex: /(?<name>.+) er blevet tilføjet til inventaret/,
    },

    [ExpoType.pirates]: {
        [ExpoSize.small]: [
            /*'Nogle øjensynligt */'fortvivlede pirater'/*, har prøvet at kapre vores ekspeditions flåde.'*/,
            /*'Einige */'primitive Barbaren greifen uns mit Raumschiffen'/* an, die nicht einmal ansatzweise die Bezeichnung Raumschiff verdient haben. Sollte der Beschuss ernstzunehmende Ausmaße annehmen, sehen wir uns gezwungen, das Feuer zu erwidern.'*/,
            /*'Wir haben ein paar */'Funksprüche sehr betrunkener Piraten'/* aufgefangen.'*/,
            /*'Wir */'mussten uns gegen einige Piraten wehren'/*, die zum Glück nicht allzu zahlreich waren.'*/,
            /*'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpoSize.medium]: [
            /*'Deine Expeditionsflotte hatte ein */'unschönes Zusammentreffen mit einigen Weltraumpiraten'/*.'*/,
            /*'Wir sind in den */'Hinterhalt einiger Sternen-Freibeuter'/* geraten!'*/,
            /*'Vi faldt i baghold af */'nogle piratskibe'/*! En kamp var uundgåelig.'*/,
        ],
        [ExpoSize.large]: [
            /*'Die aufgefangenen Signale stammten nicht von Fremdwesen, sondern */'von einer geheimen Piratenbasis'/*! Die Piraten waren von unserer Anwesenheit in ihrem Sektor nicht besonders begeistert.'*/,
            /*'Die Expeditionsflotte meldet */'schwere Kämpfe mit nicht-identifizierten Piratenschiffen'/*.'*/,
        ],
    },

    [ExpoType.aliens]: {
        [ExpoSize.small]: [
            /*'Einige */'fremdartig anmutende Schiffe'/* haben ohne Vorwarnung die Expeditionsflotte angegriffen.'*/,
            /*'Deine Expeditionsflotte hatte einen */'nicht besonders freundlichen Erstkontakt'/* mit einer unbekannten Spezies.'*/,
            /*'Unsere Expedition wurde von einer */'kleinen Gruppe unbekannter Schiffe'/* angegriffen.'*/,
            /*'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpoSize.medium]: [
            /*'Eine */'unbekannte Spezies greift unsere Expedition'/* an!'*/,
            /*'Deine */'Expeditionsflotte hat anscheinend das Hoheitsgebiet'/* einer bisher unbekannten, aber äußerst aggressiven und kriegerischen Alienrasse verletzt.'*/,
            /*'Die Verbindung zu unserer Expeditionsflotte wurde kurzfristig gestört. Sofern wir die letzte Botschaft richtig entschlüsselt haben, steht die Flotte unter schwerem Feuer; die */'Aggressoren konnten nicht identifiziert werden'/*.'*/,
        ],
        [ExpoSize.large]: [
            /*'Deine Expedition ist in eine Alien-Invasions-Flotte geraten und */'meldet schwere Gefechte'/*.'*/,
            /*'Wir hatten Mühe den korrekten */'Dialekt einer Alienrasse'/* auszusprechen. Unser Diplomat rief daher "Feuer!" statt "Friede!".'*/,
            /*'Ein großer */'Verband kristalliner Schiffe unbekannter Herkunft'/* hält direkten Kollisionskurs mit unserer Expeditionsflotte. Wir müssen nun wohl vom Schlimmsten ausgehen.'*/,
        ],
    },
};