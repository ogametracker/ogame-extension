import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const es: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*'La expedición ha */'logrado capturar y almacenar algo de Materia Oscura',
            /*'Encontramos los */'restos de una nave alienígena'/* . A bordo había un pequeño contenedor con algo de Materia Oscura.'*/,
            /*'Encontramos un */'extraño alienígena a bordo de una pequeña nave que nos dio un pequeño'/* recipiente con Materia Oscura a cambio de unos simples cálculos matemáticos.'*/,
            /*'Nuestra expedición */'se encontró con una nave fantasma que transportaba una pequeña'/* cantidad de Materia Oscura. No encontramos ningún indicio de qué le ocurrió a la tripulación original, pero nuestros técnicos fueron capaces de rescatar la Materia Oscura.'*/,
            /*'En el */'núcleo del asteroide había una pequeña cantidad'/* de Materia Oscura. Transportamos el asteroide a bordo y los exploradores intentan extraer la Materia Oscura.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*LOCA: es 'Unserer Expedition ist */'ein einmaliges Experiment gelungen'/*:'*/,
            /*LOCA: es 'Unsere Expedition hat eine */'uralte Raumstation gefunden'/*, die wohl schon seit langer Zeit unkontrolliert durch das All schwebt. Die Station selbst war komplett unbrauchbar, jedoch lagerte in einem ihrer Reaktoren noch ein wenig Dunkler Materie. Unsere Techniker versuchen, so viel wie möglich davon zu bergen.'*/,
            /*LOCA: es 'Unsere Expedition meldet ein seltsames spektrales Phänomen. Dies führte unter anderem dazu, dass sich in den */'Energiespeichern der Schiffsschilde Dunkle Materie'/* bildete. Unsere Techniker versuchen nun, solange das Phänomen noch anhält, möglichst viel dieser Dunklen Materie zu konservieren.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: es 'Eine */'spontane Hyperraumverzerrung'/* hat es deiner Expedition ermöglicht, eine große Menge dunkler Materie sicherzustellen!'*/,
            /*LOCA: es 'Unsere Expedition meldet einen ersten Kontakt der besonderen Art. Anscheinend hat */'eine Energiekreatur, die sich Legorianer nannte'/*, die Schiffe der Expedition durchflogen und dann beschlossen, der unterentwickelten Spezies ein wenig auszuhelfen - es materialisierte sich ein Behälter mit dunkler Materie an Bord der Brücke!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`Se ha capturado (?<name>${darkMatter}) de (?<amount>.+)\\.`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'Tu expedición */'descubrió un pequeño asteroide'/* en el cual se pueden reciclar algunos recursos.'*/,
            /*'En un planetoide abandonado se han encontrado */'algunas zonas de recursos fácilmente accesibles'/* y se han recolectado muchas materias primas.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Tu expedición encontró un */'antiguo convoy, repleto de carga pero desierto'/* . Se pudieron rescatar algunos de los recursos.'*/,
            /*'En una pequeña luna con su propia atmósfera, tu expedición */'encontró una cantidad enorme de recursos sin explotar'/* . La tripulación en el terreno está tratando de levantar y cargar el tesoro natural.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Un */'cinturón de minerales alrededor de un planeta desconocido contiene incontables recursos'/* . ¡Las naves de la expedición están de vuelta y sus almacenes están llenos!'*/,
            /*LOCA: es 'Deine Expeditionsflotte meldet den */'Fund eines riesigen Alien-Schiffswracks'/*. Mit der Technologie konnten sie zwar nichts anfangen, aber das Schiff ließ sich in seine Einzelteile zerlegen, wodurch man wertvolle Rohstoffe gewinnen konnte.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`Se ha capturado (?<name>${resources.join('|')}) de (?<amount>.+)\\.`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*'¡Hemos encontrado */'restos de una expedición previa'/* ! Nuestros técnicos intentarán conseguir que algunas de las naves funcionen de nuevo.'*/,
            /*'Tu expedición dio con una */'vieja fortaleza estelar que está desierta'/* desde hace años. En el hangar de la fortaleza encontraron algunas naves. Los técnicos intentan poner algunas a flote de nuevo.'*/,
            /*'Nuestra expedición */'encontró un planeta prácticamente destruido por continuas guerras'/* . Hay naves diversas flotando alrededor de la órbita. Los técnicos intentan reparar algunas de ellas. Quizá con ello también obtengamos información de lo que pasó aquí.'*/,
            /*'Encontramos una */'estación pirata desierta'/* . En el hangar hay estacionadas algunas naves antiguas. Nuestros técnicos están mirando si algunas de ellas son aún útiles.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Nuestra expedición se */'encontró con un antiguo Hangar automático'/* . Algunas de las naves se encuentran todavía en la fase de producción y nuestros técnicos están tratando de reactivar los generadores de energía.'*/,
            /*'Encontramos */'los restos de una armada'/* . Los técnicos fueron directamente a las naves casi intactas para intentar ponerlas en funcionamiento de nuevo.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: es 'Wir haben einen */'riesigen Raumschiffsfriedhof'/* gefunden. Einigen Technikern der Expeditionsflotte ist es gelungen, das ein oder andere Schiff wieder in Betrieb zu nehmen.'*/,
            /*LOCA: es 'Wir haben einen Planeten mit */'Resten einer Zivilisation'/* entdeckt.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`Las siguientes naves ahora forman parte de la flota:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
    },

    [ExpeditionEventType.nothing]: [
        /*'A pesar de los */'prometedores escaneos preliminares del sector retornamos'/* con las manos vacías.'*/,
        /*'Aparte de unos */'pintorescos animalitos provenientes de un planeta pantanoso'/* desconocido, esta expedición no trae nada interesante de vuelta de su viaje.'*/,
        /*'Tu expedición se ha */'enfrentado, textualmente, al extenso vacío del espacio'/* . Ni el más mínimo asteroide, radiación o partícula lograron hacer interesante esta expedición.'*/,
        /*'Un ser de */'pura energía causó que toda la tripulación solo mirase'/* el patrón hipnotizante mostrado en los monitores. Para cuando la mayoría de ellos se despejaron, hubo que interrumpir la expedición debido a que quedaba poco deuterio.'*/,
        /*'Un */'fallo en los motores de la nave insignia estuvo'/* cerca de destruir la flota de expedición entera. Afortunadamente los técnicos, que eran más que competentes, evitaron lo peor. Las reparaciones llevaron algo de tiempo y la expedición se vio forzada a volver sin haber conseguido nada.'*/,
        /*'Tu expedición */'hizo magníficas fotos de una supernova'/* . No se obtuvieron conocimientos nuevos, ¡pero al menos hay muchas posibilidades de ganar el premio a la mejor foto del universo este año!'*/,
        /*'Tu flota de */'expedición siguió unas peculiares señales durante un tiempo'/* . Al final se percataron de que estaban siendo emitidas desde una vieja sonda, lanzada mucho tiempo atrás para dar la bienvenida a especies desconocidas. Se recuperó la sonda, y algunos museos de tu planeta base ya han manifestado su interés en ella.'*/,
        /*'Bueno, ahora sabemos que esas */'anomalías rojas de clase 5 no solo tienen'/* efectos caóticos en los sistemas de navegación de la nave, sino que también pueden generar alucinaciones masivas en la tripulación. Aparte de eso, la expedición no ha descubierto mucho más.'*/,
        /*'Tu expedición casi entra en el campo */'gravitacional de una estrella de neutrones'/* , y necesitó cierto tiempo para librarse ella misma. A causa de esto, se consumió mucho deuterio y la flota tuvo que volver sin ningún resultado.'*/,
        /*'Un */'extraño virus informático atacó el sistema de navegación'/* al poco de salir de nuestro sistema solar. Esto causó que la expedición volara en círculos. No hace falta decir que la expedición no fue realmente satisfactoria.'*/,
        /*'Quizás no deberíamos haber */'celebrado el cumpleaños del capitán en ese planeta desierto'/* . Una fiebre terrible y desconocida causó que la mayoría de la tripulación estuviera confinada en la enfermería durante el resto de la expedición. Debido a la escasez de personal, la expedición fracasó.'*/,
        /*'Alguien instaló un viejo */'juego de estrategia en todos los ordenadores de la nave'/* . La flota de la expedición estuvo ausente durante bastante tiempo, sin ser realmente productiva.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*LOCA: es 'Das Letzte, was von dieser Expedition noch gesendet wurde, waren einige unglaublich gut gelungene */'Nahaufnahmen eines sich öffnenden schwarzen Lochs'/*.'*/,
        /*'Lo único que */'quedó de la expedición fue el siguiente mensaje'/* : zzzrrt ¡Madre mía! Krrrzzzzt Eso zrrrtrzt parece krgzzzz un krzzzzzzzztzzzz...'*/,
        /*LOCA: es 'Ein Kernbruch des Führungsschiffes führte zu einer Kettenreaktion, die in einer durchaus */'spektakulären Explosion die gesamte Expedition'/* vernichtete.'*/,
        /*'La flota de expedición */'no ha retornado al espacio normal tras su salto'/* . Nuestros científicos aún intentan descubrir qué pasó, pero parece que la flota se perdió para siempre.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*'Tu flota en expedición tuvo un */'corto contacto con una esquiva raza de alienígenas'/* . Estos anunciaron que van a enviar a un representante con bienes comerciales a tus mundos.'*/,
        /*LOCA: es 'Deine Expeditionsflotte hatte ein Notsignal aufgefangen. Es handelte sich um einen Megafrachter, der im starken Gravitationsfeld eines Planetoiden gefangen war. Nachdem der Frachter erfolgreich befreit worden war, verkündete der Frachterkapitän feierlich, seine Befreier als bevorzugte Exklusivkunden */'in sein schwarzes Buch'/* aufzunehmen.'*/,
    ],

    [ExpeditionEventType.early]: [
        /*'Un inesperado acoplamiento */'de energía en los motores aceleró la vuelta'/* de la expedición, de manera que volvió antes de lo esperado. Aparte de eso, los informes preliminares no reportan nada interesante.'*/,
        /*'Tu expedición no informa de ninguna anomalía en el sector explorado. Pero la flota */'entró en una oleada de viento solar mientras volvía'/* . Su retorno se aceleró enormemente. Tu expedición vuelve a casa un poco antes de lo esperado.'*/,
        /*'El nuevo comandante, que es bastante osado, */'ordenó utilizar un agujero de gusano inestable para acortar'/* el vuelo de regreso... ¡y tuvo éxito! Sin embargo, la expedición en sí no trajo nada nuevo.'*/,
    ],

    [ExpeditionEventType.delay]: [
        /*'Un pequeño fallo del */'navegador provocó un error de cálculo en el salto'/* de la expedición. No solo la flota aterrizó en un lugar completamente diferente, sino que ahora el camino de vuelta necesitará mucho más tiempo.'*/,
        /*'Tu expedición entró en */'un sector asolado por tormentas de partículas'/* . Esto provocó que los depósitos de energía se sobrecargaran, y la mayoría de los sistemas principales de las naves fallaron. Tus mecánicos lograron evitar lo peor, pero la flota va a volver con un gran retraso.'*/,
        /*'Debido a motivos desconocidos, el */'salto de la expedición fue totalmente erróneo'/* . Estuvo a punto de aterrizar en el corazón de una estrella. Afortunadamente llegaron a un sistema conocido, aunque el salto de vuelta va a llevar más tiempo del esperado.'*/,
        /*LOCA: es 'Der */'Sternwind eines roten Riesen'/* verfälschte den Sprung der Expedition dermaßen, dass es einige Zeit dauerte, den Rücksprung zu berechnen. Davon abgesehen gab es in dem Sektor, in dem die Expedition ankam, nichts außer der Leere zwischen den Sternen.'*/,
        /*'El */'nuevo módulo de navegación aún está lidiando contra algunos bugs'/* . No solo el salto de la expedición fue en una dirección totalmente errónea, sino que se consumió todo el deuterio; afortunadamente, el salto de la flota los dejó cerca de la luna de su planeta de partida. La flota de expedición retorna algo decepcionada, y casi sin impulso. A causa de ello, el retorno de la flota se retrasa un poco.'*/,
        /*'La nave */'principal de la expedición colisionó con una nave desconocida'/* que saltó sobre la flota sin ningún aviso. La nave extraña explotó, causando sustanciales daños a la nave principal. Tan pronto como se lleven a cabo las reparaciones necesarias, la flota iniciará el viaje de vuelta, dado que la expedición no puede continuar en estas condiciones.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /Se ha añadido lo siguiente a tu inventario: (?<name>.+)/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*'Unos piratas */'realmente desesperados intentaron capturar nuestra flota'/* de expedición.'*/,
            /*'Unos */'bárbaros primitivos están atacándonos con naves espaciales'/* que ni siquiera merecen tal nombre. Si nos disparan en serio, nos veremos forzados a devolver el fuego.'*/,
            /*'Interceptamos */'comunicaciones de unos piratas borrachos'/* . Se suponía que tenían que atacarnos.'*/,
            /*'Tuvimos */'que luchar contra unos piratas que'/* , por suerte, no eran demasiado numerosos.'*/,
            /*LOCA: es 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*LOCA: es 'Deine Expeditionsflotte hatte ein */'unschönes Zusammentreffen mit einigen Weltraumpiraten'/*.'*/,
            /*'¡Nos metimos en la */'emboscada de unos bucaneros estelares'/* ! No se pudo evitar un combate.'*/,
            /*LOCA: es 'Der Hilferuf, dem die Expedition folgte, stellte sich als */'böse Falle einiger arglistiger Sternen-Freibeuter'/* heraus. Ein Gefecht war unvermeidlich.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: es 'Die aufgefangenen Signale stammten nicht von Fremdwesen, sondern */'von einer geheimen Piratenbasis'/* ! Die Piraten waren von unserer Anwesenheit in ihrem Sektor nicht besonders begeistert.'*/,
            /*LOCA: es 'Die Expeditionsflotte meldet */'schwere Kämpfe mit nicht-identifizierten Piratenschiffen'/*.'*/,
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*'¡Unas */'naves de exótico aspecto atacaron la expedición'/* sin previo aviso!'*/,
            /*'Tu flota de expedición no tuvo un */'primer contacto especialmente amigable con una especie'/* desconocida.'*/,
            /*LOCA: es 'Unsere Expedition wurde von einer */'kleinen Gruppe unbekannter Schiffe'/* angegriffen.'*/,
            /*LOCA: es 'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'¡Una *escuadrilla */'de naves sin identificar ha atacado a nuestra'/* expedición!'*/,
            /*LOCA: es 'Deine */'Expeditionsflotte hat anscheinend das Hoheitsgebiet'/* einer bisher unbekannten, aber äußerst aggressiven und kriegerischen Alienrasse verletzt.'*/,
            /*LOCA: es 'Die Verbindung zu unserer Expeditionsflotte wurde kurzfristig gestört. Sofern wir die letzte Botschaft richtig entschlüsselt haben, steht die Flotte unter schwerem Feuer; die */'Aggressoren konnten nicht identifiziert werden'/*.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: es 'Deine Expedition ist in eine Alien-Invasions-Flotte geraten und */'meldet schwere Gefechte'/*.'*/,
            /*LOCA: es 'Wir hatten Mühe den korrekten */'Dialekt einer Alienrasse'/* auszusprechen. Unser Diplomat rief daher "Feuer!" statt "Friede!".'*/,
            /*LOCA: es 'Ein großer */'Verband kristalliner Schiffe unbekannter Herkunft'/* hält direkten Kollisionskurs mit unserer Expeditionsflotte. Wir müssen nun wohl vom Schlimmsten ausgehen.'*/,
        ],
    },

    logbookRegex: /Entrada del oficial de telecomunicaciones en el diario de a bordo:(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'parece como si */'esta parte del universo no hubiera sido explorada'/* hasta ahora'*/,
            /*'es una gran sensación ser el */'primero en un sector inexplorado',
        ],
        [ExpeditionDepletionLevel.low]: [
            /*'parece como si */'ningún humano hubiera estado antes en esta parte de la galaxia',
            /*'encontramos */'antiguos signos de naves espaciales'/* . Por tanto, no somos los primeros.'*/,
            /*'casi tuvimos una */'colisión con otra flota de expedición'/* . No sabía que hubiera otra gente rondando por aquí.'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*LOCA: es 'Wir haben den Abschluss der Expedition mit den Crewmitgliedern einer zweiten Expeditionsflotte, die im selben Sektor unterwegs war, gefeiert. */'Die haben auch nichts Spannendes zu berichten',
            /*LOCA: es 'Es wurden */'Anzeichen für die Präsenz anderer Expeditionsflotten'/* gefunden.'*/,
            /*LOCA: es 'Es wurde */'friedlicher Funkkontakt zu einigen anderen Expeditionen'/* in diesem Sektor hergestellt.'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /*LOCA: es 'Wenn wir uns zu unsicher fühlen, können wir uns ja */'mit all den anderen Expeditionen'/*, die hier herum fliegen, zusammen tun.'*/,
            /*LOCA: es 'Vielleicht wäre es sinnvoller, hier */'eine Souvenir-Station zu errichten'/* , anstatt noch eine Expedition loszuschicken.'*/,
            /*LOCA: es 'Wenn das so weitergeht, sollte man */'bei all dem Verkehr hier Navigationsbojen'/* aussetzen.'*/,
        ],
    },
};