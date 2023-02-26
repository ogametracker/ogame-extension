import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const ru: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*TODO: ru 'Der Expedition ist es gelungen, */'ein wenig Dunkle Materie einzufangen'/* und zu konservieren.'*/,
            /*TODO: ru 'Wir haben die */'Überreste eines Alien-Schiffes'/* gefunden. An Bord war ein kleiner Behälter mit Dunkler Materie!'*/,
            /*TODO: ru 'Wir trafen auf ein */'seltsames Alien an Bord eines kleinen Schiffes'/*, das uns im Austausch für ein paar simple, mathematische Berechnungen einen kleinen Behälter mit Dunkler Materie überließ.'*/,
            /*TODO: ru 'Unsere Expedition ist auf ein */'Geisterschiff gestoßen'/*, das eine kleine Menge Dunkler Materie transportierte. Wir haben zwar keinerlei Hinweise finden können, was der ursprünglichen Crew zugestoßen ist. Dennoch gelang es unseren Technikern, die Dunkle Materie zu bergen.'*/,
            /*TODO: ru 'Die Expedition folgte einigen */'seltsamen Signalen und entdeckte einen Asteroiden'/*, in dessen Kern ein wenig Dunkle Materie eingeschlossen war. Der Asteroid wurde an Bord geholt und die Forscher versuchen nun, die Dunkle Materie zu extrahieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*TODO: ru 'Unserer Expedition ist */'ein einmaliges Experiment gelungen'/*:'*/,
            /*TODO: ru 'Unsere Expedition hat eine */'uralte Raumstation gefunden'/*, die wohl schon seit langer Zeit unkontrolliert durch das All schwebt. Die Station selbst war komplett unbrauchbar, jedoch lagerte in einem ihrer Reaktoren noch ein wenig Dunkler Materie. Unsere Techniker versuchen, so viel wie möglich davon zu bergen.'*/,
            /*TODO: ru 'Unsere Expedition meldet ein seltsames spektrales Phänomen. Dies führte unter anderem dazu, dass sich in den */'Energiespeichern der Schiffsschilde Dunkle Materie'/* bildete. Unsere Techniker versuchen nun, solange das Phänomen noch anhält, möglichst viel dieser Dunklen Materie zu konservieren.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*TODO: ru 'Eine */'spontane Hyperraumverzerrung'/* hat es deiner Expedition ermöglicht, eine große Menge dunkler Materie sicherzustellen!'*/,
            /*TODO: ru 'Unsere Expedition meldet einen ersten Kontakt der besonderen Art. Anscheinend hat */'eine Energiekreatur, die sich Legorianer nannte'/*, die Schiffe der Expedition durchflogen und dann beschlossen, der unterentwickelten Spezies ein wenig auszuhelfen - es materialisierte sich ein Behälter mit dunkler Materie an Bord der Brücke!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`Было найдено (?<amount>[^\\s]+) (?<name>${darkMatter})`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*TODO: ru 'Deine Expedition hat einen */'kleinen Asteroidenschwarm'/* entdeckt, aus dem einige Ressourcen gewonnen werden können.'*/,
            /*TODO: ru 'Auf einem abgelegenen Planetoiden wurden */'einige leicht zugängliche Ressourcenfelder'/* gefunden und erfolgreich Rohstoffe gewonnen'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*TODO: ru 'Deine Expedition fand einen uralten, voll beladenen, aber */'menschenleeren Frachterkonvoi'/*. Einige Ressourcen konnten geborgen werden.'*/,
            /*TODO: ru 'Auf einem kleinen Mond mit eigener Atmosphäre fand deine Expedition */'große Rohstoffvorkommen'/*. Die Bodencrews sind dabei, diese natürlichen Schätze zu heben.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*TODO: ru 'Ein */'Mineraliengürtel um einen unbekannten Planeten'/* enthielt Unmengen an Rohstoffen. Die Expeditionsflotte meldet volle Lager!'*/,
            /*TODO: ru 'Deine Expeditionsflotte meldet den */'Fund eines riesigen Alien-Schiffswracks'/*. Mit der Technologie konnten sie zwar nichts anfangen, aber das Schiff ließ sich in seine Einzelteile zerlegen, wodurch man wertvolle Rohstoffe gewinnen konnte.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`Было найдено (?<amount>.+) (?<name>${resources.join('|')})`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*TODO: ru 'Wir sind auf die */'Überreste einer Vorgängerexpedition'/* gestoßen! Unsere Techniker versuchen, einige der Wracks wieder flugfähig zu machen.'*/,
            /*TODO: ru 'Deine Expedition ist auf eine */'alte Sternenfestung'/* gestoßen, die wohl seit Ewigkeiten verlassen ist. Im Hangar der Festung wurden ein paar Schiffe gefunden. Die Techniker versuchen, einige davon wieder flott zu machen.'*/,
            /*TODO: ru 'Unsere Expedition fand einen Planeten, der wohl durch */'anhaltende Kriege'/* fast komplett zerstört wurde. In der Umlaufbahn treiben diverse Schiffswracks. Die Techniker versuchen, einige davon zu reparieren. Vielleicht erhalten wir so auch Information darüber, was hier geschehen ist.'*/,
            /*TODO: ru 'Wir haben eine */'verlassene Piratenbasis'/* gefunden. Im Hangar liegen noch einige alte Schiffe. Unsere Techniker schauen nach, ob einige davon noch zu gebrauchen sind.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*TODO: ru 'Unsere Expedition stieß auf eine */'alte automatische Schiffswerft'/*. Einige Schiffe sind noch in der Produktionsphase und unsere Techniker versuchen, die Energieversorgung der Werft wiederherzustellen.'*/,
            /*TODO: ru 'Wir haben die */'Reste einer Armada'/* gefunden. Die Techniker der Expeditionsflotte haben sich sofort auf die halbwegs intakten Schiffe begeben und versuchen, diese wieder instand zu setzen.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*TODO: ru 'Wir haben einen */'riesigen Raumschiffsfriedhof'/* gefunden. Einigen Technikern der Expeditionsflotte ist es gelungen, das ein oder andere Schiff wieder in Betrieb zu nehmen.'*/,
            /*TODO: ru 'Wir haben einen Planeten mit */'Resten einer Zivilisation'/* entdeckt.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`К флоту присоединились:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
    },

    [ExpeditionEventType.nothing]: [
        /*'Несмотря на первые многообещающие сканы этого сектора, */'мы возвращаемся с пустыми руками',
        /*'Экспедиция не принесла ничего особого, */'кроме какой-то странной зверушки с неизвестной болотной'/* планеты.'*/,
        /*'Ваша экспедиция */'в прямом смысле слова познакомилась с вселенской пустотой'/*. Ни единого астероида, ни единого излучения или частички, хоть чего-нибудь, из-за чего стоило лететь.'*/,
        /*'Жизненная форма, */'состоящая из чистой энергии заставила членов экспедиции'/* несколько дней подряд смотреть на гипнотирующие узоры на мониторах. Когда же большинство вышло из гипноза, экспедиции надо было возвращаться, т.к. были исчерпаны все запасы дейтерия.'*/,
        /*'Неполадка */'в реакторе ведущего корабля чуть не уничтожила всю экспедицию'/* . К счастью техники предотвратили самое страшное, но ремонт занял много времени, и экспедиции пришлось вернуться с пустыми руками.'*/,
        /*'Ваша */'экспедиция сделала замечательные снимки сверхновой звезды'/* , однако по-настоящему нового она ничего не принесла. Но тем не менее есть все шансы занять первое место на конкурсе за снимок года во вселенной.'*/,
        /*'Ваш экспедиционный флот следовал некоторое время странным сигналам. */'В конце концов эти сигналы привели его к древнему зонду'/* , отправленному несколько поколений назад, чтобы поПРЕВЕДствовать другие цивилизации. Зонд был доставлен на борт и многие музеи с Вашей главной планеты уже выразили интерес в его приобретении.'*/,
        /*'Ну по крайней мере мы теперь знаем, что */'красные аномалии 5-го класса не только вносят'/* хаос в работу бортовых систем, но также вызывает массовые галлюцинации у экипажа. Но больше ничего нового экспедиция не принесла.'*/,
        /*'Ваш экспедиционный */'флот попал в опасную близость гравитационного поля нейтронной звезды'/* , и ему пришлось потратить некоторое время, чтобы выбраться из него. Это стоило флоту всего дейтерия, и поэтому экспедиция возвращается обратно с пустыми руками.'*/,
        /*'Вскоре после выхода за пределы солнечной системы */'неизвестный компьютерный вирус парализовал систему навигации'/* . Это привело к тому, что флот всё время пролетал кругом. Не стоит говорить, что экспедиция не удалась.'*/,
        /*'Думаю не стоило всё-таки отмечать */'день рождения капитана на этой затерянной планете'/* . Инопланетная лихорадка заставила большинство команды провести всю экспедицию в больничном отсеке. Резкая нехватка персонала привела к провалу экспедиции.'*/,
        /*'Кто-то установил на всех */'корабельных компьютерах какую-то древнюю стратегическую игру'/* . Экспедиционный флот был долго в пути, но принёс никаких продуктивных результатов.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*'Последнее, что удалось получить от экспедиции, были невероятно хорошо */'получившиеся снимки открывающейся чёрной дыры крупным планом',
        /*'От экспедиции */'осталось только следующее сообщение'/* : ".... о боже! Оно ... похоже ..... на ... "'*/,
        /*'Раздробление ядра ведущего корабля вызвало цепную реакцию, */'которая довольно-таки эффектным взрывом уничтожила'/* всю экспедицию.'*/,
        /*'Экспедиционный */'флот не вернулся из прыжка'/* , и наши учёные теперь ломают над этим голову, но всё указывает на то, что с флотом можно распрощаться навсегда.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*'Ваш экспедиционный */'флот вышел на контакт с какой-то стеснительной инопланетной расой'/* . Они заявили, что хотят отправить в Ваши миры своего представителя с товарами на обмен.'*/,
        /*'Ваш */'экспедиционный флот поймал сигнал помощи'/* . Он исходил от огромного мега-транспорта, попавшего в гравитационное поле одного планетоида. После освобождения транспорта, его капитан празднично объявил о занесении своих спасителей в качестве эксклюзивных клиентов в свою чёрную книгу.'*/,
    ],

    [ExpeditionEventType.early]: [
        /*'Неожиданное */'замыкание в энергетических катушках двигателей ускорили обратный'/* прыжок экспедиции так, что он возвращается раньше запланированного времени. Согласно первым сообщениям, ничего необычного не наблюдается.'*/,
        /*'Ваша экспедиция не сообщает ничего необычного в исследуемом секторе. Однако */'при обратном прыжке флот попал в поток солнечного ветра'/* , из-за чего прыжок ускорился и экспедиция возвращается несколько раньше.'*/,
        /*'Отважный новый */'командир использовал нестабильную червоточину'/*, чтобы сократить обратный прыжок - и ему это удалось! Однако сама экспедиция не принесла ничего нового.'*/,
    ],

    [ExpeditionEventType.delay]: [
        /*'Халтурно собранный */'навигатор неправильно произвёл расчёты для прыжка'/* , и поэтому флот не только приземлился в абсолютно другом месте, но и обратная дорога заняла невероятно много времени.'*/,
        /*'Ваша экспедиция */'попала в сектор с усиленными потоками частиц'/* . Из-за этого энергетические хранилища кораблей перегрузились и на всех кораблях полетели все системы. Механикам удалось кое-что исправить, но обратный путь несколько задержится.'*/,
        /*'По пока неустановленным */'причинам прыжок экспедиционного флота не удался и флот выпрыгнул'/* почти в самом сердце одного солнца. К счастью это была известная система, но обратный путь займёт некоторое время.'*/,
        /*'Звёздный ветер от */'красного гиганта исказил прыжок экспедиции так'/* , что для расчёта обратного прыжка понадобилось довольно много времени. К тому же, когда экспедиция вышла из прыжка, то не нашла ничего, кроме межзвёздной пустоты.'*/,
        /*'Новый */'навигационный модуль всё-таки имеет пару мелких неисправностей'/* , поэтому флот не только прыгнул в совершенно другую сторону, но и израсходовал при этом весь дейтерий. Флот выпрыгнул как раз рядом с луной стартовой планеты слегка расстроенная экспедиция возвращается на импульсном двигателе обратно, из-за чего обратный путь несколько затянется.'*/,
        /*'Ведущий корабль */'Вашего экспедиционного флота столкнулся с незнакомым кораблём'/* , который без предупреждения совершил прыжок на флот. Незнакомый корабль взорвался, значительно повредив ведущий корабль. Как только будут окончены самые необходимые ремонтные работы, Ваши корабли полетят обратно, т.к. в таком состоянии они не могут лететь дальше.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /(?<name>.+) был добавлен в инвентарь/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*'Пара */'отчаянных космических пиратов попыталась захватить'/* наш флот.'*/,
            /*'Нас */'атакуют какие-то варвары'/* . И хотя их примитивные корабли даже отдалённо не заслуживают называться кораблями и не способны причинить нам вреда, но если обстрел примет сколько-нибудь серьёзный масштаб, то нам придётся открыть ответный огонь.'*/,
            /*'Мы */'перехватили переговоры пьяных пиратов'/* . По всей видимости на нас должны напасть.'*/,
            /*'Нам */'пришлось обороняться от пиратов, которых, к счастью'/* , было не так много.'*/,
            /*TODO: ru 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Ваш экспедиционный флот */'пережил неприятную встречу с космическими пиратами',
            'Мы попались в лапы звёздным пиратам'/* ! Бой был неизбежен.'*/,
            /*'Сигнал о помощи, на который последовала экспедиция, */'оказался приманкой звёздных пиратов'/* . Бой был неизбежен.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Пойманные сигналы исходили не от инопланетной расы, */'а от секретной пиратской базы'/* ! Они были не в особом восторге от нашего появления.'*/,
            /*'Экспедиционный флот */'сообщает о жестоких боях с неизвестными кораблями',
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*'Какие-то */'корабли неизвестного происхождения без предупреждения атаковали'/* Ваш экспедиционный флот!'*/,
            /*'Ваш экспедиционный флот */'испытал не особо дружественный первый контакт'/* с неизвестной расой.'*/,
            /*'На нашу */'экспедицию напала небольшая группа неизвестных'/* кораблей!'*/,
            /*TODO: ru 'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            'Неизвестная раса атакует наш экспедиционный флот',
            /*'Ваш экспедиционный */'флот по всей видимости вторгся на территорию неизвестной'/* , но крайне агрессивной инопланетной расы.'*/,
            /*'Связь с нашим экспедиционным флотом прервалась. Насколько можно судить по расшифровкам последнего сообщения, */'флот находится под массивным обстрелом неидентифицированного флота',
        ],
        [ExpeditionEventSize.large]: [
            /*'На вашу */'экспедицию напал вражеский флот пришельцев'/* , имеются тяжёлые потери!'*/,
            /*TODO: ru 'Wir hatten Mühe den korrekten */'Dialekt einer Alienrasse'/* auszusprechen. Unser Diplomat rief daher "Feuer!" statt "Friede!".'*/,
            /*'Огромная */'Армада хрустальных кораблей неизвестного происхождения'/* взяли курс на прямое столкновения с нашим экспедиционным флотом. Мы должны приготовиться к худшему.'*/,
        ],
    },

    logbookRegex: /*TODO: ru*//Logbuchnachtrag des Kommunikationsoffiziers:(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*TODO: ru 'Dieser Bereich des Universums ist */'wohl noch nicht erkundet worden',
            /*TODO: ru 'Es ist ein erhebendes Gefühl, der */'Erste in einem unerforschten Sektor'/* zu sein'*/,
        ],
        [ExpeditionDepletionLevel.low]: [
            /*TODO: ru 'Es scheint nicht so, als ob */'jemals ein Mensch in diesem Bereich der Galaxis'/* gewesen wäre.'*/,
            /*TODO: ru 'Es wurden */'sehr alte Signaturen von Raumschiffen'/* entdeckt. Wir sind also nicht die Ersten hier.'*/,
            /*TODO: ru 'Wir hatten beinahe eine */'Kollision mit einer anderen Expeditionsflotte'/*. Hätte nicht gedacht, dass sich hier noch andere herumtreiben.'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*TODO: ru 'Wir haben den Abschluss der Expedition mit den Crewmitgliedern einer zweiten Expeditionsflotte, die im selben Sektor unterwegs war, gefeiert. */'Die haben auch nichts Spannendes zu berichten',
            /*TODO: ru 'Es wurden */'Anzeichen für die Präsenz anderer Expeditionsflotten'/* gefunden.'*/,
            /*TODO: ru 'Es wurde */'friedlicher Funkkontakt zu einigen anderen Expeditionen'/* in diesem Sektor hergestellt.'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /*TODO: ru 'Wenn wir uns zu unsicher fühlen, können wir uns ja */'mit all den anderen Expeditionen'/*, die hier herum fliegen, zusammen tun.'*/,
            /*TODO: ru 'Vielleicht wäre es sinnvoller, hier */'eine Souvenir-Station zu errichten'/* , anstatt noch eine Expedition loszuschicken.'*/,
            /*TODO: ru 'Wenn das so weitergeht, sollte man */'bei all dem Verkehr hier Navigationsbojen'/* aussetzen.'*/,
        ],
    },
};