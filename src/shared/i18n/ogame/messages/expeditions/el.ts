import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const el: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*'Η αποστολή */'εξερεύνησης δεν μπόρεσε να εντοπίσει αντιύλη', //TODO: ist das die Nachricht darunter?
            /*TODO: el 'Der Expedition ist es gelungen, */'ein wenig Dunkle Materie einzufangen'/* und zu konservieren.'*/,
            /*TODO: el 'Wir haben die */'Überreste eines Alien-Schiffes'/* gefunden. An Bord war ein kleiner Behälter mit Dunkler Materie!'*/,
            /*'Συναντήσαμε εν παράξενο ον, */'που μας πρόσφερε ένα κιβώτιο με αντιύλη ως αντάλαγμα'/* , για μερικούς απλούς μαθηματικούς υπολογισμούς'*/,
            /*'Η αποστολή */'εξερεύνησης κατέλαβε ένα σκάφος-φάντασμα'/* . Δε στάθηκε δυνατό μάθουμε τι απέγινε το πλήρωμα αλλά οι τεχνικοί μπορέσαν και συγκέντρωσαν την αντιύλη που μετέφερε.'*/,
            /*'Η εξερευνητική αποστολή ακολούθησε κάποιες */'παράξενες ενδείξεις που προέρχοταν από ένα αστεροϊδή'/* . Στο πυρήνα του, εντοπίστηκε αντιύλη. Η ερευνητές πήραν τον αστεροϊδή για να προσπαθήσουν να εξορύξουν την αντιύλη.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*TODO: el 'Unserer Expedition ist */'ein einmaliges Experiment gelungen'/*:'*/,
            /*'Η αποστολή εξερεύνησης, */'εντόπισε ένα εγκαταλειμένο διαστημικό σταθμό'/* , ο οποίος περιφερόταν ανεξέλεγκτα στο διάστημα για αρκετό καιρό. Ο ίδιος ο σταθμός δεν είναι χρήσιμος, ωστώσο εντοπίστηκε ποσότητα αντιύλης στους αντιδραστίρες. Οι τεχνικοί προσπαθούν να περισυλλέξουν όσο το δυνατόν περισσότερη ποσότητα.'*/,
            /*TODO: el 'Unsere Expedition meldet ein seltsames spektrales Phänomen. Dies führte unter anderem dazu, dass sich in den */'Energiespeichern der Schiffsschilde Dunkle Materie'/* bildete. Unsere Techniker versuchen nun, solange das Phänomen noch anhält, möglichst viel dieser Dunklen Materie zu konservieren.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*TODO: el 'Eine */'spontane Hyperraumverzerrung'/* hat es deiner Expedition ermöglicht, eine große Menge dunkler Materie sicherzustellen!'*/,
            /*TODO: el 'Unsere Expedition meldet einen ersten Kontakt der besonderen Art. Anscheinend hat */'eine Energiekreatur, die sich Legorianer nannte'/*, die Schiffe der Expedition durchflogen und dann beschlossen, der unterentwickelten Spezies ein wenig auszuhelfen - es materialisierte sich ein Behälter mit dunkler Materie an Bord der Brücke!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`(?<name>${darkMatter}) (?<amount>[^\\s]+) αποκτήθηκαν`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'Σε ένα απομονωμένο */'αστεροϊδή ανακαλύψαμε κάποιους εύκολα προσβάσιμα πεδία'/* πόρων και εξορύξαμε με επιτυχία μερικούς.'*/,
            /*TODO: el 'Auf einem abgelegenen Planetoiden wurden */'einige leicht zugängliche Ressourcenfelder'/* gefunden und erfolgreich Rohstoffe gewonnen'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*TODO: el 'Deine Expedition fand einen uralten, voll beladenen, aber */'menschenleeren Frachterkonvoi'/*. Einige Ressourcen konnten geborgen werden.'*/,
            /*'Σε ένα */'μικρό φεγγάρι με δική του ατμόσφαιρα'/* , η αποστολή εντόπισε τεράστιες ποσότητες ακατέργαστων πόρων. Το πλήρωμα βρίσκεται στο έδαφος και προσπαθεί να φορτώσει αυτό το φυσικό θυσαυρό.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*TODO: el 'Ein */'Mineraliengürtel um einen unbekannten Planeten'/* enthielt Unmengen an Rohstoffen. Die Expeditionsflotte meldet volle Lager!'*/,
            /*TODO: el 'Deine Expeditionsflotte meldet den */'Fund eines riesigen Alien-Schiffswracks'/*. Mit der Technologie konnten sie zwar nichts anfangen, aber das Schiff ließ sich in seine Einzelteile zerlegen, wodurch man wertvolle Rohstoffe gewinnen konnte.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`(?<name>${resources.join('|')}) (?<amount>.+) αποκτήθηκαν`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*'Διερχόμαστε */'διαμέσου των απομειναριών κάποιας προηγούμενης αποστολής'/* . Οι τεχνικοί μας θα προσπαθήσουν να θέσουν κάποια σκάφη σε πάλι λειτουργία.'*/,
            /*'Η αποστολή */'εξερεύνησης εντόπισε ένα εγκαταλελειμένο πύύργιο'/* , κάποιας παλιάς δι & γτητας. Στο υπόστεγο βρέθηκαν μερικά σκάφη. Οι τεχνικοί προσπαθούν να θέσουν τα πιο καλοδιατηρημένα σε λειτουργία.'*/,
            /*'Η αποστολή εξερεύνησης εντόπισε ένα πλανήτη, */'ο οποίος είναι σχεδόν καταστραμένος'/* , προφανώς από κάποιες πολεμικές συγκρούσεις. Υπάρχουν αρκετά σκάφη που περιφέρονται σε τροχιά. Οι τεχνικοί προσπαθούν να επισκευάσουν μερικά από αυτά. .'*/,
            /*'Εντοπίσαμε */'μια εγκαταλελειμένη βάση πειρατών'/* . Μερικά σκάφη βρίσκονται στα υπόστεγα. Οι τεχνικοί μας κάνουν τους απαραίτητους ελέγχους για να δουν αν μερικά από αυτά μπορούν να μας φανούν χρήσιμα ή όχι.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*TODO: el 'Unsere Expedition stieß auf eine */'alte automatische Schiffswerft'/*. Einige Schiffe sind noch in der Produktionsphase und unsere Techniker versuchen, die Energieversorgung der Werft wiederherzustellen.'*/,
            /*'Εντοπίσαμε */'τα απομεινάρια μιας αρμάδας'/* . οι τεχνικοί πήγαν κατευθείαν στα πιο ανέπαφα σκάφη προσπαθώντας να τα θέσουν ξανά σε λειτουργία.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*TODO: el 'Wir haben einen */'riesigen Raumschiffsfriedhof'/* gefunden. Einigen Technikern der Expeditionsflotte ist es gelungen, das ein oder andere Schiff wieder in Betrieb zu nehmen.'*/,
            /*TODO: el 'Wir haben einen Planeten mit */'Resten einer Zivilisation'/* entdeckt.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`Τα ακόλουθα σκάφη, αποτελούν πλέον μέρος του στόλου:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
    },

    [ExpeditionEventType.nothing]: [
        /*'Δυστυχώς, παρά τις πολλά */'υποσχόμενες αρχικές ενδείξεις στο τομέα'/*, επιστρέψαμε πίσω με άδεια χέρια...'*/,
        /*'Εκτός από μερικά περίεργα, */'μικρά ζώα από έναν άγνωστο ελώδη πλανήτη'/* , αυτή η αποστολή δεν φέρνει τίποτα συγκλονιστικό επιστρέφοντας από το ταξίδι.'*/,
        /*TODO: el 'Deine Expedition hat wortwörtlich mit der */'Leere des Alls'/* Bekanntschaft gemacht. Es gab nicht einmal einen kleinen Asteroiden oder Strahlung oder Partikel oder irgendetwas, das diese Expedition aufregend gestaltet hätte.'*/,
        /*'Μια οντότητα, */'αποτελούμενη από καθαρή ενέργεια'/* , φρόντισε ώστε τα πληρώματα της αποστολής να αποροφηθούν κοιτάζοντας σαν υπνωτισμένοι τα σχέδια που δημιουργούσε στις οθόνες. Όταν οι περισσότεροι συνήλθαν, έπρεπε να ματαιώσουν την αποστολή καθώς είχε απομείνει ελάχιστο Δευτέριο.'*/,
        /*'Μια αποτυχία στον */'αντιδραστήρα του ηγούμενου σκάφους της αποστολής'/* , παραλίγο να καταστρέψει όλο το στόλο. Ευτυχώς οι μηχανικοί ήταν κάτι παραπάνω από ικανοί και μπόρεσαν να αποφύγουν τα χειρότερα. Οι επισκευές απαίτησαν αρκετό χρόνο και υποχρέωσαν την αποστολή να επιστρέψει χωρίς να έχει επιτύχει τίποτα.'*/,
        /*TODO: el 'Deine Expedition hat */'wunderschöne Bilder einer Supernova'/* gemacht. Wirklich neue Erkenntnisse hat diese Expedition jedoch nicht gebracht. Aber man hat gute Chancen auf den Sieg im diesjährigen Bestes-Bild-des-Universums-Wettbewerb!'*/,
        /*'Η αποστολή σας ακολούθησε περίεργα σήματα για κάποιο διάστημα. Στο τέλος */'διαπίστωσαν ότι τα σήματα εκπέμπονταν από ένα παλιό κατασκοπευτικό'/* που είχε αποσταλεί γενεές πριν να συναντήσει ξένα είδη. Το κατασκοπευτικό διασώθηκε και κάποια μουσεία από τον κεντρικό σας πλανήτη, έχουν ήδη εκφράσει το ενδιαφέρον τους.'*/,
        /*'Τώρα λοιπόν γνωρίζουμε, πως αυτές οι */'αστρικές διαταραχές επιπέδου 5'/* , εκτός από τα χαοτικά αποτελέσματα που έχουν στα συστήματα πλοήγησης των σκαφών, δημιουργούν και φαινόμαινα μαζικών παραισθήσεων στο πλήρωμα. Η αποστολή επέστρεψε χωρίς να φέρει τίποτα πίσω.'*/,
        /*'Η αποστολή σας, παραλίγο να */'εγκλωβιστεί στο πεδίο βαρύτητας ενός ουδέτερου πλανήτη και χρειάστηκε'/* αρκετός χρόνος για να διαφύγει. Εξαιτίας του γεγονότος αυτού, καταναλώθηκε μεγάλη ποσότητα Δευτερίου και ο στόλος υποχρεώθηκε να επιστρέψει άπρακτος.'*/,
        /*'Το σύστημα ναυσιπλοϊας, */'προσβλήθηκε από κάποιο παράξενο ιό λίγο μετά την αποχώρηση'/* από το οικείο ηλιακό σύστημα και υποχρέωσε το σχηματισμό σε κυκλική τροχιά. Είναι περιττό να αναφερθεί οτι η αποστολή απέτυχε.'*/,
        /*'Τα γενέθλια του */'καπετάνιου μάλλον δεν έπρεπε να γίνουν σε αυτόν τον απομονωμένο'/* πλανήτη. Ένας τρομερός πυρετός άγνωστης αιτιολογίας, έστειλε το περισσότερο πλήρωμα της αποστολής στο δωμάτιο πρώτων βοηθειών για το υπόλοιπο της αποστολής. Η επιχείρηση κατέρρευσε λόγω έλλειψης προσωπικού.'*/,
        /*'Κάποιος εγκατέστησε ένα */'παλιό παιχνίδι στρατηγικής στους υπολογιστές όλων των'/* σκαφών. Εξ`αιτίας αυτού, αν και η αποστολή έλειπε καιρό, δεν ήταν παραγωγική.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*TODO: el 'Das Letzte, was von dieser Expedition noch gesendet wurde, waren einige unglaublich gut gelungene */'Nahaufnahmen eines sich öffnenden schwarzen Lochs'/*.'*/,
        /*TODO: el 'Von der Expedition ist */'nur noch folgender Funkspruch übrig'/* geblieben: Zzzrrt Oh Gott! Krrrzzzzt dass zrrrtrzt sieht krgzzzz ja aus wie Krzzzzzzzztzzzz ...'*/,
        /*TODO: el 'Ein Kernbruch des Führungsschiffes führte zu einer Kettenreaktion, die in einer durchaus */'spektakulären Explosion die gesamte Expedition'/* vernichtete.'*/,
        /*TODO: el 'Die Expeditionsflotte ist */'nicht mehr aus dem Sprung in den Normalraum'/* zurückgekehrt. Unsere Wissenschaftler rätseln noch immer, was geschehen sein könnte, jedoch scheint die Flotte endgültig verloren zu sein.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*'Ο στόλος της */'αποστολής σας ήρθε σε επαφή με μια ντροπαλή εξωγήινη'/* φυλή. Ανακοίνωσαν ότι θα στείλουν στους κόσμους σας, αντιπρόσωπους με αγαθά προς ανταλλαγή.'*/,
        /*TODO: el 'Deine Expeditionsflotte hatte ein Notsignal aufgefangen. Es handelte sich um einen Megafrachter, der im starken Gravitationsfeld eines Planetoiden gefangen war. Nachdem der Frachter erfolgreich befreit worden war, verkündete der Frachterkapitän feierlich, seine Befreier als bevorzugte Exklusivkunden */'in sein schwarzes Buch'/* aufzunehmen.'*/,
    ],

    [ExpeditionEventType.early]: [
        /*'Μια απρόσμενη */'ανάστροφη σύζευξη στα ενεργειακά στροφεία επίσπευσε την επιστροφή'/* της αποστολής, επιστρέφει νωρίτερα από το αναμενόμενο. Οι πρώτες αναφορές ενημερώνουν ότι δεν υπάρχει κάτι αξιόλογο να αναφέρουν.'*/,
        /*TODO: el 'Deine Expedition meldet keine Besonderheiten in dem erforschten Sektor. Jedoch geriet die Flotte */'beim Rücksprung in einen Sonnenwind'/*. Dadurch wurde der Sprung beschleunigt. Deine Expedition kehrt nun etwas früher nach Hause.'*/,
        /*TODO: el 'Der etwas wagemutige neue */'Kommandant nutzte ein instabiles Wurmloch'/*, um den Rückflug zu verkürzen - mit Erfolg! Jedoch hat die Expedition selbst keine neuen Erkenntnisse gebracht.'*/,
    ],

    [ExpeditionEventType.delay]: [
        /*TODO: el 'Ein böser Patzer des Navigators führte zu einer */'Fehlkalkulation beim Sprung'/* der Expedition.'*/,
        /*'Η αποστολή σας */'βρέθηκε σε τομέα σωματιδιακών καταιγίδων'/* . Με αποτέλεσμα να υπερφορτωθούν οι αποθήκες ενέργειας και να καταστραφούν τα περισσότερα κύρια συστήματα των σκαφών. Οι μηχανικοί σας απόφυγαν τα χειρότερα αλλά η αποστολή θα επιστρέψει με μεγάλη καθυστέρηση'*/,
        /*'Για άγνωστη αιτία, το άλμα της αποστολής πήγε στραβά. Σχεδόν */'προσγειώθηκε στην καρδιά ενός ήλιου'/* . Ευτυχώς προσγειώθηκε σε γνωστό σύστημα, αλλά το άλμα επιστροφής θα καθυστερήσει περισσότερο από το αναμενόμενο.'*/,
        /*'Ο */'αστρικός άνεμος ενός κόκκινου γίγαντα κατάστρεψε'/* το άλμα της αποστολής, θα πάρει αρκετή ώρα να υπολογιστεί το άλμα επιστροφής. Μεταξύ των άστρων του τομέα, δεν υπήρχε παρά το κενό. Ο στόλος θα επιστρέψει αργότερα από το αναμενόμενο.'*/,
        /*TODO: el 'Das neue */'Navigationsmodul hat wohl doch noch mit einigen Bugs'/* zu kämpfen. Nicht nur ging der Sprung der Expeditionsflotte in die völlig falsche Richtung, auch wurde das gesamte Deuterium verbraucht, wobei der Sprung der Flotte nur knapp hinter dem Mond des Startplaneten endete. Etwas enttäuscht kehrt die Expedition nun auf Impuls zurück. Dadurch wird die Rückkehr wohl ein wenig verzögert.'*/,
        /*TODO: el 'Das Führungsschiff deiner */'Expeditionsflotte kollidierte mit einem fremden Schiff'/*, das ohne Vorwarnung direkt in die Flotte sprang. Das fremde Schiff explodierte und die Schäden am Führungsschiff waren beachtlich. Sobald die gröbsten Reparaturen abgeschlossen sind, werden sich deine Schiffe auf den Rückweg machen, da in diesem Zustand die Expedition nicht fortgeführt werden kann.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /Το αντικείμενο (?<name>.+) προστέθηκε στα Υπάρχοντα/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*'Πέσαμε σε */'ενέδρα που είχε στηθεί από τους αστροπειρατές'/* . Η μάχη ήταν αναπόφευκτη.'*/,//TODO: welche Nachricht ist das?
            /*'Μερικοί */'πραγματικά απελπισμένοι πειρατές του διαστήματος'/* προσπάθησαν να καταλάβουν την εξερευνητική αποστολή.'*/,
            /*TODO: el 'Einige */'primitive Barbaren greifen uns mit Raumschiffen'/* an, die nicht einmal ansatzweise die Bezeichnung Raumschiff verdient haben. Sollte der Beschuss ernstzunehmende Ausmaße annehmen, sehen wir uns gezwungen, das Feuer zu erwidern.'*/,
            /*TODO: el 'Wir haben ein paar */'Funksprüche sehr betrunkener Piraten'/* aufgefangen.'*/,
            /*TODO: el 'Wir */'mussten uns gegen einige Piraten wehren'/*, die zum Glück nicht allzu zahlreich waren.'*/,
            /*TODO: el 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*TODO: el 'Deine Expeditionsflotte hatte ein */'unschönes Zusammentreffen mit einigen Weltraumpiraten'/*.'*/,
            /*TODO: el 'Wir sind in den */'Hinterhalt einiger Sternen-Freibeuter'/* geraten!'*/,
            /*TODO: el 'Der Hilferuf, dem die Expedition folgte, stellte sich als */'böse Falle einiger arglistiger Sternen-Freibeuter'/* heraus. Ein Gefecht war unvermeidlich.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*TODO: el 'Die aufgefangenen Signale stammten nicht von Fremdwesen, sondern */'von einer geheimen Piratenbasis'/* ! Die Piraten waren von unserer Anwesenheit in ihrem Sektor nicht besonders begeistert.'*/,
            /*TODO: el 'Die Expeditionsflotte meldet */'schwere Kämpfe mit nicht-identifizierten Piratenschiffen'/*.'*/,
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*TODO: el 'Einige */'fremdartig anmutende Schiffe'/* haben ohne Vorwarnung die Expeditionsflotte angegriffen.'*/,
            /*'Ο εξερευνητικός στόλος σας, */'ήρθε σε όχι και τόσο φιλική επαφή'/* , με κάποια άγνωστης προέλευσης όντα.'*/,
            /*TODO: el 'Unsere Expedition wurde von einer */'kleinen Gruppe unbekannter Schiffe'/* angegriffen.'*/,
            /*TODO: el 'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*TODO: el 'Eine */'unbekannte Spezies greift unsere Expedition'/* an!'*/,
            /*TODO: el 'Deine */'Expeditionsflotte hat anscheinend das Hoheitsgebiet'/* einer bisher unbekannten, aber äußerst aggressiven und kriegerischen Alienrasse verletzt.'*/,
            /*TODO: el 'Die Verbindung zu unserer Expeditionsflotte wurde kurzfristig gestört. Sofern wir die letzte Botschaft richtig entschlüsselt haben, steht die Flotte unter schwerem Feuer; die */'Aggressoren konnten nicht identifiziert werden'/*.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*TODO: el 'Deine Expedition ist in eine Alien-Invasions-Flotte geraten und */'meldet schwere Gefechte'/*.'*/,
            /*TODO: el 'Wir hatten Mühe den korrekten */'Dialekt einer Alienrasse'/* auszusprechen. Unser Diplomat rief daher "Feuer!" statt "Friede!".'*/,
            /*TODO: el 'Ein großer */'Verband kristalliner Schiffe unbekannter Herkunft'/* hält direkten Kollisionskurs mit unserer Expeditionsflotte. Wir müssen nun wohl vom Schlimmsten ausgehen.'*/,
        ],
    },

    logbookRegex: /Εγγραφή από το ημερολόγιο του τμήματος αντικατασκοπείας:(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'Φαίνεται πως */'αυτό το τμήμα του σύμπαντος είναι ανεξερεύνητο',
            /*'Είναι ωραίο το συναίσθημα, να */'είμαστε οι πρώτοι που ταξιδευουμε'/* σε αυτό τον ανεξερεύνητο τομέα.'*/,
        ],
        [ExpeditionDepletionLevel.low]: [
            /*TODO: el 'Es scheint nicht so, als ob */'jemals ein Mensch in diesem Bereich der Galaxis'/* gewesen wäre.'*/,
            /*TODO: el 'Es wurden */'sehr alte Signaturen von Raumschiffen'/* entdeckt. Wir sind also nicht die Ersten hier.'*/,
            /*TODO: el 'Wir hatten beinahe eine */'Kollision mit einer anderen Expeditionsflotte'/*. Hätte nicht gedacht, dass sich hier noch andere herumtreiben.'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*TODO: el 'Wir haben den Abschluss der Expedition mit den Crewmitgliedern einer zweiten Expeditionsflotte, die im selben Sektor unterwegs war, gefeiert. */'Die haben auch nichts Spannendes zu berichten',
            /*TODO: el 'Es wurden */'Anzeichen für die Präsenz anderer Expeditionsflotten'/* gefunden.'*/,
            /*TODO: el 'Es wurde */'friedlicher Funkkontakt zu einigen anderen Expeditionen'/* in diesem Sektor hergestellt.'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /*TODO: el 'Wenn wir uns zu unsicher fühlen, können wir uns ja */'mit all den anderen Expeditionen'/*, die hier herum fliegen, zusammen tun.'*/,
            /*TODO: el 'Vielleicht wäre es sinnvoller, hier */'eine Souvenir-Station zu errichten'/* , anstatt noch eine Expedition loszuschicken.'*/,
            /*TODO: el 'Wenn das so weitergeht, sollte man */'bei all dem Verkehr hier Navigationsbojen'/* aussetzen.'*/,
        ],
    },
};