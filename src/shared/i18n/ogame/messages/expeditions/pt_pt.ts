import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const pt_pt: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            //LOCA: pt /*'Der Expedition ist es gelungen, */'ein wenig Dunkle Materie einzufangen'/* und zu konservieren.'*/,
            //LOCA: pt /*'Wir haben die */'Überreste eines Alien-Schiffes'/* gefunden. An Bord war ein kleiner Behälter mit Dunkler Materie!'*/,
            //LOCA: pt /*'Wir trafen auf ein */'seltsames Alien an Bord eines kleinen Schiffes'/*, das uns im Austausch für ein paar simple, mathematische Berechnungen einen kleinen Behälter mit Dunkler Materie überließ.'*/,
            //LOCA: pt /*'Unsere Expedition ist auf ein */'Geisterschiff gestoßen'/*, das eine kleine Menge Dunkler Materie transportierte. Wir haben zwar keinerlei Hinweise finden können, was der ursprünglichen Crew zugestoßen ist. Dennoch gelang es unseren Technikern, die Dunkle Materie zu bergen.'*/,
            //LOCA: pt /*'Die Expedition folgte einigen */'seltsamen Signalen und entdeckte einen Asteroiden'/*, in dessen Kern ein wenig Dunkle Materie eingeschlossen war. Der Asteroid wurde an Bord geholt und die Forscher versuchen nun, die Dunkle Materie zu extrahieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            //LOCA: pt /*'Unserer Expedition ist */'ein einmaliges Experiment gelungen'/*:'*/,
            //LOCA: pt /*'Unsere Expedition hat eine */'uralte Raumstation gefunden'/*, die wohl schon seit langer Zeit unkontrolliert durch das All schwebt. Die Station selbst war komplett unbrauchbar, jedoch lagerte in einem ihrer Reaktoren noch ein wenig Dunkler Materie. Unsere Techniker versuchen, so viel wie möglich davon zu bergen.'*/,
            /*'A nossa frota em expedição envia-nos notícias de um fenómeno espectacular. A acumulação de Matéria Negra */'nas baterias de energia dos escudos da nave'/*. Os nossos engenheiros estão a tentar recolher o máximo de Matéria Negra que podem antes do fenómeno acabar.'*/,
        ],
        [ExpeditionEventSize.large]: [
            //LOCA: pt /*'Eine */'spontane Hyperraumverzerrung'/* hat es deiner Expedition ermöglicht, eine große Menge dunkler Materie sicherzustellen!'*/,
            //LOCA: pt /*'Unsere Expedition meldet einen ersten Kontakt der besonderen Art. Anscheinend hat */'eine Energiekreatur, die sich Legorianer nannte'/*, die Schiffe der Expedition durchflogen und dann beschlossen, der unterentwickelten Spezies ein wenig auszuhelfen - es materialisierte sich ein Behälter mit dunkler Materie an Bord der Brücke!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`Foram roubados (?<amount>[^\\s]+) de (?<name>${darkMatter})`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'A tua expedição */'encontrou um pequeno asteróide'/* de onde conseguiram resgatar alguns recursos.'*/,
            /*'Num planetóide isolado */'encontrámos um campo de recursos'/*. Conseguimos recolhê-los e estamos a voltar para descarregá-los.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            //LOCA: pt /*'Deine Expedition fand einen uralten, voll beladenen, aber */'menschenleeren Frachterkonvoi'/*. Einige Ressourcen konnten geborgen werden.'*/,
            //LOCA: pt /*'Auf einem kleinen Mond mit eigener Atmosphäre fand deine Expedition */'große Rohstoffvorkommen'/*. Die Bodencrews sind dabei, diese natürlichen Schätze zu heben.'*/,
        ],
        [ExpeditionEventSize.large]: [
            //LOCA: pt /*'Ein */'Mineraliengürtel'/* um einen unbekannten Planeten enthielt Unmengen an Rohstoffen. Die Expeditionsflotte meldet volle Lager!'*/,
            //LOCA: pt /*'Deine Expeditionsflotte meldet den */'Fund eines riesigen Alien-Schiffswracks'/*. Mit der Technologie konnten sie zwar nichts anfangen, aber das Schiff ließ sich in seine Einzelteile zerlegen, wodurch man wertvolle Rohstoffe gewinnen konnte.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`Foram roubados (?<amount>.+) de (?<name>${resources.join('|')})`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            //LOCA: pt /*'Wir sind auf die */'Überreste einer Vorgängerexpedition'/* gestoßen! Unsere Techniker versuchen, einige der Wracks wieder flugfähig zu machen.'*/,
            //LOCA: pt /*'Deine Expedition ist auf eine */'alte Sternenfestung'/* gestoßen, die wohl seit Ewigkeiten verlassen ist. Im Hangar der Festung wurden ein paar Schiffe gefunden. Die Techniker versuchen, einige davon wieder flott zu machen.'*/,
            //LOCA: pt /*'Unsere Expedition fand einen Planeten, der wohl durch */'anhaltende Kriege'/* fast komplett zerstört wurde. In der Umlaufbahn treiben diverse Schiffswracks. Die Techniker versuchen, einige davon zu reparieren. Vielleicht erhalten wir so auch Information darüber, was hier geschehen ist.'*/,
            /*'Descobrimos */'uma estação espacial pirata'/* ! Conseguimos encontrar umas velhas naves no hangar. Os nossos técnicos estão a verificar se elas ainda estão em bom estado.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'A nossa expedição encontrou um */'velho hangar automatizado'/*. Algumas das naves ainda estavam em fase de produção e os nossos técnicos estão a tentar reactivar os geradores eléctricos para tentar acabá-las'*/,
            //LOCA: pt /*'Wir haben die */'Reste einer Armada'/* gefunden. Die Techniker der Expeditionsflotte haben sich sofort auf die halbwegs intakten Schiffe begeben und versuchen, diese wieder instand zu setzen.'*/,
        ],
        [ExpeditionEventSize.large]: [
            //LOCA: pt /*'Wir haben einen */'riesigen Raumschiffsfriedhof'/* gefunden. Einigen Technikern der Expeditionsflotte ist es gelungen, das ein oder andere Schiff wieder in Betrieb zu nehmen.'*/,
            //LOCA: pt /*'Wir haben einen Planeten mit */'Resten einer Zivilisation'/* entdeckt.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`As seguintes naves fazem agora parte da frota:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
    },

    [ExpeditionEventType.nothing]: [
        /*'Embora este sector tenha mostrado */'resultados interessantes nos relatórios primários'/*, a missão não teve a mesma sorte. A frota voltou de mãos vazias.'*/,
        /*'Para além de uns pequenos e esquisitos */'animais de um planeta pantanoso'/*, esta expedição não trouxe nada de especial desta viagem.'*/,
        /*'A tripulação descobriu o */'significado da expressão "universo vasto"'/*. O relatório da missão não teve nenhum ponto interessante.'*/,
        /*'Um ser */'feito de energia hipnotizou toda'/* a tripulação da missão. Quanto esta acordou estava longe e à deriva e quase sem Deutério. Devido a este encontro a missão teve de ser cancelada.'*/,
        /*'Um */'problema no reactor da nave principal quase'/* que destruiu toda a frota de expedição. Felizmente os técnicos foram muito competentes e evitaram o pior. A reparação demorou algum tempo e forçou o retorno prematuro da frota.'*/,
        /*'A expedição tirou */'lindas fotos de uma super nova'/*. Nada de novo foi encontrado na viagem mas pelo menos poderemos tentar ganhar o prémio de "melhor fotografia" este ano.'*/,
        /*'A tua frota de expedição */'seguiu uns sinais estranhos por algum tempo'/*. No final, descobriram que era uma sonda enviada à muitas gerações atrás para cumprimentar espécies desconhecidas A sonda foi resgatada e alguns museus já demonstraram interesse por ela'*/,
        /*'Bem, agora sabemos que aquelas */'anomalias vermelhas de classe 5'/* para além de ter efeitos caóticos nos sistemas de navegação também são altamente alucinogénos.'*/,
        /*'A tua frota entrou no campo */'gravitacional de uma estrela de neutrões'/*. Para conseguir escapar à enorme força da gravidade teve de gastar grande parte do Deutério e cancelar a expedição.'*/,
        /*'Um */'virus de computador atacou o sistema de navegação mesmo'/* antes da frota sair do nosso sistema solar. O virus fez com que a frota andasse a voar em círculo. Não deverá ser necessário dizer que a missão falhou.'*/,
        /*'Provavelmente a */'festa de aniversário do capitão não deveria'/* ter sido realizada naquele planeta isolado. Uma terrível e desconhecida febre atacou os tripulantes e devido à falta de pessoal a missão teve de ser cancelada.'*/,
        /*'Alguém */'instalou um velho jogo de estratégia nos computadores'/* da nave. Esta expedição esteve algum tempo fora mas não trouxe nenhuma notícia em especial.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*'As últimas imagens que obtivemos da frota em expedição foram umas imagens */'bastante próximas de um buraco negro a nascer',
        /*'O último contacto que tivemos da */'frota em missão foi a seguinte mensagem'/*: Zzzrrt Deus! Krrrzzzzt Aquilo zrrrtrzt Parece krgzzzz uma Krzzzzzzzztzzzz...'*/,
        /*'Uma falha no núcleo do motor da nave-mãe leva a uma reacção em cadeia que */'destrói, de uma forma espectacular'/*, toda a frota.'*/,
        /*'A frota em missão */'não conseguiu voltar do salto de hiperespaço'/*. Os nossos cientistas ainda estão a tentar compreender o que aconteceu mas pelo que parece a frota foi totalmente perdida.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*'A tua frota */'contactou com uma raça alienígena tímida'/*. Eles anunciaram que irão enviar um representante com mercadorias para trocar nos nossos mundos.'*/,
        /*'A tua expedição recebeu um sinal de emergência. Um enorme cargueiro foi apanhado dentro dum poderoso campo gravitacional gerado por um planetóide. Depois de ajudar o cargueiro a libertar-se o capitão da nave anunciou que iria visitar os */'nossos planetas e iria fazer descontos especiais'/* em trocas de recursos.'*/,
    ],

    [ExpeditionEventType.early]: [
        //LOCA: pt /*'Eine unvorhergesehene */'Rückkopplung in den Energiespulen'/* der Antriebsaggregate beschleunigte den Rücksprung der Expedition, so dass sie nun früher als erwartet zurückkehrt. Ersten Meldungen zufolge hat sie jedoch nichts Spannendes zu berichten.'*/,
        /*'A tua expedição não reportou qualquer anomalia no sector explorado. Mas a frota enquanto voltava, */'apanhou um pouco de vento solar'/*. Devido a esta ocorrência a viagem de volta foi mais rápida. A tua frota de expedição volta ao ponto de partida um pouco mais cedo.'*/,
        /*'Um comandante novo e destemido */'conseguiu atravessar um wormhole instável'/* diminuindo assim a duração do voo! Contudo, a expedição não trouxe nada de novo.'*/,
    ],

    [ExpeditionEventType.delay]: [
        /*'Um */'erro no sistema de navegação fez'/* com que o salto de hiperespaço fosse mal calculado. Devido a esta falha a frota aterrou no local errado e devido a isso irá demorar mais tempo a voltar.'*/,
        /*'A missão entrou num */'sector com tempestades de plasma'/*. Devido a isto as baterias de energia da frota sofreram um curto-circuito e tiveram de aterrar num planeta próximo. Os mecânicos conseguiram resolver o problema mas a missão irá voltar com um grande atraso.'*/,
        /*'Devido a */'razões ainda desconhecidas o salto da frota de exploração'/* correu mal. Quase que aterrou perto de uma estrela. Nem tudo correu mal pois aterraram num sistema planetário conhecido. A viagem de retorno demorará mais um pouco que o previsto.'*/,
        /*'O vento */'solar de uma gigante vermelha fez com que o computador'/* se enganasse nas coordenadas do salto de hiperespaço. O computador irá precisar de mais tempo para conseguir recalcular o salto de volta. Para além disso não encontramos nada na zona para onde saltamos.'*/,
        /*'O */'novo módulo de navegação ainda tem alguns problemas'/*, devido a isso o salto foi para um sítio completamente diferente do previsto e o Deutério foi quase LOCA gasto. Quanto ao salto, este calhou próximo da lua do planeta de saída. Obrigados a utilizar os motores secundários a equipa irá demorar mais do que pensavam a voltar ao planeta.'*/,
        /*'A nave */'principal colidiu com uma nave estranha que tinha acabado'/* de sair do salto de hiperespaço. A nave estranha explodiu com o impacto causando danos substanciais no casco da nave principal. Os mecânicos/engenheiros estão a fazer turnos de 20 horas para conseguir reparar os recursos principais para que possamos voltar e fazer reparações necessárias.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /O item (?<name>.+) foi adicionado ao inventário/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*'Alguns */'piratas desesperados tentaram capturar'/* a nossa frota de expedição.'*/,
            /*'Uns */'bárbaros primitivos estão nos a atacar'/* com uma espécie de naves espaciais. Se os nossos escudos ficarem a 50% seremos obrigados a disparar contra eles.'*/,
            /*'Apanhamos umas */'mensagens via rádio e estas eram de uns piratas'/* bêbados. Parece que vamos ser atacados.'*/,
            /*'Tivemos de combater com uns piratas */'que por sorte não eram muito fortes',
            //LOCA: pt /*'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'A tua expedição deparou-se com uma, */'não muito agradável, frota pirata',
            /*'Nós fomos directos para uma */'emboscada efectuada por alguns piratas estelares'/*. Tentamos resolver pela via diplomática mas só com as armas é que conseguimos dialogar.'*/,
            /*'O*/' sinal de emergência que a expedição recebeu'/* era um engodo colocado por uns piratas estelares. Não pudemos evitar o confronto!'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Os sinais gravados não foram emitidos por um ser estranho mas sim por uma */'base pirata secreta'/* ! Eles tão ficaram surpreendidos com a nossa presença neste quadrante.'*/,
            /*'O relatório de expedição */'relata batalhas épicas contra naves-pirata'/* não identificadas!'*/,
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*'Algumas */'naves exóticas atacaram a frota de exploração'/* sem qualquer aviso prévio!'*/,
            /*'A tua frota de exploração teve um */'primeiro contacto com espécies desconhecidas'/* não muito amigável.'*/,
            /*'A nossa missão foi */'atacada por um pequeno número de naves desconhecidas'/* !'*/,
            //LOCA: pt /*'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Uma */'espécie desconhecida atacou a nossa'/* missão exploratória!'*/,
            /*'Tudo indica que a tua frota entrou em */'território de uma espécie de raça alienígena extremamente agressiva'/*.'*/,
            /*'A ligação com nossa frota exploratória foi interrompida durante um curto espaço de tempo. Pelo que conseguimos entender pela última mensagem enviada, ela está a ser atacada. Até */'agora não conseguiram identificar o agressor'/*.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'A tua frota de exploração foi atacada por uma Frota Invasora Alienígena. Há */'relatórios de grandes confrontos'/* !'*/,
            /*'Encontrámos algumas */'dificuldades em pronunciar correctamente o dialecto da raça extraterrestre'/*. Acidentalmente, o nosso diplomata gritou "Fogo!" em vez de "Paz!".'*/,
            /*'Uma grande Frota de */'naves cristalinas de origem desconhecida'/* está em rota de ataque contra a tua frota de exploração. Por agora temos de assumir o pior.'*/,
        ],
    },
    
    logbookRegex: /Entrada do diário dos Engenheiros de Comunicações:(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'Parece que esta */'parte do universo ainda não foi explorada',
            /*'É estranho saber que */'somos os primeiros a entrar neste sector',
        ],
        [ExpeditionDepletionLevel.low]: [
            /*'Ao que parece, somos os */'primeiros humanos a entrar nesta parte'/* da galáxia'*/,
            /*'Encontramos os destroços de algumas naves antigas. Não */'somos os primeiros neste quadrante',
            /*'Quase que */'chocamos contra uma outra frota em expedição'/*. Pensei que não iríamos encontrar mais ninguém por aqui'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*LOCA: pt 'Wir haben den Abschluss der Expedition mit den Crewmitgliedern einer zweiten Expeditionsflotte, die im selben Sektor unterwegs war, gefeiert. */'Die haben auch nichts Spannendes zu berichten',
            /*LOCA: pt 'Es wurden */'Anzeichen für die Präsenz anderer Expeditionsflotten'/* gefunden.'*/,
            /*LOCA: pt 'Es wurde */'friedlicher Funkkontakt zu einigen anderen Expeditionen'/* in diesem Sektor hergestellt.'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /*LOCA: pt 'Wenn wir uns zu unsicher fühlen, können wir uns ja */'mit all den anderen Expeditionen'/*, die hier herum fliegen, zusammen tun.'*/,
        ],
    },
};