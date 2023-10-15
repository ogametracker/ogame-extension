import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const pl: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            'Ekspedycja znalazła trochę Antymaterii',
            'Znaleźliśmy wrak obcego statku'/* , a w nim mały pojemnik z Antymaterią.'*/,
            /*'W małym */'statku znaleźliśmy osobliwego obcego'/* , który dał nam skrzynię z antymaterią w zamian za proste obliczenia matematyczne'*/,
            /*'Nasza */'ekspedycja przechwyciła statek-widmo'/* , który transportował małą ilość Antymaterii. Nie znaleźliśmy żadnych wskazówek odnośnie losu załogi statku, ale nasi technicy zdołali odzyskać Antymaterię.'*/,
            /*'Ekspedycja podążyła za */'dziwnym sygnałem pochodzącym z asteroidy'/* . W jej jądrze znaleziono małą ilość antymaterii. Asteroida została odholowana, a odkrywcy próbują wydobyć antymaterię.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Nasza */'ekspedycja przeprowadziła niezwykły eksperyment'/* . Naukowcom udało się wydobyć Antymaterię z umierającej gwiazdy.'*/,
            /*'Nasza Ekspedycja namierzyła zardzewiałą stację kosmiczną, która */'wydaje się niekontrolowanie dryfować od dłuższego czasu w przestrzeni kosmicznej'/* . Sama stacja była całkowicie bezużyteczna, jednakże w jej reaktorze znajdowała się pewna ilość antymaterii. Nasi technicy starają się odzyskać tyle antymaterii, ile się uda.'*/,
            /*'Nasze ekspedycja doniosła o nietypowym, spektakularnym fenomenie: */'nagromadzeniu Antymaterii w magazynach energii tarcz statku'/* . Nasi technicy starają się zgromadzić jak najwięcej Antymaterii, dopóki zjawisko trwa.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Spontaniczna */'deformacja nadprzestrzeni pozwoliła Twojej ekspedycji'/* zebrać dużą ilość Antymaterii!'*/,
            /*'Wyglądała jak postać zrobiona */'wyłącznie z energii, nazywał sie Legor'/* . Przeleciał przez statki naszej ekspedycji i postanowił pomóc nam, prymitywnej rasie.'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`Zrabowano: (?<amount>[^\\s]+) (?<name>${darkMatter})`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'Twoja */'ekspedycja natrafiła na małą asteroidę'/* , z której można pozyskać trochę surowców.'*/,
            /*'Znaleźliśmy łatwo dostępne pola */'surowców na odległej planetoidzie'/* i wydobyliśmy pewną ich ilość.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Twoja ekspedycja przez przypadek natrafiła na w */'pełni załadowany, ale opuszczony konwój fregat'/* . Udało się odzyskać część surowców.'*/,
            /*'Na małym księżycu z własną atmosferą Twoja */'ekspedycja znalazła ogromne złoża surowców'/* . Załoga na powierzchni stara się zebrać i załadować naturalny skarb.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Pierścienie */'minerałów wokół nieznanej planety zawierają niezliczone'/* ilości surowców. Statki wracają z pełnymi ładowniami.'*/,
            /*'Ekspedycja donosi o */'znalezieniu ogromnego wraku obcego statku kosmicznego'/* . Nie udało się poznać ich technologii ale zdołano podzielić statek na podstawowe elementy i odzyskać z nich surowce.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`Zrabowano: (?<amount>.+) (?<name>${resources.join('|')})`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*'Natknęliśmy się na */'pozostałości po poprzedniej ekspedycji'/* . Nasi technicy postarają się uruchomić część statków.'*/,
            /*'Twoja ekspedycja natknęła się na */'twierdzę starożytnego imperatora opuszczoną wiele'/* lat temu. W jej hangarach znaleziono statki, które technicy usiłują ponownie uruchomić.'*/,
            /*'Ekspedycja natknęła się na */'planetę niemalże całkowicie zniszczoną przez wojny'/* . Różne statki krążą na orbicie. Technicy starają się naprawić niektóre z nich. Może uda się również uzyskać informacje, co się tu wydarzyło.'*/,
            /*'Znaleźliśmy */'opuszczoną stację piratów'/* , a w jej hangarach stare statki. Technicy dokonują oględzin i sprawdzają, czy niektóre z nich mogą zostać wykorzystane.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Nasza ekspedycja */'natrafiła na starą automatyczną stocznię'/* . Kilka statków było nadal w fazie produkcyjnej i nasi technicy starają się aktualnie uruchomić generatory energii, aby dokończyć ich produkcję.'*/,
            'Znaleźliśmy szczątki armady'/* . Technicy od razu udali się do niemalże nietkniętych statków, starają się je ponownie uruchomić.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Odkryliśmy */'niesamowity cmentarz statków kosmicznych'/* . Kilku technikom z ekspedycji udało się uruchomić niektóre statki i dołączyć do floty.'*/,
            /*'Odkryliśmy */'planetę z resztkami cywilizacji'/* . Na orbicie znajduje się olbrzymi port kosmiczny. Kilku techników i pilotów z ekspedycji udało się na powierzchnię w poszukiwaniu statków, które jeszcze można wykorzystać.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`Następujące statki dołączyły do floty:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
    },

    [ExpeditionEventType.nothing]: [
        /*'Mimo pierwszych o*/'biecujących skanów tego sektora'/* , ekspedycja powróciła z pustymi rękami.'*/,
        /*'Poza osobliwymi małymi */'zwierzętami pochodzącymi z nieznanej bagiennej planety'/* ekspedycja nie przywiozła z wyprawy niczego groźnego.'*/,
        /*'Ekspedycja napotkała na */'rozległą pustkę w przestrzeni'/* , w której nie było nawet małej asteroidy, promieniowania lub czegokolwiek, co mogłoby zagrozić ekspedycji.'*/,
        /*'Żywa istota */'zbudowana z czystej energii spowodowała'/* , że wszyscy członkowie ekspedycji zaczęli wpatrywać się w hipnotyzujące wzory na ekranach. Gdy załoga się ocknęła, okazało się, że ekspedycja musi zostać przerwana z powodu małej ilości deuteru.'*/,
        /*'Awaria */'reaktora głównego statku ekspedycji niemalże zniszczyła'/* całą flotę. Na szczęście technicy byli bardzo kompetentni i udało się uniknąć najgorszego. Naprawa zabrała sporo czasu i ekspedycja musiała wrócić nie wykonawszy zadania.'*/,
        /*'Podczas */'wyprawy zrobiono wspaniałe zdjęcia supernowej'/* . Niestety nic innego nie udało się przywieźć, lecz przynajmniej są spore szanse na wygranie tegorocznego konkursu "Fotografia Roku Wszechświata".'*/,
        /*'Ekspedycja */'śledziła dziwny sygnał od jakiegoś czasu'/* . W końcu okazało się, że sygnał nadawany był ze starej sondy wysłanej pokolenia temu celem przywitania się z innymi gatunkami. Sondę uratowano, a wiele muzeów na Twojej rodzinnej planecie wyraziło zainteresowanie nią.'*/,
        /*'Teraz wiemy, że czerwone */'anomalie klasy 5 nie tylko destabilizują'/* systemy nawigacyjne statków, ale także powodują halucynacje u wielu członków załogi. Ekspedycja nie przywiozła niczego z wyprawy.'*/,
        /*'Ekspedycja niemalże została złapana przez */'pole grawitacyjne gwiazdy neutronowej i potrzebowała'/* trochę czasu na całkowite uwolnienie się. Jako, że na ten cel wykorzystano dużo deuteru, ekspedycja okazała się bezowocna.'*/,
        /*'Dziwny */'wirus komputerowy zaatakował system nawigacji'/* krótko po tym, jak ekspedycja opuściła rodzimy układ słoneczny. Spowodowało to, że ekspedycja zaczęła zataczać okręgi. Rzecz jasna, ekspedycja nie należała do udanych.'*/,
        /*'Chyba nie */'powinniśmy byli urządzać przyjęcia urodzinowego dla kapitana'/* na tej samotnej planecie. Straszna, nieznana gorączka spowodowała, że większość załogi musiała pozostać w izolatkach przez resztę ekspedycji. Z powodu braków w załodze ekspedycja nie powiodła się.'*/,
        /*'Ktoś zainstalował w */'komputerach statku starą grę strategiczną'/* . Misja ekspedycji trwała długo, lecz nie była zbyt owocna.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*'Ostatnią zdobyczą ekspedycji było naprawdę dobre */'zdjęcie otwierającej się czarnej dziury.',
        /*'Po naszej */'ekspedycji pozostała jedynie transmisja radiowa'/* : Zzzrrt grrt! Krrrzzzzt To zrrrtrzt wygląda krgzzzz jak Krzzzzzzzztzzzz...'*/,
        /*'Roztopienie rdzenia głównego statku powoduje reakcje łańcuchową, */'która powoduje wybuch niszczący całą flotę ekspedycji',
        'Ekspedycja nie wykonała skoku powrotnego'/*. Nasi pracownicy naukowi w dalszym ciągu próbują wyjaśnić co się stało, lecz wydaje się, że flota jest bezpowrotnie stracona.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*'Flota ekspedycyjna nawiązała */'kontakt z płochliwym gatunkiem obcych'/* . Ich przedstawiciel handlowy zostanie wysłany do Twojego imperium.'*/,
        'Ekspedycja odebrała sygnał alarmowy'/* . Ogromny statek transportowy dostał się w silne pole grawitacyjne planetoidy. Po udanej akcji ratunkowej ocalony kapitan ogłosił, że nasz imperator będzie jego ulubionym i uprzywilejowanym klientem.'*/,
    ],

    [ExpeditionEventType.early]: [
        /*'Niespodziewane sprzężenie */'zwrotne w zwojach energetycznych silników spowodowało'/* , że ekspedycja wróci szybciej, niż się spodziewano. Pierwsze raporty nie zawierają żadnych niepokojących informacji.'*/,
        /*'Twoja ekspedycja nie wykryła żadnych anomalii w badanym rejonie. Jednak flota */'wpadła w wiatr słoneczny podczas powrotu'/* . Z tego powodu podróż uległa znacznemu skróceniu. Twoja ekspedycja wróci do domu nieco wcześniej.'*/,
        /*'Młody odważny dowódca pomyślnie */'przedostał się przez niestabilną dziurę w czasoprzestrzeni'/* , by skrócić lot powrotny. Ekspedycja nie przywiozła jednak niczego nowego.'*/,
    ],

    [ExpeditionEventType.delay]: [
        /*'Główny nawigator miał zły dzień, */'co spowodowało obranie błędnego kursu'/* . Flota wylądowała w zupełnie innym miejscu, przez co wydłuży się czas jej powrotu.'*/,
        /*'"Twoja */'ekspedycja osiągnęła sektor pełen burz cząsteczkowych'/* , które spowodowały przeciążenie systemów przechowywania energii i uszkodzenie głównych systemów statków. Mechanicy zdołali zlikwidować najpoważniejsze usterki, ale powrót ekspedycji nastąpi z dużym opóźnieniem.'*/,
        /*'Z nieznanych */'powodów ekspedycja nieomal zderzyła się z gwiazdą'/* . Na szczęście pilotom udało się uniknąć kolizji i wylądować w znanym systemie. Wypadek ten spowoduje opóźnienie w powrocie floty.'*/,
        /*'Gwiezdny wiatr */'wiejący ze strony czerwonego giganta uniemożliwił skok'/* ekspedycji w nadprzestrzeń, przez co wydłuży się obliczenie skoku powrotnego. W tym sektorze nie było niczego poza pustką między gwiazdami. Flota wróci później, niż oczekiwano.'*/,
        /*'Nowy */'system nawigacyjny nadal nie jest wolny od błędów'/* . Skok floty ekspedycyjnej nie tylko przeniósł ją w całkiem inne miejsce, ale także wszelkie zapasy deuteru zostały wykorzystane. Na szczęście skok przeniósł flotę w pobliże księżyca planety startowej. Lekko zawiedziona ekspedycja wraca pozbawiona swego napędu. Podróż powrotna zajmie ciut więcej czasu.'*/,
        /*'Główny */'statek ekspedycyjny zderzył się z nieznanym statkiem'/* , który nagle wpadł w lecącą flotę. Ów statek wybuchł poważnie uszkadzając statek ekspedycyjny. Jak tylko zostaną przeprowadzone potrzebne naprawy, flota zawróci na planetę startową, ponieważ dalszy lot w takich warunkach nie jest możliwy.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /Do ekwipunku dodano (?<name>.+)/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*'Jacyś bardzo */'zdesperowani piraci próbowali przejąć flotę'/* ekspedycji.'*/,
            /*'Jacyś */'prymitywni barbarzyńcy atakują nas z użyciem pojazdów'/* , których nie można nazwać statkami kosmicznymi. Jeżeli ostrzał z ich strony będzie się nasilać, będziemy zmuszeni odpowiedzieć ogniem.'*/,
            /*'Odebraliśmy */'sygnał radiowy od jakichś pijanych piratów'/* . Wydaje się, że wkrótce nas zaatakują.'*/,
            'Musieliśmy walczyć z piratami'/*. Na szczęście było ich tylko kilku.'*/,
            /*LOCA: pl 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Ekspedycja */'miała niemiłe spotkanie ze statkami piratów',
            /*'Wpadliśmy prosto w */'pułapkę zastawioną przez gwiezdnych piratów'/* . Nie udało się uniknąć walki.'*/,
            /*'Sygnał alarmowy wykryty przez ekspedycję okazał się być */'fałszywym sygnałem wysłanym przez gwiezdnych piratów'/* . Walki nie dało się uniknąć.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Zarejestrowane sygnały nie pochodziły od nieznanej istoty, */'a z tajnej bazy piratów'/* . Nie byli wcale zdziwieni naszą obecnością w tym sektorze.'*/,
            /*'Ekspedycja donosi o */'ciężkich walkach z niezidentyfikowanymi statkami piratów',
        ],
        'fled-death-star': [
            /*LOCA: pl 'Your expedition stumbled across some pirates, but overwhelmed by the magnitude of your Deathstar, they fled.' */
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*'Kilka */'egzotycznie wyglądających statków zaatakowało twoją ekspedycję'/* bez żadnego ostrzeżenia'*/,
            /*'Twoja ekspedycja */'napotkała niezbyt przyjazną rasę obcych'/* ...'*/,
            /*'Nasza ekspedycja została */'zaatakowana przez niewielką grupę niezidentyfikowanych'/* statków.'*/,
            /*LOCA: pl 'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            'Nieznani obcy atakują Twoją ekspedycję',
            /*'Wygląda na to, że */'Twoja ekspedycja naruszyła terytorium nieznanej'/* rasy wojowników.'*/,
            /*'Kontakt z naszą ekspedycją został przerwany na krótki czas. Możemy jednak odszyfrować jej ostatnią wiadomość. Są pod ciężkim obstrzałem, */'agresorzy nie zostali rozpoznani',
        ],
        [ExpeditionEventSize.large]: [
            /*'Twoja */'flota natrafiła na silną flotę obcych i jest w trakcie'/* zaciekłych walk!.'*/,
            /*LOCA: pl 'Wir hatten Mühe den korrekten */'Dialekt einer Alienrasse'/* auszusprechen. Unser Diplomat rief daher "Feuer!" statt "Friede!".'*/,
            /*LOCA: pl 'Ein großer */'Verband kristalliner Schiffe unbekannter Herkunft'/* hält direkten Kollisionskurs mit unserer Expeditionsflotte. Wir müssen nun wohl vom Schlimmsten ausgehen.'*/,
        ],
        'fled-death-star': [
            /*LOCA: pl 'Your expedition stumbled across some aliens, but overwhelmed by the magnitude of your Deathstar, they fled.' */
        ],
    },

    logbookRegex: /(Wpis z dziennika pokładowego oficerów komunikacyjnych|Wpis z dziennika pokładowego oficera komunikacyjnego):(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'Zdaje się, że ta */'część wszechświata jeszcze nie była badana',
            /*'to cudowne uczucie być pierwszymi, */'którzy podróżują przez ten niezbadany sektor',
        ],
        [ExpeditionDepletionLevel.low]: [
            /*'Zdaje się, że żaden */'człowiek jeszcze nie był w tej części galaktyki',
            /*'znaleźliśmy */'szczątki starożytnego statku kosmicznego'/* . Nie jesteśmy zatem pierwsi w tym miejscu'*/,
            /*'niemalże */'doszło do kolizji z flotą innej ekspedycji'/* . Nie sądziłem, że inne ekspedycje mogą znajdować się w pobliżu.'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*'świętowaliśmy zakończenie ekspedycji z załogą innej, która znajdowała się w tym samym sektorze. Nie */'mieli żadnych niepokojących informacji',
            /*'znaleźliśmy */'dowód wskazujący na obecność wielu innych flot'/* ekspedycyjnych.'*/,
            /*'nawiązaliśmy */'przyjacielski kontakt radiowy z innymi ekspedycjami'/* w tym sektorze.'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /*LOCA: pl 'Wenn wir uns zu unsicher fühlen, können wir uns ja */'mit all den anderen Expeditionen'/*, die hier herum fliegen, zusammen tun.'*/,
            /*'może lepiej by */'było otworzyć tu sklep z pamiątkami niż wysyłać kolejną'/* ekspedycję.'*/,
            /*LOCA: pl 'Wenn das so weitergeht, sollte man */'bei all dem Verkehr hier Navigationsbojen'/* aussetzen.'*/,
        ],
    },
};