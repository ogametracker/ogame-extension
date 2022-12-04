import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const es_ar: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*'La expedición fue */'capaz de capturar y almacenar algo'/* de Materia Oscura.'*/,
            /*'Encontramos */'los restos de una nave alienígena'/* . En sus estanterías había un pequeño contenedor con algo de Materia Oscura.'*/,
            /*'Nos */'encontramos un extraño alien en una estantería en una pequeña'/* nave, nos dio una maleta con Materia Oscura a cambio de unos simples cálculos matemáticos.'*/,
            /*'Nuestra expedición se */'encontró con una nave fantasma que transportaba'/* una pequeña cantidad de Materia Oscura. No encontramos ningún indicio de que le pasó a la tripulación original de la nave pero nuestros técnicos fueron capaces de rescatar la Materia Oscura.'*/,
            /*'La expedición siguió */'algunas señales fuera de lo común hasta un asteroide'/* . En el núcleo del asteroide se encontró una pequeña cantidad de Materia Oscura. El asteroide fue tomado y los exploradores intentan extraer la Materia Oscura.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Nuestra */'expedición logro un experimento único'/* . Fueron capaces de reciclar Materia Oscura de la desaparición de una estrella.'*/,
            /*'Nuestra expedición encontró una estación espacial oxidada, */'la cual parece haber estado flotando sin control por el espacio exterior'/* durante mucho tiempo. La estación por si misma era totalmente inútil, sin embargo, había algo de Materia Oscura almacenada en su reactor. Nuestros técnicos están intentando juntar tanto como pueden.'*/,
            /*'Nuestra expedición informa de un espectacular y extraño fenómeno. La */'acumulación de Materia Oscura en los almacenes de energía'/* de los escudos de la nave. Nuestros técnicos intentan almacenar tanta Materia Oscura como pueden mientras dura el fenómeno.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'¡Una */'espontanea deformación en el hiperespacio'/* permitió a tu expedición recolectar grandes cantidades de Materia Oscura!'*/,
            /*LOCA: es-ar 'Unsere Expedition meldet einen ersten Kontakt der besonderen Art. Anscheinend hat */'eine Energiekreatur, die sich Legorianer nannte'/*, die Schiffe der Expedition durchflogen und dann beschlossen, der unterentwickelten Spezies ein wenig auszuhelfen - es materialisierte sich ein Behälter mit dunkler Materie an Bord der Brücke!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`Se robó (?<name>${darkMatter}) de (?<amount>[^\\s]+)`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'Tu expedición */'descubrió un pequeño asteroide'/* en el cual se pueden reciclar algunos recursos.'*/,
            /*'En un planetoide abandonado encontramos */'algunas zonas de recursos fácilmente accesibles y recolectamos'/* algunos satisfactoriamente.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Tu expedición encontró un antiguo, */'pero desierto convoy de carga'/* . Algunos de los recursos podrían ser rescatados.'*/,
            /*'En una pequeña luna con su propia atmósfera, tu expedición */'encontró una cantidad enorme de recursos sin explotar'/* . La tripulación en el terreno está tratando de levantar y cargar el tesoro natural.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: es-ar 'Ein */'Mineraliengürtel um einen unbekannten Planeten'/* enthielt Unmengen an Rohstoffen. Die Expeditionsflotte meldet volle Lager!'*/,
            /*'Tu expedición informa del */'descubrimiento de una nave alien gigante averiada y abandonada'/* . No fueron capaces de aprender de sus tecnologías, pero fueron capaces de dividir la nave en sus componentes básicos y hacer algunos recursos útiles de ella.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`Se robó (?<name>${resources.join('|')}) de (?<amount>.+)`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*'¡Atravesamos los */'restos de una expedición previa'/* ! Nuestros técnicos intentarán conseguir que algunas de las naves funcionen de nuevo.'*/,
            /*'Tu expedición volvió a través de una vieja */'estrella fortaleza que está desierta desde hace años'/* . En el hangar de la fortaleza encontraron algunas naves. Los técnicos intentan poner algunas a flote de nuevo.'*/,
            /*'Nuestra expedición encontró un */'planeta que estuvo cerca de ser completamente destruido'/* en continuas guerras. Hay naves diversas flotando alrededor de la órbita. Los técnicos intentan reparar algunas de ellas. Quizá con ello también conseguiremos información de lo que pasó aquí.'*/,
            /*'Encontramos una */'estación pirata desierta'/* . Hay estacionadas algunas viejas naves en el hangar. Nuestros técnicos están mirando si algunas de ellas son aún útiles.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Nuestra expedición se */'encontró con un antiguo hangar automático'/* . Algunas de las naves se encuentran todavía en la fase de producción y nuestros técnicos están tratando de reactivar los generadores de energía.'*/,
            /*'Encontramos */'los restos de una armada'/* . Los técnicos fueron directamente a las naves casi intactas para intentar ponerlas en funcionamiento de nuevo.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: es-ar 'Wir haben einen */'riesigen Raumschiffsfriedhof'/* gefunden. Einigen Technikern der Expeditionsflotte ist es gelungen, das ein oder andere Schiff wieder in Betrieb zu nehmen.'*/,
            /*'Encontramos */'un planeta con restos de una civilización'/* . Somos capaces de ver una estación espacial gigante orbitando. Algunos de tus técnicos y pilotos fueron a la superficie en busca de algunas naves que se todavia se puedan usar.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`Las siguientes naves son ahora parte de la flota:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
    },

    [ExpeditionEventType.nothing]: [
        /*'A pesar de los resultados iniciales, */'escaneos del sector muy prometedores'/* , volvimos, desafortunadamente, con las manos vacías.'*/,
        /*'Además de algunos pintorescos, pequeños */'animales de compañía de un desconocido planeta'/* , esta expedición no trae nada emocionante a su regreso del viaje.'*/,
        /*'Tu expedición aprendió */'acerca del extenso vacío del espacio'/* . No hubo ni un pequeño asteroide, radiación o partícula que pudiera haber hecho esta expedición interesante.'*/,
        /*'Un ser de pura energía se aseguró que todos los miembros de la expedición solo */'miraran el hipnotizante patrón de los monitores'/* . Cuando la mayoría de ellos se despejaron de nuevo, la expedición debía ser abortada ya que quedaba poco Deuterio.'*/,
        /*'Un */'fallo en los motores de la nave insignia estuvo'/* cerca de destruir la flota entera en expedición. Afortunadamente los técnicos,que eran más que competentes, evitaron lo peor. Las reparaciones llevaron algo de tiempo y la expedición se vio forzada a volver sin haber logrado nada. '*/,
        /*'Tu expedición hizo */'magníficas fotos de una super nova'/* . No se obtuvo nada de la expedición pero al menos hay muchas posibilidades de ganar el concurso "Mejor Foto del Universo" este año.'*/,
        /*'Tu flota en */'expedición siguió señales fuera de lo común algún tiempo'/* . Al final ellos se percataron que esas señales estaban siendo emitidas desde una vieja sonda que fue lanzada tiempo atrás para dar la bienvenida a especies desconocidas. La sonda fue guardada y algunos museos de tu planeta base ya han manifestado su interés.'*/,
        /*'Bueno, ahora */'sabemos que esas 5 anomalías rojas'/* no solo tienen efectos caóticos en los sistemas de navegación de la nave sino que también generan alucinaciones masivas en la tripulación. La expedición no trajo nada de vuelta.'*/,
        /*'Tu expedición */'casi entra en el campo gravitacional de una estrella de neutrones'/* y necesito algún tiempo para librarse ella misma. A causa de esto mucho Deuterio fue consumido y la flota en expedición tuvo que volver sin ningún resultado.'*/,
        /*'Un */'extraño virus informático atacó el sistema de navegación'/* al poco de salir de nuestro sistema solar. Esto causó que la expedición volara en círculos. No hace falta decir que la expedición no fue realmente satisfactoria.'*/,
        /*'Probablemente la */'celebración del cumpleaños del capitán no debió hacerse'/* en ese planeta desierto. Una fiebre terrible y desconocida causó que la gran mayoría de la tripulación de la expedición tuvieran que estar en la enfermería durante el resto de la expedición. Debido a la escasez de personal la expedición fracasó.'*/,
        /*'Alguien instaló un viejo */'juego de estrategia en todos los ordenadores'/* de la nave. La flota de la expedición estuvo ausente por un largo tiempo, pero no fue realmente productiva a causa de ello.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*'La última transmisión que obtuvimos de la flota de expedición fueron las excelentes fotos que */'enseñaban un agujero negro que se estaba abriendo',
        /*'La última cosa que obtuvimos de la expedición fueron algunas */'realmente buenas fotos tomadas de un agujero negro abriéndose',
        /*'Lo único que quedó de la */'expedición fue el siguiente mensaje de radio'/* : Zzzrrt Mierda! Krrrzzzzt Eso zrrrtrzt parece krgzzzz como Krzzzzzzzztzzzz...'*/,
        /*'Una fusión del núcleo de la nave insignia produce una reacción en cadena que destruye de una */'forma bastante espectacular la flota entera en'/* expedición.'*/,
        /*'El */'contacto con la flota de expedición ha sido cortada de repente'/* . Nuestros académicos están aún intentando descubrir qué pasó, pero parece que la flota se perdió para siempre.'*/,
        /*'La */'flota en expedición no saltó de vuelta al vecindario'/* . Nuestros académicos están aún intentando encontrar que pasó, pero parece que la flota se perdió para siempre.'*/
    ],

    [ExpeditionEventType.trader]: [
        /*'Tu flota en expedición tuvo un */'corto contacto con una raza de aliens un poco'/* vergonzosa. Estos anunciaron que van a enviar a un representante con bienes de comercio a tus mundos.'*/,
        /*'Tu */'expedición captura un grito de ayuda'/* . Era una gran nave de carga que fue capturada por un potente campo gravitacional de un planetoide. Después de que la nave de carga fuese liberada con éxito, el capitán de celebración anunció que va a poner a su liberador en su libro negro como cliente exclusivo preferido.'*/,
    ],

    [ExpeditionEventType.early]: [
        /*'Un inesperado */'acoplamiento de energía en los motores aceleró'/* la vuelta de la expedición, vuelve a casa antes de lo esperado. Los primeros informes dicen que no tienen nada emocionante a tener en cuenta.'*/,
        /*'Tu expedición no informa de ninguna anomalía en el sector explorado. Pero la flota entro en */'algún viento solar mientras volvía'/* . A causa de esto la vuelta de la flota se aceleró mucho. Tu expedición vuelve a casa un poco antes.'*/,
        /*'¡El nuevo, y un poco atrevido, */'comandante viajó con éxito a través de un inestable agujero'/* de gusano para acortar el vuelo de regreso! Sin embargo, la expedición en sí no trajo nada nuevo.'*/,
    ],

    [ExpeditionEventType.delay]: [
        /*'El */'líder de la navegación tuvo un mal día y esto causó'/* que el salto de la expedición fuera mal calculado. No solo la flota aterrizó en algún lugar completamente diferente, sino que ahora el camino de vuelta necesita mucho más tiempo.'*/,
        /*'Tu expedición entró en un */'sector lleno de tormentas de partículas'/* . Esto provocó que los almacenes de energía se sobrecargaran y la mayoría de los sistemas principales de las naves se averiaron. Tus mecánicos fueron capaces de evitar lo peor pero la flota va a volver con un gran retraso.'*/,
        /*'A causa de */'razones desconocidas el salto de la expedición fue totalmente'/* erróneo. Estuvo a punto de aterrizar en el corazón del sol. Afortunadamente esta aterrizó en un sistema conocido, el salto de vuelta va a llevar más tiempo del esperado.'*/,
        /*'El */'viento de una estrella gigante roja arruinó'/* los saltos de la expedición, esta necesitara algo de tiempo para calcular el salto de retorno. No había nada aparte del vacío entre las estrellas en ese sector. La flota volverá más tarde de lo previsto.'*/,
        /* es-es *//*'El */'nuevo módulo de navegación está aún luchando'/* con algunos bugs. No sólo el salto de la expedición fue en una dirección totalmente errónea, sino también el deuterio ha sido gastado por completo. Afortunadamente el salto de la flota los dejó cerca de la luna del planeta de inicio. Algo decepcionada regresa la flota de expedición sin fuerza de impulso. A causa de ello, el retorno de la flota se retarda un poco.'*/,
        /* es-ar *//*'El */'nuevo módulo de navegación está aún lleno de errores'/* . El salto de la expedición fue en una dirección totalmente errónea pero el deuterio fue usado igualmente. Afortunadamente el salto de la flota los dejó cerca de la luna del planeta de inicio.'*/,
        /*'La nave */'principal de la expedición colisionó con una nave extranjera cuando'/* esta saltó sobre la flota sin ningún aviso. La nave extranjera explotó y los daños a la nave principal fueron sustanciales. Tan pronto como las reparaciones necesarias sean realizadas la flota empezará el viaje de vuelta ya que la expedición no puede continuar en estas condiciones.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /Se ha añadido lo siguiente a tu inventario: (?<name>.+)/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*'Algunos */'piratas realmente desesperados intentaron capturar'/* nuestra flota de expedición.'*/,
            /*'Algunos */'bárbaros primitivos están atacándonos con naves'/* espaciales que no deberían ser llamadas así. Si nos disparan en serio nos veremos forzados a devolver el fuego. '*/,
            /*'Capturamos algunos */'mensajes de radio de algunos piratas borrachos'/* . Pareciera como si nos quisieran atacar.'*/,
            'Necesitamos luchar con algunos piratas que eran'/* , por suerte, solo unos pocos.'*/,
            /*LOCA: es-ar 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Tu expedición tuvo un */'desagradable encuentro con algunos piratas'/* espaciales.'*/,
            /*'¡Caimos en una */'emboscada organizada por algunos bucaneros'/* estelares! La batalla no se pudo evitar.'*/,
            /*'La señal de emergencia que la expedición siguió, */'resultó ser un montaje de algunos bucaneros'/* estelares. La batalla no se pudo evitar.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'¡Las señales no provenían de un */'extranjero sino de una base pirata secreta'/* ! Ellos no estaban sorprendidos realmente por nuestra presencia en el sector.'*/,
            /*'¡Tu expedición informa de */'duras batallas contra naves piratas sin identificar'/* !'*/,
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*'¡Algunas */'naves de apariencia exótica atacaron'/* la expedición sin previo aviso!'*/,
            /*'Tu expedición */'no hizo un primer contacto amigable con una especie'/* desconocida.'*/,
            /*'¡Nuestra expedición fue */'atacada por un pequeño grupo de naves'/* sin identificar!'*/,
            /*LOCA: es-ar 'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'¡Una */'especie desconocida ataca nuestra expedición'/* !'*/,
            /*'Tu */'expedición parece haber entrado en un territorio'/* que pertenece a una raza alien desconocida pero muy agresiva y marcial.'*/,
            /*'El */'contacto con nuestra expedición fue interrumpido'/* por un corto tiempo. Podemos descifrar su último mensaje. Están bajo ataque, el agresor no pudo ser identificado.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Tu expedición */'encontró una flota alien de invasión'/* y reporta duras batallas'*/,
            /*'Tuvimos */'dificultades para pronunciar correctamente el dialecto'/* de una raza alienígena. Nuestro diplomático gritó "¡Fuego!" en lugar de "¡Paz!".'*/,
            /*'Una */'gran formación de naves cristalinas de origen desconocido'/* va directa a colisionar con nuestra expedición. Tenemos que asumir lo peor.'*/,
        ],
    },

    logbookRegex: /Registro añadido de la comunicación oficial:(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'Parece como si */'esta parte del universo no hubiera sido explorada'/* hasta ahora.'*/,
            /*'Es una */'gran sensación ser el primero'/* en un sector inexplorado.'*/,
        ],
        [ExpeditionDepletionLevel.low]: [
            /*'Parece como si */'ningún humano hubiera estado antes'/* en esta parte de la galaxia.'*/,
            /*'Encontramos */'antiguos signos de naves espaciales'/* . No somos los primeros.'*/,
            /*'Casi tuvimos */'chocamos con otra flota de expedición'/* . No pensé que también otros se acercaran por acá.'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*LOCA: es-ar 'Wir haben den Abschluss der Expedition mit den Crewmitgliedern einer zweiten Expeditionsflotte, die im selben Sektor unterwegs war, gefeiert. */'Die haben auch nichts Spannendes zu berichten',
            /*LOCA: es-ar 'Es wurden */'Anzeichen für die Präsenz anderer Expeditionsflotten'/* gefunden.'*/,
            /*LOCA: es-ar 'Es wurde */'friedlicher Funkkontakt zu einigen anderen Expeditionen'/* in diesem Sektor hergestellt.'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /*LOCA: es-ar 'Wenn wir uns zu unsicher fühlen, können wir uns ja */'mit all den anderen Expeditionen'/*, die hier herum fliegen, zusammen tun.'*/,
            /*LOCA: es-ar 'Vielleicht wäre es sinnvoller, hier */'eine Souvenir-Station zu errichten'/* , anstatt noch eine Expedition loszuschicken.'*/,
            /*LOCA: es-ar 'Wenn das so weitergeht, sollte man */'bei all dem Verkehr hier Navigationsbojen'/* aussetzen.'*/,
        ],
    },
};