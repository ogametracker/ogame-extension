import ExpoSize from "@/models/expeditions/ExpoSize";
import ExpoType from "@/models/expeditions/ExpoType";

export default {
    [ExpoType.darkMatter]: {
        [ExpoSize.small]: [
            /*'Expedici se podařilo nalézt a */'uschovat určité množství Temné hmoty'/*.'*/,
            /*'Nalezli */'jsme zbytky mimozemské lodi'/*. Na její palubě byla nádoba s Temnou hmotou!'*/,
            /*'Potkali */'jsme podivného vetřelce v malé lodi'/*, který nám dal bednu Temné hmoty výměnou za jednoduché matematické výpočty.'*/,
            /*'Naše expedice */'prohledala opuštěnou loď'/*. Nenašli jsme žádné informace o tom, co se stalo posádce, ale podařilo se zachránit něco málo Temné hmoty.'*/,
            /*'Expedice následovala */'nezvyklé signály až k asteroidu'/*. V něm jsme nalezli menší množství Temné hmoty.'*/,
        ],
        [ExpoSize.medium]: [
            /*TODO: 'Unserer Expedition ist */'ein einmaliges Experiment gelungen'/*:'*/,
            /*TODO: 'Unsere Expedition hat eine */'uralte Raumstation gefunden'/*, die wohl schon seit langer Zeit unkontrolliert durch das All schwebt. Die Station selbst war komplett unbrauchbar, jedoch lagerte in einem ihrer Reaktoren noch ein wenig Dunkler Materie. Unsere Techniker versuchen, so viel wie möglich davon zu bergen.'*/,
            /*'Naše */'expedice hlásí neobvyklý jev'/*: hromadění Temní hmoty v energetických skladech našich lodí. Technici se pokusí nahromadit této Temné hmoty co možná nejvíce.'*/,
        ],
        [ExpoSize.large]: [
            /*TODO: 'Eine */'spontane Hyperraumverzerrung'/* hat es deiner Expedition ermöglicht, eine große Menge dunkler Materie sicherzustellen!'*/,
            /*TODO: 'Unsere Expedition meldet einen ersten Kontakt der besonderen Art. Anscheinend hat */'eine Energiekreatur, die sich Legorianer nannte'/*, die Schiffe der Expedition durchflogen und dann beschlossen, der unterentwickelten Spezies ein wenig auszuhelfen - es materialisierte sich ein Behälter mit dunkler Materie an Bord der Brücke!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`(?<name>${darkMatter}) (?<amount>[^\\s]+) bylo ukořistěno`),
    },

    [ExpoType.resources]: {
        [ExpoSize.small]: [
            /*'Expedice */'nalezla malý asteroid'/*, ze kterého se podařilo vytěžit nějaké suroviny.'*/,
            /*'Na */'izolovaném planetoidu byla nalezena snadno přístupná'/* pole surovin. Většina těchto surovin byla úspěšně vytěžena.'*/,
        ],
        [ExpoSize.medium]: [
            /*TODO: 'Deine Expedition fand einen uralten, voll beladenen, aber */'menschenleeren Frachterkonvoi'/*. Einige Ressourcen konnten geborgen werden.'*/,
            /*'Na */'malém měsíci se svou vlastní atmosférou expedice'/* nalezla velké množství zásob surovin. Posádka na povrchu se snaží vyzvednout a naložit toto přírodní bohatství.'*/,
        ],
        [ExpoSize.large]: [
            /*'Pásy */'minerálů okolo neznámé planety obsahovaly'/* nezměrné množství surovin. Lodě se z expedice vrací s plným nákladovým prostorem.'*/,
            /*'Expediční letky hlásí objev */'gigantického vraku mimozemské vesmírné lodě'/*. Nebyli schopni zjistit žádné další informace o jejich technologiích, ale byli schopni rozmontovat loď na hlavní části a získat takto slušné množství surovin.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`(?<name>${resources.join('|')}) (?<amount>.+) bylo ukořistěno`),
    },

    [ExpoType.fleet]: {
        [ExpoSize.small]: [
            /*'Nalezli jsme */'zbytky po předchozí expedici'/*! Naši technici se pokusí znovu zprovoznit některé z těchto lodí.'*/,
            /*'Expedice narazila */'na pevnost opuštěnou před lety'/*. V jejím hangáru nalezli nějaké lodě. Technici se snaží alespoň některé zprovoznit.'*/,
            /*'Expedice narazila na planetu, */'která byla téměř zničena díky mnohaleté válce'/*. Na orbitě se stále vznáší nějaké lodě. Technici se některé z nich snaží zprovoznit. Možná se nám také podaří zjistit, k čemu to vlastně došlo.'*/,
            /*'Narazili jsme na */'opuštěnou pirátskou stanici'/*. V hangáru je pár starých lodí. Naši technici zjišťují, jestli jsou vůbec ještě použitelné.'*/,
        ],
        [ExpoSize.medium]: [
            /*'Expedice narazila na */'automatickou továrnu na vesmírné lodě'/*. Některé z nich byly stále ve fázi produkce a naši technici se snaží znovu aktivovat generátory továren.'*/,
            /*'*/'Nalezli jsme zbytek armády'/*. Technici se přesunuli přímo do neporušených lodí a pokusili se je opět zprovoznit.'*/,
        ],
        [ExpoSize.large]: [
            /*'Nalezli jsme */'obrovský hřbitov vesmírných lodí'/*. Některým technikům z expedice se podařilo opět pár lodí zprovoznit.'*/,
            /*TODO: 'Wir haben einen Planeten mit */'Resten einer Zivilisation'/* entdeckt.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`Folgende Schiffe schlossen sich der Flotte an:(<br>|\\s*)(?<ships>((${ships.join('|')}):\\s*\\d+(<br>|\\s*)?)+)?`),
    },

    [ExpoType.nothing]: [
        /*'Až na pár prvních, velmi slibných scannů sektoru, expedice */'bohužel nepřináší nic zajímavého'/*.'*/,
        /*'Až na pár */'malých zvířátek z neznámé bažinaté'/* planety expedice nic zajímavého nenašla.'*/,
        /*'Tvá expedice se */'poučila o prázdnosti této části vesmíru'/*. Nebylo nalezeno vůbec nic, co by mohlo být zajímavé.'*/,
        /*'Celá expedice strávila mnoho času zíráním na */'hypnotizující stvoření z čisté energie'/*. Když mámení pominulo, byl už cas na návrat.'*/,
        /*'*/'Porucha v reaktoru velitelské lodi málem zničila'/* celou letku. Technici problém sice opravili, ale kvůli poruše se letka musela vrátit bez výsledků.'*/,
        /*'Expedice */'pořídila skvělé záběry supernovy'/*. Nic víc, ale aspoň to vypadá, že s nimi vyhrají soutěž "Nejlepší fotka z vesmíru".'*/,
        /*'Expedice po nějakou dobu sledovala podivné signály. Na konci zjistili, že je */'vydává stará sonda zaostalé civilizace'/*. Sonda byla přivezena do muzea.'*/,
        /*'Už víme, že ty */'podivné anomálie dokážou zmást navigační počítače'/* i smysly posádky. Nic zajimavého jsme ale nepřivezli.'*/,
        /*'Tvá expedice málem */'nabourala do neutronové hvězdy'/*. Při manévru přišli o dost deuteria a musí se proto vrátit bez jakýchkoliv výsledků.'*/,
        /*'Podivný */'počítačový virus nakazil navigační počítače'/* krátce po startu. V důsledku toho expedice létala dokola v kruzích a nic zajímavého nepřivezla.'*/,
        /*'Zdá se, že jsme na té */'osamělé planetě neměli slavit kapitánovy narozeniny'/*. Neznámá černá horečka nakazila většinu posádky a tak jsme se museli vrátit bez jakýchkoliv úspěchů.'*/,
        /*'Někdo nainstaloval na palubní počítače */'expedice starou strategickou hru'/*. Letka byla pryč dlouhou dobu, ale nic produktivního nevykonala.'*/,
    ],

    [ExpoType.lostFleet]: [
        /*TODO: 'Das Letzte, was von dieser Expedition noch gesendet wurde, waren einige unglaublich gut gelungene */'Nahaufnahmen eines sich öffnenden schwarzen Lochs'/*.'*/,
        /*'Jediná věc, která po expedici zbyla, je následující záznam: */'Krrrzzzzt To zrrrtrzt'/* vypadá krgzzzz jako Krzzzzzzzztzzzz...'*/,
        /*'Roztavení jádra v hlavní lodi expedice vede k řetězové reakci, */'která ničí celou letku v obdivuhodné podívané'/*.'*/,
        /*TODO: 'Die Expeditionsflotte ist */'nicht mehr aus dem Sprung in den Normalraum'/* zurückgekehrt. Unsere Wissenschaftler rätseln noch immer, was geschehen sein könnte, jedoch scheint die Flotte endgültig verloren zu sein.'*/,
    ],

    [ExpoType.trader]: [
        /*'Tvá expedice se */'setkala s přátelskou rasou mimozemšťanů'/*. Rozhodli se, že na naši planetu pošlou obchodníka se surovinami.'*/,
        /*'Tvá expedice */'zachytila nouzový signál'/*. Veliká nakladní loď byla zachycena silným gravitačním polem planetoidu. Poté, co jsme ji zbavili těžkého nákladu, se vše urovnalo a šťastný kapitán nás vyhlásil jako svého výhradního obchodního partnera.'*/,
    ],

    [ExpoType.early]: [
        /*'Nečekané výboje v */'skladištích energie motorů'/* lodí způsobily, že letka se vrátí dříve, než bylo očekáváno.'*/,
        /*'Tvá expedice */'nenalezla nic zajímavého v daném sektoru'/*. Cestou zpět ovšem narazila na silný sluneční vítr, díky němuž se vrátí domů dříve, než se původně myslelo.'*/,
        /*'Nový a odvážný velitel letky úspěšně proletěl */'červí dírou a zkrátil tak čas potřebný'/* k návratu. Nic dalšího ovšem expedice nepřináší.'*/,
    ],

    [ExpoType.delay]: [
        /*'Tvůj */'navigátor se dopustil vážné chyby v jeho výpočtech'/*, což zapříčinilo dolet letky na špatné souřadnice. Nejenže letka minula cíl; návrat zabere podstatně více času, než bylo původně v plánu.'*/,
        /*'Tvoje expedice se dostala do */'sektoru plného částicových bouří'/*. Energetické zásoby byly přetíženy a došlo ke kolapsu mnoha systémů. Cesta zpátky potrvá déle.'*/,
        /*'Z neznámých důvodů se expedice */'vynořila z hyperprostoru na úplně špatných'/* souřadnicích. Málem přistála v samém středu slunce. Naštěstí přistála ve známém systému, jen cesta zpátky potrvá déle, než se předpokládalo.'*/,
        /*'*/'Sluneční vítr rudého obra překazil skok'/* expedice a bude chvíli trvat, než se podaří spočítat zpáteční skok. V tom sektoru nebylo nic víc, než prázdnost prostoru mezi hvězdami. Letka se vrátí později, než se předpokládalo.'*/,
        /*'*/'Nový navigační modul má pořád nějaké mouchy'/*. Nejen, že flotilu zavedl na špatné souřadnice, ale ještě došlo k vyčerpání veškerého deuteria. Proto se letka bude muset vrátit na impulsní pohon a cesta tak potrvá déle.'*/,
        /*'Velitelská loď expedice se při */'výstupu z hyperprostoru srazila s cizí lodí'/*. Cizí loď explodovala, naše je jen poškozena. Jakmile budou provedeny nezbytné opravy, vydá se letka na zpáteční cestu, protože v takových podmínkách nemůže pokračovat.'*/,
    ],

    [ExpoType.item]: {
        regex: /Předmět „(?<name>.+)“ byl přidán do inventáře/,
    },

    [ExpoType.pirates]: {
        [ExpoSize.small]: [
            /*'Nějací naprosto */'zoufalí vesmírní piráti se pokusili přepadnout'/* naší expediční letku.'*/,
            /*TODO: 'Einige */'primitive Barbaren greifen uns mit Raumschiffen'/* an, die nicht einmal ansatzweise die Bezeichnung Raumschiff verdient haben. Sollte der Beschuss ernstzunehmende Ausmaße annehmen, sehen wir uns gezwungen, das Feuer zu erwidern.'*/,
            /*'Zachytili jsme */'radiovou zprávu od nějakých opilých vesmírných pirátů'/*. Zřejmě na nás brzy zaútočí.'*/,
            /*'Museli */'jsme bojovat s vesmírnými piráty'/*, ale naštěstí jich bylo jen pár.'*/,
            /*TODO: 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpoSize.medium]: [
            /*'Expedice měla */'nepříjemné setkání s vesmírnými piráty'/*.'*/,
            /*TODO: 'Wir sind in den */'Hinterhalt einiger Sternen-Freibeuter'/* geraten!'*/,
            /*TODO: 'Der Hilferuf, dem die Expedition folgte, stellte sich als */'böse Falle einiger arglistiger Sternen-Freibeuter'/* heraus. Ein Gefecht war unvermeidlich.'*/,
        ],
        [ExpoSize.large]: [
            /*TODO: 'Die aufgefangenen Signale stammten nicht von Fremdwesen, sondern */'von einer geheimen Piratenbasis'/*! Die Piraten waren von unserer Anwesenheit in ihrem Sektor nicht besonders begeistert.'*/,
            /*TODO: 'Die Expeditionsflotte meldet */'schwere Kämpfe mit nicht-identifizierten Piratenschiffen'/*.'*/,
        ],
    },

    [ExpoType.aliens]: {
        [ExpoSize.small]: [
            /*'*/'Exoticky vypadající lodě neznámého původu'/* zaútočily na expedici bez jakéhokoliv varování!'*/,
            /*TODO: 'Deine Expeditionsflotte hatte einen */'nicht besonders freundlichen Erstkontakt'/* mit einer unbekannten Spezies.'*/,
            /*'Naše expedice */'byla přepadena malou skupinou neznámých lodí'/*!'*/,
            /*TODO: 'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpoSize.medium]: [
            /*'*/'Neznámí vetřelci zaútočili'/* na naši expedici!'*/,
            /*TODO: 'Deine */'Expeditionsflotte hat anscheinend das Hoheitsgebiet'/* einer bisher unbekannten, aber äußerst aggressiven und kriegerischen Alienrasse verletzt.'*/,
            /*TODO: 'Die Verbindung zu unserer Expeditionsflotte wurde kurzfristig gestört. Sofern wir die letzte Botschaft richtig entschlüsselt haben, steht die Flotte unter schwerem Feuer; die */'Aggressoren konnten nicht identifiziert werden'/*.'*/,
        ],
        [ExpoSize.large]: [
            /*TODO: 'Deine Expedition ist in eine Alien-Invasions-Flotte geraten und */'meldet schwere Gefechte'/*.'*/,
            /*TODO: 'Wir hatten Mühe den korrekten */'Dialekt einer Alienrasse'/* auszusprechen. Unser Diplomat rief daher "Feuer!" statt "Friede!".'*/,
            /*TODO: 'Ein großer */'Verband kristalliner Schiffe unbekannter Herkunft'/* hält direkten Kollisionskurs mit unserer Expeditionsflotte. Wir müssen nun wohl vom Schlimmsten ausgehen.'*/,
        ],
    },
};