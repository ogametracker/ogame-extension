import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const ru: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*'Экспедиции удалось */'поймать и законсервировать немного Тёмной материи',
            /*'Мы нашли */'останки инопланетного корабля'/*. На борту находился небольшой контейнер с Тёмной материей!'*/,
            /*'Мы нашли странного инопланетянина на борту маленького корабля, который обменял нам небольшой контейнер Тёмной материи */'на несколько элементарных математических расчётов',
            /*'Наша экспедиция */'наткнулась на корабль-призрак с грузом Тёмной материи'/* . Пока мы не можем выяснить, что случилось с его экипажем, но нашим техникам удалось достать немного Тёмной материи.'*/,
            /*'Экспедиция */'следовала странным сигналам и обнаружила астероид'/* , в середине которого находилось небольшое количество Тёмной материи. Астероид был доставлен на борт и сейчас учёные пытаются экстрагировать Тёмную материю.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Нашей */'экспедиции удался уникальный эксперимент'/* . Из затухающей звезды им удалось добыть Тёмную материю!'*/,
            /*'Наша экспедиция */'натолкнулась на древнюю космическую станцию, долгое время дрейфовавшую по вселенной'/* . Сама станция находится в абсолютно непригодном для использования состоянии, но в одном из реакторов хранилось небольшое количество Тёмной материи. Наши техники прилагают все усилия, чтобы доставить на борт как можно больше.'*/,
            /*'Наша экспедиция сообщает о странном спектральном феномене. В результате этого в */'энергетических хранилищах корабельных щитов образовалась Тёмная материя'/* . Сейчас наши техники пытаются законсервировать как можно больше Тёмной материи.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Неожиданное */'гиперпространственное искривление вывело Вашу'/* экспедицию на огромные залежи тёмной материи!'*/,
            /*'Наша экспедиция передаёт особую новость! По всей видимости какая-то энергетическая раса, */'называвшая себя легорианцами'/* , облетела корабли экспедиции и решила немного помочь слаборазвитой расе. На мостике материализовался контейнер с тёмной материей!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`Было найдено (?<amount>[^\\s]+) (?<name>${darkMatter})`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'Ваша экспедиция */'нашла маленькое скопление астероидов'/* , из которого можно добыть некоторые ресурсы.'*/,
            /*'На уда̣ленном */'планетоиде были найдены легкодоступные залежи ресурсов'/* , которые были успешно доставлены на борт.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Ваша */'экспедиция нашла древний заполненный грузом конвой'/* . Некоторые ресурсы удалось доставить на борт.'*/,
            /*'На */'маленькой луне с собственной атмосферой ваша экспедиция'/* нашла крупные залежи ресурсов.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Пояс из минералов вокруг неизвестной планеты содержал невероятные количества ресурсов. */'Экспедиционный флот сообщает о полных хранилищах',
            /*'Ваш экспедиционный флот */'сообщает о находке огромного инопланетного корабля'/* . Его технология им абсолютно неизвестна, но отдельные его части можно пустить на ресурсы.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`Было найдено (?<amount>.+) (?<name>${resources.join('|')})`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*'Мы */'натолкнулись на остатки предыдущей экспедиции'/* ! Наши техники пытаются найти среди обломков что-то летающее.'*/,
            /*'Ваша экспедиция */'наткнулась на старинную звёздную крепость'/* , уже целую вечность покинутую. В ангаре крепости стоит ещё несколько кораблей. Техники исследуют их на предмет исправности.'*/,
            /*'Наша экспедиция нашла планету, */'почти полностью разрушенную постоянными войнами'/* . На орбите дрейфуют различные обломки. Техники пытаются отремонтировать некоторые из них, в надежде получить информацию, что там произошло. '*/,
            /*'Мы */'нашли покинутую пиратскую базу'/*. В ангаре ещё стоит несколько старых кораблей. Наши техники смотрят, могут ли они ещё летать.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Наша экспедиция */'натолкнулась на древнюю автоматическую верфь'/* . Несколько кораблей находятся ещё в фазе производства и наши техники пытаются восстановить энергообеспечение верфи.'*/,
            /*'Мы */'нашли остатки армады'/* . Техники экспедиционного флота сразу же принялись за неповреждённые корабли и пытаются починить их.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Мы нашли */'огромное кладбище космических кораблей'/* . Некоторым техникам из экспедиции удалось восстановить несколько штук.'*/,
            /*'Мы */'обнаружили планету со следами цивилизации'/* . С орбиты можно распознать огромный порт, единственный оставшийся целым. Группа техников и пилотов отправилась на поверхность планеты, чтобы поискать ещё пригодные к использованию корабли.'*/,
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
        'fled-death-star': [
            /*LOCA: ru 'Your expedition stumbled across some pirates, but overwhelmed by the magnitude of your Deathstar, they fled.' */
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
            /*'Язык этой расы труден в произношении. Совершенно случайно наш дипломат */'воскликнул "Огонь!" вместо "Мир!"',
            /*'Огромная */'Армада хрустальных кораблей неизвестного происхождения'/* взяли курс на прямое столкновения с нашим экспедиционным флотом. Мы должны приготовиться к худшему.'*/,
        ],
        'fled-death-star': [
            /*LOCA: ru 'Your expedition stumbled across some aliens, but overwhelmed by the magnitude of your Deathstar, they fled.' */
        ],
    },

    logbookRegex: /Бортовой журнал, дополнение связиста:(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'Эта часть */'вселенной наверное ещё не исследована',
            /*'Это такое возвышающее чувство - */'быть первопроходцем в неисследованном секторе'/* вселенной.'*/,
        ],
        [ExpeditionDepletionLevel.low]: [
            /*'Похоже, что в этом */'районе галактики ещё не ступала нога человека',
            /*'Мы */'обнаружили очень древние корабельные сигнатуры'/* . Похоже, что мы тут не первые.'*/,
            /*'Мы почти */'столкнулись с другим экспедиционным флотом'/* . Никогда бы не подумал, что сюда ещё кто-то полетит.'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*'Мы отпраздновали окончание экспедиции с членами команды повстречавшейся нам второй экспедиции, которая тоже исследовала этот сектор. */'Они тоже не нашли ничего особенного',
            /*'Обнаружены */'следы присутствия других экспедиционных'/* флотов.'*/,
            /*'Налажен */'дружеский радио-контакт с другими экспедициями'/* из этого сектора.'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /*'Если мы не слишком уверены в себе, то мы */'можем совместить усилия с остальными экспедициями из этого'/* сектора.'*/,
            /*'Может было бы */'разумнее соорудить здесь сувенирную станцию'/*, вместо того, чтобы отправлять целую экспедицию?'*/,
            /*'Если так пойдёт и дальше, то при */'таком движении надо будет ставить навигационные'/* буйки.'*/,
        ],
    },
};