import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const hu: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*'Az expedíciónak */'ehetősége van szerezni és tárolni némi'/* Sötét Anyagot.'*/,
            /*'Találtunk */'néhány megmaradt idegen hajót'/* . Ezeken a hajókon volt egy kis tartály, valamennyi Sötét Anyaggal.'*/,
            /*'Találkoztunk egy furcsa idegennel egy kis hajón, aki adott nekünk néhány Sötét Anyagot */'néhny egyszerű matematikai számításért'/* cserébe.'*/,
            /*'Expedíciónk */'átvette a hatalmat egy olyan szellemhajó fölött'/* , amely kis mennyiségű Sötét Anyagot szállított. Nem találtunk semmit arra vonatkozóan, hogy mi történt a hajó eredeti legénységével, de technikusaink sikeresen megmentették a Sötét Anyagot.'*/,
            /*'Az expedíciónk */'követett néhány furcsa jelet egy aszteroidába'/* . Az aszteroida magjában kis mennyiségű sötét anyagot találtak. Az aszteroidát megszerezték és a felfedezők megpróbálják kinyerni belőle a Sötét Anyagot.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Az expedíciónk */'végrehajtott egy egyedülálló kísérletet'/* . Képesek voltunk Sötét anyagot nyerni egy elpusztuló csillagból.'*/,
            /*'Az expedíciónk */'lokalizált egy rozsgás Űrállomást'/* , ami láthatólag hosszú ideje kihalt. Az állomás teljesen használhatatlan, bár van némi sötét anyag, ami a reaktorban van tárolva. A technikusaink megpróbálnak megmenteni belőle annyit, amennyit csak tudnak.'*/,
            /*'Az expedíciónk jelentett egy furcsa, látványos jelenséget. Sötét anyag */'halmozódott fel a hajó pajzs energiamezőjében'/* . A technikusaink megpróbálnak olyan sok sötét anyagot tárolni, amennyit csak tudnak, amíg a jelenség tart.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Egy */'spontán Hiperűr deformálódás lehetővé'/* tette az expedíciódnak, hogy nagy mennyiségű Sötét anyagot takarítson be!'*/,
            /*TODO: hu 'Unsere Expedition meldet einen ersten Kontakt der besonderen Art. Anscheinend hat */'eine Energiekreatur, die sich Legorianer nannte'/*, die Schiffe der Expedition durchflogen und dann beschlossen, der unterentwickelten Spezies ein wenig auszuhelfen - es materialisierte sich ein Behälter mit dunkler Materie an Bord der Brücke!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`(?<amount>[^\\s]+) (?<name>${darkMatter}) elfogva`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'Expedíció során */'felfedeztél egy kis aszteroidát'/* , melyből betakarítható némi nyersanyag.'*/,
            /*'Egy izolált bolygó-kezdeményen találtunk némi */'könnyen hozzáférhető nyersanyagot és egy részét'/* sikeresen betakarítottuk.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Az expedíciód során találtál egy ősi, teljesen feltöltött, de */'elhagyott teherszállító konvojt'/* . Talán néhány nyersanyagot még meg lehet menteni.'*/,
            /*'Egy */'saját légkörrel rendelkező apró holdon'/* expedíciód hatalmas nyersanyag-raktárat talált. A legénység a felszínen megpróbálja betakarítani a természeti kincset.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Ásvány */'gyűrűk egy ismeretlen bolgyó körül megszámlálhatatlan mennyiségű'/* nyersanyaggal. Az expedíciós hajóid jönnek vissza teli rakománnyal!'*/,
            /*TODO: hu 'Deine Expeditionsflotte meldet den */'Fund eines riesigen Alien-Schiffswracks'/*. Mit der Technologie konnten sie zwar nichts anfangen, aber das Schiff ließ sich in seine Einzelteile zerlegen, wodurch man wertvolle Rohstoffe gewinnen konnte.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`(?<amount>.+) (?<name>${resources.join('|')}) elfogva`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*'Kereszteztünk */'egy előző expedíció maradványait'/* A Technikusaink megpróbálják ismét működővé varázsolni a hajókat'*/,
            /*'Az expedíciód */'belefutott egy híres, rég elhagyatott erődbe'/* . Az erőd hangárjában találtak néhány hajót. A technikusok megpróbálják ismét működőképes állapotba hozni őket.'*/,
            /*'Expedíciónk felfedezett egy bolygót, */'mely majdnem megsemmisült a folyamatos háborúk'/* során. Különböző hajók keringenek ott bolygó körüli pályára állva. A technikusok megpróbálnak néhányat megjavítani. Talán arról is szerzünk infót, mi történt itt pontosan.'*/,
            /*'Találtunk */'egy elhagyatott kalóz állomást'/* . Néhány régi hajó van a hangárban. A Technikusok ellenőrzik, hogy használható-e valamelyik vagy sem.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Az expedíciónk egy */'régi autómatikus hajógyárba futott'/* . Néhány hajó jelenleg is készülőben van és a szerelőink azon dolgoznak, hogy újraindítsák a hajógyár energia generátorait.'*/,
            /*'Egy */'hajóhad maradványaira találtunk'/* . A szerelők elmentek a legjobb állapotban lévő hajókra, hogy ismét működésbe hozzák őket'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Találtunk */'egy hatalmas hajótemetőt'/* . Néhány szerelő a flottából képes volt néhányat működőképessé tenni közülük.'*/,
            /*TODO: hu 'Wir haben einen Planeten mit */'Resten einer Zivilisation'/* entdeckt.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`A következő hajók csatlakoznak a flottához:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
    },

    [ExpeditionEventType.nothing]: [
        /*'Az eleinte ígéretes */'letapogatási eredmények ellenlére sajnos üres'/* kézzel tértünk vissza.'*/,
        /*'Néhány kicsi, furcsa háziállaton kívül (amik egy */'ismeretlen mocsárbolgyóról származnak'/* ) az expedíció nem hoz vissza semmi izgalmasat.'*/,
        /*'Az */'expedíciód megtanulta mi a nagy üres tér'/* . Még egy kis aszterida vagy sugárzás se volt, ami izgalmassá tette volna a küldetést.'*/,
        /*'Egy élőlény, */'akit tiszta energiából csináltak'/* , arról győződött meg, hogy minden expedíciótag csak bámulta a hipnotizáló mintát a képernyőkön. Amikor a legtöbbjük megint kitisztult, az expedíciónak szüksége volt, hogy félbehagyják.'*/,
        /*'A vezető hajó */'reaktorának meghibásodása megsemmisítette a teljes'/* expedíciós flottát. Szerencsére a technikusok el tudják kerülni a legrosszabbat. Az újraépítés sok időt vesznek igénybe és az expedíció visszatér eredmény nélkül.'*/,
        /*'Az expedíciód egy */'fantasztikus képet készített egy Szupernováról'/* . Semmit nem sikerült szerezned, de jó esélyeid vannak, hogy megnyerd a "Legjobb kép az Univerzumban" díjat ebben az évben.'*/,
        /*'Az expedíciós flottád különös jeleket követett egy ideig. Végül kiderült, hogy a */'jeleket egy régi szonda sugározta'/* , ami generációkkal korábban lett küldve, hogy üdvözölje az idegeneket. A Szondát megmentették, anéhány múzeum az otthonodból jelezte az érdeklődését iránta.'*/,
        /*'Nos, mostmár tudjuk, hogy azok a piros, */'5-ös osztályú rendellenességeknek nincsenek'/* kaotikus hatásai a hajók navigációs rendszerére, de masszív hallucinációt okoznak a legénységnek. Az expedícióról üres kézzel tértek vissza.'*/,
        /*'Az expedíciód túl közel került egy */'Neutron csillag gravitációs mezőjéhez és beletellett'/* némi időbe, mire kiszabadult. A sok elhasznált Deutérium miatt a flottának eredmény nélkül kellett hazatérnie.'*/,
        /*'Egy ismeretlen */'számítógép vírus támadta meg a navigációs rendszert'/* nemsokkal az otthoni naprendszer elhagyása után. Ennek következtében a flotta körbe - körbe repül. Azt kell mondjam, hogy az expedíció nem lett túl sikeres.'*/,
        /*'Valószínűleg a */'kapitányok szülinapi ünnepségét nem kellett volna az elszigetelt'/* bolgyón tartani. Egy szörnyű ismeretlen láz miatt az expedíciós legénység jelentős része a gyengélkedőbe került. A legénységhiány miatt az expedíció megszakadt.'*/,
        /*'valaki */'feltelepített egy régi stratégiai játékot a hajó'/* összes számítógépére. Az expedíciós flotta sokáig távol volt, de emiatt nem nagyon volt haszna.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*'Az utolsó dolog, amit az expedícióról kaptunk */'néhány nagyon jó minőségű fénykép egy épp nyíló fekete'/* lyukról.'*/,
        /*'Az egyetlen dolog, ami a */'küldetésből megmaradt a következő rádió adás'/* : Zzzrrt Szellem! Krrrzzzzt Az zrrrtrzt úgy krgzzzz néz ki Krzzzzzzzztzzzz'*/,
        /*'A vezető hajó magjának felmelegedése egy hatalmas robbanáshoz vezetett, */'ami megsemmisítette az egész Expedíxiós flottát',
        /*TODO: hu 'Die Expeditionsflotte ist */'nicht mehr aus dem Sprung in den Normalraum'/* zurückgekehrt. Unsere Wissenschaftler rätseln noch immer, was geschehen sein könnte, jedoch scheint die Flotte endgültig verloren zu sein.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*'Az expedíciós flottád */'kapcsolatba lépett egy félős idegen fajjal'/* . Ők bejelentették, hogy küldenek reprezentatív árut, hogy kereskedjenek a világoddal.'*/,
        /*'Az */'expedíciód vészjelzést fogott'/* . Egy mega szállító volt egy kisbolygó gravitációs mezejének fogságában. Miután a szállítóhajó sikeresen ki lett mentve, a kapitány örömmel jelentette be hogy az aki megmentette őket, mostantól a kedvenc ügyfelük lesz.'*/,
    ],

    [ExpeditionEventType.early]: [
        /*'Váratlanul meghibásodtak a hajtóművek. A küldetés véget ért. A */'flotta hamarabb ér vissza a tervezettnél',
        /*'Az expedícióid nem jelentett semmilyen rendellenességeket a felkutatott szektorban. De a */'flotta befutott egy kevés napszélbe amíg visszatért'/* . Ez az utazást gyorsította. Az expedíciós hajók kicsit korábban térnek haza.'*/,
        /*'Az új és kicsit merész parancsnok */'sikeresen keresztülutazott egy instabil féreglyukon'/* hogy rövidítse a repülést, . Mindazonáltal maga az expedíció nem hozott semmi újat.'*/,
    ],

    [ExpeditionEventType.delay]: [
        /*'A */'navigációs vezetőnek rossz napja volt'/* és ez okozta az expedíciós ugrás elszámolását. Nem csak a flotta landolt valahol teljesen máshol de a visszaút is sokkal több időbe kerül.'*/,
        /*'Az expedíciód egy */'részecskeviharral teli szektorba jutott'/* . Ez túltöltötte az energiatárolókat és a hajók központi rendszerének nagyrésze megsemmisült. A szerelők képesek megmenteni a legrosszabbtól, de az expedícióról való visszatérés jelentős késéssel történik majd.'*/,
        /*'Ismeretlen okok */'miatt az expedíciós ugrás teljesen rossz irényba'/* ment. A Nap szíve közelében landolt. Szerencsére a landolás ismert rendszerben történt, a visszaugrás hosszabb időt vesz igénybe.'*/,
        /*'Egy Vörös */'óriás csillagszele tönktretette az expedíciós ugrást'/* , ami meghosszabbítja a kiszámítását a visszaugrásnak. Nem történt semmi a csillagok közt a szektorban. A flotta később tér vissza, mint tervezte.'*/,
        /*'A */'Navigációs modul még hibákkal kűzd'/* . Az expedíciós ugrás majdnem rossz irányba indult, de az összes Deutérium fel lett használva. Szerencsére az ugrás elég közelre ment az induló bolgyó holdjához. Az expedíció lassabban tér vissza.'*/,
        /*'Az */'expedició fő hajója ütközött egy idegen hajóval'/* , ami figyelmezetés nélkül ugrott a flottába. Az idegen hajó felrobbant és jelentős károkat okozott a fő hajónak. Azonnal el kell kezdeni a sérülések javítását, ilyen állapotban az expedíció nem folytatható.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /(?<name>.+) lett hozzáadva a raktárhoz/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*'Néhány */'űr-kalóz megpróbálta elfoglalni'/* az expedíciós flottát.'*/,
            /*'Néhány */'primitív barbár támadt ránk olyan hajókkal'/* , amiknek még neve sincs. Ha tüzet nyitnak ránk, kénytelenek leszünk visszalőni.'*/,
            /*'Elfogtunk egy rádió üzenetet, */'ami ittas kalózoktól származik'/* . Úgytűnik hamarosan megtámadnak.'*/,
            /*'Szükségünk van harcra néhány kalózzal, */'szerencsére csak néhánnyal',
            /*TODO: hu 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Az expedíciódnak */'elégedetlen találkozása volt néhány űr kalózzal',
            'Belefutottunk egy csillag-kalóz támadásba'/* ! A harcot nem lehetett elkerülni.'*/,
            /*'A segélykérő jelet, */'amit követett az expedíciónk egy csillag-kalóztól származott'/* . A harcot nem lehetett elkerülni.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*TODO: hu 'Die aufgefangenen Signale stammten nicht von Fremdwesen, sondern */'von einer geheimen Piratenbasis'/* ! Die Piraten waren von unserer Anwesenheit in ihrem Sektor nicht besonders begeistert.'*/,
            /*TODO: hu 'Die Expeditionsflotte meldet */'schwere Kämpfe mit nicht-identifizierten Piratenschiffen'/*.'*/,
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*'Egzotikus */'megjelenésű hajók támadták meg figyelmeztetés nélkül'/* a felderítő flottádat!'*/,
            /*'A felderítő expedíciód */'elsőre nem túl barátságos kapcsolatot létesített'/* az ismeretlen fajokkal.'*/,
            /*'Az expedíciónkat */'egy kisebb csapat ismeretlen hajó támadta meg',
            /*TODO: hu 'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Egy */'ismeretlen faj megtámadta az expedíciónkat',
            /*TODO: hu 'Deine */'Expeditionsflotte hat anscheinend das Hoheitsgebiet'/* einer bisher unbekannten, aber äußerst aggressiven und kriegerischen Alienrasse verletzt.'*/,
            /*'A */'kapcsolat az expedíciós flottával nemrég megszakadt'/* . Megfejtettük az utolsó kódolt üzenetüket. Erős támadás alatt vannak, a támadókat nem lehet azonosítani.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*TODO: hu 'Deine Expedition ist in eine Alien-Invasions-Flotte geraten und */'meldet schwere Gefechte'/*.'*/,
            /*TODO: hu 'Wir hatten Mühe den korrekten */'Dialekt einer Alienrasse'/* auszusprechen. Unser Diplomat rief daher "Feuer!" statt "Friede!".'*/,
            /*TODO: hu 'Ein großer */'Verband kristalliner Schiffe unbekannter Herkunft'/* hält direkten Kollisionskurs mit unserer Expeditionsflotte. Wir müssen nun wohl vom Schlimmsten ausgehen.'*/,
        ],
    },

    logbookRegex: /(A Kommunikációs tiszt naplóbejegyzése|kommunikációs tiszt naplóbejegyzése)\s*:(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'Úgy tűnik ez a */'része az univerzumnak még nincs'/* felfedezve.'*/,
            /*'Nagyon jó érzés elsőnek lenni, */'akik felderítetlen szektoban utaznak',
        ],
        [ExpeditionDepletionLevel.low]: [
            /*'Úgy tűnik nem */'volt még ember a galaxis ezen részén'/* ezelőtt.'*/,
            /*'Találtunk egy űrhajótörmeléket. Nem */'mi vagyunk az elsők itt',
            /*'Majdnem */'nekimentünk egy másik expedíciós flottának'/* . Nem gondoltam, hogy mások is vannak körülöttünk.'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*'Ünnepeltük az expedíciót egy másik expedíciós flotta legénységével eggyütt. */'Nekik nem volt semmi érdekes dolguk',
            /*'másik */'expedíciós flottára utaló jeleket találtunk',
            /*'Baráti */'rádiókapcsolatot létesítettünk egy másik expedíciós'/* flottával ebben'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /*TODO: hu 'Wenn wir uns zu unsicher fühlen, können wir uns ja */'mit all den anderen Expeditionen'/*, die hier herum fliegen, zusammen tun.'*/,
            /*TODO: hu 'Vielleicht wäre es sinnvoller, hier */'eine Souvenir-Station zu errichten'/* , anstatt noch eine Expedition loszuschicken.'*/,
            /*TODO: hu 'Wenn das so weitergeht, sollte man */'bei all dem Verkehr hier Navigationsbojen'/* aussetzen.'*/,
        ],
    },
};