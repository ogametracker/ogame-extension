import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const es_mx: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*'La expedición ha */'logrado capturar y almacenar algo de Materia Oscura',
            /*'Encontramos los */'restos de una nave alienígena'/* . A bordo había un pequeño contenedor con algo de Materia Oscura.'*/,
            /*'Nos encontramos */'un extraño alien en una estantería en una pequeña nave'/* , nos dio una maleta con Materia Oscura a cambio de unos simples cálculos matemáticos.'*/,
            /*'Nuestra expedición */'se encontró con una nave fantasma que transportaba una pequeña'/* cantidad de Materia Oscura. No encontramos ningún indicio de qué le ocurrió a la tripulación original, pero nuestros técnicos fueron capaces de rescatar la Materia Oscura.'*/,
            /*'En el */'núcleo del asteroide había una pequeña cantidad'/* de Materia Oscura. Transportamos el asteroide a bordo y los exploradores intentan extraer la Materia Oscura.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Nuestra expedición */'cumplió un experimento único'/* . Fueron capaces de reciclar Materia Oscura de la desaparición de una estrella.'*/,
            /*'Nuestra expedición */'encontró una vetusta estación espacial que parece haber flotado'/* durante mucho tiempo sin control por el espacio exterior. La estación por sí misma era totalmente inútil, pero había algo de Materia Oscura almacenada en su reactor. Nuestros técnicos están intentando guardar tanta como sea posible.'*/,
            /*'Nuestra expedición informa de un espectacular y extraño fenómeno: la acumulación de Materia Oscura */'en los almacenes de energía de los escudos de la nave'/* . Nuestros técnicos están intentando almacenar tanta Materia Oscura como sea posible mientras dure el fenómeno.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'¡Una */'deformación espontánea en el hiperespacio permitió'/* a tu expedición recolectar grandes cantidades de Materia Oscura!'*/,
            /*LOCA: es 'Unsere Expedition meldet einen ersten Kontakt der besonderen Art. Anscheinend hat */'eine Energiekreatur, die sich Legorianer nannte'/*, die Schiffe der Expedition durchflogen und dann beschlossen, der unterentwickelten Spezies ein wenig auszuhelfen - es materialisierte sich ein Behälter mit dunkler Materie an Bord der Brücke!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`Se han tomado (?<name>${darkMatter}) de (?<amount>.+)\\.`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'Tu expedición */'descubrió un pequeño asteroide en el cual se pueden'/* reciclar algunos recursos.'*/,
            /*'En un planetoide abandonado encontramos */'algunas zonas de recursos fácilmente accesibles'/* y recolectamos algunos satisfactoriamente.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Tu expedición encontró un */'antiguo convoy, repleto de carga pero desierto'/* . Se pudieron rescatar algunos de los recursos.'*/,
            /*'En una pequeña luna con su propia atmósfera, tu expedición */'encontró una cantidad enorme de recursos sin explotar'/* . La tripulación en el terreno está tratando de levantar y cargar el tesoro natural.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Un */'cinturón de minerales alrededor de un planeta desconocido contiene incontables recursos'/* . ¡Las naves de la expedición están de vuelta y sus almacenes están llenos!'*/,
            /*'Tu expedición informa del */'descubrimiento de una nave alienígena gigante averiada y abandonada'/* . No fueron capaces de aprender de sus tecnologías, pero fueron capaces de dividir la nave en sus componentes básicos y extraer recursos útiles de ella.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`Se han tomado (?<name>${resources.join('|')}) de (?<amount>.+)\\.`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*'¡Atravesamos los */'restos de una expedición previa'/* ! Nuestros técnicos intentarán conseguir que algunas de las naves funcionen de nuevo.'*/,
            /*'Tu expedición volvió a */'través de una vieja estrella fortaleza que está desierta'/* desde hace años. En el hangar de la fortaleza encontraron algunas naves. Los técnicos intentan poner algunas a flote de nuevo.'*/,
            /*'Nuestra expedición */'encontró un planeta que estuvo cerca de ser completamente destruido'/* en continuas guerras. Hay naves diversas flotando alrededor de la órbita. Los técnicos intentan reparar algunas de ellas. Quizá con ello también conseguiremos información de lo que pasó aquí.'*/,
            /*'Encontramos una */'estación pirata desierta'/* . En el hangar hay estacionadas algunas naves antiguas. Nuestros técnicos están mirando si algunas de ellas son aún útiles.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Nuestra expedición se */'encontró con un antiguo Hangar automático'/* . Algunas de las naves se encuentran todavía en la fase de producción y nuestros técnicos están tratando de reactivar los generadores de energía.'*/,
            /*'Encontramos */'los restos de una armada'/* . Los técnicos fueron directamente a las naves casi intactas para intentar ponerlas en funcionamiento de nuevo.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Encontramos */'un enorme cementerio de naves espaciales'/* . Unos técnicos de la expedición consiguieron volver a hacer funcionar algunas naves de nuevo.'*/,
            /*'Encontramos */'un planeta con restos de una civilización'/* . Desde la órbita se puede ver una estación espacial gigante que está intacta. Algunos de tus técnicos y pilotos fueron a la superficie en busca de naves que se puedan usar aún.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`Las siguientes naves son ahora parte de la flota:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
    },

    [ExpeditionEventType.nothing]: [
        /*'A pesar de los */'prometedores escaneos preliminares del sector retornamos'/* con las manos vacías.'*/,
        /*'Aparte de unos */'pintorescos animalitos provenientes de un planeta pantanoso'/* desconocido, esta expedición no trae nada interesante de vuelta de su viaje.'*/,
        /*'Tu expedición */'ha aprendido sobre el extenso vacío del espacio'/* . No hay ni un pequeño asteroide, radiación o partícula que pudiera haber hecho esta expedición interesante.'*/,
        /*'Un ser de */'pura energía se aseguró que todos los miembros de la expedición'/* solo miraran el hipnotizante patrón de los monitores. Cuando la mayoría de ellos se despejaron de nuevo, la expedición debía ser abortada ya que quedaba poco Deuterio.'*/,
        /*'Un */'fallo en los motores de la nave insignia estuvo'/* cerca de destruir la flota de expedición entera. Afortunadamente los técnicos, que eran más que competentes, evitaron lo peor. Las reparaciones llevaron algo de tiempo y la expedición se vio forzada a volver sin haber conseguido nada.'*/,
        /*'Tu expedición */'hizo magníficas fotos de una super nova'/* . No se obtuvo nada de la expedición pero al menos hay muchas posibilidades de ganar el concurso "Mejor Foto del Universo" este año.'*/,
        /*'Tu flota en */'expedición siguió señales fuera de lo común algún tiempo'/* . Al final ellos se percataron que esas señales estaban siendo emitidas desde una vieja sonda que fue lanzada tiempo atrás para dar la bienvenida a especies desconocidas. La sonda fue guardada y algunos museos de tu planeta base ya han manifestado su interés.'*/,
        /*'Bueno, ahora sabemos que esas */'anomalías rojas de clase 5 no solo tienen'/* efectos caóticos en los sistemas de navegación de la nave, sino que también pueden generar alucinaciones masivas en la tripulación. Aparte de eso, la expedición no ha descubierto mucho más.'*/,
        /*'Tu expedición casi entra en */'el campo gravitacional de una estrella de neutrones'/* y necesito algún tiempo para librarse ella misma. A causa de esto mucho Deuterio fue consumido y la flota en expedición tuvo que volver sin ningún resultado.'*/,
        /*'Un */'extraño virus informático atacó el sistema de navegación'/* al poco de salir de nuestro sistema solar. Esto causó que la expedición volara en círculos. No hace falta decir que la expedición no fue realmente satisfactoria.'*/,
        /*'Quizás no deberíamos haber */'celebrado el cumpleaños del capitán en ese planeta desierto'/* . Una fiebre terrible y desconocida causó que la mayoría de la tripulación estuviera confinada en la enfermería durante el resto de la expedición. Debido a la escasez de personal, la expedición fracasó.'*/,
        /*'Alguien instaló un viejo */'juego de estrategia en todos los ordenadores de la nave'/* . La flota de la expedición estuvo ausente durante bastante tiempo, sin ser realmente productiva.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*LOCA: es 'Das Letzte, was von dieser Expedition noch gesendet wurde, waren einige unglaublich gut gelungene */'Nahaufnahmen eines sich öffnenden schwarzen Lochs'/*.'*/,
        /*'Lo único que */'quedó de la expedición fue el siguiente mensaje'/* : zzzrrt ¡Madre mía! Krrrzzzzt Eso zrrrtrzt parece krgzzzz un krzzzzzzzztzzzz...'*/,
        /*'La */'fusión del núcleo de la nave insignia produjo una reacción'/* en cadena que destruyó espectacularmente la flota entera.'*/,
        /*'La flota de expedición */'no ha retornado al espacio normal tras su salto'/* . Nuestros científicos aún intentan descubrir qué pasó, pero parece que la flota se perdió para siempre.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*'Tu flota en expedición tuvo un */'corto contacto con una esquiva raza de alienígenas'/* . Estos anunciaron que van a enviar a un representante con bienes comerciales a tus mundos.'*/,
        /*'Tu */'expedición captó un grito de ayuda'/* . Era una gran nave de carga que fue capturada por un potente campo gravitacional de un planetoide. Después de que la nave de carga fuese liberada con éxito, el capitán anunció que va a incluir a su liberador en su libro negro como cliente exclusivo.'*/,
    ],

    [ExpeditionEventType.early]: [
        /*'Un inesperado acoplamiento */'de energía en los motores aceleró la vuelta'/* de la expedición, de manera que volvió antes de lo esperado. Aparte de eso, los informes preliminares no reportan nada interesante.'*/,
        /*'Tu expedición no informa de ninguna anomalía en el sector explorado. Pero la flota */'entró en una oleada de viento solar mientras volvía'/* . Su retorno se aceleró enormemente. Tu expedición vuelve a casa un poco antes de lo esperado.'*/,
        /*'El nuevo comandante, que es bastante osado, */'ordenó utilizar un agujero de gusano inestable para acortar'/* el vuelo de regreso... ¡y tuvo éxito! Sin embargo, la expedición en sí no trajo nada nuevo.'*/,
    ],

    [ExpeditionEventType.delay]: [
        /*'Un pequeño fallo del */'navegador provocó un error de cálculo en el salto'/* de la expedición. No solo la flota aterrizó en un lugar completamente diferente, sino que ahora el camino de vuelta necesitará mucho más tiempo.'*/,
        /*'Tu expedición entró en */'un sector lleno de tormentas de partículas'/* . Esto provocó que los almacenes de energía se sobrecargaran y la mayoría de los sistemas principales de las naves se averiaron. Tus mecánicos fueron capaces de evitar lo peor pero la flota va a volver con un gran retraso.'*/,
        /*'Debido a motivos desconocidos, el */'salto de la expedición fue totalmente erróneo'/* . Estuvo a punto de aterrizar en el corazón de una estrella. Afortunadamente llegaron a un sistema conocido, aunque el salto de vuelta va a llevar más tiempo del esperado.'*/,
        /*'El */'viento estelar de una gigante roja ha arruinado'/* los saltos de la expedición de tal manera que necesitará un tiempo para calcular el salto de retorno. Aparte de eso, no había nada más que el vacío del espacio en el sector donde apareció la expedición.'*/,
        /*'El */'nuevo módulo de navegación aún está lidiando contra algunos bugs'/* . No solo el salto de la expedición fue en una dirección totalmente errónea, sino que se consumió todo el deuterio; afortunadamente, el salto de la flota los dejó cerca de la luna de su planeta de partida. La flota de expedición retorna algo decepcionada, y casi sin impulso. A causa de ello, el retorno de la flota se retrasa un poco.'*/,
        /*'La nave */'principal de la expedición colisionó con una nave desconocida'/* que saltó sobre la flota sin ningún aviso. La nave extraña explotó, causando sustanciales daños a la nave principal. Tan pronto como se lleven a cabo las reparaciones necesarias, la flota iniciará el viaje de vuelta, dado que la expedición no puede continuar en estas condiciones.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /Se ha añadido lo siguiente a tu inventario: (?<name>.+)/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*'Unos piratas */'realmente desesperados intentaron capturar nuestra flota'/* de expedición.'*/,
            /*'Algunos */'bárbaros primitivos están atacándonos con naves espaciales'/* que no deberían ser llamadas como tal. Si nos disparan en serio nos veremos forzados a devolver el fuego.'*/,
            /*'Capturamos */'algunos mensajes de radio de algunos piratas borrachos'/* . Parece que estaremos bajo ataque pronto.'*/,
            /*'Tuvimos */'que luchar contra unos piratas que'/* , por suerte, no eran demasiado numerosos.'*/,
            /*LOCA: es 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*LOCA: es 'Deine Expeditionsflotte hatte ein */'unschönes Zusammentreffen mit einigen Weltraumpiraten'/*.'*/,
            /*'¡Nos metimos en la */'emboscada de unos bucaneros estelares'/* ! No se pudo evitar un combate.'*/,
            /*'La señal de emergencia que la expedición estaba siguiendo resultó ser */'una maliciosa trampa dispuesta por unos bucaneros estelares'/* . No se pudo evitar un combate.'*/,
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
            /*'La conexión con nuestra expedición se vio interrumpida repentinamente. Si hemos descifrado correctamente su último mensaje, la flota está sufriendo un duro ataque; */'no se ha logrado identificar a los agresores',
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: es 'Deine Expedition ist in eine Alien-Invasions-Flotte geraten und */'meldet schwere Gefechte'/*.'*/,
            /*LOCA: es 'Wir hatten Mühe den korrekten */'Dialekt einer Alienrasse'/* auszusprechen. Unser Diplomat rief daher "Feuer!" statt "Friede!".'*/,
            /*LOCA: es 'Ein großer */'Verband kristalliner Schiffe unbekannter Herkunft'/* hält direkten Kollisionskurs mit unserer Expeditionsflotte. Wir müssen nun wohl vom Schlimmsten ausgehen.'*/,
        ],
    },

    logbookRegex: /Registro añadido de la comunicación oficial:(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'Parece como si */'esta parte del universo no hubiera sido explorada'/* hasta ahora.'*/,
            /*'Es una gran sensación ser */'el primero en un sector inexplorado',
        ],
        [ExpeditionDepletionLevel.low]: [
            /*'parece como si */'ningún humano hubiera estado antes en esta parte de la galaxia',
            /*'Encontramos */'antiguos signos de naves espaciales'/* . No somos los primeros'*/,
            /*'Casi tuvimos una */'colisión con otra flota de expedición'/* . No pensé que también otros se acercaran por aquí.'*/,
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