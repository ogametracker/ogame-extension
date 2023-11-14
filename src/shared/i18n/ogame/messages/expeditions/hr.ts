import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const hr: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*'Ekspedicija */'je uspjela pronaći i sačuvati Crnu Materiju',
            /*'Pronašli smo */'ostatke vanzemaljskog broda'/* . Na njemu je bilo malo spremište Crne Materije.'*/,
            /*'Sreli smo */'čudnog vanzemaljca koji nam je dao kutiju'/* Crne Materije u zamijenu za neke jednostavne matematičke formule.'*/,
            /*'Naša*/' ekspedicija je zauzela napušteni brod s kojeg je transportirala'/* malu količinu Crne Materije. Ne pronalazimo nikakve tragove šta se dogodilo posadi ovog broda, ali tehničari su uspjeli spasiti Crnu Materiju.'*/,
            /*'Ekspedicija je pratila neke */'čudne signale prema jednom asteroidu'/*. U jezgri samog asteroida je pronađena mala količina Crne Materije. Istraživači su uzeli asteroid radi daljnjeg istraivanja i izvlačenja Crne Materije.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Naša je ekspedicija */'napravila jedinstveni eksperiment'/* . Uspjela je uzeti Crnu Materiju iz umiruće zvijezde.'*/,
            /*'Naša ekspedicija je */'locirala staru hrđavu svemirsku stanicu koja već duže vrijeme nekontrolirano'/* ide svemirom. Stanica kao takva je beskorisna, ali, izgleda da ima Crne Materije u njezinom reaktoru. Tehničari pokušavaju izvući to je više moguće.'*/,
            /*'Naša ekspedicija izvještava o spektakularnom fenomenu. Akumulacija Crne Materije u energetstkim spremištima brodskih štitova. Naši tehničari */'pokušavaju spremiti to više Materije dok fenomen'/* još traje.'*/,
        ],
        [ExpeditionEventSize.large]: [
            'Spontana deformacija svemira'/* omogućila je tvojoj ekspediciji da pronađe velike količine Crne Materije.'*/,
            /*'Naša ekspedicija je uspostavila prvi kontakt sa specijalnom rasom. Izgledalo je kao biće */'napravljeno od energije i nazivalo se Legorian'/* , proletjelo je kroz ekspedicijske brodove i na kraju odlučilo pomoći našoj nerazvijenoj rasi. Kutija sa Crnom Materijom se stvorila na brodu.'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`(?<amount>[^\\s]+) (?<name>${darkMatter}) je ukradeno`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'Tvoja ekspedicija je */'pronašla mali asteroid'/* iz kojeg se mogu izvaditi neki resursi.'*/,
            /*'Na nekom */'izoliranom planetoidu'/* našli smo lako dostupne resurse koje smo uspjeli opljačkati'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Vaša ekspedicija je pronašla prastari, */'pun resursa napušteni konvoj'/*. Nešto novih resursa je moglo biti spašeno.'*/,
            /*'Tvoja ekspedicija je na */'malom mjesecu nšla ogromna spremišta resursa'/* . Posada na mjesecu pokušava utovariti sve resurse u brodove.'*/,
        ],
        [ExpeditionEventSize.large]: [
            'Mineralni pojas oko nepoznate planete'/* sadrži neprocenjive resurse. Ekspedicijski brodovi se vraćaju nazad i njihovi spremnici su prepuni'*/,
            /*'Izvještaj ekspedicijske flote govori o */'otkrivanju ruševina ogromnog vanzemaljskog broda'/* . Nisu bili u mogućnosti da nauče išta iz njihove tehnologije ali su podijelili brod u dijelove i izvukli dosta korisnih resursa.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`(?<amount>.+) (?<name>${resources.join('|')}) je ukradeno`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*'Našli */'smo ostatke prijašnje ekspedicije'/* ! Naši tehničari će pokušati popraviti neke brodove.'*/,
            /*'Vaša ekspedicija je */'pronašla staru tvrđavu koja je napuštena prije par godina'/* . U hangaru su pronađeni neki brodovi. Tehničari pokušavaju osposobiti te brodove za let.'*/,
            /*'Naša ekspedicija je */'pronašla planet koji je skoro uništen u prijašnjim ratovima'/* . U njegovoj orbiti plutaju neki brodovi koje naši tehničari pokušavaju popraviti.'*/,
            /*'Našli smo */'staru piratsku stanicu'/* u kojoj su neki brodovi. Naši tehničari pokušavaju utvrditi jesu li još neki brodovi korisni ili ne.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Naša ekspedicija je našla */'staro automatsko brodogradilište'/*. Neki od brodova su još uvijek u produkciji pa naši tehničari pokušavaju popraviti brodogradilite da se ti brodovi dovrše.'*/,
            /*'Našli */'smo ostatke armade'/* . Tehničari su otišli direktno do netaknutih brodova da ih pokušaju pokrenuti opet.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Našli */'smo ogromno groblje brodova'/* . Neki naši tehničari iz ekspedicijske flote su uspjeli opet pokrenuti neke brodove.'*/,
            /*'Našli smo */'planetu sa ostacima civilizacije'/* . Vidjeli smo veliku netaknutu svemirsku stanicu kako orbitira oko planete. Neki naši tehničari i piloti su otišli na površinu u potragu za brodovima koje bi mogli iskoristiti.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`Sljedeći brodovi su sada dio vaše flote:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
    },

    [ExpeditionEventType.nothing]: [
        /*'Iako su prva skeniranja sektora bila dobra flota se nažalost */'vratila praznih ruku'/*.'*/,
        /*'Ekspedicija nije vratila ništa drugo osim nekih čudnih i malih stvorenja sa */'nepoznatog močvarnog planeta'/*.'*/,
        /*'Vaša ekspedicija je */'prikupila nova saznanja o praznini univerzuma'/* . Nije bilo čak niti jednog malo asteroida koji bi mogao učiniti ovu ekspediciju uzbudljivom.'*/,
        /*'Živo */'biće napravljeno od čiste energije se potrudilo'/* da svi članovi ekspedicije budu hipnotizirani tokom putovanja. Kada se većina njih osvijestila shvatili su da su potrošili previše deuterija i da se moraju vratiti nazad.'*/,
        /*'Zbog otkazivanja */'brodskog reaktora jednog od brodova skoro je došlo'/* do uništenja cijele flote. Na svu sreću tehničari su uspjeli spriječiti najgore. Dosta vremena je potrošeno na popravak i zbog toga se ekspedicija vratila bez rezultata.'*/,
        /*'Vasa ekspedicija je snimila */'prelijepe slike super nove'/*. Ništa novo nije moglo biti prikupljeno na ekspediciji osim dobre šanse da se pobijedi na takmičenju za "Najbolju sliku univerzuma".'*/,
        /*'Ekspedicijska */'flota je pratila čudan signal neko vrijeme'/* . Na kraju su oktrili da taj signal dolazi od stare sonde koju su poslale prijašnje generacije da dočekuje strane brodove. Sonda je sačuvana i neki muzeji na vašem matičnom planetu su pokazali interes za nju.'*/,
        /*'Sada znamo da te crvene */'anomalije klase 5'/* nemaju samo kaotične efekte za brodsku navigaciju nego i hipnotiziraju cijelu posadu. Ekspedicija nije vratila ništa natrag.'*/,
        /*'Vaša ekspedicija je naletjela u */'gravitacijsko polje neutronske'/* zvijezde i bilo joj je potrebno vremena da se oslobodi. Zbog toga je flota potrošila sav Deuterij i morala se vratiti bez rezultata.'*/,
        /*'Čudni računalni */'virus je zarazio brodsku navigaciju'/* ubrzo nakon počekta ekspedicije. To je uzrokovalo da se ekspedicijska flota vrti u krug. Suvišno je spominjati kako misija nije bila uspješna.'*/,
        /*'Naš ekspedicijski tim je naišao na čudnu koloniju koja je već jako dugo napuštena. Nakon slijetanja našu ekipu je pogodila */'velika temperatura od stranog virusa'/*. Kasnije su saznali da je taj virus pobio cijelu kolonizaciju koja je živjela na koloniji. Naš tim se sada vraća doma, i nažalos ne nosi ništa nazad.'*/,
        /*'Netko je */'instalirao staru stratešku'/* igru u brodsko računalo. Ekspedicijska flota je bila dugo odsutna ali zbog igre nije vratila ništa produktivno.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*'Jedina stvar koja je ostala od cijele ekspedicije je vrlo dobra slika */'crne rupe koja se stvara'/*.'*/,
        /*'Jedino što je */'ostalo od ekspedicije je radio poruka'/* : *zzzzzzzzzz* To *krzzzzzzzz* izgleda *krrzzzzzz* kao *zzzzzzzzzzzzzzzzzzzz...'*/,
        /*'Eksplozija jezgre jednog od tvojih brodova vodi do lančane reakcije u kojoj */'spektakularnom eksplozijom nestaje cijela ekspedicijska'/* flota.'*/,
        /*'Ekspedicijska flota */'se nije vratila na planetu'/* . Naši istraživači jos pokušavaju otkriti šta se dogodilo ali izgleda da je flota zauvijek izgubljena.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*'Vaša ekspedicijska flota je */'uspostavila kontakt sa sramežljivom vanzemaljskom rasom'/* . Objavili su da će poslati predstavnika sa resursima za razmjenu'*/,
        /*'Vaša ekspedicija je primila signal za hitne slučajeve. Ogroman transporter je upao u gravitacijsko polje jednog planetoida. Nakon to je transporter spašen njihov kapetan je izjavio da će */'osoba koja ih je spasila odsada biti njihov poseban klijent',
    ],

    [ExpeditionEventType.early]: [
        /*'Neke */'anomalije u motorima ekspedicijskih brodova uzrokovale'/* su povećanje brzine stoga se flota vraća prije nego očekivano. Prvi izvještaji pokazuju da nisu skupili ništa vrijedno spomena.'*/,
        /*'Izvještaji ekspedicije ne */'javljaju nikakve anomalije u istraženom sektoru'/* . Ali flota je naletjela na sunčane vjetrove i zbog toga se flota vraća prije nego očekivano.'*/,
        /*'*/'Novi i odvažni komander'/* je uspješno putovao kroz crvotočinu da skrati put povratka flote. Međutim, ekspedicija nije donjela ništa novo.'*/,
    ],

    [ExpeditionEventType.delay]: [
        'Navigator glavnog broda je imao loš dan i krivo izračunao'/* koordinate na koje treba ići. Ne samo da je flota krivo sletila negdje drugdje, nego joj i treba više vremena za povratak natrag.'*/,
        /*'Ekspedicija je završila u */'sektoru sa olujama'/*. To je potaklo spremnike energije na preopterećenje i većina sistema u brodu se srušilo. Mehaničari su uspjeli izbjeći najgore ali povratak ekspedicije će se znatno odužiti.'*/,
        /*'Zbog */'nepoznatih razloga ekspedicijski skok je završio na krivom'/* mjestu. Zamalo u sam centar sunca. Na svu sreću flota je završila u poznatom sistemu ali skok nazad će potrajati malo duže.'*/,
        /*'Gravitacija */'crvenog diva uništila je skok ekspedicijske'/* flote i trebati će malo vremena da se flota vrati nazad, stoga će joj trebati više vremena nego očekivano.'*/,
        /*'Novi */'navigacijski modul još uvijek ima nekih problema'/* . Ne samo da je ekspedicijski skok završio na krivom mjestu nego je i potrošio sav Deuterij. Bitno razočarana ekspedicijska flota se vraća bez impulsa. Povratak će trajati duže nego očekivano.'*/,
        /*'Ekspedicijska flota se susrela sa neprijateljskim brodom koji je pojavio bez ikakvog upozorenja. */'Neprijateljski brod je eksplodirao'/* i eksplozijom uzrokovao štetu na vašim brodovima. Dok god se ne poprave svi brodovi ekspedicijska flota ne može ići natrag pa će zbog toga povratak potrajati duže.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /\[predmet\](?<hash>.+) je dodan u spremnik/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*'Neki */'opaki pirati su pokušali zarobiti'/* vašu ekspedicijsku flotu.'*/,
            /*'Neki */'primitivni svemirski barbari nas napadaju'/* nečime što izgleda kao brod. Ako ne prestanu uskoro morati ćemo otvoriti vatru na njih.'*/,
            /*'Primili smo */'radio poruku od nekog pijanog pirata'/* . Izgleda da će nas netko napasti uskoro.'*/,
            /*'Flota se morala */'boriti protiv nekoliko pirata'/* kojih je na sreću bilo jako malo.'*/,
            /*LOCA: hr 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Vaša ekspedicija */'je imala neugodan susret sa piratima',
            /*'Flota je */'naletjela na skrivene odmetnike'/* . Borba je bila neizbježna.'*/,
            /*'Signal koji je vaša flota */'pratila je na bio lažan signal koji su slali pirati'/* . Borba je bila neizbježna.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Zabilježeni signal je */'došao sa skrivene piratske baze'/* ! Nisu bili iznenađeni vašom prisutnoću u njihovom sektoru.'*/,
            /*'Ekspedicija izvještava o */'teškoj borbi protiv neidentificiranih piratskih brodova',
        ],
        'fled-death-star': [
            /*LOCA: hr 'Your expedition stumbled across some pirates, but overwhelmed by the magnitude of your Deathstar, they fled.' */
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*'Neki */'brodovi egzotičnog izgleda su napali tvoju ekspedicijsku'/* flotu bez ikakvog upozorenja!'*/,
            /*'Tvoja ekspedicijska flota */'nije napravila prijateljski prvi kontakt'/* sa nepoznatim vrstama'*/,
            /*'Našu ekspediciju je */'napala mala skupina nepoznatih brodova',
            /*LOCA: hr 'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            'Nepoznate vrste napale su tvoju ekspediciju',
            /*'Tvoja ekspedicijska flota */'je ušla u teritorij koji pripada nepoznatoj ali vrlo agresivnoj'/* rasi izvanzemaljaca'*/,
            /*'Veza sa tvojom ekspedicijskom flotom je prekinuta. Uspjeli smo dešifrirati njihovu zadnju poruku. Pod teškim napadom su, */'neprijatelj se ne može identificirati',
        ],
        [ExpeditionEventSize.large]: [
            /*'Tvoja ekspedicija je naletjela na invaziju */'izvanzemaljske flote i došlo je do velike bitke',
            /*LOCA: hr 'Wir hatten Mühe den korrekten */'Dialekt einer Alienrasse'/* auszusprechen. Unser Diplomat rief daher "Feuer!" statt "Friede!".'*/,
            /*LOCA: hr 'Ein großer */'Verband kristalliner Schiffe unbekannter Herkunft'/* hält direkten Kollisionskurs mit unserer Expeditionsflotte. Wir müssen nun wohl vom Schlimmsten ausgehen.'*/,
        ],
        'fled-death-star': [
            /*LOCA: hr 'Your expedition stumbled across some aliens, but overwhelmed by the magnitude of your Deathstar, they fled.' */
        ],
    },

    logbookRegex: /Izvadak iz dnevnika oficira za komunikaciju:(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'Izgleda da */'ovaj dio univerzuma nije još istražen',
            /*'Izvandredan je osjećaj */'putovati dijelom sektora koji'/* jo nije istraen'*/,
        ],
        [ExpeditionDepletionLevel.low]: [
            /*'Izgleda da */'nijedan čovjek nije bio u ovom dijelu galaksije'/* prije nas'*/,
            /*'Našli smo ostatke prastarih svemirskih brodova. */'Netko je bio ovdje prije nas',
            /*'Skoro smo se susreli sa drugom ekspedicijskom flotom. */'Nisam očekivao da bi nekoga'/* moglo biti ovdje'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*'Susreli smo članove druge ekspedicijske flote. */'Nisu nam rekli ništa korisno',
            /*'Našli smo dokaz da ima još */'ekspedicijskih flota prisutnih ovdije',
            /*'Uspostavili smo */'prijateljski kontakt sa drugom ekspedicijskom flotom',
        ],
        [ExpeditionDepletionLevel.high]: [
            /*LOCA: hr 'Wenn wir uns zu unsicher fühlen, können wir uns ja */'mit all den anderen Expeditionen'/*, die hier herum fliegen, zusammen tun.'*/,
            /*LOCA: hr 'Vielleicht wäre es sinnvoller, hier */'eine Souvenir-Station zu errichten'/* , anstatt noch eine Expedition loszuschicken.'*/,
            /*LOCA: hr 'Wenn das so weitergeht, sollte man */'bei all dem Verkehr hier Navigationsbojen'/* aussetzen.'*/,
        ],
    },
};