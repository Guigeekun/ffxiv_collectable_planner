/**
 * Static data for reputation achievements, organized by expansion and allied society.
 */

export interface ReputationAchievement {
  id: number;
  name: string;
  description: string;
  points: number;
  patch: string;
  owned: string;
  icon: string;
}

export interface ReputationSociety {
  id: string;
  name: string;
  group: string;
  achments: ReputationAchievement[];
}

export interface ReputationExpansion {
  expansion: string;
  expansionClass: string;
  societies: ReputationSociety[];
  alliedQuest: ReputationAchievement | null;
}

export const REPUTATION_ACHIEVEMENTS_BY_EXPANSION: ReputationExpansion[] = [
  {
    "expansion": "A Realm Reborn",
    "expansionClass": "exp-arr",
    "societies": [
      {
        "id": "amaljaa",
        "name": "Amalj'aa",
        "group": "Brotherhood of Ash",
        "achments": [
          {
            "id": 863,
            "name": "You Bet Your Ash I",
            "description": "Attain rank 1 reputation (neutral) with the Brotherhood of Ash.",
            "points": 5,
            "patch": "2.1",
            "owned": "78%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062955_hr1.tex"
          },
          {
            "id": 864,
            "name": "You Bet Your Ash II",
            "description": "Attain rank 2 reputation (recognized) with the Brotherhood of Ash.",
            "points": 5,
            "patch": "2.1",
            "owned": "41%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062955_hr1.tex"
          },
          {
            "id": 865,
            "name": "You Bet Your Ash III",
            "description": "Attain rank 3 reputation (friendly) with the Brotherhood of Ash.",
            "points": 10,
            "patch": "2.1",
            "owned": "35%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062955_hr1.tex"
          },
          {
            "id": 866,
            "name": "A Real Bad Ash",
            "description": "Attain rank 4 reputation (trusted) with the Brotherhood of Ash.",
            "points": 20,
            "patch": "2.1",
            "owned": "33%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062955_hr1.tex"
          }
        ]
      },
      {
        "id": "sylph",
        "name": "Sylph",
        "group": "Little Solace",
        "achments": [
          {
            "id": 867,
            "name": "Sylph-conscious I",
            "description": "Attain rank 1 reputation (neutral) with the sylphs of Little Solace.",
            "points": 5,
            "patch": "2.1",
            "owned": "79%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062956_hr1.tex"
          },
          {
            "id": 868,
            "name": "Sylph-conscious II",
            "description": "Attain rank 2 reputation (recognized) with the sylphs of Little Solace.",
            "points": 5,
            "patch": "2.1",
            "owned": "42%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062956_hr1.tex"
          },
          {
            "id": 869,
            "name": "Sylph-conscious III",
            "description": "Attain rank 3 reputation (friendly) with the sylphs of Little Solace.",
            "points": 10,
            "patch": "2.1",
            "owned": "35%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062956_hr1.tex"
          },
          {
            "id": 870,
            "name": "Sylph-assured",
            "description": "Attain rank 4 reputation (trusted) with the sylphs of Little Solace.",
            "points": 20,
            "patch": "2.1",
            "owned": "32%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062956_hr1.tex"
          }
        ]
      },
      {
        "id": "kobold",
        "name": "Kobold",
        "group": "789th Order",
        "achments": [
          {
            "id": 904,
            "name": "Fortune Favors the Kobold I",
            "description": "Attain rank 1 reputation (neutral) with the 789th Order kobolds.",
            "points": 5,
            "patch": "2.2",
            "owned": "74%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062958_hr1.tex"
          },
          {
            "id": 905,
            "name": "Fortune Favors the Kobold II",
            "description": "Attain rank 2 reputation (recognized) with the 789th Order kobolds.",
            "points": 5,
            "patch": "2.2",
            "owned": "37%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062958_hr1.tex"
          },
          {
            "id": 906,
            "name": "Fortune Favors the Kobold III",
            "description": "Attain rank 3 reputation (friendly) with the 789th Order kobolds.",
            "points": 10,
            "patch": "2.2",
            "owned": "33%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062958_hr1.tex"
          },
          {
            "id": 907,
            "name": "Kobold as Brass",
            "description": "Attain rank 4 reputation (trusted) with the 789th Order kobolds.",
            "points": 20,
            "patch": "2.2",
            "owned": "31%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062958_hr1.tex"
          }
        ]
      },
      {
        "id": "sahagin",
        "name": "Sahagin",
        "group": "Novv's Clutch",
        "achments": [
          {
            "id": 908,
            "name": "Gilling Me Softly I",
            "description": "Attain rank 1 reputation (neutral) with Novv's Clutch.",
            "points": 5,
            "patch": "2.2",
            "owned": "74%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062959_hr1.tex"
          },
          {
            "id": 909,
            "name": "Gilling Me Softly II",
            "description": "Attain rank 2 reputation (recognized) with Novv's Clutch.",
            "points": 5,
            "patch": "2.2",
            "owned": "36%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062959_hr1.tex"
          },
          {
            "id": 910,
            "name": "Gilling Me Softly III",
            "description": "Attain rank 3 reputation (friendly) with Novv's Clutch.",
            "points": 10,
            "patch": "2.2",
            "owned": "32%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062959_hr1.tex"
          },
          {
            "id": 911,
            "name": "Licensed to Gill",
            "description": "Attain rank 4 reputation (trusted) with Novv's Clutch.",
            "points": 20,
            "patch": "2.2",
            "owned": "30%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062959_hr1.tex"
          }
        ]
      },
      {
        "id": "ixal",
        "name": "Ixal",
        "group": "Ehcatl Nine",
        "achments": [
          {
            "id": 1022,
            "name": "Bird Is the Word I",
            "description": "Attain rank 1 reputation (neutral) with the Ehcatl Nine.",
            "points": 5,
            "patch": "2.35",
            "owned": "62%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062957_hr1.tex"
          },
          {
            "id": 1023,
            "name": "Bird Is the Word II",
            "description": "Attain rank 3 reputation (friendly) with the Ehcatl Nine.",
            "points": 5,
            "patch": "2.35",
            "owned": "43%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062957_hr1.tex"
          },
          {
            "id": 1024,
            "name": "Bird Is the Word III",
            "description": "Attain rank 5 reputation (respected) with the Ehcatl Nine.",
            "points": 10,
            "patch": "2.35",
            "owned": "36%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062957_hr1.tex"
          },
          {
            "id": 1025,
            "name": "That's Ixal, Folks",
            "description": "Attain rank 7 reputation (sworn) with the Ehcatl Nine.",
            "points": 20,
            "patch": "2.35",
            "owned": "32%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062957_hr1.tex"
          }
        ]
      }
    ],
    "alliedQuest": {
      "id": 1026,
      "name": "Sore Thumb",
      "description": "Complete the quest “Friends Forever.”",
      "points": 20,
      "patch": "2.35",
      "owned": "26%",
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F060000%2F060033_hr1.tex"
    }
  },
  {
    "expansion": "Heavensward",
    "expansionClass": "exp-hw",
    "societies": [
      {
        "id": "vanu",
        "name": "Vanu Vanu",
        "group": "Gundu",
        "achments": [
          {
            "id": 1395,
            "name": "When the Getting's Gundu I",
            "description": "Attain rank 1 reputation (neutral) with the Gundu tribe.",
            "points": 5,
            "patch": "3.1",
            "owned": "69%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062960_hr1.tex"
          },
          {
            "id": 1396,
            "name": "When the Getting's Gundu II",
            "description": "Attain rank 3 reputation (friendly) with the Gundu tribe.",
            "points": 5,
            "patch": "3.1",
            "owned": "49%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062960_hr1.tex"
          },
          {
            "id": 1397,
            "name": "When the Getting's Gundu III",
            "description": "Attain rank 5 reputation (respected) with the Gundu tribe.",
            "points": 10,
            "patch": "3.1",
            "owned": "42%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062960_hr1.tex"
          },
          {
            "id": 1398,
            "name": "Top Gundu",
            "description": "Attain rank 7 reputation (sworn) with the Gundu tribe.",
            "points": 20,
            "patch": "3.1",
            "owned": "36%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062960_hr1.tex"
          }
        ]
      },
      {
        "id": "vath",
        "name": "Vath",
        "group": "Vath",
        "achments": [
          {
            "id": 1495,
            "name": "The Vath Less Troubled I",
            "description": "Attain rank 3 reputation (friendly) with the Vath.",
            "points": 5,
            "patch": "3.2",
            "owned": "72%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062961_hr1.tex"
          },
          {
            "id": 1496,
            "name": "The Vath Less Troubled II",
            "description": "Attain rank 4 reputation (trusted) with the Vath.",
            "points": 5,
            "patch": "3.2",
            "owned": "48%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062961_hr1.tex"
          },
          {
            "id": 1497,
            "name": "The Vath Less Troubled III",
            "description": "Attain rank 6 reputation (honored) with the Vath.",
            "points": 10,
            "patch": "3.2",
            "owned": "41%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062961_hr1.tex"
          },
          {
            "id": 1498,
            "name": "Vathcore",
            "description": "Attain rank 7 reputation (sworn) with the Vath.",
            "points": 20,
            "patch": "3.2",
            "owned": "39%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062961_hr1.tex"
          }
        ]
      },
      {
        "id": "moogle",
        "name": "Moogle",
        "group": "Mogmenders",
        "achments": [
          {
            "id": 1618,
            "name": "Mog Eat Mog I",
            "description": "Attain rank 1 reputation (neutral) with the Mogmenders of Moghome.",
            "points": 5,
            "patch": "3.3",
            "owned": "53%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062962_hr1.tex"
          },
          {
            "id": 1619,
            "name": "Mog Eat Mog II",
            "description": "Attain rank 3 reputation (friendly) with the Mogmenders of Moghome.",
            "points": 5,
            "patch": "3.3",
            "owned": "49%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062962_hr1.tex"
          },
          {
            "id": 1620,
            "name": "Mog Eat Mog III",
            "description": "Attain rank 5 reputation (respected) with the Mogmenders of Moghome.",
            "points": 10,
            "patch": "3.3",
            "owned": "45%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062962_hr1.tex"
          },
          {
            "id": 1621,
            "name": "Top Mog",
            "description": "Attain rank 7 reputation (sworn) with the Mogmenders of Moghome.",
            "points": 20,
            "patch": "3.3",
            "owned": "41%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062962_hr1.tex"
          }
        ]
      }
    ],
    "alliedQuest": {
      "id": 1627,
      "name": "Hey Now, You're an All-star",
      "description": "Complete the quest “Eternity, Loyalty, Honesty.”",
      "points": 20,
      "patch": "3.5",
      "owned": "28%",
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F060000%2F060033_hr1.tex"
    }
  },
  {
    "expansion": "Stormblood",
    "expansionClass": "exp-sb",
    "societies": [
      {
        "id": "kojin",
        "name": "Kojin",
        "group": "Divine Circle",
        "achments": [
          {
            "id": 1997,
            "name": "To Kojin Is Divine I",
            "description": "Attain rank 3 reputation (friendly) with the Divine Circle.",
            "points": 5,
            "patch": "4.1",
            "owned": "69%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062964_hr1.tex"
          },
          {
            "id": 1998,
            "name": "To Kojin Is Divine II",
            "description": "Attain rank 4 reputation (trusted) with the Divine Circle.",
            "points": 5,
            "patch": "4.1",
            "owned": "51%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062964_hr1.tex"
          },
          {
            "id": 1999,
            "name": "To Kojin Is Divine III",
            "description": "Attain rank 6 reputation (honored) with the Divine Circle.",
            "points": 10,
            "patch": "4.1",
            "owned": "45%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062964_hr1.tex"
          },
          {
            "id": 2000,
            "name": "Divinity: Original Kojin",
            "description": "Attain rank 7 reputation (sworn) with the Divine Circle.",
            "points": 20,
            "patch": "4.1",
            "owned": "42%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062964_hr1.tex"
          }
        ]
      },
      {
        "id": "ananta",
        "name": "Ananta",
        "group": "Velodyna",
        "achments": [
          {
            "id": 2014,
            "name": "Call Me Snake I",
            "description": "Attain rank 3 reputation (friendly) with the Velodyna Gatekeepers.",
            "points": 5,
            "patch": "4.2",
            "owned": "65%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062963_hr1.tex"
          },
          {
            "id": 2015,
            "name": "Call Me Snake II",
            "description": "Attain rank 4 reputation (trusted) with the Velodyna Gatekeepers.",
            "points": 5,
            "patch": "4.2",
            "owned": "53%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062963_hr1.tex"
          },
          {
            "id": 2016,
            "name": "Call Me Snake III",
            "description": "Attain rank 6 reputation (honored) with the Velodyna Gatekeepers.",
            "points": 10,
            "patch": "4.2",
            "owned": "46%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062963_hr1.tex"
          },
          {
            "id": 2017,
            "name": "My Anantaconda",
            "description": "Attain rank 7 reputation (sworn) with the Velodyna Gatekeepers.",
            "points": 20,
            "patch": "4.2",
            "owned": "44%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062963_hr1.tex"
          }
        ]
      },
      {
        "id": "namazu",
        "name": "Namazu",
        "group": "Seven Hundred Seventy-Seven",
        "achments": [
          {
            "id": 2099,
            "name": "Fish to Fry I",
            "description": "Attain rank 3 reputation (friendly) with the Seven Hundred Seventy-Seven.",
            "points": 5,
            "patch": "4.3",
            "owned": "54%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062965_hr1.tex"
          },
          {
            "id": 2100,
            "name": "Fish to Fry II",
            "description": "Attain rank 4 reputation (trusted) with the Seven Hundred Seventy-Seven.",
            "points": 5,
            "patch": "4.3",
            "owned": "49%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062965_hr1.tex"
          },
          {
            "id": 2101,
            "name": "Fish to Fry III",
            "description": "Attain rank 6 reputation (honored) with the Seven Hundred Seventy-Seven.",
            "points": 10,
            "patch": "4.3",
            "owned": "45%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062965_hr1.tex"
          },
          {
            "id": 2102,
            "name": "In a Barrel",
            "description": "Attain rank 7 reputation (sworn) with the Seven Hundred Seventy-Seven.",
            "points": 20,
            "patch": "4.3",
            "owned": "43%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062965_hr1.tex"
          }
        ]
      }
    ],
    "alliedQuest": {
      "id": 2235,
      "name": "West Meets East",
      "description": "Complete the quest “What a Wonder-full World.”",
      "points": 20,
      "patch": "4.5",
      "owned": "31%",
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F060000%2F060033_hr1.tex"
    }
  },
  {
    "expansion": "Shadowbringers",
    "expansionClass": "exp-shb",
    "societies": [
      {
        "id": "pixie",
        "name": "Pixie",
        "group": "Dreamspinners",
        "achments": [
          {
            "id": 2436,
            "name": "Bring Me a Dream I",
            "description": "Attain rank 3 reputation (friendly) with the Dreamspinners.",
            "points": 5,
            "patch": "5.1",
            "owned": "71%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062970_hr1.tex"
          },
          {
            "id": 2437,
            "name": "Bring Me a Dream II",
            "description": "Attain rank 4 reputation (trusted) with the Dreamspinners.",
            "points": 5,
            "patch": "5.1",
            "owned": "61%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062970_hr1.tex"
          },
          {
            "id": 2438,
            "name": "Bring Me a Dream III",
            "description": "Attain rank 6 reputation (honored) with the Dreamspinners.",
            "points": 10,
            "patch": "5.1",
            "owned": "56%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062970_hr1.tex"
          },
          {
            "id": 2439,
            "name": "Forever Young",
            "description": "Attain rank 7 reputation (sworn) with the Dreamspinners.",
            "points": 20,
            "patch": "5.1",
            "owned": "53%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062970_hr1.tex"
          }
        ]
      },
      {
        "id": "qitari",
        "name": "Qitari",
        "group": "Stewards",
        "achments": [
          {
            "id": 2597,
            "name": "With My Compliments I",
            "description": "Attain rank 3 reputation (friendly) with the Stewards.",
            "points": 5,
            "patch": "5.2",
            "owned": "50%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062971_hr1.tex"
          },
          {
            "id": 2598,
            "name": "With My Compliments II",
            "description": "Attain rank 4 reputation (trusted) with the Stewards.",
            "points": 5,
            "patch": "5.2",
            "owned": "43%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062971_hr1.tex"
          },
          {
            "id": 2599,
            "name": "With My Compliments III",
            "description": "Attain rank 6 reputation (honored) with the Stewards.",
            "points": 10,
            "patch": "5.2",
            "owned": "38%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062971_hr1.tex"
          },
          {
            "id": 2600,
            "name": "History's No Mystery",
            "description": "Attain rank 7 reputation (sworn) with the Stewards.",
            "points": 20,
            "patch": "5.2",
            "owned": "36%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062971_hr1.tex"
          }
        ]
      },
      {
        "id": "dwarf",
        "name": "Dwarf",
        "group": "Watts's Anvil",
        "achments": [
          {
            "id": 2638,
            "name": "Dwarven Crafts I",
            "description": "Attain rank 3 reputation (friendly) with Watts's Anvil.",
            "points": 5,
            "patch": "5.3",
            "owned": "52%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062972_hr1.tex"
          },
          {
            "id": 2639,
            "name": "Dwarven Crafts II",
            "description": "Attain rank 4 reputation (trusted) with Watts's Anvil.",
            "points": 5,
            "patch": "5.3",
            "owned": "48%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062972_hr1.tex"
          },
          {
            "id": 2640,
            "name": "Dwarven Crafts III",
            "description": "Attain rank 6 reputation (honored) with Watts's Anvil.",
            "points": 10,
            "patch": "5.3",
            "owned": "45%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062972_hr1.tex"
          },
          {
            "id": 2641,
            "name": "Beard Science",
            "description": "Attain rank 7 reputation (sworn) with Watts's Anvil.",
            "points": 20,
            "patch": "5.3",
            "owned": "43%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062972_hr1.tex"
          }
        ]
      }
    ],
    "alliedQuest": null
  },
  {
    "expansion": "Endwalker",
    "expansionClass": "exp-ew",
    "societies": [
      {
        "id": "arkasodara",
        "name": "Arkasodara",
        "group": "Hippo Riders",
        "achments": [
          {
            "id": 3055,
            "name": "Hasty Hasty Hippos I",
            "description": "Attain rank 3 reputation (friendly) with the Hippo Riders.",
            "points": 5,
            "patch": "6.15",
            "owned": "54%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062975_hr1.tex"
          },
          {
            "id": 3056,
            "name": "Hasty Hasty Hippos II",
            "description": "Attain rank 4 reputation (trusted) with the Hippo Riders.",
            "points": 5,
            "patch": "6.15",
            "owned": "49%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062975_hr1.tex"
          },
          {
            "id": 3057,
            "name": "Hasty Hasty Hippos III",
            "description": "Attain rank 6 reputation (honored) with the Hippo Riders.",
            "points": 10,
            "patch": "6.15",
            "owned": "45%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062975_hr1.tex"
          },
          {
            "id": 3058,
            "name": "Ride or Die",
            "description": "Attain rank 7 reputation (sworn) with the Hippo Riders.",
            "points": 20,
            "patch": "6.15",
            "owned": "43%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062975_hr1.tex"
          }
        ]
      },
      {
        "id": "omicron",
        "name": "Omicron",
        "group": "Last Dregs",
        "achments": [
          {
            "id": 3123,
            "name": "Voices of a Distant Server I",
            "description": "Attain rank 3 reputation (friendly) with the staff and patrons of the Last Dregs.",
            "points": 5,
            "patch": "6.25",
            "owned": "46%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062976_hr1.tex"
          },
          {
            "id": 3124,
            "name": "Voices of a Distant Server II",
            "description": "Attain rank 4 reputation (trusted) with the staff and patrons of the Last Dregs.",
            "points": 5,
            "patch": "6.25",
            "owned": "42%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062976_hr1.tex"
          },
          {
            "id": 3125,
            "name": "Voices of a Distant Server III",
            "description": "Attain rank 6 reputation (honored) with the staff and patrons of the Last Dregs.",
            "points": 10,
            "patch": "6.25",
            "owned": "38%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062976_hr1.tex"
          },
          {
            "id": 3126,
            "name": "Fully Caffeinated",
            "description": "Attain rank 7 reputation (sworn) with the staff and patrons of the Last Dregs.",
            "points": 20,
            "patch": "6.25",
            "owned": "37%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062976_hr1.tex"
          }
        ]
      },
      {
        "id": "loporrit",
        "name": "Loporrit",
        "group": "Dreaming Ways",
        "achments": [
          {
            "id": 3188,
            "name": "Way to Go I",
            "description": "Attain rank 3 reputation (friendly) with the Dreaming Ways.",
            "points": 5,
            "patch": "6.35",
            "owned": "42%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062977_hr1.tex"
          },
          {
            "id": 3189,
            "name": "Way to Go II",
            "description": "Attain rank 4 reputation (trusted) with the Dreaming Ways.",
            "points": 5,
            "patch": "6.35",
            "owned": "39%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062977_hr1.tex"
          },
          {
            "id": 3190,
            "name": "Way to Go III",
            "description": "Attain rank 6 reputation (honored) with the Dreaming Ways.",
            "points": 10,
            "patch": "6.35",
            "owned": "35%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062977_hr1.tex"
          },
          {
            "id": 3191,
            "name": "Every Which Way",
            "description": "Attain rank 7 reputation (sworn) with the Dreaming Ways.",
            "points": 20,
            "patch": "6.35",
            "owned": "33%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062977_hr1.tex"
          }
        ]
      }
    ],
    "alliedQuest": {
      "id": 3411,
      "name": "Space Race",
      "description": "Complete the quest “A Dream Worth Chasing.”",
      "points": 20,
      "patch": "6.55",
      "owned": "22%",
      "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F060000%2F060033_hr1.tex"
    }
  },
  {
    "expansion": "Dawntrail",
    "expansionClass": "exp-dt",
    "societies": [
      {
        "id": "pelupelu",
        "name": "Pelupelu",
        "group": "Turali Travel Agency",
        "achments": [
          {
            "id": 3588,
            "name": "Pelu Proponent I",
            "description": "Attain rank 3 reputation (friendly) with the Turali Travel Agency.",
            "points": 5,
            "patch": "7.1",
            "owned": "31%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062978_hr1.tex"
          },
          {
            "id": 3589,
            "name": "Pelu Proponent II",
            "description": "Attain rank 4 reputation (trusted) with the Turali Travel Agency.",
            "points": 5,
            "patch": "7.1",
            "owned": "27%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062978_hr1.tex"
          },
          {
            "id": 3590,
            "name": "Pelu Proponent III",
            "description": "Attain rank 6 reputation (honored) with the Turali Travel Agency.",
            "points": 10,
            "patch": "7.1",
            "owned": "23%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062978_hr1.tex"
          },
          {
            "id": 3591,
            "name": "Extra-special Advisor",
            "description": "Attain rank 7 reputation (sworn) with the Turali Travel Agency.",
            "points": 20,
            "patch": "7.1",
            "owned": "21%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062978_hr1.tex"
          }
        ]
      },
      {
        "id": "moblin",
        "name": "Moblin",
        "group": "Gok Golma",
        "achments": [
          {
            "id": 3621,
            "name": "Eat Your Vegetables I",
            "description": "Attain rank 3 reputation (friendly) with the farmers of Gok Golma.",
            "points": 5,
            "patch": "7.25",
            "owned": "17%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062979_hr1.tex"
          },
          {
            "id": 3622,
            "name": "Eat Your Vegetables II",
            "description": "Attain rank 4 reputation (trusted) with the farmers of Gok Golma.",
            "points": 5,
            "patch": "7.25",
            "owned": "15%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062979_hr1.tex"
          },
          {
            "id": 3623,
            "name": "Eat Your Vegetables III",
            "description": "Attain rank 6 reputation (honored) with the farmers of Gok Golma.",
            "points": 10,
            "patch": "7.25",
            "owned": "13%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062979_hr1.tex"
          },
          {
            "id": 3624,
            "name": "Harvest of Hope",
            "description": "Attain rank 7 reputation (sworn) with the farmers of Gok Golma.",
            "points": 20,
            "patch": "7.25",
            "owned": "11%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062979_hr1.tex"
          }
        ]
      },
      {
        "id": "mamoolja",
        "name": "Mamool Ja",
        "group": "Zirgorteh",
        "achments": [
          {
            "id": 3774,
            "name": "Winter's Warmth I",
            "description": "Attain rank 3 reputation (friendly) with the Hands of Zirgorteh.",
            "points": 5,
            "patch": "7.35",
            "owned": "13%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062980_hr1.tex"
          },
          {
            "id": 3775,
            "name": "Winter's Warmth II",
            "description": "Attain rank 4 reputation (trusted) with the Hands of Zirgorteh.",
            "points": 5,
            "patch": "7.35",
            "owned": "12%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062980_hr1.tex"
          },
          {
            "id": 3776,
            "name": "Winter's Warmth III",
            "description": "Attain rank 6 reputation (honored) with the Hands of Zirgorteh.",
            "points": 10,
            "patch": "7.35",
            "owned": "10%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062980_hr1.tex"
          },
          {
            "id": 3777,
            "name": "Peak Performance",
            "description": "Attain rank 7 reputation (sworn) with the Hands of Zirgorteh.",
            "points": 20,
            "patch": "7.35",
            "owned": "9.2%",
            "icon": "https://v2.xivapi.com/api/asset?format=webp&path=ui%2Ficon%2F062000%2F062980_hr1.tex"
          }
        ]
      }
    ],
    "alliedQuest": null
  }
];
