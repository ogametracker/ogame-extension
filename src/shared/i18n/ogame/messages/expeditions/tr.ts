import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const tr: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*'Kesif ekibi az bir */'miktar karanlik madde buldu ve bunu basarili'/* bir sekilde depoya aktarmayi basardi'*/,
            /*'Eski bir */'Alien gemisinin kalintilarini bulduk'/* . Süper haberler var: Geminin icinden karanlik maddeyle dolu bir kutu cikti'*/,
            /* TODO tr 'Wir trafen auf ein */'seltsames Alien an Bord eines kleinen Schiffes'/*, das uns im Austausch für ein paar simple, mathematische Berechnungen einen kleinen Behälter mit Dunkler Materie überließ.'*/,
            /* TODO tr 'Unsere Expedition ist auf ein */'Geisterschiff gestoßen'/*, das eine kleine Menge Dunkler Materie transportierte. Wir haben zwar keinerlei Hinweise finden können, was der ursprünglichen Crew zugestoßen ist. Dennoch gelang es unseren Technikern, die Dunkle Materie zu bergen.'*/,
            /* TODO tr 'Die Expedition folgte einigen */'seltsamen Signalen und entdeckte einen Asteroiden'/*, in dessen Kern ein wenig Dunkle Materie eingeschlossen war. Der Asteroid wurde an Bord geholt und die Forscher versuchen nun, die Dunkle Materie zu extrahieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /* TODO tr 'Unserer Expedition ist */'ein einmaliges Experiment gelungen'/*:'*/,
            /* TODO tr 'Unsere Expedition hat eine */'uralte Raumstation gefunden'/*, die wohl schon seit langer Zeit unkontrolliert durch das All schwebt. Die Station selbst war komplett unbrauchbar, jedoch lagerte in einem ihrer Reaktoren noch ein wenig Dunkler Materie. Unsere Techniker versuchen, so viel wie möglich davon zu bergen.'*/,
            /* TODO tr 'Unsere Expedition meldet ein seltsames spektrales Phänomen. Dies führte unter anderem dazu, dass sich in den */'Energiespeichern der Schiffsschilde Dunkle Materie'/* bildete. Unsere Techniker versuchen nun, solange das Phänomen noch anhält, möglichst viel dieser Dunklen Materie zu konservieren.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /* TODO tr 'Eine */'spontane Hyperraumverzerrung'/* hat es deiner Expedition ermöglicht, eine große Menge dunkler Materie sicherzustellen!'*/,
            /* TODO tr 'Unsere Expedition meldet einen ersten Kontakt der besonderen Art. Anscheinend hat */'eine Energiekreatur, die sich Legorianer nannte'/*, die Schiffe der Expedition durchflogen und dann beschlossen, der unterentwickelten Spezies ein wenig auszuhelfen - es materialisierte sich ein Behälter mit dunkler Materie an Bord der Brücke!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`(?<amount>[^\\s]+) (?<name>${darkMatter}) ele geçirildi`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'Yaptigin kesif sayesinde cok degerli */'kaynaklar iceren kücük bir göktasi grubu ortaya cikardin'/* . Bunlari iyi degerlendirebilirsen mevcut hammadde miktarini arttirabilirsin.'*/,
            /*'Kenarda, gözlerden irak kalan kücük */'bir gezegen üzerinde bir kac maden bulundu ve bu madenlerden'/* basariyla yararli olabilecek hammadde cikarildi.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /* TODO tr 'Deine Expedition fand einen uralten, voll beladenen, aber */'menschenleeren Frachterkonvoi'/*. Einige Ressourcen konnten geborgen werden.'*/,
            /* TODO tr 'Auf einem kleinen Mond mit eigener Atmosphäre fand deine Expedition */'große Rohstoffvorkommen'/*. Die Bodencrews sind dabei, diese natürlichen Schätze zu heben.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /* TODO tr 'Ein */'Mineraliengürtel um einen unbekannten Planeten'/* enthielt Unmengen an Rohstoffen. Die Expeditionsflotte meldet volle Lager!'*/,
            /* TODO tr 'Deine Expeditionsflotte meldet den */'Fund eines riesigen Alien-Schiffswracks'/*. Mit der Technologie konnten sie zwar nichts anfangen, aber das Schiff ließ sich in seine Einzelteile zerlegen, wodurch man wertvolle Rohstoffe gewinnen konnte.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`(?<amount>.+) (?<name>${resources.join('|')}) ele geçirildi`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /* TODO tr 'Wir sind auf die */'Überreste einer Vorgängerexpedition'/* gestoßen! Unsere Techniker versuchen, einige der Wracks wieder flugfähig zu machen.'*/,
            /*'Kesif */'ekibin terkedilmis yildiz kalesi buldu'/* . Kalede kimse yasamiyor ama icinde hala birkac gemi var. Geriye bu gemilerin calisir durumda olup olmadigini anlamak kaliyor.'*/,
            /*'Kesif sirasinda eski */'savaslar sonucunda neredeyse tamamen yokolmus bir gezegen'/* bulduk. Gezegenin yörüngesinde öylece hareket etmekte olan onlarca gemi vardi, bakalim belki bu gemilerden bazilarini tamir etmeyi basarabiliriz. Böylelikle buralarda ne oldugunu da anlayabiliriz.'*/,
            /*'Terkedilmis bir korsan üssü bulduk. */'Üssün deposundaysa bir cok eski gemi var, ve teknik uzmanlarimiz bu gemilerin'/* kullanilip kullanilmayacagina karar vermeye calisiyor.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /* TODO tr 'Unsere Expedition stieß auf eine */'alte automatische Schiffswerft'/*. Einige Schiffe sind noch in der Produktionsphase und unsere Techniker versuchen, die Energieversorgung der Werft wiederherzustellen.'*/,
            /* TODO tr 'Wir haben die */'Reste einer Armada'/* gefunden. Die Techniker der Expeditionsflotte haben sich sofort auf die halbwegs intakten Schiffe begeben und versuchen, diese wieder instand zu setzen.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /* TODO tr 'Wir haben einen */'riesigen Raumschiffsfriedhof'/* gefunden. Einigen Technikern der Expeditionsflotte ist es gelungen, das ein oder andere Schiff wieder in Betrieb zu nehmen.'*/,
            /* TODO tr 'Wir haben einen Planeten mit */'Resten einer Zivilisation'/* entdeckt.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`Filona katilan gemiler:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
    },

    [ExpeditionEventType.nothing]: [
        /* TODO tr 'Trotz der ersten vielversprechenden Scans dieses Sektors kommen wir leider */'mit leeren Händen'/* zurück.'*/,
        /*'Bu kesif sonucunda kücük, */'garip bir yaratik disinda kayda deger bir sey bulunamadi',
        /* TODO tr 'Deine Expedition hat wortwörtlich mit der */'Leere des Alls'/* Bekanntschaft gemacht. Es gab nicht einmal einen kleinen Asteroiden oder Strahlung oder Partikel oder irgendetwas, das diese Expedition aufregend gestaltet hätte.'*/,
        /* TODO tr 'Eine Lebensform aus reiner Energie hat dafür gesorgt, dass sämtliche Expeditionsmitglieder tagelang auf */'die hypnotischen Muster'/* auf den Bildschirmen starrten. Als endlich die Meisten wieder klar im Kopf waren, musste die Expedition aufgrund von akutem Deuterium-Mangel abgebrochen werden.'*/,
        /*'Filo merkez */'gemisinin reaktöründeki hata neredeyse tüm kesif filosunu'/* yokediyordu. Sans eseri en iyi uzmanlarin da kesfe katilmislardi ve sorunlari uzun ugraslar sonucunda hallettiler. Bu sorun o kadar cok güc ve vakit harcattiki, kesif yarida birakilmak zorunda kalindi.'*/,
        /* TODO tr 'Deine Expedition hat */'wunderschöne Bilder einer Supernova'/* gemacht. Wirklich neue Erkenntnisse hat diese Expedition jedoch nicht gebracht. Aber man hat gute Chancen auf den Sieg im diesjährigen Bestes-Bild-des-Universums-Wettbewerb!'*/,
        /* TODO tr 'Deine Expeditionsflotte folgte einige Zeit seltsamen Signalen. Schließlich musste sie feststellen, dass die */'Signale zu einer uralten Sonde'/* gehören, die wohl vor einigen Generationen losgeschickt wurde, um fremde Spezies zu begrüßen. Die Sonde wurde geborgen und mehrere Museen deines Hauptplaneten haben schon Interesse daran verlauten lassen.'*/,
        /* TODO tr 'Nun, zumindest weiß man jetzt, dass */'rote Anomalien der Klasse 5'/* nicht nur chaotische Auswirkungen auf die Schiffssysteme haben, sondern auch massive Halluzinationen bei der Crew auslösen können. Viel mehr hat diese Expedition aber nicht gebracht.'*/,
        /*'Keşif filon bir */'şekilde nötron yıldızlarından birinin merkez çekim kuvvetinin'/* yakınlarına girdi. Bu çekim kuvvetinden çıkması kolay olmadı, kendini ancak ağır bir mücadelenin sonucunda kurtarabildi. Tabii bu mücadele sırasında ekstra deuterium tüketimi zorunluydu ve dolayısıyla filon verilen görevi yerine getiremeden, yakıt yetersizliği sebebiyle erkenden eve dönmek zorunda kaldı.'*/,
        /*'Evrenin tüm yönbulma */'sistemleri garip bir bilgisayar virüsü yüzünden agir sorunlar'/* yasadilar. Bunun sonucunda gönderilen kesif filosu tüm süre boyunca kendi etrafinda turlamis ve dönüp dolasip ayni yere gelmis. Herhalde bu kesif yolculugunun olumlu bir katkisi olmadigini bir daha söylemem gerekmiyor.'*/,
        /* TODO tr 'Vielleicht hätte man den */'Geburtstag des Captains'/* nicht auf diesem abgelegenen Planeten feiern sollen. Ein fieses Dschungelfieber hat große Teile der Crew gezwungen, die Reise in der Krankenstation zu verbringen. Der unerwartete Personalausfall führte dazu, dass die Expedition scheiterte.'*/,
        /* TODO tr 'Irgendjemand hat auf allen Schiffscomputern ein */'uraltes Strategiespiel'/* installiert. Die Expeditionsflotte war lange unterwegs, aber dadurch nicht besonders produktiv.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /* TODO tr 'Das Letzte, was von dieser Expedition noch gesendet wurde, waren einige unglaublich gut gelungene */'Nahaufnahmen eines sich öffnenden schwarzen Lochs'/*.'*/,
        /* TODO tr 'Von der Expedition ist */'nur noch folgender Funkspruch übrig'/* geblieben: Zzzrrt Oh Gott! Krrrzzzzt dass zrrrtrzt sieht krgzzzz ja aus wie Krzzzzzzzztzzzz ...'*/,
        /* TODO tr 'Ein Kernbruch des Führungsschiffes führte zu einer Kettenreaktion, die in einer durchaus */'spektakulären Explosion die gesamte Expedition'/* vernichtete.'*/,
        /* TODO tr 'Die Expeditionsflotte ist */'nicht mehr aus dem Sprung in den Normalraum'/* zurückgekehrt. Unsere Wissenschaftler rätseln noch immer, was geschehen sein könnte, jedoch scheint die Flotte endgültig verloren zu sein.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /* TODO tr 'Deine Expeditionsflotte hatte kurzen */'Kontakt zu einer scheuen Alien-Rasse'/*.'*/,
        /* TODO tr 'Deine Expeditionsflotte hatte ein Notsignal aufgefangen. Es handelte sich um einen Megafrachter, der im starken Gravitationsfeld eines Planetoiden gefangen war. Nachdem der Frachter erfolgreich befreit worden war, verkündete der Frachterkapitän feierlich, seine Befreier als bevorzugte Exklusivkunden */'in sein schwarzes Buch'/* aufzunehmen.'*/,
    ],

    [ExpeditionEventType.early]: [
        /* TODO tr 'Eine unvorhergesehene */'Rückkopplung in den Energiespulen'/* der Antriebsaggregate beschleunigte den Rücksprung der Expedition, so dass sie nun früher als erwartet zurückkehrt. Ersten Meldungen zufolge hat sie jedoch nichts Spannendes zu berichten.'*/,
        /* TODO tr 'Deine Expedition meldet keine Besonderheiten in dem erforschten Sektor. Jedoch geriet die Flotte */'beim Rücksprung in einen Sonnenwind'/*. Dadurch wurde der Sprung beschleunigt. Deine Expedition kehrt nun etwas früher nach Hause.'*/,
        /* TODO tr 'Der etwas wagemutige neue */'Kommandant nutzte ein instabiles Wurmloch'/*, um den Rückflug zu verkürzen - mit Erfolg! Jedoch hat die Expedition selbst keine neuen Erkenntnisse gebracht.'*/,
    ],

    [ExpeditionEventType.delay]: [
        /*'Kesif filon */'navigasyon sistemindeki önemli bir hatadan dolayi yola yanlis'/* hesaplarla cikiyor. Filo cok yanlis bir yere inmekle kalmiyor, ayni zamanda eve geri dönüsü de önemli boyutta yavasliyor.'*/,
        /* TODO tr 'Deine Expedition geriet in einen */'Sektor mit verstärkten Partikelstürmen'/*. Dadurch überluden sich die Energiespeicher der Flotte und bei sämtlichen Schiffen fielen die Hauptsysteme aus. Deine Mechaniker konnten das Schlimmste verhindern, jedoch wird die Expedition nun mit einiger Verspätung zurückkehren.'*/,
        /* TODO tr 'Aus bisher unbekannten Gründen ging der */'Sprung der Expeditionsflotte völlig daneben'/*. Beinahe wären die Schiffe im Herzen einer Sonne angekommen. Zum Glück ist man in einem bekannten System gelandet, jedoch wird der Rücksprung länger dauern als ursprünglich gedacht.'*/,
        /* TODO tr 'Der */'Sternwind eines roten Riesen'/* verfälschte den Sprung der Expedition dermaßen, dass es einige Zeit dauerte, den Rücksprung zu berechnen. Davon abgesehen gab es in dem Sektor, in dem die Expedition ankam, nichts außer der Leere zwischen den Sternen.'*/,
        /*'Das neue */'Navigationsmodul hat wohl doch noch mit einigen Bugs'/* zu kämpfen. Nicht nur ging der Sprung der Expeditionsflotte in die völlig falsche Richtung, auch wurde das gesamte Deuterium verbraucht, wobei der Sprung der Flotte nur knapp hinter dem Mond des Startplaneten endete. Etwas enttäuscht kehrt die Expedition nun auf Impuls zurück. Dadurch wird die Rückkehr wohl ein wenig verzögert.'*/,
        /* TODO tr 'Das Führungsschiff deiner */'Expeditionsflotte kollidierte mit einem fremden Schiff'/*, das ohne Vorwarnung direkt in die Flotte sprang. Das fremde Schiff explodierte und die Schäden am Führungsschiff waren beachtlich. Sobald die gröbsten Reparaturen abgeschlossen sind, werden sich deine Schiffe auf den Rückweg machen, da in diesem Zustand die Expedition nicht fortgeführt werden kann.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /* TODO tr *//Ein (?<name>.+) wurde dem Inventar hinzugefügt/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /* TODO tr 'Ein paar anscheinend */'sehr verzweifelte Weltraumpiraten'/* haben versucht,'*/,
            /* TODO tr 'Einige */'primitive Barbaren greifen uns mit Raumschiffen'/* an, die nicht einmal ansatzweise die Bezeichnung Raumschiff verdient haben. Sollte der Beschuss ernstzunehmende Ausmaße annehmen, sehen wir uns gezwungen, das Feuer zu erwidern.'*/,
            /* TODO tr 'Wir haben ein paar */'Funksprüche sehr betrunkener Piraten'/* aufgefangen.'*/,
            /* TODO tr 'Wir */'mussten uns gegen einige Piraten wehren'/*, die zum Glück nicht allzu zahlreich waren.'*/,
            /* TODO tr 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /* TODO tr 'Deine Expeditionsflotte hatte ein */'unschönes Zusammentreffen mit einigen Weltraumpiraten'/*.'*/,
            /*'Yildiz */'korsanlarinin kurdugu tuzagin tam ortasina dustuk'/* ! Savas kacinilmaz.'*/,
            /* TODO tr 'Der Hilferuf, dem die Expedition folgte, stellte sich als */'böse Falle einiger arglistiger Sternen-Freibeuter'/* heraus. Ein Gefecht war unvermeidlich.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /* TODO tr 'Die aufgefangenen Signale stammten nicht von Fremdwesen, sondern */'von einer geheimen Piratenbasis'/* ! Die Piraten waren von unserer Anwesenheit in ihrem Sektor nicht besonders begeistert.'*/,
            /* TODO tr 'Die Expeditionsflotte meldet */'schwere Kämpfe mit nicht-identifizierten Piratenschiffen'/*.'*/,
        ],
        'fled-death-star': [
            /* TODO tr 'Deine Expedition */'ist auf Aliens getroffen. Überwältigt von der Stärke deines Todessterns'/* , sind sie jedoch geflohen.'*/
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*'Egzotik görünüslü */'tarafimizca bilinmeyen gemiler kesif filomuza hic bir uyarida bulunmadan'/* saldirdilar!'*/,
            /* TODO tr 'Deine Expeditionsflotte hatte einen */'nicht besonders freundlichen Erstkontakt'/* mit einer unbekannten Spezies.'*/,
            /* TODO tr 'Unsere Expedition wurde von einer */'kleinen Gruppe unbekannter Schiffe'/* angegriffen.'*/,
            /* TODO tr 'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /* TODO tr 'Eine */'unbekannte Spezies greift unsere Expedition'/* an!'*/,
            /* TODO tr 'Deine */'Expeditionsflotte hat anscheinend das Hoheitsgebiet'/* einer bisher unbekannten, aber äußerst aggressiven und kriegerischen Alienrasse verletzt.'*/,
            /* TODO tr 'Die Verbindung zu unserer Expeditionsflotte wurde kurzfristig gestört. Sofern wir die letzte Botschaft richtig entschlüsselt haben, steht die Flotte unter schwerem Feuer; die */'Aggressoren konnten nicht identifiziert werden'/*.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /* TODO tr 'Deine Expedition ist in eine Alien-Invasions-Flotte geraten und */'meldet schwere Gefechte'/*.'*/,
            /* TODO tr 'Wir hatten Mühe den korrekten */'Dialekt einer Alienrasse'/* auszusprechen. Unser Diplomat rief daher "Feuer!" statt "Friede!".'*/,
            /* TODO tr 'Ein großer */'Verband kristalliner Schiffe unbekannter Herkunft'/* hält direkten Kollisionskurs mit unserer Expeditionsflotte. Wir müssen nun wohl vom Schlimmsten ausgehen.'*/,
        ],
        'fled-death-star': [
            /* TODO tr 'Deine Expedition */'ist auf Piraten getroffen. Überwältigt von der Stärke deines Todessterns'/* , sind sie jedoch geflohen.'*/
        ],
    },

    logbookRegex: /(Istihbarat Merkezi Komutaninin seyif defterinden alinti|Istihbarat Komutaninin seyir defterinden):(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'Evrenin bu */'bölgesinin henüz hic arastirilmamis oldugu cok bariz bir sekilde'/* belli oluyor.'*/,
            /*'Daha önce hic girilmemis bir */'bölgeye ilk giren insan olmak inanilmaz güzel bir duygu'/* , kelimelerle ifade edemem.'*/,
        ],
        [ExpeditionDepletionLevel.low]: [
            /* TODO tr 'Es scheint nicht so, als ob */'jemals ein Mensch in diesem Bereich der Galaxis'/* gewesen wäre.'*/,
            /* TODO tr 'Es wurden */'sehr alte Signaturen von Raumschiffen'/* entdeckt. Wir sind also nicht die Ersten hier.'*/,
            /* TODO tr 'Wir hatten beinahe eine */'Kollision mit einer anderen Expeditionsflotte'/*. Hätte nicht gedacht, dass sich hier noch andere herumtreiben.'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /* TODO tr 'Wir haben den Abschluss der Expedition mit den Crewmitgliedern einer zweiten Expeditionsflotte, die im selben Sektor unterwegs war, gefeiert. */'Die haben auch nichts Spannendes zu berichten',
            /* TODO tr 'Es wurden */'Anzeichen für die Präsenz anderer Expeditionsflotten'/* gefunden.'*/,
            /* TODO tr 'Es wurde */'friedlicher Funkkontakt zu einigen anderen Expeditionen'/* in diesem Sektor hergestellt.'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /* TODO tr 'Wenn wir uns zu unsicher fühlen, können wir uns ja */'mit all den anderen Expeditionen'/*, die hier herum fliegen, zusammen tun.'*/,
            /* TODO tr 'Vielleicht wäre es sinnvoller, hier */'eine Souvenir-Station zu errichten'/* , anstatt noch eine Expedition loszuschicken.'*/,
            /* TODO tr 'Wenn das so weitergeht, sollte man */'bei all dem Verkehr hier Navigationsbojen'/* aussetzen.'*/,
        ],
    },
};