import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const da: ExpeditionMessages = {
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
            /*'Din ekspedition har */'lokaliseret en forhistorisk rumbase'/*, som tilsyneladende har fløjet ukontrolleret rundt i galaksen gennem længere tid. Selve rumbasen var ubrugelig men der blev fundet Mørk Materie som var blevet opbevaret i basens reaktor. Dine ingeniører prøver at redde så meget de kan.'*/,
            /*'Vores ekspedition */'rapporterer om et spektakulært fænomen'/*. En sammenhobning af Mørk Materie i energilageret i skibets skjolde. Vores teknikere prøver at holde på så meget Mørk Materie de kan, mens fænomenet er foranstående.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'En */'spontan hyper-space deformation tillader din ekspedition'/* at rede en stor mængde Mørk Materie!'*/,
            /*'Vores ekspeditionsflåde oprettede den første kontakt med en speciel race. Det så ud til at være et væsen lavet af energi, */'som kaldte sig selv Legorian'/* . Væsenet fløj gennem vores ekspeditionsskibe og besluttede sig for at hjælpe vores underudviklede race. En kasse med Mørk Materie blev materialiseret på broen af skibet.'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`(?<name>${darkMatter}) (?<amount>[^\\s]+) er blevet taget`, 'i'),
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
            /**/'Planetringene omkring planeten'/* indeholder uendelige mængder råstoffer. Ekspeditionsskibene vender tilbage med fyldte kamre!'*/,
            /*'Din ekspeditionsflåde har fundet et */'gigantisk rumskib af ukendt oprindelse'/*. Vi kunne ikke lære noget fra teknologierne brugt i det, men det lykkedes os at opdele det i dets grundenheder og udvinde nogle brugbare ressourcer af det.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`(?<name>${resources.join('|')}) (?<amount>.+) er blevet taget.`, 'i'),
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
            /*'Vi har fundet en */'planet med rester fra en ukendt civilisation'/*. Vi kan se en gigantisk rumstation cirkulere omkring planeten. Nogen af vores piloter og teknikere er taget til overfladen for at lede efter skibe, som måske stadig kan bruges.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`De følgende skibe er nu del af flåden.\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
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
        /*'Det eneste som var tilbage fra ekspeditionen, */'var den følgende radio transmission'/*: Zzzrrt Gud! Krrrzzzzt ligner zrrrtrzt S.o. krgzzzz S.O.S Krzzzzzzzztzzzz...'*/,
        /*'En */'kernenedsmeltning i moderskibet førte til en kædereaktion'/*, som knuste hele din ekspeditionsflåde på et splitsekund.'*/,
        /*'*/'Ekspeditionsflåden kom ikke tilbage'/*. Vores flådeadmiraler prøver stadig at finde ud af hvad der er sket, men det ser ud til at flåden er tabt for evigt.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*'Din ekspeditionsflåde har opnået kontakt med en hidtil ukendt race. De meddeler at de vil sende en af */'deres repræsentanter til din verden'/*, som du kan handle råstoffer med.'*/,
        /*'Din ekspeditionsflåde */'opsnappede et nødsignal'/*. Et enormt transportskib var blevet fanget af et stærkt gravitationsfelt - skabt af en asteroide. Efter at den store transporter var blevet bjerget, blev kaptajnen så glad at han meddelte, at dem som havde reddet dem var deres foretrukne og eksklusive klienter.'*/,
    ],

    [ExpeditionEventType.early]: [
        /*'En */'uforudset tilbagekobling i energispolen'/* på motoren gør, at din ekspedition vender tilbage tidligere end forventet. Den første rapport fortæller, at der ikke er nogen forklaring på fejlen.'*/,
        /*'Din ekspedition har ikke rapporteret nogen uregelmæssigheder i den udforskede sektor. Men */'flåden kommer ind i noget solvind'/*. På grund af dette vender din ekspedition hjem en smule hurtigere.'*/,
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
        regex: /(?<name>.+) er blevet tilføjet til inventaret/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*'Nogle øjensynligt */'fortvivlede pirater'/*, har prøvet at kapre vores ekspeditions flåde.'*/,
            /*'Nogle */'primitive barbarer angriber os med deres rumskibe'/* ; hvis man da overhovet kan kalde dem rumskibe. Hvis vores skibe udsættes for fare, bliver vi nødt til at skyde tilbage.'*/,
            /*'Vi har sporet */'nogle berusede pirater'/*, der planlægger at overfalde os.'*/,
            /*'Under ekspeditionen blev vi nødt til at */'kæmpe mod nogle få piratskibe'/*.'*/,
            /*LOCA: dk 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Din ekspeditionsflåde */'havde et ufint sammenstød med nogle rumpirater'/*.'*/,
            /*'Vi faldt i baghold af */'nogle piratskibe'/* ! En kamp var uundgåelig.'*/,
            /*'Ekspeditionsflåden fik fat i et nødsignal, */'hvilket viste sig til at være et baghold af nogle rumpirater'/* ! Vi kunne ikke flygte uden at kæmpe.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Der er modtaget signaler som ikke stammer fra fremmede */'væsener men derimod kommer fra en skjult piratbase'/* ! Piraterne var ikke glade for vores besøg i deres sektor.'*/,
            /*'Ekspeditionsflåden melder om kampe */'med ikke-identificerede piratskibe'/* !'*/,
        ],
        'fled-death-star': [
            /*LOCA: dk 'Your expedition stumbled across some pirates, but overwhelmed by the magnitude of your Deathstar, they fled.' */
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*LOCA: dk 'Einige */'fremdartig anmutende Schiffe'/* haben ohne Vorwarnung die Expeditionsflotte angegriffen.'*/,
            /*'Din ekspeditionsflåde havde ikke en */'venlig første kontakt'/* med en ukendt race.'*/,
            /*'Vores ekspedition blev angrebet af en */'mindre gruppe af ukendte skibe'/* !'*/,
            /*LOCA: dk 'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Et */'fremmedartet skib angriber din ekspeditionsflåde'/* uden varsel!'*/, //v9?
            /*'En */'ukendt race angriber din ekspedition', //v10?
            /*'Din ekspeditionsflåde */'synes at have fløjet ind i et territorium'/*, som tilhører en ukendt og yderst aggressiv og krigerisk race.'*/,
            /*'Forbindelsen til */'ekspeditionsflåden var afbrudt i en kort periode'/* . Det som vi kunne dekryptere fra den sidste besked var, at de var under hård beskydning. Angriberen blev ikke identificeret.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: dk 'Deine Expedition ist in eine Alien-Invasions-Flotte geraten und */'meldet schwere Gefechte'/*.'*/,
            /*'Vi havde en del */'problemer med at udtale dialekten af alienracen rigtigt'/* . Vores diplomat sagde ved et uheld `Ild!` i stedet for `Fred!`.'*/,
            /*'En stor */'formation af krystallignende skibe, fra en ukendt'/* oprindelse, indtager direkte kollision mod din ekspeditionsflåde. Vi kan nu forvente det værste.'*/,
        ],
        'fled-death-star': [
            /*'Din */'ekspedition stødte på nogen rumvæsner'/* , men de flygtede efter at blive overvældet af størrelsen på din Dødsstjerne.' */
        ],
    },
    
    logbookRegex: /(Logbog af Kommunikationsofficererne|Logbog supplement Kommunikationsofficer):(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'Dette område af universet er */'åbenbart ikke blevet besøgt indtil nu',
            /*'Det er en vidunderlig følelse at være de første, */'der når frem til ukendte territorier',
        ],
        [ExpeditionDepletionLevel.low]: [
            /*'Det ser ikke */'ud til at andre har været i denne'/* del af galaksen før.'*/,
            /*'Der blev */'opdaget gamle signaturer af rumskibe'/* . Det ser ikke ud til at vi var de første.'*/,
            /*'Vi blev */'næsten ramt af en fremmed ekspeditionsflåde'/* . Havde ikke regnet med at der var så mange undervejs i dette område.'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*LOCA: dk 'Wir haben den Abschluss der Expedition mit den Crewmitgliedern einer zweiten Expeditionsflotte, die im selben Sektor unterwegs war, gefeiert. */'Die haben auch nichts Spannendes zu berichten',
            /*LOCA: dk 'Es wurden */'Anzeichen für die Präsenz anderer Expeditionsflotten'/* gefunden.'*/,
            /*LOCA: dk 'Es wurde */'friedlicher Funkkontakt zu einigen anderen Expeditionen'/* in diesem Sektor hergestellt.'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /*LOCA: dk 'Wenn wir uns zu unsicher fühlen, können wir uns ja */'mit all den anderen Expeditionen'/*, die hier herum fliegen, zusammen tun.'*/,
            /*LOCA: dk 'Vielleicht wäre es sinnvoller, hier */'eine Souvenir-Station zu errichten'/* , anstatt noch eine Expedition loszuschicken.'*/,
            /*LOCA: dk 'Wenn das so weitergeht, sollte man */'bei all dem Verkehr hier Navigationsbojen'/* aussetzen.'*/,
        ],
    },
};