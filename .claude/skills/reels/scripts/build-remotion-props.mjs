#!/usr/bin/env node
/**
 * Build Remotion input props from finalized Reels manifests.
 *
 * Usage:
 *   node .claude/skills/reels/scripts/build-remotion-props.mjs --slug 170
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const FPS = 30;

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i += 1) {
    if (args[i].startsWith('--')) {
      parsed[args[i].slice(2)] = args[i + 1];
      i += 1;
    }
  }
  return parsed;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function splitCaption(text) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  const beats = [];
  for (let i = 0; i < words.length; i += 4) {
    beats.push(words.slice(i, i + 4).join(' '));
  }
  return beats;
}

const captionBeatOverridesBySlug = {
  225: {
    1: [
      'In Korea, the fastest ride\nis not always the best route.',
      'KTX, SRT, and buses\nsolve different problems.',
    ],
    2: [
      'Start with your hotel,\nnot the vehicle.',
      'Seoul Station points you\ntoward KTX.',
      'Gangnam or Songpa\ncan make Suseo easier.',
    ],
    3: [
      'Pick by station first:',
      'central Seoul means KTX,',
      'Gangnam means SRT,',
      'smaller cities can mean bus.',
    ],
    4: [
      'KTX is the classic\nlong-distance choice,',
      'especially for Busan,\nDaegu, Daejeon,',
      'Gyeongju, and major\nrail corridors.',
    ],
    5: [
      'But buses are not\na downgrade.',
      'For smaller cities,\nbeaches, temples, festivals,',
      'or sold-out trains,',
      'the terminal can win.',
    ],
    6: [
      'Compare door-to-door time:',
      'hotel to station,\nplatform buffer,',
      'main ride,\narrival transfer,',
      'and luggage stress.',
    ],
    7: [
      'Save this before booking\nintercity travel in Korea.',
      'More Korea travel\nguides at',
      'epicKor.com',
    ],
  },
  228: {
    1: [
      'A Korean temple stay\nis not a spa night',
      'with better scenery.\nIt is a real temple schedule.',
    ],
    2: [
      'You are joining\na hosted cultural program',
      'inside an active\nBuddhist temple,',
      'with guides, monks,\nstaff, and rules.',
    ],
    3: [
      'So pick the\nprogram type first:',
      'day program, rest stay,',
      'experience stay,\nor overnight.',
      'Do not book by\nthe prettiest photo.',
    ],
    4: [
      'Depending on the temple,',
      'you might meditate,\ndrink tea, eat simply,',
      'join chanting,\nor do one hundred eight bows.',
    ],
    5: [
      'The basic rule\nis simple:',
      'dress modestly,\nkeep your phone quiet,',
      'arrive on time,\nand ask before filming',
      'people or ceremonies.',
    ],
    6: [
      'For Seoul,\nchoose easy access.',
      'For a mountain temple,\ncheck weather, stairs,',
      'bedding, luggage,\nand the last bus.',
    ],
    7: [
      'Save this before booking\na Korea temple stay.',
      'More Korean culture\nguide at',
      'epicKor.com',
    ],
  },
  229: {
    1: [
      'In Korea, the floor\nis not just floor.',
      'It is where\nlife happens.',
    ],
    2: [
      'That is why shoes stop\nat the entrance',
      'before your body fully\nenters the clean space.',
    ],
    3: [
      'Ondol made warm\nfloors normal,',
      'so sitting, eating,\nand sleeping closer',
      'to the floor actually\nmade sense.',
    ],
    4: [
      'The mistake is thinking\nthis is ancient cosplay.',
      'Low tables and mats are also\nflexible modern furniture.',
    ],
    5: [
      'Here is the rule\nto save:',
      'outside shoes stay out,',
      'clean socks or guest\nslippers stay in,',
      'and bathroom slippers stay\nin the bathroom.',
    ],
    6: [
      'So do not roll\na suitcase',
      'across the clean floor,',
      'and do not wander out\nwearing bathroom slippers.',
    ],
    7: [
      'Save this before\na Korean home visit,',
      'hanok stay,\nfloor-seat restaurant,',
      'or jjimjilbang.',
      'More Korean culture\nguide at',
      'epicKor.com',
    ],
  },
  197: {
    1: [
      'Boryeong Mud Festival\nis the one Korea summer',
      'event where your outfit\nis basically supposed to lose.',
    ],
    2: [
      'The 2026 dates are\nJuly twenty-fourth',
      'to August ninth,\nat Daecheon Beach,',
      'about two hundred kilometers\nfrom Seoul.',
    ],
    3: [
      'It is not one mud pit.',
      'It is slides, pools,\nbeach energy, performances,',
      'and a lot of people\nmaking questionable but',
      'memorable choices.',
    ],
    4: [
      'Your packing list is\nthe difference between',
      'hilarious and miserable:\nphone pouch, water shoes,',
      'sunscreen, towel,\nand a dry change.',
    ],
    5: [
      'If you go from Seoul,\ndecide your return plan',
      'before you get muddy.',
      'Train, bus, shuttle,\nor overnight,',
      'but do not freestyle it\nat night.',
    ],
    6: [
      'The biggest rookie mistake\nis protecting your clothes',
      'better than your phone,\nfeet, and skin.',
    ],
    7: [
      'Save this if your Korea trip\ntouches late July.',
      'More Korea travel guides\nat epickor.com.',
    ],
  },
  196: {
    1: [
      'Korea just turned\nWorld Cup morning kickoffs',
      'into a national\nbrunch appointment.',
    ],
    2: [
      'The clock is\nthe whole joke:',
      'same red shirts,\nvery different snacks.',
    ],
    3: [
      'And this is not\nnostalgia content.',
      'Son, Lee Kang-in,\nKim Min-jae, and',
      'Hwang Hee-chan\nare why casual fans',
      'are checking the score.',
    ],
    4: [
      'After the Czechia comeback,',
      'the group chat version\nis simple:',
      'Korea did the dramatic\nthing before lunch.',
    ],
    5: [
      'So in Seoul, a match\ncan feel like',
      'a public festival,\nan office excuse,',
      'and a snack run\nall at once.',
    ],
    6: [
      'If you are visiting,\nbring red, water,',
      'sunscreen, and patience.',
      'Do not bring\nmain-character energy.',
    ],
    7: [
      'Save this if you are\nin Korea during the World Cup.',
      'More Korea culture guides\nat epickor.com.',
    ],
  },
  170: {
    1: [
      'Foreigners hear "PC bang"',
      'and think internet cafe.',
      'Korea means something',
      'very different.',
    ],
    2: [
      'A PC bang is',
      'a gaming lounge,',
      'snack bar,',
      'esports room,',
      'and cheap hangout',
      'in one place.',
    ],
    3: [
      'You pay by time,',
      'sit at a powerful computer,',
      'log in,',
      'and start playing',
      'almost instantly.',
    ],
    4: [
      'The social part matters.',
      'Friends sit in rows,',
      'play together,',
      'shout quietly,',
      'and turn online games',
      'into an offline plan.',
    ],
    5: [
      'Then comes the food.',
      'In many PC bangs,',
      'ramyeon, fried rice,',
      'drinks, and snacks',
      'come right to your seat.',
    ],
    6: [
      'That frictionless setup',
      'helped make gaming feel normal',
      'in Korea,',
      'not hidden in a bedroom.',
    ],
    7: [
      'So if you visit Seoul,',
      'try one respectfully.',
      'Do not film strangers.',
      'Order something simple.',
      'Feel how local the room is.',
    ],
    8: [
      'For the full guide,',
      'read EpicKor\'s',
      'Korean PC bang',
      'culture article.',
    ],
  },
  171: {
    1: [
      'Tourists look for',
      'a special Korean breakfast.',
      'Locals often solve',
      'the morning at',
      'a convenience store.',
    ],
    2: [
      'A Korean convenience store breakfast',
      'is not one menu.',
      'It is tiny choices:',
      'rice, bread, coffee,',
      'milk, eggs.',
    ],
    3: [
      'The safest first pick',
      'is triangle gimbap.',
      'Rice, filling, and seaweed',
      'in one neat',
      'commute food.',
    ],
    4: [
      'Match the order',
      'to your day.',
      'Walking a lot?',
      'Choose rice.',
      'Not hungry yet?',
      'Bread and coffee.',
    ],
    5: [
      'If you try triangle gimbap,',
      'the wrapper matters.',
      'Pull tab one first,',
      'then the side wrappers.',
    ],
    6: [
      'And if the store has seats,',
      'keep it quick.',
      'Eat, tidy up,',
      'and leave space',
      'for the next person.',
    ],
    7: [
      'Try the simple local order:',
      'triangle gimbap,',
      'one drink,',
      'and one small extra.',
      'Full guide on EpicKor.com.',
    ],
  },
  172: {
    1: [
      'First-timers at Korean BBQ',
      'often make one mistake.',
      'They treat it like',
      'a steak dinner',
      'with a grill',
      'in the middle.',
    ],
    2: [
      'But the table',
      'is the point.',
      'Meat, banchan, leaves,',
      'sauces, rice,',
      'and stew all',
      'work together.',
    ],
    3: [
      'The grill has',
      'a rhythm.',
      'Wait, flip, cut,',
      'move cooked pieces aside,',
      'then eat while',
      'the next batch cooks.',
    ],
    4: [
      'And the lettuce wrap,',
      'or ssam,',
      'is supposed to be',
      'one bite.',
      'Not a giant',
      'leafy sandwich.',
    ],
    5: [
      'If someone is managing',
      'the grill,',
      'let them lead.',
      'Korean BBQ is shared food,',
      'not private plate building.',
    ],
    6: [
      'Start simple:',
      'one main meat,',
      'a few banchan,',
      'light sauce,',
      'and smaller wraps.',
      'You can always order more.',
    ],
    7: [
      'Follow the table,',
      'not a script.',
      'Full Korean BBQ guide',
      'on EpicKor.com.',
    ],
  },
  173: {
    1: [
      'Korea\'s tourist shopping route',
      'has changed.',
      'It is not just',
      'palaces, duty-free,',
      'and one souvenir run anymore.',
    ],
    2: [
      'The new route is',
      'Olive Young, Daiso, Musinsa,',
      'pharmacies, and skin clinics.',
      'Ordinary Korean stops',
      'became travel stops.',
    ],
    3: [
      'Olive Young works because',
      'it makes K-beauty searchable',
      'in real life.',
      'Sunscreen, toner pads, lip tint,',
      'patches, all in one place.',
    ],
    4: [
      'Daiso is different.',
      'It is where tourists understand',
      'Korean micro-solutions:',
      'pouches, socks, travel tools,',
      'stickers, and tiny useful things.',
    ],
    5: [
      'Musinsa turns Korean fashion',
      'from something you saw online',
      'into racks you can actually',
      'try, compare, and buy.',
    ],
    6: [
      'Pharmacies and skin clinics',
      'need more caution.',
      'Ask clear questions,',
      'check what is safe for you,',
      'and do not treat medical stops',
      'like a haul.',
    ],
    7: [
      'Build the route around one area,',
      'not your whole suitcase.',
      'Full Korea shopping guide',
      'on EpicKor.com.',
    ],
  },
  174: {
    1: [
      'Seoul subway looks easy.',
      'The map is simple,',
      'but the quiet rhythm',
      'is what tourists usually miss.',
    ],
    2: [
      'First, let people get off',
      'before you board.',
      'Stand to the sides,',
      'leave the center open,',
      'then move inside.',
    ],
    3: [
      'A train can be packed',
      'and still quiet.',
      'Keep your voice low,',
      'use headphones,',
      'and save long calls',
      'for after you exit.',
    ],
    4: [
      'Priority seats work',
      'differently in Korea.',
      'If you do not',
      'genuinely need one,',
      'leave it empty,',
      'even when it looks available.',
    ],
    5: [
      'Your bag has etiquette too.',
      'Take backpacks off',
      'in crowded cars,',
      'keep suitcases out',
      'of doorways,',
      'and make yourself smaller.',
    ],
    6: [
      'Do not turn the train',
      'into a snack space.',
      'Eat station food',
      'before boarding,',
      'and keep open drinks',
      'or strong smells',
      'off the car.',
    ],
    7: [
      'If you get lost,',
      'step aside first.',
      'Check the exit number,',
      'reset your route,',
      'then rejoin the flow.',
    ],
    8: [
      'Seoul subway is easy',
      'when you respect the quiet.',
      'Full subway etiquette',
      'guide on EpicKor.com.',
    ],
  },
  175: {
    1: [
      'Korean traditional markets',
      'are not just nostalgia.',
      'They are Seoul\'s',
      'backstage,',
      'where the city still buys,',
      'eats, moves, and works.',
    ],
    2: [
      'Namdaemun feels like',
      'an everyday survival kit:',
      'socks, kitchen tools,',
      'snacks, ginseng, bags,',
      'street food,',
      'and practical gifts.',
    ],
    3: [
      'Dongdaemun is different.',
      'It is a fashion machine,',
      'where clothes, fabric,',
      'buyers,',
      'and late-night work',
      'keep moving.',
    ],
    4: [
      'Choose by mission.',
      'Namdaemun is easier',
      'for first market energy.',
      'Dongdaemun is better',
      'for fashion systems',
      'and night movement.',
    ],
    6: [
      'Do not try',
      'to complete the maze.',
      'Pick one mission:',
      'eat, buy gifts,',
      'study fashion,',
      'or just watch',
      'the city work.',
    ],
    5: [
      'The reason these markets',
      'still matter is simple:',
      'locals still use them.',
      'They are not just',
      'photo spots for travelers.',
    ],
    7: [
      'Old markets are not',
      'leftovers.',
      'They are maps',
      'of Seoul itself.',
      'Full market guide',
      'on EpicKor.com.',
    ],
  },
  176: {
    1: [
      'The hardest part',
      'of a Korean jjimjilbang',
      'is not the heat.',
      'It is knowing',
      'what happens next.',
    ],
    2: [
      'First, shoes go',
      'in one locker.',
      'Then your clothes',
      'and bag go in another.',
      'The key matters.',
    ],
    3: [
      'There are two zones.',
      'Wet bath areas',
      'are gender-separated',
      'and usually nude.',
      'Common sauna rooms',
      'use the uniform.',
    ],
    4: [
      'The biggest rule',
      'is simple.',
      'Shower before any bath,',
      'keep your phone away,',
      'and do not stare.',
    ],
    5: [
      'In the common area,',
      'go slow.',
      'Try one warm room,',
      'drink water or sikhye,',
      'then rest.',
    ],
    6: [
      'Bring less than you think.',
      'Skincare, a hair tie,',
      'maybe earplugs.',
      'Skip big luggage',
      'if you can.',
    ],
    7: [
      'Once you know',
      'the system,',
      'it feels less scary.',
      'Full jjimjilbang guide',
      'on EpicKor.com.',
    ],
  },
  177: {
    1: [
      'Korean cafe culture',
      'is not really',
      'about caffeine.',
      'It is about',
      'finding a place',
      'to pause.',
    ],
    2: [
      'In Seoul,',
      'a cafe can be',
      'a date spot,',
      'study room,',
      'shopping break,',
      'charging station,',
      'and dessert stop.',
    ],
    3: [
      'The trick is',
      'reading the cafe type.',
      'Cheap chain, roaster,',
      'dessert cafe, work cafe,',
      'concept cafe.',
      'Each one wants',
      'different behavior.',
    ],
    4: [
      'That is why Seongsu,',
      'Yeonnam, and hanok cafes',
      'feel like destinations,',
      'not waiting rooms.',
    ],
    5: [
      'But cafe work',
      'has rules.',
      'If you stay long,',
      'buy again,',
      'keep your setup small,',
      'and avoid peak-hour',
      'table hogging.',
    ],
    6: [
      'Order simple first.',
      'Iced Americano',
      'is the default.',
      'Cream coffee or dessert',
      'is the social version.',
    ],
    7: [
      'Plan one famous cafe.',
      'Then leave room',
      'for the cafe',
      'you actually need.',
      'Full guide on',
      'EpicKor.com.',
    ],
  },
  178: {
    1: [
      'In Korea,',
      'dinner can start',
      'with one scroll.',
      'That\'s the Baemin effect.',
    ],
    2: [
      'Delivery was already',
      'normal here:',
      'chicken, noodles,',
      'jajangmyeon, flyers,',
      'phone calls.',
    ],
    3: [
      'Baemin changed',
      'the interface.',
      'Now cravings',
      'are searchable,',
      'visual, rated, timed,',
      'and saved.',
    ],
    4: [
      'So instead of asking,',
      'which restaurant',
      'do I call,',
      'people ask,',
      'what am I',
      'in the mood for?',
    ],
    5: [
      'Restaurants changed too.',
      'Menus, photos,',
      'packaging, and fees',
      'all had to work',
      'inside the app.',
    ],
    6: [
      'But for visitors,',
      'the app still needs',
      'local pieces:',
      'address, phone number,',
      'payment, and',
      'building access.',
    ],
    7: [
      'That\'s why',
      'Baemin matters.',
      'It turned an old',
      'Korean habit into',
      'daily infrastructure.',
      'Full guide at',
      'EpicKor.com.',
    ],
  },
  179: {
    1: [
      'Korean drinking culture',
      'is not just about',
      'soju shots.',
      'It is really',
      'about the table.',
    ],
    2: [
      'The drink matters,',
      'but anju matters',
      'just as much:',
      'chicken, pajeon,',
      'stew, and food',
      'everyone shares.',
    ],
    3: [
      'Soju usually means',
      'barbecue or pocha.',
      'Makgeolli says pajeon',
      'and slow conversation.',
      'Beer says chimaek.',
    ],
    4: [
      'People pour,',
      'pass food,',
      'refill water,',
      'and read the mood.',
      'That is the social part.',
    ],
    5: [
      'Etiquette helps,',
      'but boundaries',
      'matter more.',
      'Use two hands,',
      'pace yourself,',
      'and say early',
      'if you are not drinking.',
    ],
    6: [
      'For a first night,',
      'keep it simple:',
      'order one anju,',
      'keep water close,',
      'and follow the pace.',
    ],
    7: [
      'The real culture',
      'is food, rhythm,',
      'and respect.',
      'Full Korean drinking',
      'guide at EpicKor.com.',
    ],
  },
  180: {
    1: [
      'Bukchon looks like',
      'the perfect Seoul',
      'photo spot.',
      'That is exactly why',
      'you need',
      'to slow down.',
    ],
    2: [
      'Those hanok alleys',
      'are not',
      'a theme park.',
      'People still live',
      'behind those doors.',
    ],
    3: [
      'The photo works because',
      'old roofs,',
      'narrow streets,',
      'palaces,',
      'and modern Seoul',
      'all meet',
      'in one frame.',
    ],
    4: [
      'But the rule',
      'is simple:',
      'take the photo',
      'without taking over',
      'the neighborhood.',
    ],
    5: [
      'Since 2025,',
      'the strictest',
      'Red Zone has',
      'tourist hours',
      'from 10 AM',
      'to 5 PM,',
      'with fines',
      'outside the rules.',
    ],
    6: [
      'So plan',
      'a short, quiet route:',
      'Anguk, one hill,',
      'one cafe,',
      'and no filming',
      'private homes.',
    ],
    7: [
      'The best',
      'Bukchon memory',
      'is not',
      'the loudest shot.',
      'It is leaving',
      'the street',
      'as calm',
      'as you found it.',
    ],
  },
  181: {
    1: [
      'Korean webtoons',
      'did not just move',
      'comics online.',
      'They changed',
      'the shape of reading.',
    ],
    2: [
      'The trick is',
      'vertical scroll:',
      'your thumb controls',
      'the timing,',
      'the silence,',
      'and the reveal.',
    ],
    3: [
      'Naver turned',
      'that habit',
      'into a platform:',
      'weekly episodes,',
      'comments, rankings,',
      'and paid early access.',
    ],
    4: [
      'For studios,',
      'a hit webtoon',
      'is tested IP',
      'before the camera',
      'ever rolls.',
    ],
    5: [
      'That is why',
      'stories can jump',
      'from phone panels',
      'to Netflix queues',
      'and K-drama fandoms.',
    ],
    6: [
      'Now global brands',
      'are learning',
      'the same format:',
      'mobile first,',
      'scroll first,',
      'binge later.',
    ],
    7: [
      'Start with',
      'the genre you love.',
      'The next Korean story',
      'may already be',
      'under your thumb.',
    ],
  },
  182: {
    1: [
      'In a Korean office,',
      '6 PM can mean',
      'two different things:',
      'the workday is over,',
      'or everyone is waiting',
      'to see who leaves first.',
    ],
    2: [
      'There is the',
      'official clock,',
      'and then there is',
      'the emotional clock.',
      'The second one',
      'is usually louder.',
    ],
    3: [
      'That is why hierarchy',
      'shows up in tiny moves:',
      'who speaks first,',
      'who disagrees,',
      'and who gets copied.',
    ],
    4: [
      'Nunchi is the skill',
      'underneath it.',
      'You read the room',
      'before the room',
      'says anything.',
    ],
    5: [
      'Overtime changed on paper.',
      'But feeling allowed',
      'to go home',
      'is not the same',
      'as feeling safe',
      'to go home.',
    ],
    6: [
      'Then comes hoesik:',
      'dinner, chicken, beer,',
      'and the meeting',
      'after the meeting.',
    ],
    7: [
      'The new Korean office',
      'is not rejecting teamwork.',
      'It is renegotiating',
      'what loyalty is allowed',
      'to cost.',
      'More Korea culture',
      'at epickor.com.',
    ],
  },
  183: {
    1: [
      'In Seoul summer,',
      'the map can lie.',
      'A ten-minute walk',
      'with no shade',
      'can feel much longer',
      'than it looks.',
    ],
    2: [
      'The real question',
      'is not how far',
      'it is.',
      'It is where',
      'the next shade,',
      'subway, cafe,',
      'or cool room is.',
    ],
    3: [
      'Build the day',
      'in heat zones:',
      'morning outside,',
      'midday inside,',
      'evening back',
      'on the street.',
    ],
    4: [
      'Seoul is planning',
      'for heat now:',
      'shade, cooling spaces,',
      'and shelters',
      'are part of the city.',
    ],
    5: [
      'Use the subway',
      'like a cooling network.',
      'Walk for a purpose,',
      'then go underground',
      'before the heat',
      'makes decisions for you.',
    ],
    6: [
      'Pack like your day bag',
      'is a tiny',
      'cooling system:',
      'water, fan, towel,',
      'sunscreen,',
      'and light layers.',
    ],
    7: [
      'The best Seoul summer',
      'itinerary plans',
      'the cool-down',
      'before you need it.',
      'More Korea culture',
      'at epickor.com.',
    ],
  },
  184: {
    1: [
      'In Korea,',
      'four-cut photo booths',
      'are not just',
      'tiny souvenirs.',
      'They are a',
      'five-minute ritual.',
    ],
    2: [
      'A phone photo',
      'gives you endless tries.',
      'The booth gives you',
      'a countdown,',
      'a frame,',
      'and one small',
      'printed proof.',
    ],
    3: [
      'That is why',
      'the booth feels like',
      'a tiny studio:',
      'lights, mirrors,',
      'props, curtains,',
      'and panic poses.',
    ],
    4: [
      'The awkward part',
      'is the point.',
      'You choose poses fast,',
      'laugh too early,',
      'and keep the mistake.',
    ],
    5: [
      'Then fandom frames',
      'turn it into',
      'a Hallyu stop:',
      'idols, characters,',
      'comeback moments,',
      'and limited designs.',
    ],
    6: [
      'Before you leave,',
      'do three things:',
      'choose a simple frame,',
      'save the QR file,',
      'and keep the strip flat.',
    ],
    7: [
      'That little strip',
      'says you were there,',
      'and who you were with.',
      'More Korea culture',
      'at epickor.com.',
    ],
  },
  185: {
    1: [
      'Seoul is famous',
      'for moving fast.',
      'So of course',
      'it made doing nothing',
      'a competition.',
    ],
    2: [
      'At the Hangang',
      'Space-Out Competition,',
      'people sit still',
      'for 90 minutes.',
      'No phone.',
      'No talking.',
      'No productive little',
      'task.',
    ],
    3: [
      'And that is why',
      'the joke works.',
      'In a city',
      'built around speed,',
      'stillness suddenly',
      'looks radical.',
    ],
    4: [
      'The Han River',
      'matters here.',
      'It is not just',
      'a view.',
      'It is where',
      'Seoul goes',
      'to recover.',
    ],
    5: [
      'People bring mats,',
      'snacks, drinks,',
      'tiny lamps,',
      'and just enough room',
      'to breathe for a while.',
    ],
    6: [
      'Korea often turns',
      'rest into a format:',
      'cafe break,',
      'jjimjilbang,',
      'temple stay,',
      'river picnic.',
    ],
    7: [
      'If your Seoul itinerary',
      'is already packed,',
      'do not add wellness',
      'as one more task.',
      'Replace something.',
      'Save this before',
      'you overplan Seoul.',
      'epicKor.com',
    ],
  },
  186: {
    1: [
      'Eating alone in Korea used to feel awkward.',
      'Now it has a name.',
    ],
    2: [
      'Honbap means eating alone.',
      'Honsul means drinking alone.',
    ],
    3: [
      'And no, it does not automatically mean lonely.',
    ],
    4: [
      'Korea still loves group meals.',
      'But more people live alone,',
      'work weird hours, travel solo,',
      'and eat on their own schedule.',
    ],
    5: [
      'So the food system adapted:',
      'counter seats, convenience-store meals,',
      'delivery, cafes, and one-person bowls.',
    ],
    6: [
      'Start with kimbap, noodles, gukbap,',
      'food courts, or convenience stores.',
      'For Korean BBQ, ask first.',
    ],
    7: [
      'Say: hona-ja muk-u-do joa-yo?\n혼자 먹어도 좋아요?',
    ],
    8: [
      'Save this before your solo Korea trip.',
    ],
  },
  187: {
    1: [
      'Some Korean superstitions\nsound fake',
      'until they change\nwhat people actually do.',
    ],
    2: [
      'Like this: in Korea,\nsome elevators',
      'use F instead of 4,',
      'because four sounds\nclose to death.',
    ],
    3: [
      'And this one\nmatters more:',
      'do not write a living\nperson\'s name in red ink.',
    ],
    4: [
      'It can feel rude,\nunlucky, or death-coded.',
      'Use black or blue.\nEasy.',
    ],
    5: [
      'Then there is\nfan death.',
      'No, a normal fan\nis not secretly magic.',
      'But the belief\nis famous enough',
      'that Korean fans\noften have timers.',
    ],
    6: [
      'So if your host says,\nset the timer,',
      'do not turn it\ninto a debate.',
    ],
    7: [
      'Seaweed soup before a test?\nBad joke.',
      'Shoes for your partner?\nRisky joke.',
      'You do not have to\nbelieve every superstition.',
      'You just need to know',
      'which ones make\na moment awkward.',
      'Save this before\nyour Korea trip.',
    ],
  },
  188: {
    1: [
      'Seoul is the Korea\nmost travelers meet first.',
    ],
    2: [
      'Busan is the Korea\nthat changes the mood.',
    ],
    3: [
      'If this is your first trip\nand you have under five full days,',
      'pick Seoul.',
    ],
    4: [
      'It gives you palaces,\nshopping, K-beauty,',
      'nightlife, cafes,\nand the easiest transit',
      'in one tight city.',
    ],
    5: [
      'But if you want sea air,\nseafood, beaches,',
      'coastal walks,\nand a slower night,',
      'Busan is not\na side quest.',
    ],
    6: [
      'Here is the rule.',
      'Short first trip?\nSeoul first.',
      'Six or seven days?\nSeoul plus Busan works.',
      'Repeat trip?\nGive Busan real time.',
    ],
    7: [
      'Do not add Busan\nbecause you feel guilty.',
      'Travel by fit,\nnot by checklist.',
      'Save this before\nyou book Korea.',
    ],
  },
  189: {
    1: [
      'Most tourists think the DMZ\nis one place. It is not.',
    ],
    2: [
      'Imjingak, Dora Observatory,\nthe Third Tunnel,',
      'and the JSA are different\nlevels of access.',
    ],
    3: [
      'And a normal DMZ tour',
      'does not automatically\ninclude the JSA.',
    ],
    4: [
      'You are not wandering around\na border like a museum.',
    ],
    5: [
      'You are following\na tour route,',
      'with passport checks,\nmilitary rules,',
      'and access\nthat can change.',
    ],
    6: [
      'Bring your passport.\nWear real walking shoes,',
      'because the Third Tunnel\nis more physical than it looks.',
    ],
    7: [
      'And do not book\nsomething tight right after,',
      'because the schedule\ncan shift.',
      'Save this before you book\na DMZ tour from Seoul.',
    ],
  },
  190: {
    1: [
      'Save these three numbers\nbefore you get sick in Korea.',
    ],
    2: [
      '119 is for\nambulance, fire,',
      'and real emergencies.',
      '1330 is the Korea\ntravel hotline.',
      '1339 is for\npublic-health guidance.',
    ],
    3: [
      'Korean healthcare is strong,',
      'but you still need to\nchoose the right door.',
    ],
    4: [
      'For a mild cold,',
      'stomach issue,\nor motion sickness,',
      'a pharmacy may be\nthe fastest first stop.',
    ],
    5: [
      'Need a doctor,\nbut it is not an emergency?',
      'Look for a local clinic.',
    ],
    6: [
      'If it is serious,\ndo not overthink it.',
      'Use a hospital\nor call 119.',
    ],
    7: [
      'Bring travel insurance,\nyour passport,',
      'medication names,\nand allergy info.',
      'This is travel prep,\nnot medical advice.',
    ],
  },
  191: {
    1: [
      'Korean college is\nnot just study hard.',
    ],
    2: [
      'It is study hard,\nsocialize hard,',
      'and start planning\nyour future early.',
    ],
    3: [
      'After years of\nentrance-exam pressure,',
      'university can feel\nlike freedom.',
      'But the pressure\ndoes not disappear.',
      'It changes shape.',
    ],
    4: [
      'Students join clubs,\ngo to festivals,',
      'take MT trips,\nbuild friend groups,',
      'and sometimes drink way more\nthan they expected.',
    ],
    5: [
      'But at the same time,',
      'they are thinking about grades,',
      'internships, language scores,',
      'certificates, and jobs.',
    ],
    6: [
      'It can look like a party\nfrom the outside.',
      'But underneath it,\nthere is hierarchy,',
      'career anxiety,\nschool prestige,',
      'and a lot of\nsocial effort.',
    ],
    7: [
      'So Korean university life\nis not just school.',
      'It is a mirror\nof modern Korea.',
      'Save this if you want\nto understand young Korea.',
    ],
  },
  198: {
    1: [
      'Waterbomb is where your cute\nSeoul outfit can betray you.',
    ],
    2: [
      'It is a music festival,\na water fight,',
      'and late-July humidity\nall at once.',
    ],
    3: [
      'So dress to dry,\nnot just to pose.',
    ],
    4: [
      'Before you enter,\nseal your phone.',
      'Test the pouch with tissue\nat the hotel.',
    ],
    5: [
      'Keep the bag tiny:\nphone pouch, small towel,',
      'SPF,\ndry shirt.',
      'Leave the best bag\nat the hotel.',
    ],
    6: [
      'And plan the exit before\nyour battery is red,',
      'because the real ending is\ngetting home wet and tired.',
    ],
    7: [
      'Save this before\nWaterbomb Seoul.',
      'More Korea travel guides\nat epickor.com.',
    ],
  },
  192: {
    1: [
      'Olive Young is where\nK-beauty gets useful,',
      'and dangerous.',
    ],
    2: [
      'The store is designed',
      'to make every shelf\nfeel urgent.',
    ],
    3: [
      'So do not start\nby reading every label.',
      'Walk the store\nonce first.',
    ],
    4: [
      'Then use the simple',
      'one-one-one rule.',
    ],
    5: [
      'Buy one thing\nyou actually need,',
      'one thing you\nare curious about,',
      'and one small gift.',
    ],
    6: [
      'The easy wins are sunscreen,\ntoner pads, lip tints,',
      'patches, and travel minis.',
      'Skip giant routines',
      'you cannot test or pack.',
    ],
    7: [
      'Save this before your\nfirst Olive Young run.',
      'More Korea shopping guides',
      'at epickor.com.',
    ],
  },
};

const captionStartFrameOverridesBySlug = {
  197: {
    3: [0, 38, 92, 138],
  },
  172: {
    1: [0, 51, 79, 96, 111, 129],
  },
  173: {
    1: [0, 34, 55, 82, 112],
    2: [0, 32, 78, 116, 150],
    3: [0, 34, 69, 96, 139],
    4: [0, 38, 78, 113, 160],
    5: [0, 34, 76, 119],
    6: [0, 32, 61, 89, 127, 170],
    7: [0, 45, 86, 116],
  },
  175: {
    1: [0, 24, 58, 80, 104, 141],
    3: [0, 30, 76, 108, 130, 152],
    7: [0, 28, 50, 72, 98, 123],
  },
  183: {
    6: [0, 36, 57, 74, 98, 116],
  },
  185: {
    4: [0, 34, 66, 88, 102, 116, 130],
  },
  186: {
    1: [0, 61],
    2: [0, 35],
    3: [0],
    4: [0, 32, 66, 101],
    5: [0, 42, 84],
    6: [0, 40, 73],
    7: [0],
    8: [0],
  },
  188: {
    3: [0, 70],
  },
  198: {
    5: [0, 68, 100],
  },
  192: {
    1: [0, 42],
    2: [0, 40],
    3: [0, 58],
    4: [0, 30],
    5: [0, 50, 88],
    6: [0, 48, 88, 128],
    7: [0, 58, 104],
  },
  228: {
    5: [0, 44, 96, 134],
    7: [0, 66, 106],
  },
  229: {
    7: [0, 72, 118, 154, 201],
  },
  225: {
    3: [0, 42, 82, 122],
    5: [0, 55, 108, 144],
    6: [0, 42, 84, 124],
    7: [0, 56, 92],
  },
};

const sceneDurationFrameOverridesBySlug = {
  225: {
    1: 162,
    2: 180,
    3: 174,
    4: 168,
    5: 192,
    6: 174,
    7: 144,
  },
  185: {
    // Tuned from part-02 silence detection so scenes 4-6 stay synced after "goes to recover."
    4: 144,
    5: 108,
    6: 136,
  },
  189: {
    // Add a little breathing room after fast scene-level TTS so the DMZ Reel does not feel rushed.
    1: 102,
    2: 152,
    3: 118,
    4: 102,
    5: 168,
    6: 160,
    7: 193,
  },
};

function getCaptionBeats(scene, reelSlug) {
  return captionBeatOverridesBySlug[reelSlug]?.[scene.number] || splitCaption(scene.subtitleText || scene.narration);
}

function captionBeatWeight(beat) {
  const text = String(beat || '');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const pauses = (text.match(/[,:;.!?]/g) || []).length;
  return Math.max(1, words + pauses * 0.45);
}

function getCaptionBeatStartFrames(beats, durationFrames, reelSlug, sceneNumber) {
  if (!beats.length) return [];
  const overrides = captionStartFrameOverridesBySlug[reelSlug]?.[sceneNumber];
  if (overrides?.length === beats.length) {
    return overrides.map((frame) => Math.min(durationFrames - 1, Math.max(0, frame)));
  }
  const weights = beats.map(captionBeatWeight);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let cursor = 0;
  return beats.map((_, index) => {
    const start = index === 0 ? 0 : Math.min(durationFrames - 1, Math.round(cursor));
    cursor += (weights[index] / total) * durationFrames;
    return start;
  });
}

function usesReadableBandCaptions(reelSlug) {
  const numericSlug = Number(reelSlug);
  return !Number.isFinite(numericSlug) || numericSlug >= 186;
}

function getAudioDurationSeconds(filePath) {
  if (!fs.existsSync(filePath)) return null;

  const result = spawnSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', filePath],
    { encoding: 'utf8' }
  );

  if (result.status === 0) {
    const duration = Number(String(result.stdout || '').trim());
    if (Number.isFinite(duration) && duration > 0) return duration;
  }

  if (filePath.toLowerCase().endsWith('.mp3')) {
    const bytes = fs.statSync(filePath).size;
    const elevenLabsOutputBitrate = 128000;
    const estimated = (bytes * 8) / elevenLabsOutputBitrate;
    return Number.isFinite(estimated) && estimated > 0 ? estimated : null;
  }

  return null;
}

function narrationWeight(scene) {
  const text = String(scene.subtitleText || scene.narration || '');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const sentencePauses = (text.match(/[.!?]/g) || []).length;
  return Math.max(1, words + sentencePauses * 1.8);
}

const parsedArgs = parseArgs();
const { slug } = parsedArgs;
const audioVersion = parsedArgs['audio-version'] || parsedArgs.audioVersion || '';

if (!slug || !/^[a-zA-Z0-9_-]+$/.test(slug)) {
  console.error('Usage: --slug {safe-slug}');
  process.exit(1);
}

const reelDir = path.join(ROOT, 'output', 'reels', slug);
const scenesPath = path.join(reelDir, 'scenes.json');
const approvedPath = path.join(reelDir, 'approved-visuals.json');
const assetManifestPath = path.join(reelDir, 'asset-manifest.json');
const motionCardsPath = path.join(reelDir, 'motion-cards.json');
const motionCardTemplatesPath = path.join(reelDir, 'motion-card-templates.json');
const defaultMotionCardTemplatesPath = path.join(ROOT, '.claude', 'skills', 'reels', 'motion-card-templates.json');
const scenesFile = readJson(scenesPath);
const audioFileName = audioVersion ? `narration-${audioVersion}.mp3` : 'narration.mp3';
const audioPath = path.join(reelDir, 'audio', audioFileName);
const publicAudioPath = path.join(ROOT, 'public', 'assets', 'reels', slug, 'audio', audioFileName);
const partGroupsBySlug = {
  186: [
    { part: 1, scenes: [1, 2, 3] },
    { part: 2, scenes: [4, 5] },
    { part: 3, scenes: [6, 7, 8] },
  ],
  170: [
    { part: 1, scenes: [1, 2, 3] },
    { part: 2, scenes: [4, 5, 6] },
    { part: 3, scenes: [7, 8] },
  ],
  171: [
    { part: 1, scenes: [1, 2] },
    { part: 2, scenes: [3, 4] },
    { part: 3, scenes: [5, 6, 7] },
  ],
  172: [
    { part: 1, scenes: [1, 2] },
    { part: 2, scenes: [3, 4] },
    { part: 3, scenes: [5, 6, 7] },
  ],
};
const partGroups = partGroupsBySlug[slug] || [
  { part: 1, scenes: [1, 2, 3] },
  { part: 2, scenes: [4, 5, 6] },
  { part: 3, scenes: [7, 8] },
];
const partAudio = audioVersion
  ? partGroups.map((group) => {
      const fileName = `narration-${audioVersion}-part-${String(group.part).padStart(2, '0')}.mp3`;
      const outputPath = path.join(reelDir, 'audio', fileName);
      const publicPath = path.join(ROOT, 'public', 'assets', 'reels', slug, 'audio', fileName);
      const durationSeconds = getAudioDurationSeconds(publicPath) || getAudioDurationSeconds(outputPath);
      return {
        ...group,
        fileName,
        outputPath,
        publicPath,
        durationSeconds,
      };
    })
  : [];
const sceneAudio = audioVersion
  ? scenesFile.scenes.map((scene) => {
      const fileName = `narration-${audioVersion}-scene-${String(scene.number).padStart(2, '0')}.mp3`;
      const outputPath = path.join(reelDir, 'audio', fileName);
      const publicPath = path.join(ROOT, 'public', 'assets', 'reels', slug, 'audio', fileName);
      const durationSeconds = getAudioDurationSeconds(publicPath) || getAudioDurationSeconds(outputPath);
      return {
        sceneNumber: scene.number,
        fileName,
        outputPath,
        publicPath,
        durationSeconds,
      };
    })
  : [];
const hasSceneAudio = sceneAudio.length > 0 && sceneAudio.every((scene) => fs.existsSync(scene.publicPath) && scene.durationSeconds);
const hasPartAudio = !hasSceneAudio && partAudio.length > 0 && partAudio.every((part) => fs.existsSync(part.publicPath) && part.durationSeconds);

const approvedFile = readJson(approvedPath);
const assetManifest = fs.existsSync(assetManifestPath) ? readJson(assetManifestPath) : { scenes: [] };
const motionCardsFile = fs.existsSync(motionCardsPath) ? readJson(motionCardsPath) : { cards: [] };
const motionCardTemplatesFile = fs.existsSync(motionCardTemplatesPath)
  ? readJson(motionCardTemplatesPath)
  : fs.existsSync(defaultMotionCardTemplatesPath)
    ? readJson(defaultMotionCardTemplatesPath)
    : { templates: [] };

if (scenesFile.status !== 'visuals_approved' || !approvedFile.finalizedAt) {
  console.error('Visuals are not finalized. Press Finalize visual review before building Remotion props.');
  process.exit(1);
}

const audioDurationSeconds = hasPartAudio
  ? partAudio.reduce((total, part) => total + part.durationSeconds, 0)
  : hasSceneAudio
    ? sceneAudio.reduce((total, scene) => total + scene.durationSeconds, 0)
  : getAudioDurationSeconds(publicAudioPath) || getAudioDurationSeconds(audioPath);
const baseDurationSeconds = scenesFile.scenes.reduce((total, scene) => total + Number(scene.expectedDurationSeconds || 5), 0);
const targetDurationSeconds = audioDurationSeconds || baseDurationSeconds;
const targetFrames = Math.max(1, Math.ceil(targetDurationSeconds * FPS));
const totalWeight = scenesFile.scenes.reduce((total, scene) => total + narrationWeight(scene), 0);

let startFrame = 0;
const sceneDurations = new Map();

if (hasSceneAudio) {
  const durationOverrides = sceneDurationFrameOverridesBySlug[slug] || {};
  for (const scene of sceneAudio) {
    const audioFrames = Math.max(1, Math.ceil(scene.durationSeconds * FPS));
    const overrideFrames = durationOverrides[scene.sceneNumber] || 0;
    sceneDurations.set(scene.sceneNumber, Math.max(audioFrames, overrideFrames));
  }
} else if (hasPartAudio) {
  for (const part of partAudio) {
    const partScenes = scenesFile.scenes.filter((scene) => part.scenes.includes(scene.number));
    const partFrames = Math.max(1, Math.ceil(part.durationSeconds * FPS));
    const durationOverrides = sceneDurationFrameOverridesBySlug[slug] || {};
    const overrideTotal = partScenes.reduce((total, scene) => total + (durationOverrides[scene.number] || 0), 0);

    if (overrideTotal > 0) {
      if (overrideTotal !== partFrames) {
        console.error(`Scene duration overrides for slug ${slug} part ${part.part} total ${overrideTotal} frames, expected ${partFrames}.`);
        process.exit(1);
      }
      for (const scene of partScenes) {
        sceneDurations.set(scene.number, durationOverrides[scene.number]);
      }
      continue;
    }

    const partWeight = partScenes.reduce((total, scene) => total + narrationWeight(scene), 0);
    let allocated = 0;
    partScenes.forEach((scene, index) => {
      const isLastInPart = index === partScenes.length - 1;
      const frames = isLastInPart
        ? partFrames - allocated
        : Math.max(60, Math.round((narrationWeight(scene) / partWeight) * partFrames));
      sceneDurations.set(scene.number, frames);
      allocated += frames;
    });
  }
}

function imageFitModeFor(slug, sceneNumber, asset) {
  const defaultFitMode = asset.fitMode || 'cover';
  const overrides = {
    229: {
      4: {
        1: 'framed_16_9',
      },
      6: {
        2: 'framed_16_9',
      },
    },
  };

  return overrides[slug]?.[sceneNumber]?.[asset.rank] || defaultFitMode;
}

function imageCameraMoveFor(slug, sceneNumber, rank) {
  const moves = {
    225: {
      1: {
        1: 'pan_right',
        2: 'pan_left',
        3: 'drift_up',
      },
      2: {
        1: 'pan_left',
        2: 'pan_right',
        3: 'drift_up',
      },
      4: {
        1: 'pan_right',
        2: 'pan_left',
        3: 'drift_down',
      },
      5: {
        1: 'pan_up',
        2: 'pan_right',
        3: 'pan_left',
      },
      7: {
        1: 'slow_zoom_out',
        2: 'drift_right',
      },
    },
    228: {
      1: {
        1: 'drift_up',
        2: 'pan_down',
      },
      2: {
        1: 'pan_right',
        2: 'pan_left',
      },
      4: {
        1: 'pan_down',
        2: 'drift_right',
        3: 'pan_left',
      },
      6: {
        1: 'pan_left',
        2: 'pan_right',
      },
      7: {
        1: 'slow_zoom_out',
        2: 'drift_up',
      },
    },
    229: {
      1: {
        1: 'drift_up',
        2: 'pan_down',
      },
      2: {
        1: 'pan_right',
        2: 'pan_left',
      },
      3: {
        1: 'pan_down',
        2: 'drift_right',
      },
      4: {
        1: 'drift_left',
        2: 'pan_up',
        3: 'pan_right',
      },
      6: {
        1: 'pan_down',
        2: 'drift_right',
      },
      7: {
        1: 'pan_up',
        2: 'pan_left',
      },
    },
  };

  return moves[slug]?.[sceneNumber]?.[rank] || undefined;
}

const scenes = scenesFile.scenes.map((scene, index) => {
  const isLastScene = index === scenesFile.scenes.length - 1;
  const proportionalFrames = Math.round((narrationWeight(scene) / totalWeight) * targetFrames);
  const fallbackFrames = Math.round(Number(scene.expectedDurationSeconds || 5) * FPS);
  const durationFrames = sceneDurations.get(scene.number) || (isLastScene ? targetFrames - startFrame : Math.max(60, audioDurationSeconds ? proportionalFrames : fallbackFrames));
  const assets = assetManifest.scenes.find((item) => item.number === scene.number)?.images || [];
  const captionBeats = getCaptionBeats(scene, slug);
  const usesReadableBand = usesReadableBandCaptions(slug);
  const captionLeadFrames = usesReadableBand ? 0 : Number(scene.captionLeadFrames ?? scenesFile.subtitleStyle?.captionLeadFrames ?? 6);
  const remotionScene = {
    number: scene.number,
    startFrame,
    durationFrames,
    durationSeconds: durationFrames / FPS,
    narration: scene.subtitleText || scene.narration,
    captionBeats,
    captionBeatStartFrames: getCaptionBeatStartFrames(captionBeats, durationFrames, slug, scene.number),
    captionLeadFrames: Number.isFinite(captionLeadFrames) ? captionLeadFrames : 6,
    captionStyle: usesReadableBand ? 'readable_band' : 'phrase_pop',
    typographyBeats: scene.typographyBeats || [],
    motion: scene.motion,
    images: assets.map((asset) => ({
      rank: asset.rank,
      publicPath: asset.publicPath,
      staticFilePath: String(asset.publicPath || '').replace(/^\//, ''),
      sourceUrl: asset.src,
      width: asset.width || undefined,
      height: asset.height || undefined,
      aspectRatio: asset.aspectRatio || undefined,
      fitMode: imageFitModeFor(slug, scene.number, asset),
      cameraMove: imageCameraMoveFor(slug, scene.number, asset.rank),
    })),
  };
  startFrame += durationFrames;
  return remotionScene;
});

const audioSegments = hasPartAudio
  ? partAudio.map((part) => {
      const firstScene = scenes.find((scene) => part.scenes.includes(scene.number));
      const durationFrames = part.scenes.reduce((total, number) => total + (sceneDurations.get(number) || 0), 0);
      return {
        part: part.part,
        file: path.relative(ROOT, part.outputPath).replace(/\\/g, '/'),
        publicPath: `/assets/reels/${slug}/audio/${part.fileName}`,
        staticFilePath: `assets/reels/${slug}/audio/${part.fileName}`,
        startFrame: firstScene?.startFrame || 0,
        durationFrames,
        durationSeconds: durationFrames / FPS,
      };
    })
  : hasSceneAudio
    ? sceneAudio.map((audio) => {
        const scene = scenes.find((item) => item.number === audio.sceneNumber);
        return {
          part: audio.sceneNumber,
          sceneNumber: audio.sceneNumber,
          file: path.relative(ROOT, audio.outputPath).replace(/\\/g, '/'),
          publicPath: `/assets/reels/${slug}/audio/${audio.fileName}`,
          staticFilePath: `assets/reels/${slug}/audio/${audio.fileName}`,
          startFrame: scene?.startFrame || 0,
          durationFrames: scene?.durationFrames || Math.ceil(audio.durationSeconds * FPS),
          durationSeconds: (scene?.durationFrames || Math.ceil(audio.durationSeconds * FPS)) / FPS,
        };
      })
  : [];

const approvedMotionCards = (motionCardsFile.cards || []).filter((card) => card.reviewStatus === 'approved');

const outroFrameOverridesBySlug = {
  186: 180,
  225: 90,
  228: 90,
  229: 90,
};
const outroFrames = outroFrameOverridesBySlug[slug] || 60;

const props = {
  slug,
  title: scenesFile.title,
  width: 1080,
  height: 1920,
  fps: FPS,
  durationFrames: startFrame + outroFrames,
  durationSeconds: (startFrame + outroFrames) / FPS,
  finalizedAt: approvedFile.finalizedAt,
  audio: !hasPartAudio && fs.existsSync(publicAudioPath)
    ? {
        file: path.relative(ROOT, audioPath).replace(/\\/g, '/'),
        publicPath: `/assets/reels/${slug}/audio/${audioFileName}`,
        staticFilePath: `assets/reels/${slug}/audio/${audioFileName}`,
      }
    : null,
  audioSegments,
  outro: {
    startFrame,
    durationFrames: outroFrames,
    text: 'epicKor.com',
  },
  brand: {
    label: 'EpicKor',
    cta: 'EPICKOR.COM',
  },
  subtitleStyle: scenesFile.subtitleStyle || {
    mode: 'narration_synced',
    preset: 'modern_reels_phrase_pop',
  },
  scenes,
  motionCards: approvedMotionCards,
  motionCardTemplates: motionCardTemplatesFile.templates || [],
};

const outputPath = path.join(reelDir, 'remotion-props.json');
writeJson(outputPath, props);
console.log(`Saved ${path.relative(ROOT, outputPath)}`);
