import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionEventSize } from "../../../../models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "../../../../models/expeditions/ExpeditionEventType";
import { ExpeditionMessages } from "./types";

export const en: ExpeditionMessages = {
    [ExpeditionEventType.darkMatter]: {
        [ExpeditionEventSize.small]: [
            /*'The expedition was able to */'capture and store some Dark Matter',
            /*'We found the */'remains of an alien ship'/*. We found a little container with some Dark Matter on a shelf in the cargo hold!'*/,
            /*'We met an */'odd alien on the shelf of a small ship'/* who gave us a case with Dark Matter in exchange for some simple mathematical calculations.'*/,
            /*'Our expedition took over a */'ghost ship which was transporting a small amount of Dark Matter'/*. We didn`t find any hints of what happened to the original crew of the ship, but our technicians where able to rescue the Dark Matter.'*/,
            /*'The expedition followed some */'odd signals to an asteroid'/*. In the asteroids core a small amount of Dark Matter was found. The asteroid was taken and the explorers are attempting to extract the Dark Matter.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Our expedition */'accomplished a unique experiment'/*. They were able to harvest Dark Matter from a dying star.'*/,
            /*'Our Expedition */'located a rusty space station'/*, which seemed to have been floating uncontrolled through outer space for a long time. The station itself was totally useless, however, it was discovered that some Dark Matter is stored in the reactor. Our technicians are trying to save as much as they can.'*/,
            /*'Our expedition reports a */'spectacular phenomenon'/*. The accumulation of Dark Matter in the energy storages of the ship shields. Our technicians try to store as much Dark Matter as they can while the phenomenon lasts.*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'A */'spontaneous hyper space deformation'/* allowed your expedition to harvest large amount of Dark Matter'*/,
            /*'Our expedition made first contact with a special race. It looks as though a creature made of pure energy, who */'named himself Legorian'/*, flew through the expedition ships and then decided to help our underdeveloped species. A case containing Dark Matter materialized at the bridge of the ship'*/,
        ],
        regex: (darkMatter: string) => new RegExp(`(?<name>${darkMatter}) (?<amount>[^\\s]+) have been captured`, 'i'),
    },

    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: [
            /*'Your expedition */'discovered a small asteroid'/* from which some resources could be harvested.'*/,
            /*'On an isolated planetoid we found */'some easily accessible resources fields'/* and harvested some successfully.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Your expedition found an ancient, */'fully loaded but deserted freighter convoy'/*. Some of the resources could be rescued.'*/,
            /*'On a */'tiny moon with its own atmosphere'/* your expedition found some huge raw resources storage. The crew on the ground is trying to lift and load that natural treasure.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Mineral */'belts around an unknown planet contained countless resources'/*. The expedition ships are coming back and their storages are full'*/,
            /*'Your expedition fleet reports the */'discovery of a giant alien ship wreck'/*. They were not able to learn from their technologies but they were able to divide the ship into its main components and made some useful resources out of it'*/,
        ],
        regex: (resources: string[]) => new RegExp(`(?<name>${resources.join('|')}) (?<amount>.+) have been captured`, 'i'),
    },

    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: [
            /*'We came across the */'remains of a previous expedition'/* ! Our technicians will try to get some of the ships to work again.'*/,
            /*'Your expedition ran into the */'shipyards of a colony that was deserted eons ago'/*. In the shipyards hangar they discover some ships that could be salvaged. The technicians are trying to get some of them to fly again.'*/,
            /*'Our expedition found a planet which was */'almost destroyed during a certain chain of wars'/*. There are different ships floating around in the orbit. The technicians are trying to repair some of them. Maybe we will also get information about what happened here.'*/,
            /*'We */'found a deserted pirate station'/*. There are some old ships lying in the hangar. Our technicians are figuring out whether some of them are still useful or not.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Our expedition ran into an */'old automatic shipyard'/*. Some of the ships are still in the production phase and our technicians are currently trying to reactivate the yards energy generators.'*/,
            /*'We found */'the remains of an armada'/*. The technicians directly went to the almost intact ships to try to get them to work again.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'We */'found an enormous spaceship graveyard'/*. Some of the technicians from the expedition fleet were able to get some of the ships to work again.'*/,
            /*'We found the */'planet of an extinct civilization'/*. We are able to see a giant intact space station, orbiting. Some of your technicians and pilots went to the surface looking for some ships which could still be used.'*/,
        ],
        regex: (ships: string[]) => new RegExp(`The following ships are now part of the fleet:\\s*(?<ships>((${ships.join('|')}):\\s*\\d+\\s*)+)?`),
    },

    [ExpeditionEventType.nothing]: [
        /*'Despite the first, */'very promising scans of this sector'/*, we unfortunately returned empty handed.'*/,
        /*'Besides some quaint, */'small pets from a unknown marsh planet'/*, this expedition brings nothing thrilling back from the trip.'*/,
        /*'Your expedition has learnt about */'the extensive emptiness'/* of space. There was not even one small asteroid or radiation or particle that could have made this expedition interesting.'*/,
        /*'A failure in the */'flagships reactor core nearly destroys'/* the entire expedition fleet. Fortunately the technicians were more than competent and could avoid the worst. The repairs took quite some time and forced the expedition to return without having accomplished its goal. */,
        /*'Your expedition took */'gorgeous pictures of a super nova'/*. Nothing new could be obtained from the expedition, but at least there is good chance to win that "Best Picture Of The Universe" competition in next months issue of OGame magazine.'*/,
        /*'Your expedition fleet */'followed odd signals for some time'/*. At the end they noticed that those signals where being sent from an old probe which was sent out generations ago to greet foreign species. The probe was saved and some museums of your home planet already voiced their interest.'*/,
        /*'Well, now we know that those red, */'class 5 anomalies'/* do not only have chaotic effects on the ships navigation systems but also generate massive hallucination on the crew. The expedition didn`t bring anything back.'*/,
        /*'Your expedition nearly */'ran into a neutron stars gravitation field'/* and needed some time to free itself. Because of that a lot of Deuterium was consumed and the expedition fleet had to come back without any results.'*/,
        /*'A */'strange computer virus attacked the navigation system'/* shortly after parting our home system. This caused the expedition fleet to fly in circles. Needless to say that the expedition wasn`t really successful.'*/,
        /*'Our expedition team came across a strange colony that had been abandoned eons ago. After landing, */'our crew started to suffer from a high fever'/* caused by an alien virus. It has been learned that this virus wiped out the entire civilization on the planet. Our expedition team is heading home to treat the sickened crew members. Unfortunately we had to abort the mission and we come home empty handed.'*/,
        /*'Due to a */'failure in the central computers of the flagship'/*, the expedition mission had to be aborted. Unfortunately as a result of the computer malfunction, the fleet returns home empty handed.'*/,
        /*'A */'living being made out of pure energy'/* came aboard and induced all the expedition members into some strange trance, causing them to only gazed at the hypnotizing patterns on the computer screens. When most of them finally snapped out of the hypnotic-like state, the expedition mission needed to be aborted as they had way too little Deuterium.'*/,
    ],

    [ExpeditionEventType.lostFleet]: [
        /*'The last transmission we received from the expedition fleet was this */'magnificent picture of the opening of a black hole'/*.'*/,
        /*'The */'only thing left from the expedition was the following radio transmission'/*: Zzzrrt Oh no! Krrrzzzzt That zrrrtrzt looks krgzzzz like .. AHH! Krzzzzzzzztzzzz...'*/,
        /*'A */'core meltdown of the lead ship'/* leads to a chain reaction, which destroys the entire expedition fleet in a spectacular explosion.'*/,
        /*'Contact with the */'expedition fleet was suddenly lost'/*. Our scientists are still trying to establish contact, but it seems the fleet is lost forever.'*/,
    ],

    [ExpeditionEventType.trader]: [
        /*'Your expedition fleet made */'contact with a friendly alien race'/*. They announced that they would send a representative with goods to trade to your worlds.'*/,
        /*'Your expedition */'picked up an emergency signal'/* during the mission. A mega cargo vessel was caught by a powerful gravitation field generated by a planetoid. After the vessel and cargo was successfully freed, the captain announced that the person who saved them would be their favorite and exclusive client.'*/,
    ],

    [ExpeditionEventType.early]: [
        /*'An */'unexpected back coupling in the energy spools'/* of the engines hastened the expeditions return, it returns home earlier than expected. First reports tell they do not have anything thrilling to account for.'*/,
        /*'Your expeditions doesn`t report any anomalies in the explored sector. But the fleet */'ran into some solar wind while returning'/*. This resulted in the return trip being expedited. Your expedition returns home a bit earlier.'*/,
        /*'The new and daring commander successfully */'traveled through an unstable wormhole'/* to shorten the flight back! However, the expedition itself didn`t bring anything new.'*/,
    ],

    [ExpeditionEventType.delay]: [
        /*'Your */'navigator made a grave error in his computations'/* that caused the expeditions jump to be miscalculated. Not only did the fleet miss the target completely, but the return trip will take a lot more time than originally planned.'*/,
        /*'Your expedition went into a */'sector full of particle storms'/*. This set the energy stores to overload and most of the ships main systems crashed. Your mechanics where able to avoid the worst, but the expedition is going to return with a big delay.'*/,
        /*'For */'unknown reasons the expeditions jump went totally wrong'/*. It nearly landed in the heart of a sun. Fortunately it landed in a known system, but the jump back is going to take longer than thought.'*/,
        /*'The */'solar wind of a red giant'/* ruined the expeditions jump and it will take quite some time to calculate the return jump. There was nothing besides the emptiness of space between the stars in that sector. The fleet will return later than expected.'*/,
        /*'The */'new navigation module is still buggy'/*. The expeditions jump not only lead them in the wrong direction, but it used all the Deuterium fuel. Fortunately the fleets jump got them close to the departure planets moon. A bit disappointed the expedition now returns without impulse power. The return trip will take longer than expected.'*/,
        /*'The expedition`s */'flagship collided with a foreign ship'/* when it jumped into the fleet without any warning. The foreign ship exploded and the damage to the flagship was substantial. The expedition cannot continue in these conditions, and so the fleet will begin to make its way back once the needed repairs have been carried out.'*/,
    ],

    [ExpeditionEventType.item]: {
        regex: /(?<name>.+) has been added to the inventory/i,
    },

    [ExpeditionEventType.pirates]: {
        [ExpeditionEventSize.small]: [
            /*'Some */'really desperate space pirates'/* tried to capture our expedition fleet.'*/,
            /*'Some */'primitive barbarians are attacking us with spaceships'/* that can`t even be named as such. If the fire gets serious we will be forced to fire back.'*/,
            /*'We caught some */'radio transmissions from some drunk pirates'/*. Seems like we will be under attack soon.'*/,
            /*'We needed to */'fight some pirates which'/* were, fortunately, only a few.'*/,
            /*'Our expedition reports that a */'Moa Tikarr'/* and his wild troops request our unconditional capitulation. If they are going to get serious they will have to learn that our ships are able to defend themselves.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'Your expedition had */'an unpleasant rendezvous with some space pirates'/*.'*/,
            /*'We ran straight into an */'ambush set by some Star Buccaneers'/* ! A fight couldn`t be avoided.'*/,
            /*'That emergency signal that the expedition team followed was */'in reality an ambush set up by some Star Buccaneers'/*. A fight could not be avoided.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'The recorded signals didn`t come from a */'foreign being but from a secret pirate base'/* ! They were not really surprised by our presence in their sector.'*/,
            /*'The expedition */'reports tough battles against unidentified pirate'/* ships.'*/,
        ],
    },

    [ExpeditionEventType.aliens]: {
        [ExpeditionEventSize.small]: [
            /*'Some */'exotic looking ships attacked the expedition'/* fleet without warning!'*/,
            /*'Your expedition fleet made some */'unfriendly first contact'/* with an unknown species.'*/,
            /*'Our expedition was */'attacked by a small group of unknown ships'/* !'*/,
            /*'The expeditions fleet reports contact with unknown ships. The */'sensor readings are not decipherable'/*, but it seems that the alien ships are activating their weapon system.'*/,
        ],
        [ExpeditionEventSize.medium]: [
            /*'An */'unknown species is attacking'/* our expedition!'*/,
            /*'Your expedition fleet seems to have */'flown into territory that belongs to'/* an unknown but really aggressive and warlike alien race.'*/,
            /*'The */'connection to our expedition fleet was interrupted'/* for a short time. We could decrypt their last message. They are under heavy attack, the aggressors could not be identified.'*/,
        ],
        [ExpeditionEventSize.large]: [
            /*'Your expedition */'ran into an alien invasion fleet'/* and reports heavy fighting!'*/,
            /*'We had a bit of difficulty */'pronouncing the dialect of the alien race'/* correctly. Our diplomat accidentally called `Fire!` instead of `Peace!`'*/,
            /*'A large Armada of */'crystalline ships of unknown origin'/* take a direct collision course with our expedition-fleet. We should assume the worst.'*/,
        ],
    },

    logbookRegex: /(Entry from the communications officers logbook|Logbook addition of the communication officer):(?<text>.+)/i,
    depletionMessages: {
        [ExpeditionDepletionLevel.none]: [
            /*'It seems that */'this part of the universe has not been explored'/* yet'*/,
            /*'It feels */'great to be the first ones traveling'/* through an unexplored sector'*/,
        ],
        [ExpeditionDepletionLevel.low]: [
            /*'It seems that */'no human has been in this part of the galaxy'/* before'*/,
            /*'We found */'debris of ancient space ships'/*. We are not the first ones here.'*/,
            /*'We */'nearly had a collision with another expedition fleet'/*. I did not believe that there would be others around here'*/,
        ],
        [ExpeditionDepletionLevel.medium]: [
            /*'We */'celebrated the expeditions fulfillment with the crew members'/* of another expedition fleet which where on their way in the same sector. They have nothing new to report.'*/,
            /*'We found */'proof indicating the presence of multiple expedition fleets'/* in the area. We are returning home.'*/,
            /*'We */'established friendly radio contact with some other expeditions'/* in this sector.'*/,
        ],
        [ExpeditionDepletionLevel.high]: [
            /*'If we felt in danger */'we could return with all the other expeditions flying around'/* here.'*/,
        ],
    },
};