import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const pt: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*pt*//*'A missão em */'exploração conseguiu capturar e conservar alguma Matéria Negra',
            /*pt*//*'Encontramos os */'restos de uma nave alienígena'/* ' Lá dentro encontrámos um pequeno contentor com Matéria Negra.'*/,
            /*pt*//*'Encontrámos um */'estranho alienígena numa pequena nave que nos deu um pequeno contentor'/* com Matéria Negra em troca de uns simples cálculos matemáticos.'*/,
            /*pt*//*'A nossa frota em */'exploração encontrou uma nave-fantasma que transportava uma pequena quantidade'/* de Matéria Negra. Os engenheiros tentaram perceber o que tinha acontecido à tripulação mas não chegaram a qualquer explicação, no entanto recolheram a Matéria Negra.'*/,
            /*pt*//*'A expedição seguiu uns */'estranhos sinais vindos dum asteróide'/* . No núcleo do asteróide estava uma pequena quantidade de Matéria Negra enclausurada. O asteróide foi resgatado para proceder à extracção da Matéria Negra.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*pt*//*'A nossa missão de */'exploração conseguiu completar um dos seus propósitos'/* ! Esta conseguiu retirar Matéria Negra duma estrela a extinguir-se.'*/,
            /*pt*//*'A nossa */'missão localiza uma antiga estação espacial que'/* , ao que parece, está a flutuar sem rumo no espaço sideral. A estação em si não é recuperável mas foi descoberta alguma Matéria Negra armazenada nos seus reactores. Os nossos técnicos tentaram recuperar tanta Matéria Negra quanta puderam.'*/,
            /*pt*//*'A nossa frota em expedição envia-nos notícias de um fenómeno espectacular. A acumulação de Matéria Negra */'nas baterias de energia dos escudos da nave'/*. Os nossos engenheiros estão a tentar recolher o máximo de Matéria Negra que podem antes do fenómeno acabar.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*pt*//*'Uma */'deformação espontânea no hiperespaço permite'/* à tua frota recolher uma grande quantidade de Matéria Negra!'*/,
            /*pt*//*'A nossa frota em exploração contactou pela primeira vez com uma raça especial. Parece que é uma criatura feita de energia pura, */'que se auto-intitula Legoriana'/* . Esta flutua por entre as naves da expedição e decide ajudar a nossa espécie subdesenvolvida - uma caixa contendo Matéria Negra foi materializada no convés da nave!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`Foram roubados (?<amount>[^\\s]+) de (?<name>${darkMatter})`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*pt*//*'A tua expedição */'encontrou um pequeno asteróide'/* de onde conseguiram resgatar alguns recursos.'*/,
            /*pt*//*'Num planetóide isolado */'encontrámos um campo de recursos'/*. Conseguimos recolhê-los e estamos a voltar para descarregá-los.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*pt*//*'A tua expedição */'encontrou uma antiga escolta de cargueiros abandonados'/* . Ao abrir os conveses descobriram que ainda tinham alguns recursos! Estes foram descarregados nos porões das nossas naves.'*/,
            /*pt*//*'Numa pequena lua que tinha atmosfera, a tua expedição */'encontrou um grande armazém de recursos básicos'/* . A tripulação terrestre está a tentar transferi-los para a nave.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*pt*//*'Encontrámos uma */'cinta de minerais à volta de um planeta'/* desconhecido. As naves da expedição já estão a voltar completamente cheias!'*/,
            /*pt*//*'A tua frota de expedição */'relata que encontrou os destroços de uma nave alienígena gigante'/* . Embora não tenhamos aprendido novas tecnologias conseguimos resgatar alguns recursos da blindagem da nave.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`Foram roubados (?<amount>.+) de (?<name>${resources.join('|')})`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*pt*//*'Encontrámos os */'destroços de uma antiga expedição espacial'/* ! Os nossos técnicos estão a tentar meter os sistemas das naves encontradas mais uma vez operacionais.'*/,
            /*pt*//*'A tua expedição */'encontrou uma fortaleza de uma antiga celebridade'/* que foi abandonada. No hangar da fortaleza encontrámos algumas naves. Os técnicos estão a tentar ver se algumas ainda estão operacionais.'*/,
            /*pt*//*'A nossa expedição encontrou um */'planeta que quase foi totalmente destruído durante uma guerra'/* . Conseguimos encontrar várias naves a orbitar o planeta. Os técnicos estão a tentar reparar algumas delas, talvez também poderemos reunir algumas informações do que se passou por ali.'*/,
            /*pt*//*'Descobrimos */'uma estação espacial pirata'/* ! Conseguimos encontrar umas velhas naves no hangar. Os nossos técnicos estão a verificar se elas ainda estão em bom estado.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*pt*//*'A nossa expedição encontrou um */'velho hangar automatizado'/*. Algumas das naves ainda estavam em fase de produção e os nossos técnicos estão a tentar reactivar os geradores eléctricos para tentar acabá-las'*/,
            /*pt*//*'Encontrámos */'o resto de uma armada'/* ! Os técnicos voaram para as naves que estavam mais intactas e tentaram metê-las a funcionar!'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*pt*//*'Encontrámos */'um enorme cemitério de naves'/* ! Os Engenheiros de Máquinas conseguiram meter algumas a funcionar e estas estão a voltar connosco!'*/,
            /*pt*//*'Encontrámos um */'planeta que alberga os restos de uma civilização'/* . Conseguimos encontrar uma estação espacial velha mas intacta. Alguns dos nosso técnicos e pilotos desceram à estação e conseguiram resgatar algumas das naves que lá se encontravam.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`As seguintes naves fazem agora parte da frota:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
    },

    [ExpeditionEventType.nothing]: [
        /*pt*//*'Embora este sector tenha mostrado */'resultados interessantes nos relatórios primários'/*, a missão não teve a mesma sorte. A frota voltou de mãos vazias.'*/,
        /*pt*//*'Para além de uns pequenos e esquisitos */'animais de um planeta pantanoso'/*, esta expedição não trouxe nada de especial desta viagem.'*/,
        /*pt*//*'A tripulação descobriu o */'significado da expressão "universo vasto"'/*. O relatório da missão não teve nenhum ponto interessante.'*/,
        /*pt*//*'Um ser */'feito de energia hipnotizou toda'/* a tripulação da missão. Quanto esta acordou estava longe e à deriva e quase sem Deutério. Devido a este encontro a missão teve de ser cancelada.'*/,
        /*pt*//*'Um */'problema no reactor da nave principal quase'/* que destruiu toda a frota de expedição. Felizmente os técnicos foram muito competentes e evitaram o pior. A reparação demorou algum tempo e forçou o retorno prematuro da frota.'*/,
        /*pt*//*'A expedição tirou */'lindas fotos de uma super nova'/*. Nada de novo foi encontrado na viagem mas pelo menos poderemos tentar ganhar o prémio de "melhor fotografia" este ano.'*/,
        /*pt*//*'A tua frota de expedição */'seguiu uns sinais estranhos por algum tempo'/*. No final, descobriram que era uma sonda enviada à muitas gerações atrás para cumprimentar espécies desconhecidas A sonda foi resgatada e alguns museus já demonstraram interesse por ela'*/,
        /*pt*//*'Bem, agora sabemos que aquelas */'anomalias vermelhas de classe 5'/* para além de ter efeitos caóticos nos sistemas de navegação também são altamente alucinogénos.'*/,
        /*pt*//*'A tua frota entrou no campo */'gravitacional de uma estrela de neutrões'/*. Para conseguir escapar à enorme força da gravidade teve de gastar grande parte do Deutério e cancelar a expedição.'*/,
        /*pt*//*'Um */'virus de computador atacou o sistema de navegação mesmo'/* antes da frota sair do nosso sistema solar. O virus fez com que a frota andasse a voar em círculo. Não deverá ser necessário dizer que a missão falhou.'*/,
        /*pt*//*'Provavelmente a */'festa de aniversário do capitão não deveria'/* ter sido realizada naquele planeta isolado. Uma terrível e desconhecida febre atacou os tripulantes e devido à falta de pessoal a missão teve de ser cancelada.'*/,
        /*pt*//*'Alguém */'instalou um velho jogo de estratégia nos computadores'/* da nave. Esta expedição esteve algum tempo fora mas não trouxe nenhuma notícia em especial.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*pt*//*'As últimas imagens que obtivemos da frota em expedição foram umas imagens */'bastante próximas de um buraco negro a nascer',
        /*pt*//*'O último contacto que tivemos da */'frota em missão foi a seguinte mensagem'/*: Zzzrrt Deus! Krrrzzzzt Aquilo zrrrtrzt Parece krgzzzz uma Krzzzzzzzztzzzz...'*/,
        /*pt*//*'Uma falha no núcleo do motor da nave-mãe leva a uma reacção em cadeia que */'destrói, de uma forma espectacular'/*, toda a frota.'*/,
        /*pt*//*'A frota em missão */'não conseguiu voltar do salto de hiperespaço'/*. Os nossos cientistas ainda estão a tentar compreender o que aconteceu mas pelo que parece a frota foi totalmente perdida.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*pt*//*'A tua frota */'contactou com uma raça alienígena tímida'/*. Eles anunciaram que irão enviar um representante com mercadorias para trocar nos nossos mundos.'*/,
        /*pt*//*'A tua expedição recebeu um sinal de emergência. Um enorme cargueiro foi apanhado dentro dum poderoso campo gravitacional gerado por um planetóide. Depois de ajudar o cargueiro a libertar-se o capitão da nave anunciou que iria visitar os */'nossos planetas e iria fazer descontos especiais'/* em trocas de recursos.'*/,
    ],

    [ExpeditionEventType.early]: [
        /*pt*//*'Um problema inesperado no */'campo energético dos motores fez com que a expedição'/* voltasse mais rapidamente para casa. Os relatórios primários não revelam qualquer descoberta.'*/,
        /*pt*//*'A tua expedição não reportou qualquer anomalia no sector explorado. Mas a frota enquanto voltava, */'apanhou um pouco de vento solar'/*. Devido a esta ocorrência a viagem de volta foi mais rápida. A tua frota de expedição volta ao ponto de partida um pouco mais cedo.'*/,
        /*pt*//*'Um comandante novo e destemido */'conseguiu atravessar um wormhole instável'/* diminuindo assim a duração do voo! Contudo, a expedição não trouxe nada de novo.'*/,
    ],

    [ExpeditionEventType.delay]: [
        /*pt*//*'Um */'erro no sistema de navegação fez'/* com que o salto de hiperespaço fosse mal calculado. Devido a esta falha a frota aterrou no local errado e devido a isso irá demorar mais tempo a voltar.'*/,
        /*pt*//*'A missão entrou num */'sector com tempestades de plasma'/*. Devido a isto as baterias de energia da frota sofreram um curto-circuito e tiveram de aterrar num planeta próximo. Os mecânicos conseguiram resolver o problema mas a missão irá voltar com um grande atraso.'*/,
        /*pt*//*'Devido a */'razões ainda desconhecidas o salto da frota de exploração'/* correu mal. Quase que aterrou perto de uma estrela. Nem tudo correu mal pois aterraram num sistema planetário conhecido. A viagem de retorno demorará mais um pouco que o previsto.'*/,
        /*pt*//*'O vento */'solar de uma gigante vermelha fez com que o computador'/* se enganasse nas coordenadas do salto de hiperespaço. O computador irá precisar de mais tempo para conseguir recalcular o salto de volta. Para além disso não encontramos nada na zona para onde saltamos.'*/,
        /*pt*//*'O */'novo módulo de navegação ainda tem alguns problemas'/*, devido a isso o salto foi para um sítio completamente diferente do previsto e o Deutério foi quase LOCA gasto. Quanto ao salto, este calhou próximo da lua do planeta de saída. Obrigados a utilizar os motores secundários a equipa irá demorar mais do que pensavam a voltar ao planeta.'*/,
        /*pt*//*'A nave */'principal colidiu com uma nave estranha que tinha acabado'/* de sair do salto de hiperespaço. A nave estranha explodiu com o impacto causando danos substanciais no casco da nave principal. Os mecânicos/engenheiros estão a fazer turnos de 20 horas para conseguir reparar os recursos principais para que possamos voltar e fazer reparações necessárias.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /O item (?<name>.+) foi adicionado ao inventário/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*pt*//*'Alguns */'piratas desesperados tentaram capturar'/* a nossa frota de expedição.'*/,
            /*pt*//*'Uns */'bárbaros primitivos estão nos a atacar'/* com uma espécie de naves espaciais. Se os nossos escudos ficarem a 50% seremos obrigados a disparar contra eles.'*/,
            /*pt*//*'Apanhamos umas */'mensagens via rádio e estas eram de uns piratas'/* bêbados. Parece que vamos ser atacados.'*/,
            /*pt*//*'Tivemos de combater com uns piratas */'que por sorte não eram muito fortes',
            /*LOCA: pt /*'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*pt*//*'A tua expedição deparou-se com uma, */'não muito agradável, frota pirata',
            /*pt*//*'Nós fomos directos para uma */'emboscada efectuada por alguns piratas estelares'/*. Tentamos resolver pela via diplomática mas só com as armas é que conseguimos dialogar.'*/,
            /*pt*//*'O*/' sinal de emergência que a expedição recebeu'/* era um engodo colocado por uns piratas estelares. Não pudemos evitar o confronto!'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*pt*//*'Os sinais gravados não foram emitidos por um ser estranho mas sim por uma */'base pirata secreta'/* ! Eles tão ficaram surpreendidos com a nossa presença neste quadrante.'*/,
            /*pt*//*'O relatório de expedição */'relata batalhas épicas contra naves-pirata'/* não identificadas!'*/,
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*pt*//*'Algumas */'naves exóticas atacaram a frota de exploração'/* sem qualquer aviso prévio!'*/,
            /*pt*//*'A tua frota de exploração teve um */'primeiro contacto com espécies desconhecidas'/* não muito amigável.'*/,
            /*pt*//*'A nossa missão foi */'atacada por um pequeno número de naves desconhecidas'/* !'*/,
            /*LOCA: pt /*'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*pt*//*'Uma */'espécie desconhecida atacou a nossa'/* missão exploratória!'*/,
            /*pt*//*'Tudo indica que a tua frota entrou em */'território de uma espécie de raça alienígena extremamente agressiva'/*.'*/,
            /*pt*//*'A ligação com nossa frota exploratória foi interrompida durante um curto espaço de tempo. Pelo que conseguimos entender pela última mensagem enviada, ela está a ser atacada. Até */'agora não conseguiram identificar o agressor'/*.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*pt*//*'A tua frota de exploração foi atacada por uma Frota Invasora Alienígena. Há */'relatórios de grandes confrontos'/* !'*/,
            /*pt*//*'Encontrámos algumas */'dificuldades em pronunciar correctamente o dialecto da raça extraterrestre'/*. Acidentalmente, o nosso diplomata gritou "Fogo!" em vez de "Paz!".'*/,
            /*pt*//*'Uma grande Frota de */'naves cristalinas de origem desconhecida'/* está em rota de ataque contra a tua frota de exploração. Por agora temos de assumir o pior.'*/,
        ],
    },
    
    logbookRegex: /Entrada do diário dos Engenheiros de Comunicações:(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*pt*//*'Parece que esta */'parte do universo ainda não foi explorada',
            /*pt*//*'É estranho saber que */'somos os primeiros a entrar neste sector',
        ],
        [ExpeditionDepletionLevel.low]: [
            /*pt*//*'Ao que parece, somos os */'primeiros humanos a entrar nesta parte'/* da galáxia'*/,
            /*pt*//*'Encontramos os destroços de algumas naves antigas. Não */'somos os primeiros neste quadrante',
            /*pt*//*'Quase que */'chocamos contra uma outra frota em expedição'/*. Pensei que não iríamos encontrar mais ninguém por aqui'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*pt*//*'Nós celebramos o final da */'expedição com os membros de outra expedição que estavam'/* no mesmo sector. Eles não tinham nada de especial a reportar.'*/,
            /*pt*//*'Descobrimos */'provas que indicam a presença de outras frotas'/* em expedição.'*/,
            /*pt*//*'Nós conseguimos */'contactar com outras frotas de expedição amigáveis neste'/* sector.'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /*pt*//*'Se estivéssemos em */'perigo podíamos voltar com uma das várias expedições'/* que estavam por aquele quadrante.'*/,
            /*pt*//*'Talvez seja mais */'produtivo abrir uma loja de presentes aqui do que enviar'/* outra expedição.'*/,
            /*pt*//*'Se isto continuar assim */'teremos de colocar boias de navegação para controlar'/* o tráfego.'*/,
        ],
    },
};