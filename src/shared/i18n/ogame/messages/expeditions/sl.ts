import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const sl: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*'Ekspediciji je */'uspelo zajeti in shraniti nekaj Črne materije'/*.'*/,
            /*'Našli smo */'ostanke vesoljske ladje'/* na kateri je shranjeno nekaj Črne materije na policah v skladiščih!'*/,
            /*'Srečali smo */'čudnega nezemljana na manjši ladji'/*, kateri nam je v zameno za nekaj matematičnih kalkulacij ponudil Črno materijo.'*/,
            /*'Naša ekspedicija */'je zajela neznano ladjo'/*, katera je prevažala manjšo količino Črne materije. Nimamo podatkov kaj se je zgodilo z originalno posadko, vendar je našim tehnikom uspelo zajeti nekaj Črne materije.'*/,
            /*'Ekspedicija je */'spremljala čudne signale od enega asteroida'/*. V samem jedru tega asteroida so našli manjšo količino Črne materije. Zaradi nadaljnega raziskovanja so znanstveniki zasegli asteroid in pobrali Črno materijo.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Naši ekspediciji je */'uspel unikaten eksperiment'/*. Uspeli so reciklirati Črno materijo iz zvezde, ki umira.'*/,
            /*'Naša ekspedicija je */'najdla zapuščeno vesoljsko postajo'/*, ki je tavala po vesolju brez cilja. Sama postaja je povsem neuporabna, vendar pa smo našli nekaj Črne materije v reaktorju. Naši tehniki poskušajo shraniti kolikor le lahko.'*/,
            /*'Naša ekspedicija poroča o neverjetnem fenomenu. Našli so Črno materijo v */'skladiščih energije v ščitu ladje'/*. Dokler fenomen traja, naši tehniki poskušajo shraniti kolikor se je da.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'*/'Spontana deformacija hiper prostora'/* ti je omogočila, da pobereš večje količine Črne materije!'*/,
            /*'Naša ekspedicija je vzpostavila kontakt s posebno raso. Izgleda kot močno bitje, narejeno iz čiste energije, */'imenovano Legorian'/*, ki je preletelo skozi ekspedicijske ladje in se odločilo pomagati slabšim rasam. Kovček s Črno materijo te čaka na ladijskem mostu.'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`(?<name>${darkMatter}) (?<amount>[^\\s]+) je bilo zajeto.`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'Ekspedicija je našla */'manjši asteroid'/* iz katerega smo uspeli dobiti surovine.'*/,
            /*'Na */'oddaljenem planetoidu smo našli surovine'/*, katere nam je uspelo pobrati.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Tvoja ekspedicija je naletela na */'star konvoj poln surovin'/*. Nekaj surovin jim je uspelo pobrati.'*/,
            /*'Ekspedicija je odkrila */'ogromne količine surovin na majhni luni'/*. Posadka se trudi, da jih shrani čim več.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'*/'Mineralni pas okoli nepoznanega planeta'/* vsebuje neprecenljive surovine. Ekspedicija se vrača nazaj brez njih, saj so skladišča prepolna.'*/,
            /*'Poročilo ekspedicije poroča o najdbi */'ruševin ogromne vesoljske ladje'/*. Naši tehniki niso mogli dobiti nobenih novih informacij, vendar so razstavili ladjo na dele in tako pridobili koristne surovine.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`(?<name>${resources.join('|')}) (?<amount>.+) je bilo zajeto`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*'Našli smo */'ostanke prejšnjih ekspedicij'/* ! Naši tehniki bodo poskusili popraviti nekatere ladje.'*/,
            /*'Ekspedicija je našla staro kolonijo, ki je */'bila zapuščena pred par leti'/*. V hangarjih so našli tudi nekaj ladij, katere zdaj tehniki poskušajo popraviti.'*/,
            /*'Ekspedicija je našla planet, kateri je bil */'skoraj uničen v prejšnjih misijah'/*. V njegovi orbiti letijo še nekatere ladje katere naši tehniki lahko popravijo.'*/,
            /*'Našli smo */'staro piratsko postajo'/* na kateri so še vedno ladje. Naši tehniki poskušajo ugotoviti ali so še uporabne.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Ekspedicija je našla */'staro avtomatsko ladjedelnico'/*. Opazili so da so nekatere ladje še vedno v listi gradnje, tako da se trudijo, da popravijo ladjedelnico in s tem dobijo nove ladje.'*/,
            /*'Našli smo */'ostanke armade'/*. Tehniki so se odpravili do ladij, da vidijo ali jih lahko uporabimo..'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Našli smo */'ogromno pokopališče ladij'/*. Našim tehnikom je uspelo nekatere popraviti.'*/,
            /*'Našli smo */'planet z ostanki civilizacije'/*. Opazili smo tudi ogromno vesoljsko postajo kako kroži v orbiti. Tehniki so se odpravili, da pogledajo katere ladje lahko uporabijo.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`Naslednje ladje so zdaj del tvoje flote:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
    },

    [ExpeditionEventType.nothing]: [
        /*'Čeprav so bile prve raziskave področja obetavne, */'se naša flota vrača domov praznih rok'/*.'*/,
        /*'Ekspedicija je prinesla nazaj */'samo neka čudna majhna bitja'/* iz močvirnatega planeta.'*/,
        /*'Tvoja ekspedicija je */'pridobila znanje o novih praznih prostorih'/*. Niso našli niti enega asteroida ali radiacije, ki bi naredila ekspedicijo zanimivo.'*/,
        /*'Naleteli smo na vesoljsko bitje, */'ki je omamilo vse člane naše posadke'/*. Po tem, ko so spet prišli k sebi, so se odločili, da prekinejo ekspedicijo saj se jim čas izteka in zaloge deuteriuma so prav tako pri koncu.'*/,
        /*'Zaradi odpovedi */'enega od ladijskih motorjev je skoraj prišlo do popolnega uničenja'/*. Na srečo so naši tehniki uspeli preprečiti najhujše. Veliko časa je šlo za popravek in tako se ekspedicija vrača brez rezultatov.'*/,
        /*'Tvoji ekspediciji je uspelo */'narediti veličastne slike super nove'/*. Nič novega ni bilo odkrito na misiji, vendar pa imamo vsaj možnost zmage na tekmovanju "Najboljša slika vesolja", ki bo naslednji mesec v OGame reviji.'*/,
        /*'Ekspedicijska flota je nekaj časa spremljala čuden signal. Na koncu so ugotovili, da */'signal prihaja iz stare sonde'/*, ki so jo prejšnje ekspedicije pustile v vesolju. Sonda je shranjena in nekateri muzeji na domačem planetu so že pokazali zanimanje za njo.'*/,
        /*'Zdaj vsaj vemo, da te rdeče, */'razreda 5 anomalije ne povzročajo samo kaotične efekte'/* na sistem navigacije, ampak tudi povzročajo masivno halucinacijo posadke. Ekspedicija ni prinesla nič nazaj.'*/,
        /*'Tvoja ekspedicija je */'naletela na gravitacijsko polje nevtronske'/* zvezde in je potrebovala nekaj časa, da se ga oslobodi. Zaradi tega je flota porabila ves deuterium in se tako vrača brez rezultatov.'*/,
        /**/'Čuden virus je napadel navigacijski sistem'/*, ko smo zapuščali planet. Naša flota je zaradi tega letela v krogih in mislim, da ni potrebno omeniti, da ekspedicija ni bila uspešna.'*/,
        /*'Naša */'ekspedicija je naletela na čudno kolonijo'/*, ki je bila opuščena že pred leti. Po pristanku in začetku prvih raziskovanj smo naleteli na virus, ki je ubil celotno tedanjo populacijo planeta. Naša ekspedicija se vrača domov, da bi pozdravila svoje člane. Misija je preklicana in se tako vračamo praznih rok.'*/,
        /*'Prišlo je do */'napake na računalniških sistemih'/* in zaradi tega je bila naša flota dolgo odsotna ter se tako vrača brez uspeha.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*'Zadnje sporočilo, ki smo ga dobili, je slika, */'ki prikazuje veličasten vhod v črno luknjo'/*.'*/,
        /*'Edina stvar, ki je */'ostala od ekspedicije je sporočilo preko radia'/*: *zzzzzzzzzz* To *krzzzzzzzz* izgleda *krrzzzzzz* kot *zzzzzzzzzzzzzzzzzzzz....'*/,
        /**/'Eksplozija jedra v eni od tvojih vodilnih ladij je povzročila'/*, da je celotna ekspedicijska flota izgubljena.'*/,
        /**/'Kontakt z ekspedicijsko floto je bil nenadoma izgubljen'/*. Naši znanstveniki se še vedno trudijo, da bi vzpostavili kontakt, vendar zgleda, da je flota izgubljena. '*/,
    ],

    [ExpeditionEventType.trader]: [
        /*'Ekspedicija je vzpostavila */'kontakt s sramežljivo vesoljsko raso'/*. Povedali so nam, da bodo poslali predstavnika s surovinami za zamenjavo.'*/,
        /*'*/'Ekspedicija je zaznala klice na pomoč'/*. Ogromna tovorna ladja je padla v gravitacijsko polje enega planeta. Po tem, ko je bila ladja rešena je njihov kapitan izjavil, da bo oseba, ki jim je pomagala bila od zdaj naprej njihov poseben partner.'*/,
    ],

    [ExpeditionEventType.early]: [
        /**/'Anomalije v motorjih ekspedicijskih ladij'/* so povzročile večjo hitrost in tako se flota vrača hitreje kot je bilo pričakovano. Prvi rezultati prikazujejo, da ni bilo nikakršnih poškodb na sami ladji.'*/,
        /*'Poročila ekspedicije ne poročajo o nikakršnih anomalijah v raziskovalnem sektorju. Vendar pa je flota */'naletela na sončni veter'/* in se zaradi tega vrača prej kot je bilo pričakovano.'*/,
        /*'Novi poveljnik je uspešno */'potoval skozi črno luknjo in tako se naša flota'/* vrača prej kot predvideno. Sama ekspedicija pa ni prinesla nič novega.'*/,
    ],

    [ExpeditionEventType.delay]: [
        /*'Poveljnik ekspedicije je imel slab dan in tako je */'izračunal napačne koordinate kam morajo potovati'/*. Flota je tako zašla iz smeri in potrebno ji bo več časa za povratek nazaj.'*/,
        /**/'Tvoja ekspedicijska flota je zašla v nevihtno območje'/*. Večina elektronike na ladjah je bila tako uničena in pot nazaj bo veliko daljša kot smo pričakovali.'*/,
        /*'Zaradi neznanih */'razlogov je naša ekspedicija letela po čisto napačni poti'/*. Skoraj bi pristala na soncu, a so naši poveljniki zagledali poznan sistem in se pravočasno obrnili. Pot nazaj bo potrebovala nekoliko več časa kot je bilo predvideno.'*/,
        /**/'Solarni veter od zvezde velikanke je povzročil'/*, da je flota zašla. Potrebno bo nekaj preračunavanj poti nazaj, kar pa pomeni zamudo v povratku.'*/,
        /**/'Novi navigacijski sistem ima še vedno napake'/*. Ne samo da je naša flota zašla, ampak je porabila tudi ves deuterium. Na srečo je bila v bližini luna, kjer smo opravili zasilen postanek. Pot nazaj pa bo zaradi tega nekoliko daljša.'*/,
        /*'Ekspedicijska flota je naletela na neznano ladjo, */'ki je ravno v trenutku približevanja eksplodirala'/*. Takoj ko naši mehaniki popravijo škodo, ki so jo naše ladje utrpele se lahko odpravimo domov. Misija je zaradi tega preklicana.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /(?<name>.+) je bil dodan inventarju/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /**/'Obupani pirati so se trudili'/*, da bi zajeli našo ekspedicijo.,'*/,
            /**/'Primitivni vesoljski barbari nas napadajo'/* z nečim kar zgleda kot vesoljsko plovilo. Če kmalu ne prenehajo, bomo primorani vrniti ogenj.'*/,
            /**/'Zasegli smo sporočilo od piratov'/*. Zgleda, da bomo kmalu napadeni.'*/,
            /**/'Boriti smo se morali proti piratom'/*, katerih na srečo ni bilo veliko'*/,
            /*LOCA: si 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Tvoja ekspedicija je */'imela neprijetno srečanje s piratskimi'/* ladjami.'*/,
            /**/'Ekspedicija je naletela na zasedo'/* ! Bitki se ni bilo mogoče izogniti.'*/,
            /*'Signal za pomoč kateremu je flota sledila, */'je bila v resnici zaseda piratov'/*. Bitki se ni bilo mogoče izogniti.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Signal ni prišel od tujega stvora, */'ampak iz baze piratov'/* ! Niti niso bili presenečeni nad našo prisotnostjo.'*/,
            /*'Ekspedicija */'poroča o bitki z neznanimi piratskimi'/* ladjami!'*/,
        ],
        'fled-death-star': [
            /*LOCA: si 'Your expedition stumbled across some pirates, but overwhelmed by the magnitude of your Deathstar, they fled.' */
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /**/'Ladje eksotičnega izgleda'/*, so napadle našo ekspedicijsko floto brez opozorila.'*/,
            /*'Tvoja ekspedicijska flota je imela */'neprijateljsko srečanje z nepoznano raso'/*.'*/,
            /*'Naša ekspedicijska */'flota je bila napadena s strani ladij nepoznanega '/*izvora!'*/,
            /*LOCA: si 'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /**/'Nepoznana rasa napada našo ekspedicijsko floto'/* !*/,
            /*'Tvoja ekspedicijska */'flota je naletela na ozemlje'/*, ki pripada nepoznani vendar zelo agresivni, vesoljcem podobni rasi.'*/,
            /*'Povezava z našo ekspedicijsko */'floto je bila za kratek čas prekinjena'/*. Lahko dešifriramo zadnje sporočilo. Zgleda, da so v težkem napadu z nepoznano raso.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Tvoja ekspedicija je */'naletela na sovražno floto in poroča o hudi'/* bitki!'*/,
            /*'Imeli smo nekaj težav pri pravilni izgovorjavi narečja vesoljcev. naš */'diplomat je po nesreči zaklical'/* `Ogenj!` namesto `Mir!`.'*/,
            /*'Velika */'armada kistalnih ladij nepoznanega izvora se je srečala z našo ekspedicijsko'/* floto. Lahko predvidevamo najhujše.'*/,
        ],
        'fled-death-star': [
            /*LOCA: si 'Your expedition stumbled across some aliens, but overwhelmed by the magnitude of your Deathstar, they fled.' */
        ],
    },
    
    logbookRegex: /Poročilo iz dnevnika:(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'Zgleda, */'da ta del vesolja še ni bil raziskan',
            /*'Ko */'potuješ po delu vesolja, ki še ni bil raziskan'/* , dobiš neverjeten občutek'*/,
        ],
        [ExpeditionDepletionLevel.low]: [
            /*'Zgleda, */'da razen nas še noben človek ni bil v tem delu'/* vesolja'*/,
            /*'Našli */'smo ostanke starih ladij'/* . Nekdo je bil pred nami tukaj.'*/,
            /*Skoraj */'smo se srečali z drugo ekspedicijo'/* . Nismo pričakovali še nekoga tukaj'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*LOCA: si 'Wir haben den Abschluss der Expedition mit den Crewmitgliedern einer zweiten Expeditionsflotte, die im selben Sektor unterwegs war, gefeiert. */'Die haben auch nichts Spannendes zu berichten',
            /*LOCA: si 'Es wurden */'Anzeichen für die Präsenz anderer Expeditionsflotten'/* gefunden.'*/,
            /*LOCA: si 'Es wurde */'friedlicher Funkkontakt zu einigen anderen Expeditionen'/* in diesem Sektor hergestellt.'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /*LOCA: si 'Wenn wir uns zu unsicher fühlen, können wir uns ja */'mit all den anderen Expeditionen'/*, die hier herum fliegen, zusammen tun.'*/,
            /*LOCA: si 'Vielleicht wäre es sinnvoller, hier */'eine Souvenir-Station zu errichten'/* , anstatt noch eine Expedition loszuschicken.'*/,
            /*LOCA: si 'Wenn das so weitergeht, sollte man */'bei all dem Verkehr hier Navigationsbojen'/* aussetzen.'*/,
        ],
    },
};