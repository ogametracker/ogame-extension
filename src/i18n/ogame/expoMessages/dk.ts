import ExpoSize from "@/models/expeditions/ExpoSize";
import ExpoType from "@/models/expeditions/ExpoType";

export default {
    [ExpoType.darkMatter]: {
        [ExpoSize.small]: [
            /*'Det var muligt for din */'ekspedition at indfange og konservere'/* en del Mørk Materie.'*/,
            /*'Wir haben die */'Überreste eines Alien-Schiffes'/* gefunden. An Bord war ein kleiner Behälter mit Dunkler Materie!'*/,
            /*'Vi mødte et */'oldgammelt væsen'/* af ukendt race, i et mindre rumskib. Han gav os en lille kasse med Mørk Materie i bytte for nogle simple matematiske udregninger.'*/,
            /*'Unsere Expedition ist auf ein */'Geisterschiff gestoßen'/*, das eine kleine Menge Dunkler Materie transportierte. Wir haben zwar keinerlei Hinweise finden können, was der ursprünglichen Crew zugestoßen ist. Dennoch gelang es unseren Technikern, die Dunkle Materie zu bergen.'*/,
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
        regex: /(?<name>Mørk Materie) (?<amount>[^\s]+) er blevet taget/,
    },

    [ExpoType.resources]: {
        [ExpoSize.small]: [
            /*'Din ekspedition fandt en */'lille asteroide'/*, hvorfra nogle ressourcer kunne opsamles.'*/,
            /*'På en */'isoleret planet'/*, fandt vi nogle let tilgængelige ressourceområder og høstede dem.'*/,
        ],
        [ExpoSize.medium]: [
            /*'Din ekspedition fandt en gammel, fuldt lastet og */'forladt konvoj af transportskibe'/*. Nogen af ressourcerne kunne reddes.'*/,
            /*'Auf einem kleinen Mond mit eigener Atmosphäre fand deine Expedition */'große Rohstoffvorkommen'/*. Die Bodencrews sind dabei, diese natürlichen Schätze zu heben.'*/,
        ],
        [ExpoSize.large]: [
            /*'Ein */'Mineraliengürtel'/* um einen unbekannten Planeten enthielt Unmengen an Rohstoffen. Die Expeditionsflotte meldet volle Lager!'*/,
            /*'Deine Expeditionsflotte meldet den */'Fund eines riesigen Alien-Schiffswracks'/*. Mit der Technologie konnten sie zwar nichts anfangen, aber das Schiff ließ sich in seine Einzelteile zerlegen, wodurch man wertvolle Rohstoffe gewinnen konnte.'*/,
        ],
        regex: /(?<name>Metal|Krystal|Deuterium) (?<amount>.+) er blevet taget./,
    },

    [ExpoType.fleet]: {
        [ExpoSize.small]: [
            /*'Vi kom forbi resterne af en */'tidligere ekspedition'/*. Vores teknikere vil forsøge at få nogle af skibene til at virke igen.'*/,
            /*'Vores ekspedition har fundet en */'forladt stjernefæstning'/*. I hangaren fandt vi nogle skibe. Vores tekniker prøver at få dem i gang igen.'*/,
            /*'Unsere Expedition fand einen Planeten, der wohl durch */'anhaltende Kriege'/* fast komplett zerstört wurde. In der Umlaufbahn treiben diverse Schiffswracks. Die Techniker versuchen, einige davon zu reparieren. Vielleicht erhalten wir so auch Information darüber, was hier geschehen ist.'*/,
            /*'Vi har fundet en */'forladt piratbase'/*. I deres hangar lå nogle gamle skibe. Vores tekniker er på vej for at finde ud om de kan genbruges.'*/,
        ],
        [ExpoSize.medium]: [
            /*'Unsere Expedition stieß auf eine */'alte automatische Schiffswerft'/*. Einige Schiffe sind noch in der Produktionsphase und unsere Techniker versuchen, die Energieversorgung der Werft wiederherzustellen.'*/,
            /*'Wir haben die */'Reste einer Armada'/* gefunden. Die Techniker der Expeditionsflotte haben sich sofort auf die halbwegs intakten Schiffe begeben und versuchen, diese wieder instand zu setzen.'*/,
        ],
        [ExpoSize.large]: [
            /*'Wir haben einen */'riesigen Raumschiffsfriedhof'/* gefunden. Einigen Technikern der Expeditionsflotte ist es gelungen, das ein oder andere Schiff wieder in Betrieb zu nehmen.'*/,
            /*'Wir haben einen Planeten mit */'Resten einer Zivilisation'/* entdeckt.'*/,
        ],
        regex: /De følgende skibe er nu del af flåden.(<br>|\s*)(?<ships>([\w\s]+:\s*\d+(<br>|\s*)?)+)?/,
    },

    [ExpoType.nothing]: [
        /*'Trods det første, meget lovende skan af sektoren kom vi */'desværre tilbage'/* uden noget.'*/,
        /*'Außer einiger kurioser kleiner Tierchen von einem */'unbekannten Sumpfplaneten'/* bringt diese Expedition nichts Aufregendes von ihrer Reise mit.'*/,
        /*'Deine Expedition hat wortwörtlich mit der */'Leere des Alls'/* Bekanntschaft gemacht. Es gab nicht einmal einen kleinen Asteroiden oder Strahlung oder Partikel oder irgendetwas, das diese Expedition aufregend gestaltet hätte.'*/,
        /*'Eine Lebensform aus reiner Energie hat dafür gesorgt, dass sämtliche Expeditionsmitglieder tagelang auf */'die hypnotischen Muster'/* auf den Bildschirmen starrten. Als endlich die Meisten wieder klar im Kopf waren, musste die Expedition aufgrund von akutem Deuterium-Mangel abgebrochen werden.'*/,
        /*'Ein */'Reaktorfehler des Führungsschiffes'/* hätte beinahe die gesamte Expedition vernichtet. Zum Glück waren die Techniker mehr als fähig und konnten das Schlimmste verhindern. Die Reparatur nahm jedoch so viel Zeit in Anspruch, dass die Expedition unverrichteter Dinge wieder zurückkehren musste.'*/,
        /*'Deine Expedition hat */'wunderschöne Bilder einer Supernova'/* gemacht. Wirklich neue Erkenntnisse hat diese Expedition jedoch nicht gebracht. Aber man hat gute Chancen auf den Sieg im diesjährigen Bestes-Bild-des-Universums-Wettbewerb!'*/,
        /*'Deine Expeditionsflotte folgte einige Zeit seltsamen Signalen. Schließlich musste sie feststellen, dass die */'Signale zu einer uralten Sonde'/* gehören, die wohl vor einigen Generationen losgeschickt wurde, um fremde Spezies zu begrüßen. Die Sonde wurde geborgen und mehrere Museen deines Hauptplaneten haben schon Interesse daran verlauten lassen.'*/,
        /*'Nun, zumindest weiß man jetzt, dass */'rote Anomalien der Klasse 5'/* nicht nur chaotische Auswirkungen auf die Schiffssysteme haben, sondern auch massive Halluzinationen bei der Crew auslösen können. Viel mehr hat diese Expedition aber nicht gebracht.'*/,
        /*'Deine Expeditionsflotte geriet gefährlich nahe an */'das Gravitationsfeld eines Neutronensterns'/* und musste einige Zeit kämpfen, um sich daraus zu befreien. Dadurch wurde sehr viel Deuterium verbraucht und die Expeditionsflotte kehrte schließlich unverrichteter Dinge zurück.'*/,
        /*'En */'underlig computervirus'/* angreb navigationssystemet kort efter afgang. Dette gjorde at ekspeditionsflåden fløj i cirkler, Unødvendigt at sige den ikke rigtig var succesfuld.'*/,
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
        /*'Din */'navigationschef havde en dårlig dag'/* og fik lavet en fejl i ekspeditionsrutens udregninger. Udover at din flåde er endt et ukendt sted, vil det også tage længere tid at flyve hjem.'*/,
        /*'Din ekspedition er kommet ind i en */'partikelstorm'/*. Dette overbelastede energisystemet og det meste af skibets hovedsystem er derfor brudt sammen. Dine mekanikere fik afværget det værste. Din ekspedition vender tilbage med stor forsinkelse.'*/,
        /*'Aus bisher unbekannten Gründen ging der */'Sprung der Expeditionsflotte völlig daneben'/*. Beinahe wären die Schiffe im Herzen einer Sonne angekommen. Zum Glück ist man in einem bekannten System gelandet, jedoch wird der Rücksprung länger dauern als ursprünglich gedacht.'*/,
        /*'Der */'Sternwind eines roten Riesen'/* verfälschte den Sprung der Expedition dermaßen, dass es einige Zeit dauerte, den Rücksprung zu berechnen. Davon abgesehen gab es in dem Sektor, in dem die Expedition ankam, nichts außer der Leere zwischen den Sternen.'*/,
        /*'Das neue */'Navigationsmodul hat wohl doch noch mit einigen Bugs'/* zu kämpfen. Nicht nur ging der Sprung der Expeditionsflotte in die völlig falsche Richtung, auch wurde das gesamte Deuterium verbraucht, wobei der Sprung der Flotte nur knapp hinter dem Mond des Startplaneten endete. Etwas enttäuscht kehrt die Expedition nun auf Impuls zurück. Dadurch wird die Rückkehr wohl ein wenig verzögert.'*/,
        /*'Ekspeditionens moderskib havde et */'sammenstød med et fremmed skib'/*. Det fremmede skib eksploderede og den efterfølgende skade på moderskibet var omfattende. Det kan ikke flyve videre i nuværende tilstand. Lige så snart de nødvendige reparationer er lavet, vil dit skib flyve tilbage.'*/,
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