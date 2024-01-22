import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const tr: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*'Kesif ekibi az bir */'miktar karanlik madde buldu ve bunu basarili'/* bir sekilde depoya aktarmayi basardi'*/,
            /*'Eski bir */'Alien gemisinin kalintilarini bulduk'/* . Süper haberler var: Geminin icinden karanlik maddeyle dolu bir kutu cikti'*/,
            /*'Kücük bir */'geminin güvertesinde garip bir yaratikla karsilastik'/* . Bu yaratik bizlere oldukca nazik davrandi ve bir kac basit matematik formülü karsiliginda bir koli karanlik madde hediye etti, biz de anlamadik?'*/,
            /*'Kesif gezimiz */'sirasinda kücük bir miktar karanlik madde nakliye eden garip bir gemiye'/* , bir hayalet gemiye rastladik. Acikcasi geminin tayfasina ne oldugu konusunda en ufak bir bilgi ya da iz bulamadik ama en azindan geminin icindeki karanlik maddeyi uzmanlarimiz sayesinde kendi gemimize nakledebildik.'*/,
            /*'Kesif ekibi garip sinyalleri takip edip, */'düsmüs bir göktasinin yerini tesbit ediyor'/* . Göktasinin icinde az bir miktar karanlik madde bulunuyor ve tasin ilgili kismi gemiye tasiniyor. Su an bilim adamlari, bu göktasinin icinden karanlik maddeyi cikarmaya ugrasiyor.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /* TODO tr 'Unserer Expedition ist */'ein einmaliges Experiment gelungen'/*:'*/,
            /*'Kesif ekibimiz , uzun süredir */'kontrolsüz bir bicimde dis uzayda sürüklenmekte olan'/* , pasli bir uzay istasyonuna yerlesiyor. Istasyonun kendisi tamamen kullanilamaz durumda; lakin reaktöründe hala biraz Karanlik Madde var. Teknisyenlerimiz kurtarabildikleri kadarini kurtarmaya calisiyor.'*/,
            /*'Keşif esnasında nadir görülen çok ilginç bir olaya rastladık. Bu olayla birlikte geminin */'koruyucu kalkanlarının enerji depolarının içinde karanlık madde oluşumuna'/* rastlandı. Olayın sebebi çözülemediği için, öncelikle sebebi bir kenara bırakılıp; mevcut uzman kadro ile oluşan karanlık maddenin toplanması ve depolanmasına çalışılıyor.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /* TODO tr 'Eine */'spontane Hyperraumverzerrung'/* hat es deiner Expedition ermöglicht, eine große Menge dunkler Materie sicherzustellen!'*/,
            /* TODO tr 'Unsere Expedition meldet einen ersten Kontakt der besonderen Art. Anscheinend hat */'eine Energiekreatur, die sich Legorianer nannte'/*, die Schiffe der Expedition durchflogen und dann beschlossen, der unterentwickelten Spezies ein wenig auszuhelfen - es materialisierte sich ein Behälter mit dunkler Materie an Bord der Brücke!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`(?<amount>[^\\s]+) (?<name>${darkMatter}) ele geçirildi`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'Yaptigin kesif sayesinde cok degerli */'kaynaklar iceren kücük bir göktasi grubu ortaya cikardin'/* . Bunlari iyi degerlendirebilirsen mevcut hammadde miktarini arttirabilirsin.'*/,
            /*'Kenarda, gözlerden irak kalan kücük */'bir gezegen üzerinde bir kac maden bulundu ve bu madenlerden'/* basariyla yararli olabilecek hammadde cikarildi.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Kesif ekibin, tamamen yüklü ve */'terkedilmis bir antik yük gemisi konvoyu buldu'/* . Bazi hammaddeler kurtarilabildi.'*/,
            /*'Kendi atmosferine sahip ufak bir Ay`da, kesif */'filon yuksek miktarda islenmemis hammadde istifi buldu'/* . Ay uzerinde calisan Mürettebat hala bu dogal hazineleri kaldirip, yüklemeye calisiyor.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /* TODO tr 'Ein */'Mineraliengürtel um einen unbekannten Planeten'/* enthielt Unmengen an Rohstoffen. Die Expeditionsflotte meldet volle Lager!'*/,
            /*'Kesif filomuz , */'devasa bir alien gemisi enkazini rapor etti'/*. Enkazdan , alienlarin teknolojilerine ait hic bir bilgi alamayan ekibimiz, gemiyi hammaddelerine kadar ayristirarak , yüksek miktarda işe yarar maden elde etti.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`(?<amount>.+) (?<name>${resources.join('|')}) ele geçirildi`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*'Bir önceki */'kesif filosunun kalintisina ulastik'/* ! Bu kalintilar icinde isimize yarayacak gemi olup olmadigina karar vermeye calisiyoruz.'*/,
            /*'Kesif */'ekibin terkedilmis yildiz kalesi buldu'/* . Kalede kimse yasamiyor ama icinde hala birkac gemi var. Geriye bu gemilerin calisir durumda olup olmadigini anlamak kaliyor.'*/,
            /*'Kesif sirasinda eski */'savaslar sonucunda neredeyse tamamen yokolmus bir gezegen'/* bulduk. Gezegenin yörüngesinde öylece hareket etmekte olan onlarca gemi vardi, bakalim belki bu gemilerden bazilarini tamir etmeyi basarabiliriz. Böylelikle buralarda ne oldugunu da anlayabiliriz.'*/,
            /*'Terkedilmis bir korsan üssü bulduk. */'Üssün deposundaysa bir cok eski gemi var, ve teknik uzmanlarimiz bu gemilerin'/* kullanilip kullanilmayacagina karar vermeye calisiyor.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Keşif sırasında */'eski ama tam otomatik çalışan tersane bulduk'/* . Hatta bu tersanede bazı gemiler hala üretim aşamasındalar, teknik ekibimiz binadaki enerji sorununu çözmeye çalışıyor.'*/,
            /*'Kesif */'sirasinda bir filonun kalintilarini bulduk'/* . Hemen bu kalintilari inceleyip, isimize yarayacak gemi varsa tamir edip kendi filomuza katacagiz.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Cok büyük */'boyutlarda uzay gemisi mezarligi bulduk'/* ! Kesif filosundaki teknik uzmanlarimiz bulunan bu gemilerden bazilarini tamir edip, filomuza katmayi becerdiler.'*/,
            /*'Icinde zamaninda */'gelismis bir uygarlik barindirmis olan bir gezegen bulduk'/* . Koca gezegende geriye sadece uzaydan da görebilen devasa bir uzay gemisi istasyonu kalmis. Pilot ve uzmanlarimiz gezegene gidip bu uzay gemisi istasyonunda isimize yarayabilecek gemi olup olmadigini kontrol edecekler.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`Filona katilan gemiler:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
    },

    [ExpeditionEventType.nothing]: [
        /*'Bu bölgeden gelen ilk raporlar cok ilgi cekiciydi, ancak sonuc olarak elimiz bos dönüyoruz...*/'bir sey bulamadik',
        /*'Bu kesif sonucunda kücük, */'garip bir yaratik disinda kayda deger bir sey bulunamadi',
        /*'Bu kesif seni */'kelimenin tam anlamiyla evrenin bosluklariyla tanistirdi'/* . Bosluk disinda hic bir seye rastlamadin, ne kücük bir gezegen ne bir göktasi ne bir tanecik...hicbir sey!'*/,
        /*'Tüm mürettebatın saf enerjiden oluşan */'bir canlı tarafından hipnotize ediliyor'/* . Bu süreç içersinde günlerce yaptıkları tek şey önlerindeki ekrana bakmak oluyor. Ancak bu enerjinin etkisinden çıktıklarında, yakıt sorunu yüzünden olabildiğince çabuk bir şekilde eve dönmeleri gerektiğini anlıyor ve bu keşif gezisini yarıda kesiyorlar.'*/,
        /*'Filo merkez */'gemisinin reaktöründeki hata neredeyse tüm kesif filosunu'/* yokediyordu. Sans eseri en iyi uzmanlarin da kesfe katilmislardi ve sorunlari uzun ugraslar sonucunda hallettiler. Bu sorun o kadar cok güc ve vakit harcattiki, kesif yarida birakilmak zorunda kalindi.'*/,
        /*'Kesif */'filon Supernova` nin cok güzel resimlerini cekmis'/* ama bunun haricinde önemli bir kesifte bulunamadi. Yine de moralini bozma, en azindan bu resimler " Evrenin En Iyi Resimleri Yarismasinda" basarili olacaktir.'*/,
        /*'Bir ara kesif filona garip sinyaller eslik ediyordu. Bir kac arastirmadan sonra bu sinyallerin, */'cok eskiden yabanci yaratiklari incelemesi icin göderilmis olan bir casus sondasindan'/* geldigi anlasildi. Sonda bulundugu yerden cikarilip, ana gezegenine geri götürüldü. Bu kadar cok müzenin bu sondayi sergilemek icin yarisacagini kimse bilemezdi!'*/,
        /*'Eh, en */'azindan simdi herkes 5. siniftan kirmizi anemalinin'/* gemi sistemleri üzerindeki garip etkilerinin yani sira mürettebat üzerinde de olumsuz psikolojik etkileri oldugunu biliyor. Bu kesif sonucunda baska bir sey de ögrenilemedi!'*/,
        /*'Keşif filon bir */'şekilde nötron yıldızlarından birinin merkez çekim kuvvetinin'/* yakınlarına girdi. Bu çekim kuvvetinden çıkması kolay olmadı, kendini ancak ağır bir mücadelenin sonucunda kurtarabildi. Tabii bu mücadele sırasında ekstra deuterium tüketimi zorunluydu ve dolayısıyla filon verilen görevi yerine getiremeden, yakıt yetersizliği sebebiyle erkenden eve dönmek zorunda kaldı.'*/,
        /*'Evrenin tüm yönbulma */'sistemleri garip bir bilgisayar virüsü yüzünden agir sorunlar'/* yasadilar. Bunun sonucunda gönderilen kesif filosu tüm süre boyunca kendi etrafinda turlamis ve dönüp dolasip ayni yere gelmis. Herhalde bu kesif yolculugunun olumlu bir katkisi olmadigini bir daha söylemem gerekmiyor.'*/,
        /*'Galiba */'kaptanin dogumgününün bu bilinmedik gezegende kutlanmasi'/* hic iyi bir fikir degildi. Garip bir hastalik ve beraberinde getirdigi agir ates yüzünden mürettabatin yarisi yorgan dösek hastahanede yatiyor. Bu sorun yüzünden kesif de basarisizlikla yarida kesilmek zorunda kaldi.'*/,
        /*'Ilginc bir sekilde gemi */'mürettabindan bir kisi geminin tüm bilgisayarlarina milattan kalma bir strateji'/* oyunu yüklemis. Kesif filosu uzun süre yolda olmasina ragmen, bu teknik aksakliktan ötürü cok da verimli olamadi.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*'Kesif filosundan alabildigimiz son bilgi, yeni acilmakta olan bir kara deligin */'acikca belirgin oldugu cok net bir fotograf olabildi',
        /*'Kesif */'filosundan geriye sadece bu radyo kaydi kaldi'/* : Zzzz Aman tanrim! Krrrzzzztttt Bu zzrrrttzzrt bir krgzzzzzz benziyor Krrzzzzzzztzzzzzttzzzzzz.........'*/,
        /*'Lider Geminin ana reaktöründeki bir kaynak erimesi, diger bütün gemilerin */'yokolmasina yol acan bir patlamalar zincirine sebebiyet verdi',
        /* TODO tr 'Die Expeditionsflotte ist */'nicht mehr aus dem Sprung in den Normalraum'/* zurückgekehrt. Unsere Wissenschaftler rätseln noch immer, was geschehen sein könnte, jedoch scheint die Flotte endgültig verloren zu sein.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*'Kesif filon */'biraz utangac bir alien irkina rastliyor'/* . Acikcasi bu kadar cekingen alien ile de ilk kez karsilasiyorsun ve seninkiler de olaylari yavastan aliyorlar. Bir süre iletisim kurduktan sonra, aralarindan bir temsilciyi degis tokus edilebilecek mallarla dünyana göndermeyi öneriyorlar.'*/,
        /* TODO tr 'Deine Expeditionsflotte hatte ein Notsignal aufgefangen. Es handelte sich um einen Megafrachter, der im starken Gravitationsfeld eines Planetoiden gefangen war. Nachdem der Frachter erfolgreich befreit worden war, verkündete der Frachterkapitän feierlich, seine Befreier als bevorzugte Exklusivkunden */'in sein schwarzes Buch'/* aufzunehmen.'*/,
    ],

    [ExpeditionEventType.early]: [
        /*'Motor */'takımlarının enerji halkalarında yaşanan beklenmedik'/* geribesleme sonucunda kesif filonun geri dönüşü hızlanıyor ve beklenenden önce geri dönüyor. Kendilerinden gelen ilk raporlara göre keşif sırasında ilginç bir olay yaşamamışlar.'*/,
        /*'Kesfedilen bölgede olagandisi bir veriye rastlanmiyor; ancak filo geri sicrama sirasinda bir sekilde */'günes rüzgarina denk geliyor ve bu sebepten ötürü sicrama süresi degisiyor'/* . Filo vaktinden önce geliyor!'*/,
        /*'Geminin yeni */'komutani oldukca cesur cikti, cesur olmasinin yanisira'/* bir o kadar da yetenekli oldugunu iddia edebiliriz. Tam oturmamis bir solucan deligi bulup kullanarak, filonun eve geri dönüsünü hizlandirdi! Her ne kadar filo erken dönmüs olsa da, bu kesif sonunda herhangi bir bulgu bulunamadigi gercegini degistirmiyor.'*/,
    ],

    [ExpeditionEventType.delay]: [
        /*'Kesif filon */'navigasyon sistemindeki önemli bir hatadan dolayi yola yanlis'/* hesaplarla cikiyor. Filo cok yanlis bir yere inmekle kalmiyor, ayni zamanda eve geri dönüsü de önemli boyutta yavasliyor.'*/,
        /*'Kesif filon */'tanecik fırtınası yaşanan bir bölgeye girdi ve sonucunda bazı gemilerin enerji'/* depolarındaki aşırı zorlanma sebebiyle bu gemilerin merkez sistemleri de çöktü. Uzmanlar en önemli sorunları çözdüler, ancak filonun geri dönüşü bu olaylar yüzünden gecikecektir.'*/,
        /*'Sebebi bilinmeyen bir arizadan dolayi, */'göndermis oldugun kesif filosu cok yanlis yerlere iniyor'/* ; hatta neredeyse günesin merkezine iniyor da, kendini son andaki manevrasiyla kurtariyor. Neyse ki simdi bilinen bir günes sisteminde, ve arizalari giderip eve dönmeyi planliyor. Ancak tüm bu sorunlar filonun geri dönüsünü cok yavaslatacaktir.'*/,
        /*'Kırmızı devin */'yildiz rüzgari yüzünden kesif filonun sicramasi o derece etkileniyor'/* ki, geri dönüsün sadece hesaplanmasi bile inanilmaz zaman aliyor. Ayrica kesfin yapildigi yerde yildizlar arasindaki bosluktan baska bir sey yoktu.'*/,
        /*'Yeni */'yönbulma ünitesi hala sorunlarla savaşıyor'/* . Keşif uçuşu sadece yanlış yöne gitmekle kalmadı, aynı zamanda bütün deuteriumunu da kullandı. Şans eseri filolar, uçuşa başladıkları gezegenin ayına yakın bir yere kadar ulaşabildiler. Biraz hayal kırıklığı yaratıcı ama keşif filosu impulsa geri dönüyor. Bu nedenle dönüş yolculuğu biraz daha uzun sürecek.'*/,
        /*'Kesif merkez */'gemin hicbir uyarida bulunmadan direk filonun ortasina dalan'/* yabanci bir gemi ile carpisti. Carpismanin sonucunda yabanci gemi havaya ucurken, senin geminde cok agir yaralar acildi. Bu sartlar altinda, tüm kesif filosu bir an önce gereken tamiratlari yapip eve dönecektir, kesif ucusuna bu asamadan sonra devam edilemez.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /* TODO tr *//Ein (?<name>.+) wurde dem Inventar hinzugefügt/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*'Bazı umutsuz uzay korsanları */'keşif filomuzu ele geçirmek için beyhude bir çaba'/* içindeler.'*/,
            /*'Bazi ilkel */'barbarlar bize uzaygemisi olarak adlandirilmayacak birseyle saldiriyorlar'/* . Eger ates ciddilesirse, karsilik vermek zorunda kalabiliriz.'*/,
            /*'Sarhos uzay */'korsanlarindan bazi telsiz mesajlari yakaladik'/* . Yakinda saldiri altinda olacagiz galiba.'*/,
            /*'Karsimiza cikan */'uzay korsanlari neyseki öyle ahim sahim tipler degildiler'/* , kendimizi savunmamiz cok zor olmadi.'*/,
            /* TODO tr 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /* TODO tr 'Deine Expeditionsflotte hatte ein */'unschönes Zusammentreffen mit einigen Weltraumpiraten'/*.'*/,
            /*'Yildiz */'korsanlarinin kurdugu tuzagin tam ortasina dustuk'/* ! Savas kacinilmaz.'*/,
            /* TODO tr 'Der Hilferuf, dem die Expedition folgte, stellte sich als */'böse Falle einiger arglistiger Sternen-Freibeuter'/* heraus. Ein Gefecht war unvermeidlich.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /* TODO tr 'Die aufgefangenen Signale stammten nicht von Fremdwesen, sondern */'von einer geheimen Piratenbasis'/* ! Die Piraten waren von unserer Anwesenheit in ihrem Sektor nicht besonders begeistert.'*/,
            /* TODO tr 'Die Expeditionsflotte meldet */'schwere Kämpfe mit nicht-identifizierten Piratenschiffen'/*.'*/,
        ],
        'fled-death-star': [
            /* TODO tr 'Deine Expedition */'ist auf Aliens getroffen. Überwältigt von der Stärke deines Todessterns'/* , sind sie jedoch geflohen.'*/
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*'Egzotik görünüslü */'tarafimizca bilinmeyen gemiler kesif filomuza hic bir uyarida bulunmadan'/* saldirdilar!'*/,
            /*'Kesif ekibimiz, */'bilinmeyen bir tür ile hic de dost canlisi olamayan'/* bir temasa giriyor.'*/,
            /*'Kücük bir grup */'bilinmeyen gemi tarafindan kesif ekibimize'/* saldirildi!'*/,
            /* TODO tr 'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /* TODO tr 'Eine */'unbekannte Spezies greift unsere Expedition'/* an!'*/,
            /*'Kesif filon, kimligi bilinmeyen ama */'gercekten saldirgan ve dövüs canlisi yabanci bir irkin'/* bölgesine girmis görünüyor.'*/,
            /*'Kesif filomuz ile baglantimiz bir süreligine kesildi. Son mesajlarini cözmeye calisiyoruz. Büyük bir taarruz altindalar , */'saldirganlar tanimlanamadi',
        ],
        [ExpeditionEventSize.large]: [
            /* TODO tr 'Deine Expedition ist in eine Alien-Invasions-Flotte geraten und */'meldet schwere Gefechte'/*.'*/,
            /* TODO tr 'Wir hatten Mühe den korrekten */'Dialekt einer Alienrasse'/* auszusprechen. Unser Diplomat rief daher "Feuer!" statt "Friede!".'*/,
            /* TODO tr 'Ein großer */'Verband kristalliner Schiffe unbekannter Herkunft'/* hält direkten Kollisionskurs mit unserer Expeditionsflotte. Wir müssen nun wohl vom Schlimmsten ausgehen.'*/,
        ],
        'fled-death-star': [
            /* TODO tr 'Deine Expedition */'ist auf Piraten getroffen. Überwältigt von der Stärke deines Todessterns'/* , sind sie jedoch geflohen.'*/
        ],
    },

    logbookRegex: /(Istihbarat Merkezi Komutaninin seyif defterinden alinti|Istihbarat Komutaninin seyir defterinden):(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'Evrenin bu */'bölgesinin henüz hic arastirilmamis oldugu cok bariz bir sekilde'/* belli oluyor.'*/,
            /*'Daha önce hic girilmemis bir */'bölgeye ilk giren insan olmak inanilmaz güzel bir duygu'/* , kelimelerle ifade edemem.'*/,
        ],
        [ExpeditionDepletionLevel.low]: [
            /*'Ilk izlenimlere */'göre galaksinin bu köselerine ilk gelen biziz'/* . Baska bir filonun izine henüz rastlamadik.'*/,
            /* TODO tr 'Es wurden */'sehr alte Signaturen von Raumschiffen'/* entdeckt. Wir sind also nicht die Ersten hier.'*/,
            /*TODO is this the message above? 'Uzay */'gemilerinin birakabilecegi cinsten isaretlere rastladik'/* . Varliklari konusunda bir bilgimiz yok; ancak buralara gelen ilk filonun bizimki olmadigi kesin.'*/,
            /*'Neredeyse yabanci */'bir kesif filosuyla carpisiyorduk'/* . Acikcasi buralarda baska kesif filolarinin olabilecegi aklimin ucundan bile gecmezdi.'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /* TODO tr 'Wir haben den Abschluss der Expedition mit den Crewmitgliedern einer zweiten Expeditionsflotte, die im selben Sektor unterwegs war, gefeiert. */'Die haben auch nichts Spannendes zu berichten',
            /* TODO tr 'Es wurden */'Anzeichen für die Präsenz anderer Expeditionsflotten'/* gefunden.'*/,
            /* TODO tr 'Es wurde */'friedlicher Funkkontakt zu einigen anderen Expeditionen'/* in diesem Sektor hergestellt.'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /* TODO tr 'Wenn wir uns zu unsicher fühlen, können wir uns ja */'mit all den anderen Expeditionen'/*, die hier herum fliegen, zusammen tun.'*/,
            /* TODO tr 'Vielleicht wäre es sinnvoller, hier */'eine Souvenir-Station zu errichten'/* , anstatt noch eine Expedition loszuschicken.'*/,
            /* TODO tr 'Wenn das so weitergeht, sollte man */'bei all dem Verkehr hier Navigationsbojen'/* aussetzen.'*/,
        ],
    },
};