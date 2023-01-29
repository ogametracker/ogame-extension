import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const zh_tw: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*'遠征探險隊獲得並*/'且儲存了一些暗物質',
            '我們發現了外星人艦船的殘骸'/* .在艦船倉庫的隔板內,找到了積存著的一些暗物質!'*/,
            /*'我們在一艘小型船艦的隔板內遇到了*/'一位奇怪的外星人'/* ,他給我們一盒暗物質來交換一些簡單的數學公式.'*/,
            /*'我們的遠征探險隊控制一艘幽靈船,*/'船上似乎運載了'/* 一些暗物質.這艘船的跡像看不出來到底這邊曾經發生過什麼事情,我們的技術人員回收積存在這裡的暗物質.'*/,
            /*'遠征探險隊追隨著一*/'些奇怪的信號來到'/* 一顆小行星.在小行星核心,發現了少量的暗物質.我們占領了小行星,探險家正嘗試從中儘量提取暗物質.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'我們的遠征探險艦隊完成了*/'一項史無前例的實驗'/* .他們從一顆垂死的恒星上採集到了暗物質'*/,
            /*'我們的探險隊駐紮在一*/'個廢棄的空間站'/* ,這個地方看起來已經漂流在外太空一段時間.這個太空站已經沒有多大的用處,但是在核反應爐中,還有一些暗物質.我們的技術人員盡可能的嘗試保存它們.'*/,
            /*'我們的探險隊報告發現奇特的現象.在船艦護盾的能量槽中,*/'附著積存著一些暗物質'/* .我們的技術人員在正盡可能在這些怪象持續時儲存這些暗物質.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: zh_tw 'Eine */'spontane Hyperraumverzerrung'/* hat es deiner Expedition ermöglicht, eine große Menge dunkler Materie sicherzustellen!'*/,
            /*LOCA: zh_tw 'Unsere Expedition meldet einen ersten Kontakt der besonderen Art. Anscheinend hat */'eine Energiekreatur, die sich Legorianer nannte'/*, die Schiffe der Expedition durchflogen und dann beschlossen, der unterentwickelten Spezies ein wenig auszuhelfen - es materialisierte sich ein Behälter mit dunkler Materie an Bord der Brücke!'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`捕獲了 (?<name>${darkMatter}) (?<amount>[^\\s]+)`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'您的遠征探險艦隊發現了一*/'顆可以採集資源的小'/*行星.'*/,
            /*'在一*/'個遙遠的小行星上'/* ,我們發現了一些容易採集的資源帶,並成功從中採集到一些資源.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'你的遠征探險隊發現了*/'一個滿載貨物的古老運輸艦隊'/* 。上面似乎有一些資源還能夠被利用。'*/,
            /*'在一個擁*/'有自身大氣層的迷你月球上'/* ,您的遠征探險艦隊找到了一些資源礦藏,已先行登陸的隊員正在嘗試發掘並裝載那些自然礦藏.*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: zh_tw 'Ein */'Mineraliengürtel um einen unbekannten Planeten'/* enthielt Unmengen an Rohstoffen. Die Expeditionsflotte meldet volle Lager!'*/,
            /*'您的遠征探險艦隊報告說他們發現了*/'一艘巨型的外星人艦船殘骸'/* .他們雖然無法從那裡學到任何科技,但他們發現可以分解那艘艦船的主要部件成為我們有用的資源.'*/,
        ],
        regex: (resources: string[]) => new RegExp(`捕獲了 (?<name>${resources.join('|')}) (?<amount>.+)`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*'我們進入了之前遇難的遠*/'征探險隊殘骸群中'/* !我們的技術人員正試圖令到一些艦船重新運作*/,
            /*'您的遠征探索艦隊闖進了很久以前就被廢棄的*/'一個殖民星造船廠'/* .在造船廠的機庫內,他們發現了一些還可以修理的艦船.技術人員正嘗試令一些艦船重新飛起來.'*/,
            /*'我們的遠征探險艦隊找到一顆幾經一連串*/'戰爭摧殘接近被毀滅的行星'/* .在行星的軌道上漂浮著各式各樣的艦船.技術人員正嘗試修復一些艦船.或許我們可以從中瞭解這裡到底發生了什麼事情.'*/,
            /*'我們發現了一*/'個已遭廢棄的海盜太空站'/* .有一些陳舊的艦船橫臥在機庫內.我們的技術人員正評估著哪些艦船可以重新修復使用'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'我們的遠征探險艦隊闖進了一*/'間古老的全自動造船廠'/* ,一些艦船依然還在建造階段,我們的技術人員現在正嘗試重新恢復造船廠的能源供應'*/,
            /*'我們找到了一*/'支艦隊的殘骸群'/* .技術人員前往那些幾乎完好的艦船處嘗試令到它們重新啓動起來'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: zh_tw 'Wir haben einen */'riesigen Raumschiffsfriedhof'/* gefunden. Einigen Technikern der Expeditionsflotte ist es gelungen, das ein oder andere Schiff wieder in Betrieb zu nehmen.'*/,
            /*'我們找到了*/'一個文明滅絕的行星'/* .我們找到了還環繞在軌道上正常運行的龐大太空站.您的一些技術人員和駕駛員前往那裡找到了一些仍然可以使用的艦船.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`下列艦船隸屬於艦隊:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`, 'i'),
    },

    [ExpeditionEventType.nothing]: [
        /*'儘管我們是第一個來到這個非常有希望的區域,很不幸,*/'我們空手而歸',
        /*'在那個不知名的沼澤行星上,*/'除了一些新奇有趣的小動物'/* ,這次遠征探險艦隊在旅程中一無所獲.'*/,
        /*'您的遠征探險隊已*/'對帝國遼闊的空域瞭如指掌'/* .這裡毫無新意,甚至連一顆小行星或輻射源乃至粉塵微粒都完全無法令遠征探險艦隊有絲毫興致.'*/,
        /*'一*/'個散發著高純能量的生物悄然來到甲板上'/* ,用意念控制所有的探險隊員,令他們凝視著電腦熒幕上催眠圖形,進入到一些奇怪的催眠幻覺中.到最後,當他們大部分人掙脫了催眠狀態後,但他們已經遺失大部分重氫,遠征探險任務不得不放棄.'*/,
        '旗艦的反應器失常'/* ,差點導致整個遠征探險艦隊覆滅.值得慶幸的是,技術專家們表現極為出色避免了最糟糕狀況的出現.維修將要花費一些時間,並導致艦隊的返航時間將無法按預期抵達.'*/,
        /*'您的遠征探險隊拍攝*/'了超新星華麗的照片'/* .雖然遠征探險隊沒有帶回來任何新的發現,但是最起碼卻有機會贏得下個月發表的OGame雜誌的"宇宙最佳圖片"獎.'*/,
        /*'您的遠征探險隊斷斷續續追蹤到一些奇怪的訊號.後來,*/'才知道原來那些訊號'/* 是從古老的間諜衛星所發射出來的,這衛星原來是遠古先輩們試圖接觸外星文明而發射的.該衛星已經被保存下來,同時許多來自於母星的博物館紛紛對此表達有興趣.'*/,
        /*'現在我們已經知道了,*/'那些紅色5級異象不僅對艦船的'/*導航系統帶來混亂干擾,同時也使船員產生大量的幻覺.遠征探險隊並沒有帶任何東西回來.'*/,
        /*'您的遠征探險隊誤入了一*/'顆中子星的引力場'/* ,需要一段時間來掙脫該力場.由於在掙脫時,幾乎將所有的重氫消耗殆盡,所以您的遠征探險艦隊不得不在沒有任何成果下返航.'*/,
        /*'就在剛離開我們母星太陽系宙域不久後,*/'一種怪異的電腦病毒入侵了'/*導航系統.這使得遠征探險隊迷途打轉飛行.必須說,這次遠征探險已完全失敗.'*/,
        /*'我們的遠征探險隊途徑一個已經廢棄很久的怪異殖民星.降落以後,我們的船員感染了一*/'種外星病毒並開始發高燒'/* .據說這種病毒曾經傳播到這個行星的每一個角落並摧毀了這裡的文明.我們的探險隊為了治療這些患病的船員開始返航.我們不得不取消這次任務,我們一無所獲的回家了.'*/,
        '由於旗艦的中央電腦系統發生錯誤'/* ,探險任務不得不終止.另外由於電腦故障的原因,我們的艦隊無奈地空手而回.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*LOCA: zh_tw 'Das Letzte, was von dieser Expedition noch gesendet wurde, waren einige unglaublich gut gelungene */'Nahaufnahmen eines sich öffnenden schwarzen Lochs'/*.'*/,
        '遠征探險隊傳來的最後一條無線電訊息'/* :滋~~ 糟了！咖 那邊 滋~ 好像 嗶~~~有… 訊息中斷'*/,
        /*LOCA: zh_tw 'Ein Kernbruch des Führungsschiffes führte zu einer Kettenreaktion, die in einer durchaus */'spektakulären Explosion die gesamte Expedition'/* vernichtete.'*/,
        /*LOCA: zh_tw 'Die Expeditionsflotte ist */'nicht mehr aus dem Sprung in den Normalraum'/* zurückgekehrt. Unsere Wissenschaftler rätseln noch immer, was geschehen sein könnte, jedoch scheint die Flotte endgültig verloren zu sein.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*'您的遠征探險艦隊與一*/'友善的外星人種族進行了聯絡'/* .他們宣布他們將派遣一名代表與您的帝國進行貨物交易.'*/,
        /*'您的遠征探險艦隊*/'在任務中發出一則緊急的訊號'/* .一艘巨型貨運船被一顆小行星的萬有引力力場吸住.在巨型貨運船被您成功救出後,船長宣布挽救他的人將是他們敬愛的尊貴客戶.'*/,
    ],

    [ExpeditionEventType.early]: [
        '在引擎的能源軸線上發生了'/*一個未能預期耦合逆轉狀況導致艦隊加速了返回時間,遠征探險艦隊因此比預期更早地返回了.首份報告稱他們沒找到什麼令人興奮的發現.'*/,
        /*'您的遠征探險艦隊報告稱在遠征探險的宇宙空域內並沒有找到什麼異象.正當他們返回之時,*/'艦隊偶遇了一股太陽風'/*.艦隊因此返航的路程加快了.您的遠征探險艦隊比預期更早地返回了.'*/,
        '年輕而膽識過人的指揮官'/*成功穿越了一個不穩定的蟲洞,減少了返回的飛行時間!而然,這支遠征探險艦隊並沒有帶回來什麼新東西.'*/,
    ],

    [ExpeditionEventType.delay]: [
        '您的電腦導航系統發生'/* 一個嚴重錯誤導致遠征探險隊空間跳躍失敗.不但造成艦隊完全失去目的地座標,還使得返航的時間比預期更長了.'*/,
        /*'您的遠征探險艦隊誤闖*/'入了一個粒子風暴區域'/* .這使得能源供給出現超負荷現象,並且大部分的艦船的主要系統被摧毀.您的機械專家們能讓您避免出現最糟糕的狀況,但返航的時間預期將會大大延遲.'*/,
        /*'由於不明原因,*/'遠征探險艦隊的空間跳躍總是頻頻出錯'/* .這次更離譜,竟然跳到一顆恒星的心臟地帶去了.值得慶幸的是,這次是跳到了一個我們熟知的太陽系內,不過要跳躍回來將要花費比預期設想的時間要多得多.'*/,
        /*'一*/'顆紅巨星的太陽風破壞了'/* 遠征探索艦隊的空間跳躍,並令到艦隊不得不花費更多的時間來重新調整空間跳躍.在那艦隊與紅巨星之間的區域內,除了宇宙空間的虛無外一無所有,艦隊返航時間將與預期設想要久得多.'*/,
        '新導航系統組件仍然有問題'/* .遠征探索艦隊的空間跳躍錯誤不僅使得他們去錯目的地,更使得艦隊燃料全部耗盡.唯一值得慶幸的是,錯誤的空間跳躍只是令到艦隊跳躍到出發地行星的月球附近.現在艦隊喪失意志敗興而歸.返航時間將要比預期要長的多.'*/,
        /*'一艘外來艦船突然跳躍到遠征探險艦隊中心,*/'與我們遠征探險隊旗艦相撞了'/* ,外來艦船繼而爆炸同時對我們的旗艦造成了嚴重傷害.在這種情況下,艦隊只能做點應急維修然後返航,他們無法再繼續遠征探險了.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /已將 (?<name>.+) 添加至 背囊 中/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            '一些亡命的宇宙海盜'/*嘗試洗劫我們的遠征探險艦隊.'*/,
            /*'一*/'群原始野蠻人正利用太'/*空船向我們的遠征探險艦隊發起攻擊,我們甚至連他們叫什麼名都全然不知.如果他們再猛烈攻擊我們,我們將不得不予以還擊.'*/,
            /*'我們從一*/'幫張狂的海盜處收到'/* 一些挑釁的無線電訊號.看來,我們即將遭受攻擊'*/,
            /*'我們不得不*/'與那裡的海盜進行戰鬥'/* ,慶幸的是對方艦船數不多.'*/,
            /*LOCA: zh_tw 'Unsere Expeditionsflotte meldet, dass ein gewisser */'Moa Tikarr und seine wilde Meute'/* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*LOCA: zh_tw 'Deine Expeditionsflotte hatte ein */'unschönes Zusammentreffen mit einigen Weltraumpiraten'/*.'*/,
            /*LOCA: zh_tw 'Wir sind in den */'Hinterhalt einiger Sternen-Freibeuter'/* geraten!'*/,
            /*LOCA: zh_tw 'Der Hilferuf, dem die Expedition folgte, stellte sich als */'böse Falle einiger arglistiger Sternen-Freibeuter'/* heraus. Ein Gefecht war unvermeidlich.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'該信號記錄絕不是來自外星文明的,*/'而是一個隱祕的海盜基地'/* !這些海盜對我們突然出現這裡絲毫不覺得有半分詫異.'*/,
            /*LOCA: zh_tw 'Die Expeditionsflotte meldet */'schwere Kämpfe mit nicht-identifizierten Piratenschiffen'/*.'*/,
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*'批奇形怪狀*/'的外星艦船在事先毫無警'/*告之下襲擊了我們的遠征探險艦隊'*/,
            /*LOCA: zh_tw 'Deine Expeditionsflotte hatte einen */'nicht besonders freundlichen Erstkontakt'/* mit einer unbekannten Spezies.'*/,
            /*'我們的遠征探險艦隊被*/'一小股不明來歷的艦'/*隊襲擊了!'*/,
            /*LOCA: zh_tw 'Die Expeditionsflotte meldet */'Kontakt mit unbekannten Schiffen'/*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*LOCA: zh_tw 'Eine */'unbekannte Spezies greift unsere Expedition'/* an!'*/,
            /*'您的遠征探險艦隊似乎踏足到一*/'個屬於未知種族的疆土宙域'/* ,不過可以確定的是它們絕對是凶殘和好戰的外星種族.'*/,
            /*LOCA: zh_tw 'Die Verbindung zu unserer Expeditionsflotte wurde kurzfristig gestört. Sofern wir die letzte Botschaft richtig entschlüsselt haben, steht die Flotte unter schwerem Feuer; die */'Aggressoren konnten nicht identifiziert werden'/*.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*LOCA: zh_tw 'Deine Expedition ist in eine Alien-Invasions-Flotte geraten und */'meldet schwere Gefechte'/*.'*/,
            /*LOCA: zh_tw 'Wir hatten Mühe den korrekten */'Dialekt einer Alienrasse'/* auszusprechen. Unser Diplomat rief daher "Feuer!" statt "Friede!".'*/,
            /*LOCA: zh_tw 'Ein großer */'Verband kristalliner Schiffe unbekannter Herkunft'/* hält direkten Kollisionskurs mit unserer Expeditionsflotte. Wir müssen nun wohl vom Schlimmsten ausgehen.'*/,
        ],
    },

    logbookRegex: /通訊官日誌記錄:(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'似乎這片宇*/'宙空域仍未被探索',
            /*'作為第一批到此未*/'被探索的宇宙空域的人'/* ,感覺太棒了'*/,
        ],
        [ExpeditionDepletionLevel.low]: [
            /*'在該銀河系的這片空域內,*/'似乎並沒有人類踏'/* 足過'*/,
            /*'我們發現一*/'艘遠古太空艦船的殘骸'/* .但我們並不是第一個踏足的人'*/,
            /*LOCA: zh_tw 'Wir hatten beinahe eine */'Kollision mit einer anderen Expeditionsflotte'/*. Hätte nicht gedacht, dass sich hier noch andere herumtreiben.'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*LOCA: zh_tw 'Wir haben den Abschluss der Expedition mit den Crewmitgliedern einer zweiten Expeditionsflotte, die im selben Sektor unterwegs war, gefeiert. */'Die haben auch nichts Spannendes zu berichten',
            /*LOCA: zh_tw 'Es wurden */'Anzeichen für die Präsenz anderer Expeditionsflotten'/* gefunden.'*/,
            /*LOCA: zh_tw 'Es wurde */'friedlicher Funkkontakt zu einigen anderen Expeditionen'/* in diesem Sektor hergestellt.'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /*LOCA: zh_tw 'Wenn wir uns zu unsicher fühlen, können wir uns ja */'mit all den anderen Expeditionen'/*, die hier herum fliegen, zusammen tun.'*/,
            /*LOCA: zh_tw 'Vielleicht wäre es sinnvoller, hier */'eine Souvenir-Station zu errichten'/* , anstatt noch eine Expedition loszuschicken.'*/,
            /*LOCA: zh_tw 'Wenn das so weitergeht, sollte man */'bei all dem Verkehr hier Navigationsbojen'/* aussetzen.'*/,
        ],
    },
};