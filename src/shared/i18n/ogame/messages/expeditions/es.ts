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
            /*'Nuestra expedición */'logró llevar a cabo un experimento único'/* : consiguieron extraer Materia Oscura de una estrella moribunda.'*/,
            /*'Nuestra expedición */'encontró una vetusta estación espacial que parece haber flotado'/* durante mucho tiempo sin control por el espacio exterior. La estación por sí misma era totalmente inútil, pero había algo de Materia Oscura almacenada en su reactor. Nuestros técnicos están intentando guardar tanta como sea posible.'*/,
            /*'Nuestra expedición informa de un espectacular y extraño fenómeno: la acumulación de Materia Oscura */'en los almacenes de energía de los escudos de la nave'/* . Nuestros técnicos están intentando almacenar tanta Materia Oscura como sea posible mientras dure el fenómeno.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'¡Una */'deformación espontánea en el hiperespacio permitió'/* a tu expedición recolectar grandes cantidades de Materia Oscura!'*/,
            /*'Nuestra expedición informa de un primer encuentro muy particular. Parece ser que una criatura de energía, */'que se llamaba a sí mismo Legoriano'/* , fluyó a través de las naves de la expedición y decidió ayudar a nuestra especie poco desarrollada. ¡Materializó un recipiente de Materia Oscura en el puente de la nave!'*/,
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
            /*'Tu expedición informa del */'descubrimiento de una nave alienígena gigante averiada y abandonada'/* . No fueron capaces de aprender de sus tecnologías, pero fueron capaces de dividir la nave en sus componentes básicos y extraer recursos útiles de ella.'*/,
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
            /*'Encontramos */'un enorme cementerio de naves espaciales'/* . Unos técnicos de la expedición consiguieron volver a hacer funcionar algunas naves de nuevo.'*/,
            /*'Encontramos */'un planeta con restos de una civilización'/* . Desde la órbita se puede ver una estación espacial gigante que está intacta. Algunos de tus técnicos y pilotos fueron a la superficie en busca de naves que se puedan usar aún.'*/,
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
        /*'La última */'transmisión que recibimos de la flota fueron las excelentes fotos'/* de un agujero negro abriéndose.'*/,
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
        /*'Tu expedición entró en */'un sector asolado por tormentas de partículas'/* . Esto provocó que los depósitos de energía se sobrecargaran, y la mayoría de los sistemas principales de las naves fallaron. Tus mecánicos lograron evitar lo peor, pero la flota va a volver con un gran retraso.'*/,
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
            /*'Unos */'bárbaros primitivos están atacándonos con naves espaciales'/* que ni siquiera merecen tal nombre. Si nos disparan en serio, nos veremos forzados a devolver el fuego.'*/,
            /*'Interceptamos */'comunicaciones de unos piratas borrachos'/* . Se suponía que tenían que atacarnos.'*/,
            /*'Tuvimos */'que luchar contra unos piratas que'/* , por suerte, no eran demasiado numerosos.'*/,
            /*LOCA: es 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Tu flota de expedición */'tuvo un desagradable encuentro con unos piratas'/* espaciales.'*/,
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
            /*'Tu flota de */'expedición parece haber entrado en un territorio perteneciente a una raza alienígena'/* desconocida pero muy belicosa.'*/,
            /*'La conexión con nuestra expedición se vio interrumpida repentinamente. Si hemos descifrado correctamente su último mensaje, la flota está sufriendo un duro ataque; */'no se ha logrado identificar a los agresores',
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: es 'Deine Expedition ist in eine Alien-Invasions-Flotte geraten und */'meldet schwere Gefechte'/*.'*/,
            /*'Tuvimos dificultades para */'pronunciar correctamente el dialecto de una raza alienígena'/* . Nuestro diplomático gritó "¡Fuego!" en lugar de "¡Paz!".'*/,
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
            /*'celebramos el fin de la expedición con los miembros de la tripulación de otra flota expedicionaria que estaba en el mismo sector. */'Ellos tampoco tienen nada emocionante sobre lo que informar',
            /*LOCA: es 'Es wurden */'Anzeichen für die Präsenz anderer Expeditionsflotten'/* gefunden.'*/,
            /*'establecimos */'contacto amistoso por radio con otras expediciones en el sector',
        ],
        [ExpeditionDepletionLevel.high]: [
            /*LOCA: es 'Wenn wir uns zu unsicher fühlen, können wir uns ja */'mit all den anderen Expeditionen'/*, die hier herum fliegen, zusammen tun.'*/,
            /*LOCA: es 'Vielleicht wäre es sinnvoller, hier */'eine Souvenir-Station zu errichten'/* , anstatt noch eine Expedition loszuschicken.'*/,
            /*LOCA: es 'Wenn das so weitergeht, sollte man */'bei all dem Verkehr hier Navigationsbojen'/* aussetzen.'*/,
        ],
    },
};