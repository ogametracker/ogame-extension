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
            /*TODO: hu 'Unsere Expedition ist auf ein */'Geisterschiff gestoßen'/*, das eine kleine Menge Dunkler Materie transportierte. Wir haben zwar keinerlei Hinweise finden können, was der ursprünglichen Crew zugestoßen ist. Dennoch gelang es unseren Technikern, die Dunkle Materie zu bergen.'*/,
            /*TODO: hu 'Die Expedition folgte einigen */'seltsamen Signalen und entdeckte einen Asteroiden'/*, in dessen Kern ein wenig Dunkle Materie eingeschlossen war. Der Asteroid wurde an Bord geholt und die Forscher versuchen nun, die Dunkle Materie zu extrahieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*TODO: hu 'Unserer Expedition ist */'ein einmaliges Experiment gelungen'/*:'*/,
            /*TODO: hu 'Unsere Expedition hat eine */'uralte Raumstation gefunden'/*, die wohl schon seit langer Zeit unkontrolliert durch das All schwebt. Die Station selbst war komplett unbrauchbar, jedoch lagerte in einem ihrer Reaktoren noch ein wenig Dunkler Materie. Unsere Techniker versuchen, so viel wie möglich davon zu bergen.'*/,
            /*TODO: hu 'Unsere Expedition meldet ein seltsames spektrales Phänomen. Dies führte unter anderem dazu, dass sich in den */'Energiespeichern der Schiffsschilde Dunkle Materie'/* bildete. Unsere Techniker versuchen nun, solange das Phänomen noch anhält, möglichst viel dieser Dunklen Materie zu konservieren.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*TODO: hu 'Eine */'spontane Hyperraumverzerrung'/* hat es deiner Expedition ermöglicht, eine große Menge dunkler Materie sicherzustellen!'*/,
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
            /*TODO: hu 'Ein */'Mineraliengürtel um einen unbekannten Planeten'/* enthielt Unmengen an Rohstoffen. Die Expeditionsflotte meldet volle Lager!'*/,
            /*TODO: hu 'Deine Expeditionsflotte meldet den */'Fund eines riesigen Alien-Schiffswracks'/*. Mit der Technologie konnten sie zwar nichts anfangen, aber das Schiff ließ sich in seine Einzelteile zerlegen, wodurch man wertvolle Rohstoffe gewinnen konnte.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`(?<amount>.+) (?<name>${resources.join('|')}) elfogva`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*'Kereszteztünk */'egy előző expedíció maradványait'/* A Technikusaink megpróbálják ismét működővé varázsolni a hajókat'*/,
            /*'Az expedíciód */'belefutott egy híres, rég elhagyatott erődbe'/* . Az erőd hangárjában találtak néhány hajót. A technikusok megpróbálják ismét működőképes állapotba hozni őket.'*/,
            /*TODO: hu 'Unsere Expedition fand einen Planeten, der wohl durch */'anhaltende Kriege'/* fast komplett zerstört wurde. In der Umlaufbahn treiben diverse Schiffswracks. Die Techniker versuchen, einige davon zu reparieren. Vielleicht erhalten wir so auch Information darüber, was hier geschehen ist.'*/,
            /*'Találtunk */'egy elhagyatott kalóz állomást'/* . Néhány régi hajó van a hangárban. A Technikusok ellenőrzik, hogy használható-e valamelyik vagy sem.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*TODO: hu 'Unsere Expedition stieß auf eine */'alte automatische Schiffswerft'/*. Einige Schiffe sind noch in der Produktionsphase und unsere Techniker versuchen, die Energieversorgung der Werft wiederherzustellen.'*/,
            /*'Egy */'hajóhad maradványaira találtunk'/* . A szerelők elmentek a legjobb állapotban lévő hajókra, hogy ismét működésbe hozzák őket'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*TODO: hu 'Wir haben einen */'riesigen Raumschiffsfriedhof'/* gefunden. Einigen Technikern der Expeditionsflotte ist es gelungen, das ein oder andere Schiff wieder in Betrieb zu nehmen.'*/,
            /*TODO: hu 'Wir haben einen Planeten mit */'Resten einer Zivilisation'/* entdeckt.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`A következő hajók csatlakoznak a flottához:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
    },

    [ExpeditionEventType.nothing]: [
        /*'Az eleinte ígéretes */'letapogatási eredmények ellenlére sajnos üres'/* kézzel tértünk vissza.'*/,
        /*TODO: hu 'Außer einiger kurioser kleiner Tierchen von einem */'unbekannten Sumpfplaneten'/* bringt diese Expedition nichts Aufregendes von ihrer Reise mit.'*/,
        /*TODO: hu 'Deine Expedition hat wortwörtlich mit der */'Leere des Alls'/* Bekanntschaft gemacht. Es gab nicht einmal einen kleinen Asteroiden oder Strahlung oder Partikel oder irgendetwas, das diese Expedition aufregend gestaltet hätte.'*/,
        /*'Egy élőlény, */'akit tiszta energiából csináltak'/* , arról győződött meg, hogy minden expedíciótag csak bámulta a hipnotizáló mintát a képernyőkön. Amikor a legtöbbjük megint kitisztult, az expedíciónak szüksége volt, hogy félbehagyják.'*/,
        /*'A vezető hajó */'reaktorának meghibásodása megsemmisítette a teljes'/* expedíciós flottát. Szerencsére a technikusok el tudják kerülni a legrosszabbat. Az újraépítés sok időt vesznek igénybe és az expedíció visszatér eredmény nélkül.'*/,
        /*'Az expedíciód egy */'fantasztikus képet készített egy Szupernováról'/* . Semmit nem sikerült szerezned, de jó esélyeid vannak, hogy megnyerd a "Legjobb kép az Univerzumban" díjat ebben az évben.'*/,
        /*'Az expedíciós flottád különös jeleket követett egy ideig. Végül kiderült, hogy a */'jeleket egy régi szonda sugározta'/* , ami generációkkal korábban lett küldve, hogy üdvözölje az idegeneket. A Szondát megmentették, anéhány múzeum az otthonodból jelezte az érdeklődését iránta.'*/,
        /*'Nos, mostmár tudjuk, hogy azok a piros, */'5-ös osztályú rendellenességeknek nincsenek'/* kaotikus hatásai a hajók navigációs rendszerére, de masszív hallucinációt okoznak a legénységnek. Az expedícióról üres kézzel tértek vissza.'*/,
        /*'Az expedíciód túl közel került egy */'Neutron csillag gravitációs mezőjéhez és beletellett'/* némi időbe, mire kiszabadult. A sok elhasznált Deutérium miatt a flottának eredmény nélkül kellett hazatérnie.'*/,
        /*'Egy ismeretlen */'számítógép vírus támadta meg a navigációs rendszert'/* nemsokkal az otthoni naprendszer elhagyása után. Ennek következtében a flotta körbe - körbe repül. Azt kell mondjam, hogy az expedíció nem lett túl sikeres.'*/,
        /*TODO: hu 'Vielleicht hätte man den */'Geburtstag des Captains'/* nicht auf diesem abgelegenen Planeten feiern sollen. Ein fieses Dschungelfieber hat große Teile der Crew gezwungen, die Reise in der Krankenstation zu verbringen. Der unerwartete Personalausfall führte dazu, dass die Expedition scheiterte.'*/,
        /*TODO: hu 'Irgendjemand hat auf allen Schiffscomputern ein */'uraltes Strategiespiel'/* installiert. Die Expeditionsflotte war lange unterwegs, aber dadurch nicht besonders produktiv.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*TODO: hu 'Das Letzte, was von dieser Expedition noch gesendet wurde, waren einige unglaublich gut gelungene */'Nahaufnahmen eines sich öffnenden schwarzen Lochs'/*.'*/,
        /*TODO: hu 'Von der Expedition ist */'nur noch folgender Funkspruch übrig'/* geblieben: Zzzrrt Oh Gott! Krrrzzzzt dass zrrrtrzt sieht krgzzzz ja aus wie Krzzzzzzzztzzzz ...'*/,
        /*TODO: hu 'Ein Kernbruch des Führungsschiffes führte zu einer Kettenreaktion, die in einer durchaus */'spektakulären Explosion die gesamte Expedition'/* vernichtete.'*/,
        /*TODO: hu 'Die Expeditionsflotte ist */'nicht mehr aus dem Sprung in den Normalraum'/* zurückgekehrt. Unsere Wissenschaftler rätseln noch immer, was geschehen sein könnte, jedoch scheint die Flotte endgültig verloren zu sein.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*TODO: hu 'Deine Expeditionsflotte hatte kurzen */'Kontakt zu einer scheuen Alien-Rasse'/*.'*/,
        /*TODO: hu 'Deine Expeditionsflotte hatte ein Notsignal aufgefangen. Es handelte sich um einen Megafrachter, der im starken Gravitationsfeld eines Planetoiden gefangen war. Nachdem der Frachter erfolgreich befreit worden war, verkündete der Frachterkapitän feierlich, seine Befreier als bevorzugte Exklusivkunden */'in sein schwarzes Buch'/* aufzunehmen.'*/,
    ],

    [ExpeditionEventType.early]: [
        /*TODO: hu 'Eine unvorhergesehene */'Rückkopplung in den Energiespulen'/* der Antriebsaggregate beschleunigte den Rücksprung der Expedition, so dass sie nun früher als erwartet zurückkehrt. Ersten Meldungen zufolge hat sie jedoch nichts Spannendes zu berichten.'*/,
        /*TODO: hu 'Deine Expedition meldet keine Besonderheiten in dem erforschten Sektor. Jedoch geriet die Flotte */'beim Rücksprung in einen Sonnenwind'/*. Dadurch wurde der Sprung beschleunigt. Deine Expedition kehrt nun etwas früher nach Hause.'*/,
        /*TODO: hu 'Der etwas wagemutige neue */'Kommandant nutzte ein instabiles Wurmloch'/*, um den Rückflug zu verkürzen - mit Erfolg! Jedoch hat die Expedition selbst keine neuen Erkenntnisse gebracht.'*/,
    ],

    [ExpeditionEventType.delay]: [
        /*'A */'navigációs vezetőnek rossz napja volt'/* és ez okozta az expedíciós ugrás elszámolását. Nem csak a flotta landolt valahol teljesen máshol de a visszaút is sokkal több időbe kerül.'*/,
        /*'Az expedíciód egy */'részecskeviharral teli szektorba jutott'/* . Ez túltöltötte az energiatárolókat és a hajók központi rendszerének nagyrésze megsemmisült. A szerelők képesek megmenteni a legrosszabbtól, de az expedícióról való visszatérés jelentős késéssel történik majd.'*/,
        /*TODO: hu 'Aus bisher unbekannten Gründen ging der */'Sprung der Expeditionsflotte völlig daneben'/*. Beinahe wären die Schiffe im Herzen einer Sonne angekommen. Zum Glück ist man in einem bekannten System gelandet, jedoch wird der Rücksprung länger dauern als ursprünglich gedacht.'*/,
        /*TODO: hu 'Der */'Sternwind eines roten Riesen'/* verfälschte den Sprung der Expedition dermaßen, dass es einige Zeit dauerte, den Rücksprung zu berechnen. Davon abgesehen gab es in dem Sektor, in dem die Expedition ankam, nichts außer der Leere zwischen den Sternen.'*/,
        /*TODO: hu 'Das neue */'Navigationsmodul hat wohl doch noch mit einigen Bugs'/* zu kämpfen. Nicht nur ging der Sprung der Expeditionsflotte in die völlig falsche Richtung, auch wurde das gesamte Deuterium verbraucht, wobei der Sprung der Flotte nur knapp hinter dem Mond des Startplaneten endete. Etwas enttäuscht kehrt die Expedition nun auf Impuls zurück. Dadurch wird die Rückkehr wohl ein wenig verzögert.'*/,
        /*'Az */'expedició fő hajója ütközött egy idegen hajóval'/* , ami figyelmezetés nélkül ugrott a flottába. Az idegen hajó felrobbant és jelentős károkat okozott a fő hajónak. Azonnal el kell kezdeni a sérülések javítását, ilyen állapotban az expedíció nem folytatható.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /*TODO: hu *//Ein (?<name>.+) wurde dem Inventar hinzugefügt/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*'Néhány */'űr-kalóz megpróbálta elfoglalni'/* az expedíciós flottát.'*/, //TODO: welche Nachricht ist das?
            /*TODO: hu 'Ein paar anscheinend */'sehr verzweifelte Weltraumpiraten'/* haben versucht,'*/,
            /*TODO: hu 'Einige */'primitive Barbaren greifen uns mit Raumschiffen'/* an, die nicht einmal ansatzweise die Bezeichnung Raumschiff verdient haben. Sollte der Beschuss ernstzunehmende Ausmaße annehmen, sehen wir uns gezwungen, das Feuer zu erwidern.'*/,
            /*TODO: hu 'Wir haben ein paar */'Funksprüche sehr betrunkener Piraten'/* aufgefangen.'*/,
            /*TODO: hu 'Wir */'mussten uns gegen einige Piraten wehren'/*, die zum Glück nicht allzu zahlreich waren.'*/,
            /*TODO: hu 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*TODO: hu 'Deine Expeditionsflotte hatte ein */'unschönes Zusammentreffen mit einigen Weltraumpiraten'/*.'*/,
            /*TODO: hu 'Wir sind in den */'Hinterhalt einiger Sternen-Freibeuter'/* geraten!'*/,
            /*TODO: hu 'Der Hilferuf, dem die Expedition folgte, stellte sich als */'böse Falle einiger arglistiger Sternen-Freibeuter'/* heraus. Ein Gefecht war unvermeidlich.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*TODO: hu 'Die aufgefangenen Signale stammten nicht von Fremdwesen, sondern */'von einer geheimen Piratenbasis'/* ! Die Piraten waren von unserer Anwesenheit in ihrem Sektor nicht besonders begeistert.'*/,
            /*TODO: hu 'Die Expeditionsflotte meldet */'schwere Kämpfe mit nicht-identifizierten Piratenschiffen'/*.'*/,
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*TODO: hu 'Einige */'fremdartig anmutende Schiffe'/* haben ohne Vorwarnung die Expeditionsflotte angegriffen.'*/,
            /*TODO: hu 'Deine Expeditionsflotte hatte einen */'nicht besonders freundlichen Erstkontakt'/* mit einer unbekannten Spezies.'*/,
            /*TODO: hu 'Unsere Expedition wurde von einer */'kleinen Gruppe unbekannter Schiffe'/* angegriffen.'*/,
            /*TODO: hu 'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*TODO: hu 'Eine */'unbekannte Spezies greift unsere Expedition'/* an!'*/,
            /*TODO: hu 'Deine */'Expeditionsflotte hat anscheinend das Hoheitsgebiet'/* einer bisher unbekannten, aber äußerst aggressiven und kriegerischen Alienrasse verletzt.'*/,
            /*TODO: hu 'Die Verbindung zu unserer Expeditionsflotte wurde kurzfristig gestört. Sofern wir die letzte Botschaft richtig entschlüsselt haben, steht die Flotte unter schwerem Feuer; die */'Aggressoren konnten nicht identifiziert werden'/*.'*/,
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
            /*TODO: hu 'Wir hatten beinahe eine */'Kollision mit einer anderen Expeditionsflotte'/*. Hätte nicht gedacht, dass sich hier noch andere herumtreiben.'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*TODO: hu 'Wir haben den Abschluss der Expedition mit den Crewmitgliedern einer zweiten Expeditionsflotte, die im selben Sektor unterwegs war, gefeiert. */'Die haben auch nichts Spannendes zu berichten',
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