import ExpoSize from "@/models/expeditions/ExpoSize";
import ExpoType from "@/models/expeditions/ExpoType";

export default {
    [ExpoType.darkMatter]: {
        [ExpoSize.small]: [
            /*'Der Expedition ist es gelungen, */'ein wenig Dunkle Materie einzufangen'/* und zu konservieren.'*/,
            /*'Wir haben die */'Überreste eines Alien-Schiffes'/* gefunden. An Bord war ein kleiner Behälter mit Dunkler Materie!'*/,
            /*'Wir trafen auf ein */'seltsames Alien an Bord eines kleinen Schiffes'/*, das uns im Austausch für ein paar simple, mathematische Berechnungen einen kleinen Behälter mit Dunkler Materie überließ.'*/,
            /*'Our expedition took over a */'ghost ship which was transporting a small amount of Dark Matter'/*. We didn`t find any hints of what happened to the original crew of the ship, but our technicians where able to rescue the Dark Matter.'*/,
            /*'Die Expedition folgte einigen */'seltsamen Signalen und entdeckte einen Asteroiden'/*, in dessen Kern ein wenig Dunkle Materie eingeschlossen war. Der Asteroid wurde an Bord geholt und die Forscher versuchen nun, die Dunkle Materie zu extrahieren.'*/,
        ],
        [ExpoSize.medium]: [
            /*'Unserer Expedition ist */'ein einmaliges Experiment gelungen'/*:'*/,
            /*'Unsere Expedition hat eine */'uralte Raumstation gefunden'/*, die wohl schon seit langer Zeit unkontrolliert durch das All schwebt. Die Station selbst war komplett unbrauchbar, jedoch lagerte in einem ihrer Reaktoren noch ein wenig Dunkler Materie. Unsere Techniker versuchen, so viel wie möglich davon zu bergen.'*/,
            /*'Unsere Expedition meldet ein seltsames spektrales Phänomen. Dies führte unter anderem dazu, dass sich in den */'Energiespeichern der Schiffsschilde Dunkle Materie'/* bildete. Unsere Techniker versuchen nun, solange das Phänomen noch anhält, möglichst viel dieser Dunklen Materie zu konservieren.'*/,
        ],
        [ExpoSize.large]: [
            /*'Eine */'spontane Hyperraumverzerrung'/* hat es deiner Expedition ermöglicht, eine große Menge dunkler Materie sicherzustellen!'*/,
            /*'Unsere Expedition meldet einen ersten Kontakt der besonderen Art. Anscheinend hat */'eine Energiekreatur, die sich Legorianer nannte'/*, die Schiffe der Expedition durchflogen und dann beschlossen, der unterentwickelten Spezies ein wenig auszuhelfen - es materialisierte sich ein Behälter mit dunkler Materie an Bord der Brücke!'*/,
        ],
        regex: /(?<name>Dark Matter) (?<amount>.+) have been captured/,
    },

    [ExpoType.resources]: {
        [ExpoSize.small]: [
            /*'Your expedition */'discovered a small asteroid'/* from which some resources could be harvested.'*/,
            /*'On an isolated planetoid we found */'some easily accessible resources fields'/* and harvested some successfully.'*/,
        ],
        [ExpoSize.medium]: [
            /*'Deine Expedition fand einen uralten, voll beladenen, aber */'menschenleeren Frachterkonvoi'/*. Einige Ressourcen konnten geborgen werden.'*/,
            /*'Auf einem kleinen Mond mit eigener Atmosphäre fand deine Expedition */'große Rohstoffvorkommen'/*. Die Bodencrews sind dabei, diese natürlichen Schätze zu heben.'*/,
        ],
        [ExpoSize.large]: [
            /*'Ein */'Mineraliengürtel'/* um einen unbekannten Planeten enthielt Unmengen an Rohstoffen. Die Expeditionsflotte meldet volle Lager!'*/,
            /*'Deine Expeditionsflotte meldet den */'Fund eines riesigen Alien-Schiffswracks'/*. Mit der Technologie konnten sie zwar nichts anfangen, aber das Schiff ließ sich in seine Einzelteile zerlegen, wodurch man wertvolle Rohstoffe gewinnen konnte.'*/,
        ],
        regex: /(?<name>Metal|Crystal|Deuterium) (?<amount>.+) have been captured/,
    },

    [ExpoType.fleet]: {
        [ExpoSize.small]: [
            /*'Wir sind auf die */'Überreste einer Vorgängerexpedition'/* gestoßen! Unsere Techniker versuchen, einige der Wracks wieder flugfähig zu machen.'*/,
            /*'Your expedition ran into the */'shipyards of a colony that was deserted eons ago'/*. In the shipyards hangar they discover some ships that could be salvaged. The technicians are trying to get some of them to fly again.'*/,
            /*'Unsere Expedition fand einen Planeten, der wohl durch */'anhaltende Kriege'/* fast komplett zerstört wurde. In der Umlaufbahn treiben diverse Schiffswracks. Die Techniker versuchen, einige davon zu reparieren. Vielleicht erhalten wir so auch Information darüber, was hier geschehen ist.'*/,
            /*'Wir haben eine */'verlassene Piratenbasis'/* gefunden. Im Hangar liegen noch einige alte Schiffe. Unsere Techniker schauen nach, ob einige davon noch zu gebrauchen sind.'*/,
        ],
        [ExpoSize.medium]: [
            /*'Unsere Expedition stieß auf eine */'alte automatische Schiffswerft'/*. Einige Schiffe sind noch in der Produktionsphase und unsere Techniker versuchen, die Energieversorgung der Werft wiederherzustellen.'*/,
            /*'Wir haben die */'Reste einer Armada'/* gefunden. Die Techniker der Expeditionsflotte haben sich sofort auf die halbwegs intakten Schiffe begeben und versuchen, diese wieder instand zu setzen.'*/,
        ],
        [ExpoSize.large]: [
            /*'Wir haben einen */'riesigen Raumschiffsfriedhof'/* gefunden. Einigen Technikern der Expeditionsflotte ist es gelungen, das ein oder andere Schiff wieder in Betrieb zu nehmen.'*/,
            /*'Wir haben einen Planeten mit */'Resten einer Zivilisation'/* entdeckt.'*/,
        ],
        regex: /The following ships are now part of the fleet:(?<ships>.+)/,
    },

    [ExpoType.nothing]: [
        /*'Despite the first, */'very promising scans of this sector'/*, we unfortunately returned empty handed.'*/,
        /*'Besides some quaint, */'small pets from a unknown marsh planet'/*, this expedition brings nothing thrilling back from the trip.'*/,
        /*'Your expedition has learnt about */'the extensive emptiness of space'/*. There was not even one small asteroid or radiation or particle that could have made this expedition interesting.'*/,
        /*'Eine Lebensform aus reiner Energie hat dafür gesorgt, dass sämtliche Expeditionsmitglieder tagelang auf */'die hypnotischen Muster'/* auf den Bildschirmen starrten. Als endlich die Meisten wieder klar im Kopf waren, musste die Expedition aufgrund von akutem Deuterium-Mangel abgebrochen werden.'*/,
        /*'Ein */'Reaktorfehler des Führungsschiffes'/* hätte beinahe die gesamte Expedition vernichtet. Zum Glück waren die Techniker mehr als fähig und konnten das Schlimmste verhindern. Die Reparatur nahm jedoch so viel Zeit in Anspruch, dass die Expedition unverrichteter Dinge wieder zurückkehren musste.'*/,
        /*'Deine Expedition hat */'wunderschöne Bilder einer Supernova'/* gemacht. Wirklich neue Erkenntnisse hat diese Expedition jedoch nicht gebracht. Aber man hat gute Chancen auf den Sieg im diesjährigen Bestes-Bild-des-Universums-Wettbewerb!'*/,
        /*'Your expedition fleet */'followed odd signals for some time'/*. At the end they noticed that those signals where being sent from an old probe which was sent out generations ago to greet foreign species. The probe was saved and some museums of your home planet already voiced their interest.'*/,
        /*'Well, now we know that those red, */'class 5 anomalies'/* do not only have chaotic effects on the ships navigation systems but also generate massive hallucination on the crew. The expedition didn`t bring anything back.'*/,
        /*'Your expedition nearly */'ran into a neutron stars gravitation field'/* and needed some time to free itself. Because of that a lot of Deuterium was consumed and the expedition fleet had to come back without any results.'*/,
        /*'Ein */'seltsames Computervirus'/* legte kurz nach Verlassen des Sonnensystems die Navigation lahm. Dies führte dazu, dass die gesamte Expeditionsflotte die ganze Zeit im Kreis flog. Überflüssig zu sagen, dass die Expedition nicht besonders erfolgreich war.'*/,
        /*'Vielleicht hätte man den */'Geburtstag des Captains'/* nicht auf diesem abgelegenen Planeten feiern sollen. Ein fieses Dschungelfieber hat große Teile der Crew gezwungen, die Reise in der Krankenstation zu verbringen. Der unerwartete Personalausfall führte dazu, dass die Expedition scheiterte.'*/,
        /*'Irgendjemand hat auf allen Schiffscomputern ein */'uraltes Strategiespiel'/* installiert. Die Expeditionsflotte war lange unterwegs, aber dadurch nicht besonders produktiv.'*/,
    ],

    [ExpoType.lostFleet]: [
        /*'Das Letzte, was von dieser Expedition noch gesendet wurde, waren einige unglaublich gut gelungene */'Nahaufnahmen eines sich öffnenden schwarzen Lochs'/*.'*/,
        /*'Von der Expedition ist */'nur noch folgender Funkspruch übrig'/* geblieben: Zzzrrt Oh Gott! Krrrzzzzt dass zrrrtrzt sieht krgzzzz ja aus wie Krzzzzzzzztzzzz ...'*/,
        /*'Ein Kernbruch des Führungsschiffes führte zu einer Kettenreaktion, die in einer durchaus */'spektakulären Explosion die gesamte Expedition'/* vernichtete.'*/,
        /*'Die Expeditionsflotte ist */'nicht mehr aus dem Sprung in den Normalraum'/* zurückgekehrt. Unsere Wissenschaftler rätseln noch immer, was geschehen sein könnte, jedoch scheint die Flotte endgültig verloren zu sein.'*/,
    ],

    [ExpoType.trader]: [
        /*'Deine Expeditionsflotte hatte kurzen */'Kontakt zu einer scheuen Alien-Rasse'/*.'*/,
        /*'Deine Expeditionsflotte hatte ein Notsignal aufgefangen. Es handelte sich um einen Megafrachter, der im starken Gravitationsfeld eines Planetoiden gefangen war. Nachdem der Frachter erfolgreich befreit worden war, verkündete der Frachterkapitän feierlich, seine Befreier als bevorzugte Exklusivkunden */'in sein schwarzes Buch'/* aufzunehmen.'*/,
    ],

    [ExpoType.early]: [
        /*'Eine unvorhergesehene */'Rückkopplung in den Energiespulen'/* der Antriebsaggregate beschleunigte den Rücksprung der Expedition, so dass sie nun früher als erwartet zurückkehrt. Ersten Meldungen zufolge hat sie jedoch nichts Spannendes zu berichten.'*/,
        /*'Deine Expedition meldet keine Besonderheiten in dem erforschten Sektor. Jedoch geriet die Flotte */'beim Rücksprung in einen Sonnenwind'/*. Dadurch wurde der Sprung beschleunigt. Deine Expedition kehrt nun etwas früher nach Hause.'*/,
        /*'Der etwas wagemutige neue */'Kommandant nutzte ein instabiles Wurmloch'/*, um den Rückflug zu verkürzen - mit Erfolg! Jedoch hat die Expedition selbst keine neuen Erkenntnisse gebracht.'*/,
    ],

    [ExpoType.delay]: [
        /*'Ein böser Patzer des Navigators führte zu einer */'Fehlkalkulation beim Sprung'/* der Expedition.'*/,
        /*'Deine Expedition geriet in einen */'Sektor mit verstärkten Partikelstürmen'/*. Dadurch überluden sich die Energiespeicher der Flotte und bei sämtlichen Schiffen fielen die Hauptsysteme aus. Deine Mechaniker konnten das Schlimmste verhindern, jedoch wird die Expedition nun mit einiger Verspätung zurückkehren.'*/,
        /*'Aus bisher unbekannten Gründen ging der */'Sprung der Expeditionsflotte völlig daneben'/*. Beinahe wären die Schiffe im Herzen einer Sonne angekommen. Zum Glück ist man in einem bekannten System gelandet, jedoch wird der Rücksprung länger dauern als ursprünglich gedacht.'*/,
        /*'Der */'Sternwind eines roten Riesen'/* verfälschte den Sprung der Expedition dermaßen, dass es einige Zeit dauerte, den Rücksprung zu berechnen. Davon abgesehen gab es in dem Sektor, in dem die Expedition ankam, nichts außer der Leere zwischen den Sternen.'*/,
        /*'The */'new navigation module is still buggy'/*. The expeditions jump not only lead them in the wrong direction, but it used all the Deuterium fuel. Fortunately the fleets jump got them close to the departure planets moon. A bit disappointed the expedition now returns without impulse power. The return trip will take longer than expected.'*/,
        /*'Das Führungsschiff deiner */'Expeditionsflotte kollidierte mit einem fremden Schiff'/*, das ohne Vorwarnung direkt in die Flotte sprang. Das fremde Schiff explodierte und die Schäden am Führungsschiff waren beachtlich. Sobald die gröbsten Reparaturen abgeschlossen sind, werden sich deine Schiffe auf den Rückweg machen, da in diesem Zustand die Expedition nicht fortgeführt werden kann.'*/,
    ],

    [ExpoType.item]: {
        regex: /Ein (?<name>.+) wurde dem Inventar hinzugefügt/,
    },

    [ExpoType.pirates]: {
        [ExpoSize.small]: [
            /*'Ein paar anscheinend */'sehr verzweifelte Weltraumpiraten'/* haben versucht,'*/,
            /*'Einige */'primitive Barbaren greifen uns mit Raumschiffen'/* an, die nicht einmal ansatzweise die Bezeichnung Raumschiff verdient haben. Sollte der Beschuss ernstzunehmende Ausmaße annehmen, sehen wir uns gezwungen, das Feuer zu erwidern.'*/,
            /*'Wir haben ein paar */'Funksprüche sehr betrunkener Piraten'/* aufgefangen.'*/,
            /*'Wir */'mussten uns gegen einige Piraten wehren'/*, die zum Glück nicht allzu zahlreich waren.'*/,
            /*'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpoSize.medium]: [
            /*'Deine Expeditionsflotte hatte ein */'unschönes Zusammentreffen mit einigen Weltraumpiraten'/*.'*/,
            /*'Wir sind in den */'Hinterhalt einiger Sternen-Freibeuter'/* geraten!'*/,
            /*'Der Hilferuf, dem die Expedition folgte, stellte sich als */'böse Falle einiger arglistiger Sternen-Freibeuter'/* heraus. Ein Gefecht war unvermeidlich.'*/,
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
        ],
    },
};