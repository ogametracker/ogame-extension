import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const pt_br: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*'A expedição */'conseguiu capturar e conservar alguma Matéria Negra',
            /*'Nós encontramos os restos de uma nave alienígena. Lá */'dentro havia um pequeno recepiente com Matéria Negra',
            /*'Encontramos um */'estrangeiro alienígena em uma pequena nave que nos deu'/* um pequeno frasco com Matéria Negra em troca de simples cálculos matemáticos.'*/,
            /*'A nossa expedição */'encontrou uma nave-fantasma que transportava uma pequena quantidade'/* de Matéria Negra. Nós não conseguimos descobrir o que aconteceu com a tripulação, mas nossos engenheiros conseguiram transferir a Matéria Negra para a nossa nave.'*/,
            /*'A expedição */'seguiu uns estranhos sinais vindos de um asteróide'/* . No núcleo do asteróide estava uma pequena quantidade de Matéria Negra enclausurada. O asteróide foi resgatado para proceder à extração da Matéria Negra.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Sua expedição */'conseguiu completar uma experiênca única'/* ! Retiraram Matéria Negra de uma estrela que estava se extinguindo.'*/,
            /*'Nossa missão */'localizou uma antiga estação espacial'/* , que parece estar flutuando sem rumo no espaço sideral já faz muito tempo. A estação em si não é recuperável mas foi descoberto alguma Matéria Negra armazenada em seu reator. Os nossos técnicos tentaram recuperar o máximo de Matéria Negra que puderam.'*/,
            /*'Nossa expedição relata um fenômemo impar e espetacular: A */'acumulação de Matéria Negra nas baterias de energia dos escudos'/* da nave. Nossos engenheiros tentam retirar o máxima de Matéria Negra enquanto o fenômeno durar.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Uma */'deformação espontânea no hiperespaço permitiu que'/* a sua frota recolhesse uma grande quantidade de Matéria Negra!'*/,
            /*LOCA: pt-br 'Unsere Expedition meldet einen ersten Kontakt der besonderen Art. Anscheinend hat */'eine Energiekreatur, die sich Legorianer nannte'/*, die Schiffe der Expedition durchflogen und dann beschlossen, der unterentwickelten Spezies ein wenig auszuhelfen - es materialisierte sich ein Behälter mit dunkler Materie an Bord der Brücke!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`Foram roubados (?<amount>[^\\s]+) de (?<name>${darkMatter})`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'A sua expedição */'encontrou um pequeno asteróide e conseguiu resgatar'/* alguns recursos.'*/,
            /*'Em um */'planetóide isolado encontramos um campo de recursos'/* com fácil acesso e recolhemos alguns recursos com sucesso.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'A sua expedição */'encontrou uma antiga escolta de cargueiros abandonados'/* , interamente carregados. Alguns recursos foram resgatados.'*/,
            /*'Em uma */'pequena lua com atmosfera'/* , a sua expedição encontrou um grande armazém de recursos básicos. A tripulação terrestre está tentando transferir e carregar esse tesouro natural.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: pt-br 'Ein */'Mineraliengürtel um einen unbekannten Planeten'/* enthielt Unmengen an Rohstoffen. Die Expeditionsflotte meldet volle Lager!'*/,
            /*'A sua frota de expedição relata a */'descoberta de destroços de uma nave alienígena gigante'/* . Nós não podemos aprender as suas tecnologias, mas foi possível dividir as naves com seus componentes principais e resgatar recursos preciosos do resto.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`Foram roubados (?<amount>.+) de (?<name>${resources.join('|')})`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*'Nós encontramos os */'destroços de uma antiga expedição espacial'/* ! Nossos técnicos estão tentando colocar as naves para funcionarem novamente.'*/,
            /*'A sua expedição */'encontrou uma fortaleza de uma antiga celebridade'/* que foi abandonada. No hangar da fortaleza encontrm-se algumas naves. Os técnicos estão tentando colocar alguma delas para voar novamente.'*/,
            /*'A nossa expedição */'encontrou um planeta que quase foi totalmente destruído'/* durante uma guerra. Existem várias naves que flutuam em órbita do planeta. Os técnicos estão tentando reparar algumas delas. Talvez também poderemos reunir algumas informações do que aconteceu aqui.'*/,
            /*'Nós */'encontramos uma estação espacial pirata'/* ! Há algumas naves velhas naves no hangar. Os nossos técnicos estão verificando se alguma delas está em bom estado.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'A nossa expedição */'encontrou um velho hangar automatizado'/* . Algumas das naves ainda estavam em fase de produção e os nossos técnicos estão tentando reativar os geradores elétricos para tentar acabá-las.'*/,
            /*'Nós */'encontramos o resto de uma armada'/* ! Os técnicos voaram para as naves que estavam quase intactas e tentaram fazê-las funcionar novamente!'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Nós encontramos um */'enorme cemitério de naves espaciais'/* ! Os Engenheiros de Máquinas conseguiram colocar algumas naves a funcionar novamente.'*/,
            /*LOCA: pt-br 'Wir haben einen Planeten mit */'Resten einer Zivilisation'/* entdeckt.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`As seguintes naves agora fazem parte da frota:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
    },

    [ExpeditionEventType.nothing]: [
        /*'Apesar de inicialmente esse setor ter */'mostrado resultados interessantes em seus relatórios'/* , a missão não contou com a mesma sorte e infelizmente voltamos de mãos vazias.'*/,
        /*'Além de uns pequenos e */'esquisitos animais de um planeta pantanoso'/* , esta expedição não trouxe nada de especial dessa viagem.'*/,
        /*'A sua expedição descobriu o */'significado da expressão "universo vasto"'/* . Não havia nem um pequeno asteróide ou radiação ou partícula que tornasse essa expedição interessante.'*/,
        /*'Um ser feito de */'energia hipnotizou toda a tripulação da missão'/* . Quando a tripulação acordou estava longe e à deriva, quase sem Deutério e por essa razão tiveram que cancelar a missão.'*/,
        /*'Uma */'falha no reator da nave principal quase destruiu'/* completamente a frota de expedição. Felizmente os técnicos foram muito competentes e evitaram o pior. A reparação demorou algum tempo e forçou a expedição a retornar sem ter realizado qualquer coisa.'*/,
        /*'A sua expedição */'tirou lindas fotos de uma super nova'/* . Nada de novo foi encontrado nessa expedição, mas pelo menos terão oportunidade de ganhar o prêmio de "Melhor Fotografia" esse ano.'*/,
        /*'A sua frota de */'expedição seguiu uns sinais estranhos por algum tempo'/* . No final, descobriram que era uma sonda enviada por gerações muito anteriores para cumprimentar espécies desconhecidas A sonda foi resgatada e alguns museus já demonstraram interesse por ela'*/,
        /*'Bem, agora sabemos que aquelas */'anomalias vermelhas de classe 5 não somente causam efeitos'/* caóticos no sistema de navegação, como também são altamente alucinogénas. A expedição volta sem nada trazer.'*/,
        /*'A sua expedição entrou no */'campo gravitacional de uma estrela de neutrões'/* e precisou de algum tempo para escapar. Por causa disso, teve um gasto de grande parte do deutério e a frota de expedição teve que retornar sem resultados.'*/,
        /*'Um */'estranho vírus de computador atacou ao sistema de navegação'/* assim que a frota saiu do nosso sistema solar. Isso fez com que a frota voasse em círculos. Não deve nem ser necessário dizer que a missão falhou.'*/,
        /*'Provavelmente a */'festa de aniversário do capitão não deveria'/* ter sido realizada naquele planeta isolado.Uma terrível febre desconhecida, fez com que os tripulantes tivessem que permanecer em descanso nos quartos de primeiros socorros da expedição. Devido à falta de pessoal a missão teve que ser cancelada.'*/,
        /*'Alguém instalou um velho */'jogo de estratégia nos computadores da nave'/* . Esta expedição esteve algum tempo fora mas não trouxe nenhuma notícia em especial.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*LOCA: pt-br 'Das Letzte, was von dieser Expedition noch gesendet wurde, waren einige unglaublich gut gelungene */'Nahaufnahmen eines sich öffnenden schwarzen Lochs'/*.'*/,
        /*'A única coisa deixada pela */'expedição era a seguinte transmição de rádio'/* : Zzzrrt Deus! Krrrzzzzt Aquilo zrrrtrzt olha krgzzzz como Krzzzzzzzztzzzz...'*/,
        /*LOCA: pt-br 'Ein Kernbruch des Führungsschiffes führte zu einer Kettenreaktion, die in einer durchaus */'spektakulären Explosion die gesamte Expedition'/* vernichtete.'*/,
        /*LOCA: pt-br 'Die Expeditionsflotte ist */'nicht mehr aus dem Sprung in den Normalraum'/* zurückgekehrt. Unsere Wissenschaftler rätseln noch immer, was geschehen sein könnte, jedoch scheint die Flotte endgültig verloren zu sein.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*'A sua frota de expedição */'fez contato com uma raça alienígena tímida'/* . Eles anunciaram o envio de um representante com mercadorias para trocar nos nossos mundos.'*/,
        /*'A sua */'expedição recebeu um sinal de emergência'/* . Um enorme cargueiro foi apanhado dentro dum poderoso campo gravitacional gerado por um planetóide. Depois de ajudar o cargueiro a libertar-se o capitão da nave anunciou que a pessoa que o libertou seria seu favorito e exclusivo cliente.'*/,
    ],

    [ExpeditionEventType.early]: [
        /*'Um problema */'inesperado no campo energético dos motores'/* fez com que a expedição voltasse mais rapidamente para casa. Os primeiros relatórios não revelam qualquer descoberta.'*/,
        /*'A sua expedição não reportou nenhuma anomalia no setor explorado. Mas quando a frota retornava, */'apanhou um pouco de vento solar'/* . Por causa disso a viagem de volta foi mais rápida. A sua frota de expedição retorna um pouco mais cedo.'*/,
        /*'O novo e destemido */'comandante conseguiu atravessar um wormhole instável diminuindo'/* assim a duração do vôo! Contudo, a expedição não trouxe qualque novidade.'*/,
    ],

    [ExpeditionEventType.delay]: [
        /*'Um */'erro no sistema de navegação'/* fez com que o salto de hiperespaço fosse mal calculado. Por causa disso a frota aterrou no local errado e irá demorar mais tempo para voltar.'*/,
        /*'A missão */'entrou num setor com tempestades de plasma'/* . Por causa disso, as baterias de energia da frota sofreram um curto-circuito e tiveram de aterrar num planeta próximo. Os mecânicos conseguiram resolver o problema mas a missão irá voltar com um grande atraso.'*/,
        /*'Devido a razões ainda desconhecidas, */'o salto da frota de expedição correu mal'/* . Quase aterrou no coração de um sol. Por sorte aterraram em um sistema conhecido, mas a viagem retorno demorará um pouco mais que o tempo previsto.'*/,
        /*'O */'vento de uma estrela vermelha gigante'/* , fez com que o computador se enganasse nas coordenadas do salto de hiperespaço. Vai levar algum tempo para calcular o salto de retorno. Não encontramos nada alem disso na área que saltamos. A frota irá retornar depois do esperado.'*/,
        /*'O */'novo módulo de navegação ainda tem alguns problemas'/* . Alem das expedições saltam para um lugar totalmente diferente, o deutério foi quase todo gasto. Por sorte, as frotas saltam próximas da lua do planeta de saída. Obrigados a utilizar os motores secundários, a equipe demorará mais do que o esperado para retornar ao planeta.'*/,
        /*'A nave principal da expedição */'colidiu com uma nave estranha que tinha acabado de sair do salto'/* de hiperespaço sem qualquer aviso. A nave estranha explodiu causando danos substanciais no casco da nave principal. Assim que os reparos necessários forem concluídos, as frotas começaram a retornar, visto que a expedição nao pode continuar nessas condições'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /O item (?<name>.+) foi adicionado ao inventário/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*'Alguns */'piratas espaciais desesperados tentaram capturar'/* a nossa frota de expedição.'*/,
            /*'Alguns */'bárbaros primitivos estão nos atacando com naves espaciais'/* , que não podem nem mesmo serem chamadas assim. Se começaram a fazer algum dano considerável seremos obrigados a atirar de volta.'*/,
            /*'Apanhamos algumas */'mensagens de rádio de alguns piratas bêbados'/* . Parece que logo seremos atacados.'*/,
            /*'Nós */'tivemos de combater com alguns piratas'/* que por sorte não eram muito fortes.'*/,
            /*LOCA: pt-br 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*LOCA: pt-br 'Deine Expeditionsflotte hatte ein */'unschönes Zusammentreffen mit einigen Weltraumpiraten'/*.'*/,
            /*LOCA: pt-br 'Wir sind in den */'Hinterhalt einiger Sternen-Freibeuter'/* geraten!'*/,
            /*'O */'sinal de emergência que a expedição recebeu era um engodo colocado'/* por uns piratas estelares. Não houve como evitar um confronto.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: pt-br 'Die aufgefangenen Signale stammten nicht von Fremdwesen, sondern */'von einer geheimen Piratenbasis'/* ! Die Piraten waren von unserer Anwesenheit in ihrem Sektor nicht besonders begeistert.'*/,
            /*LOCA: pt-br 'Die Expeditionsflotte meldet */'schwere Kämpfe mit nicht-identifizierten Piratenschiffen'/*.'*/,
        ],
        'fled-death-star': [
            /*LOCA: pt-br 'Your expedition stumbled across some pirates, but overwhelmed by the magnitude of your Deathstar, they fled.' */
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*'Algumas */'naves exóticas atacaram a frota de expedição'/* sem qualquer aviso!'*/,
            /*'A sua frota de expedição */'teve um primeiro contato realmente não muito agradável'/* com espécies desconhecidas.'*/,
            /*'A nossa missão */'foi atacada por um pequeno grupo de naves'/* desconhecidas!'*/,
            /*LOCA: pt-br 'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*LOCA: pt-br 'Eine */'unbekannte Spezies greift unsere Expedition'/* an!'*/,
            /*LOCA: pt-br 'Deine */'Expeditionsflotte hat anscheinend das Hoheitsgebiet'/* einer bisher unbekannten, aber äußerst aggressiven und kriegerischen Alienrasse verletzt.'*/,
            /*LOCA: pt-br 'Die Verbindung zu unserer Expeditionsflotte wurde kurzfristig gestört. Sofern wir die letzte Botschaft richtig entschlüsselt haben, steht die Flotte unter schwerem Feuer; die */'Aggressoren konnten nicht identifiziert werden'/*.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: pt-br 'Deine Expedition ist in eine Alien-Invasions-Flotte geraten und */'meldet schwere Gefechte'/*.'*/,
            /*LOCA: pt-br 'Wir hatten Mühe den korrekten */'Dialekt einer Alienrasse'/* auszusprechen. Unser Diplomat rief daher "Feuer!" statt "Friede!".'*/,
            /*LOCA: pt-br 'Ein großer */'Verband kristalliner Schiffe unbekannter Herkunft'/* hält direkten Kollisionskurs mit unserer Expeditionsflotte. Wir müssen nun wohl vom Schlimmsten ausgehen.'*/,
        ],
        'fled-death-star': [
            /*LOCA: pt-br 'Your expedition stumbled across some aliens, but overwhelmed by the magnitude of your Deathstar, they fled.' */
        ],
    },

    logbookRegex: /Entrada do diário dos Engenheiros de Comunicações:(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'Parece que */'esta parte do universo ainda não foi explorada',
            /*'É estranho saber que somos os */'primeiros a viajar através de um setor desconhecido',
        ],
        [ExpeditionDepletionLevel.low]: [
            /*'Ao que parece, somos os */'primeiros humanos a entrar nesta parte'/* da galáxia'*/,
            /*'Encontramos os destroços de algumas naves antigas. Não */'somos os primeiros neste quadrante',
            /*'Quase que */'chocamos contra uma outra frota em expedição'/*. Pensei que não iríamos encontrar mais ninguém por aqui'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*'Nós celebramos o final da */'expedição com os membros de outra expedição que estavam'/* no mesmo sector. Eles não tinham nada de especial a reportar.'*/,
            /*'Descobrimos */'provas que indicam a presença de outras frotas'/* em expedição.'*/,
            /*'Nós conseguimos */'contactar com outras frotas de expedição amigáveis neste'/* sector.'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /*'Se estivéssemos em */'perigo podíamos voltar com uma das várias expedições'/* que estavam por aquele quadrante.'*/,
            /*'Talvez seja mais */'produtivo abrir uma loja de presentes aqui do que enviar'/* outra expedição.'*/,
            /*'Se isto continuar assim */'teremos de colocar boias de navegação para controlar'/* o tráfego.'*/,
        ],
    },
};