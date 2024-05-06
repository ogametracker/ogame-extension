import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const ro: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*'Expeditia a fost */'capabila sa captureze si stocheze niste'/* Materie Intunecata.'*/,
            /*'Am gasit */'ramasitele unei nave extraterestre'/* . Pe bordul sau era un recipient mic cu catava Materie Intunecata!'*/,
            /*'Am gasit un */'extraterestru ciudat la bordul unei nave mici care ne-a dat'/* o valiza cu Materie Intunecata in schimbul unor calcule matematice simple.'*/,
            /*'Expediția a */'găsit o navă abandonată ce transporta o cantitate'/* mică de Materie Întunecată. Nu am găsit indicii legate de soarta acestei nave, dar tehnicienii noștrii au reușit să extragă Materia Întunecată.'*/,
            /*'Expeditia a urmarit niste */'semnale ciudate catre un asteroid'/* . In miezul asteroidului a fost gasita o cantitate mica de Materie Intunecata. Asteroidul a fost luat si exploratorii incearca sa extraga Materia Intunecata.,'*/
        ],
        [ExpeditionEventSize.medium]: [
            /*'Expeditia noastra */'indeplineste un experiment unic'/* . Au fost capabil sa stranga Materie Intunecata de la o stea pe cale de disparitie.'*/,
            /*'Expeditia noastra a */'localizat o statie spatiala ruginita'/* , care parea sa pluteasca necontrolata prin afara spatiului pentru un timp indelungat. Statia era total nevolositoare, insa, era niste Materie Intunecata stocata in reactorul lor. Tehnicienii nostrii incearca sa salveze cat pot de mult.'*/,
            /*'Expeditia nostra raporteaza un fenomen ciudat si spectaculos. Acumularea Materiei Intunecata in */'depozitele de energie ale scuturilor navelor'/* . Tehnicienii nostrii incearca sa stocheze cat mai multa Materie Intunecata atat timp cat mai tine fenomenul.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'O deformarea */'hiperspatiala spontana a permis expeditiei'/* tale sa adune o cantitate mare de Materie Intunecata!'*/,
            /*'Expeditia noastra a facut primul contact cu o rasa speciala. Semana cu o creatura */'formata din energie, care se numea Legorian'/* , zburase prin navele de expeditie si a decis sa ajute specia noastra subdezvoltata. O valiza care contine Materie Intunecata a fost materializata pe podul navei!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`(?<name>${darkMatter}) (?<amount>[^\\s]+) au fost capturate`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'Expeditia ta a */'descoperit un asteroid mic din care'/* au putut fi stranse niste resurse.'*/,
            /*'Pe un planetoid izolat am gasit niste */'campuri de resurse usor accesibile'/* si am strans cateva cu succes.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Expeditia ta a */'gasit un convoi antic, plin dar parasit'/* . Cateva din resurse au putut fi salvate.'*/,
            /*'Pe o luna mica cu propria atmosfera expeditia ta a gasit */'niste depozite uriase de resurse in stare bruta'/* . Echipajul de la sol incearca sa ridice incarcatura de comoara nationala.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Curele */'minerale in jurul unei planete necunoscute'/* contin resurse nenumarate. Navele de expeditie se intorc inapoi cu depozitele pline!'*/,
            /*'Flota ta de expeditie */'raporteaza descoperirea unei epave a unei nave extraterestre uriase'/* . Nu au fost capabili sa invete de la tehnologiile lor dar au fost capabili sa divida nava in componentele sale principale si au facut niste resurse folositoare din acestea.'*/
        ],
        regex: (resources: string[]) => new RegExp(`(?<name>${resources.join('|')}) (?<amount>.+) au fost capturate`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*'Am dat peste */'ramasitele unei expeditii precedente'/* ! Tehnicienii nostrii vor incerca sa repare unele din nave.'*/,
            /*'Expediția ta a dat */'peste un cimitir de nave foarte vechi'/* . În hangar au fost găsite câteva nave ce au putut fi salvate. Tehnicienii noștri încearcă să le repare.'*/,
            /*'Expeditia noastra a gasit o */'planeta care a fost aproape distrusa in timpul unui anumit lant de razboaie'/* . Exista nave diferite care plutesc in jurul orbitei. Tehnicienii incearca sa repare cateva dintre ele. Poate ca de asemenea vom primi informatii despre ce s-a intamplat acolo.'*/,
            /*'Am gasit o */'statie de pirati abandonata'/* . Exista niste nave vechi in hangar. Tehnicienii nostrii incearca sa-si dea seama daca unele dintre ele mai sunt folositoare sau nu.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Expeditia noastra a dat */'de un santier naval automat si vechi'/* . Unele nave sunt inca in faza de productie si tehnicienii nostrii in acest moment incearca sa reactiveze generatoarele de energie ale santierului.'*/,
            /*'Am gasit */'resturile dintr-o armada'/* . Tehnicienii s-au dus direct catre majoritatea navelor aproape intacte si incearca sa le repare.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Am gasit */'un cimitir imens de nave'/* . Cativa din tehnicienii de pe flota expeditiei au fost capabili sa repare unele din nave.'*/,
            /*'Am gasit o */'planeta care are resturi ale unei civilizatii'/* . Suntem capabili sa vedem o statie spatiala giganta intacta, orbitand. Unii din tehnicienii tai si piloti merg la suprafata cautand unele nave care inca s-ar putea folosi.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`Urmatoarele nave fac acum parte din flota:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
    },

    [ExpeditionEventType.nothing]: [
        /*'In ciuda primelor, foarte promitatoare scanari ale sectorului, din */'nefericire ne-am intors cu mainile goale',
        /*'Cu exceptia unor */'animale mici de pe o planeta mlastinoasa'/* , expeditia nu aduce nimic interesant din calatorie.'*/,
        /*'Expeditia ta a */'invatat despre pustietatea imensa a spatiului'/* . Nu a existat nici macar un asteroid mic sau radiatie sau particula care sa fi facut aceasta expeditie incitanta.'*/,
        /*'O fiinta */'formata din energie pura s-a asigurat ca toti membrii'/* expeditiei au privit doar la tiparul hipnotizant a ecranelor. Cand majoritatea dintre ei s-au trezit din nou expeditia a trebuit sa fie abandonata deoarece aveau prea putin Deuteriu.'*/,
        /*'Un esec la */'reactorul navei lider aproape ca a distrus'/* intreaga flota de expeditie. Din fericire tehnicienii reusit sa limiteze daunele. Reparatia a durat ceva timp si a fortat expeditia sa se intoarca fara sa rezolve nimic.'*/,
        /*'Expeditia ta a */'facut poze superbe la o super nova'/* . Nimic nou nu a putut fi obtinut din expeditie dar macar sunt sanse bune sa castigi competitia de "Cea mai Buna Poza din Univers" de anu viitor.'*/,
        /*'Flota ta de expeditie a urmarit niste semnale ciudate pentru ceva vreme. La final au observat ca acele */'semnale erau trimise de la o sonda'/* veche care a fost trimisa acum multe generatii pentru a intampina specile straine. Sonda a fost salvata si ceva muzee de pe planeta ta mama deja si-au exprimat interesul.'*/,
        /*'Ei bine, acum stim ca */'acele anomalii rosii, clasa 5'/* nu doar ca au efect rau asupra navigatiei sistemelor navelor dar de asemenea genereaza o halucinare masiva asupra echipajului. Expeditia nu a adus nimic inapoi.'*/,
        /*'Expeditia ta aproape că a nimerit in câmpul de */'gravitație a unei stele neutronice'/* . Din aceasta cauza s-a consumat mult Deuteriu si flota de expeditie a trebuit sa se intoarca fara nici un rezultat.'*/,
        /*'Un */'virus de calculator a atacat sistemele de navigare'/* cu putin dupa plecarea de pe sistemul nostru solar. Acest lucru a cauzat flota de expeditie sa zboare in cercuri. Nu mai e nevoie sa spunem ca expeditia nu a fost de prea mare succes.'*/,
        /*'Echipa noastră de expediție a */'ajuns la o colonie abandonată de milenii'/* . După ce au aterizat, echipajul a fost infectat cu un virus necunoscut. Acum știm ce a omorât această colonie. Expediția se întoarce acasă pentru a-și trata membrii bolnavi. Din păcate, a trebuit să abandonăm misiunea și ne întoarcem cu mâna goală.'*/,
        /*'Cineva a instalat cu joc */'strategic vechi in toate calculatoarele'/* de pe nave. Flota de expeditie a fost plecata pentru un timp indelungat dar nu a fost prea productiva din aceasta cauza.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*'Ultimul lucru pe care il avem de la expeditie a fost o */'fotografie foarte bine facuta cu deschiderea unei gauri negre',
        /*'Singurul lucru ramas de la */'expeditie a fost urmatoarea transmisie radio'/* : Zzzrrt Doamne! Krrrzzzzt Acea zrrrtrzt arata krgzzzz ca Krzzzzzzzztzzzz...'*/,
        /*'O supra alimentare a miezului navei mama duce la o reactie in lant care */'distruge intr-o explozie destul de spectaculoasa'/* intreaga flota de expeditie.'*/,
        /*'Flota de */'expeditie nu a sarit inapoi in cartier'/* . Academicienii nostrii inca incearca sa afle ce s-a intamplat dar se pare ca flota este pierduta pentru totdeauna.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*'Flota ta de expeditia a facut */'contactul cu o rasa de extraterestrii timizi'/* . Acestia anunta ca wiykd-ul lor a trimis un reprezentant cu bunuri sa faca schimb pentru lumile voastre.'*/,
        /*'Expeditia */'ta a primit un semnal de urgenta'/* . Un mega cargo a fost capturat pe un camp de gravitatie puternic generat de un planetoid. Dupa ce cargoul a fost eliberat cu succes capitanul a anuntat fericit ca persoana care i-a salvat va fi clientul lor preferat si exclusiv.'*/,
    ],

    [ExpeditionEventType.early]: [
        /*'O */'neasteptata explozie la motoarele din spate'/* a grabit intoarcerea expeditiei, flota se intoarce acasa mai repede decat trebuia. Primele rapoarte arata ca nu au nimic interesant sa raporteze.'*/,
        /*'Expeditia ta nu raporteaza nici o anormalitate in sectorul explorat. Dar flota a ajuns in */'ceva vant al Soarelui in timp ce se intorcea'/* . Din aceasta cauza calea de intoarcere a fost grabita cu mult. Expeditia ta se intoarce acasa putin mai devreme.'*/,
        /*'Noul si putin indraznetul */'comandant a traversat cu succes printr-o carie instabila'/* pentru a scurta zborul inapoi! Dar, expeditia nu a adus nimic nou.'*/,
    ],

    [ExpeditionEventType.delay]: [
        /*'Liderul navigatiei a avut o zi proasta si asta a */'cauzat expeditiei sa ajunga la calculari gresite'/* . Nu numai ca flota a aterizat intr-un loc complet diferit dar calea inapoi necesita mult mai mult timp.'*/,
        /*'Expediția a */'ajuns în mijlocul unei furtuni de particule'/* . Aceste energii se supra încarcă și distrug sistemele electronice ale navelor. Mecanicii tăi au reușit să salveze flota de expediție, dar drumul înapoi va fi puțin mai lung.'*/,
        /*'Datorita motivelor */'necunoscute saltul expeditiei a mers total gresit'/* . Aproape ca a aterizat in inima Soarelui. Din fericire a aterizat intr-un sistem cunoscut, saltul inapoi va dura mai mult totusi.'*/,
        /*'Vantul unei */'stele ale unui gigant rosu a ruinat'/* saltul expeditiei si va dura ceva timp sa calculeze introarcerea saltului. Nu exista nimic pe langa pustietatea dintre stele si reactor. Flota se va intoarce mai tarziu decat este asteptata.,'*/,
        /*'Noul modul de */'navigare inca se lupta cu unele probleme'/* . Saltul expeditiei nu numai ca a condus navele in directia total gresita dar a folosit si tot Deuteriul. Din fericire saltul flotei i-a dus destul de aproape de luna planetei stea. Putin dezamagit expeditia se intoarce acum fara impuls. Calea de intoarcere va dura ceva mai mult.'*/,
        /*'Nava mama a */'expeditiei a facut o coliziune cu o nava straina cand s-a teleportat'/* direct in aceasta fara nici un avertisment. Nava straina a explodat si stricaciunile cauzate navei principale au fost substantiale. Cand reparatile necesare sunt facute flotele o sa-si inceapa calea de intoarcere deoarece expeditia nu mai poate continua in acele conditii.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /(?<name>.+) a fost adăugat la inventar/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*'Cativa pirati ai */'spatiului foarte disperati au incercat'/* sa-ti captureze flota de expeditie.'*/,
            /*'Niste pirati */'ne ataca cu nave inferior tehnologice'/* .Daca focul devine serios vom fi nevoiti sa ripostam.'*/,
            /*'Am prins un */'mesaj radio de la niste pirati beti'/* . Se pare ca vom fi atacati in curand.'*/,
            /*'Am fost */'nevoiti sa ne luptam cu niste pirati care'/* , din fericire, erau putini.'*/,
            /*TODO: ro 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*TODO: ro 'Deine Expeditionsflotte hatte ein */'unschönes Zusammentreffen mit einigen Weltraumpiraten'/*.'*/,
            /*'Am intrat direct intr-o */'ambuscada pusa de ceva buccaneri ai stelelor'/* ! Lupta nu a putut fi evitata!'*/,
            /*'Semnalul de urgenta pe care l-a urmat */'expeditia a fost pus de ceva buccaneri ai stelelor'/* . O lupta nu a putut fi evitata.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*TODO: ro 'Die aufgefangenen Signale stammten nicht von Fremdwesen, sondern */'von einer geheimen Piratenbasis'/* ! Die Piraten waren von unserer Anwesenheit in ihrem Sektor nicht besonders begeistert.'*/,
            /*TODO: ro 'Die Expeditionsflotte meldet */'schwere Kämpfe mit nicht-identifizierten Piratenschiffen'/*.'*/,
        ],
        'fled-death-star': [
            /*TODO: ro 'Deine Expedition */'ist auf Aliens getroffen. Überwältigt von der Stärke deines Todessterns'/* , sind sie jedoch geflohen.'*/
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*'Niste nave */'aparent exotice au atacat flota de expeditie'/* fara nici un avertisment!'*/,
            /*'Flota ta de expeditie a avut un */'prim contact mai putin prietenos cu o specie necunoscuta',
            /*'Expeditia */'noastra a fost atacata de un grup de nave necunoscute',
            /*TODO: ro 'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'O */'specie necunoscuta iti ataca expeditia',
            /*'Flota ta de */'expeditie pare sa fi zburat deasupra unui teritoriu care apartine'/* unei rase necunoscuta si razboinica.'*/,
            /*TODO: ro 'Die Verbindung zu unserer Expeditionsflotte wurde kurzfristig gestört. Sofern wir die letzte Botschaft richtig entschlüsselt haben, steht die Flotte unter schwerem Feuer; die */'Aggressoren konnten nicht identifiziert werden'/*.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Expeditia ta a dat peste o */'flota de invazie extraterestra si raporteaza'/* lupte crancene!'*/,
            /*TODO: ro 'Wir hatten Mühe den korrekten */'Dialekt einer Alienrasse'/* auszusprechen. Unser Diplomat rief daher "Feuer!" statt "Friede!".'*/,
            /*TODO: ro 'Ein großer */'Verband kristalliner Schiffe unbekannter Herkunft'/* hält direkten Kollisionskurs mit unserer Expeditionsflotte. Wir müssen nun wohl vom Schlimmsten ausgehen.'*/,
        ],
        'fled-death-star': [
            /*'Expediția */'ta a dat peste niște extratereștri dar aceștia'/* , intimidați de mărimea RIP-ului tău, au fugit.'*/
        ],
    },

    logbookRegex: /Inregistrare din primul jurnal de bord al comunicantilor:(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'Se pare ca aceasta */'parte a universului nu a fost explorata inca',
            /*'Ne simtim grozav sa fim */'primii care calatoresc printr-un sector'/* neexplorat.'*/,
        ],
        [ExpeditionDepletionLevel.low]: [
            /*'Se pare ca nici un om nu a */'fost prin aceasta parte a galaxiei inainte',
            /*'Am gasit */'campuri de ramasite ale navelor spatiale antice'/* . Nu suntem primii aici.'*/,
            /*'Aproape ca am avut o */'coliziune cu o alta flota de expeditie'/* . Nu credeam ca vor mai fi si altii aici.'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*TODO: ro 'Wir haben den Abschluss der Expedition mit den Crewmitgliedern einer zweiten Expeditionsflotte, die im selben Sektor unterwegs war, gefeiert. */'Die haben auch nichts Spannendes zu berichten',
            /*TODO: ro 'Es wurden */'Anzeichen für die Präsenz anderer Expeditionsflotten'/* gefunden.'*/,
            /*TODO: ro 'Es wurde */'friedlicher Funkkontakt zu einigen anderen Expeditionen'/* in diesem Sektor hergestellt.'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /*TODO: ro 'Wenn wir uns zu unsicher fühlen, können wir uns ja */'mit all den anderen Expeditionen'/*, die hier herum fliegen, zusammen tun.'*/,
            /*TODO: ro 'Vielleicht wäre es sinnvoller, hier */'eine Souvenir-Station zu errichten'/* , anstatt noch eine Expedition loszuschicken.'*/,
            /*TODO: ro 'Wenn das so weitergeht, sollte man */'bei all dem Verkehr hier Navigationsbojen'/* aussetzen.'*/,
        ],
    },
};