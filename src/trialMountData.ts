/**
 * Static data for trial mounts, organized by expansion and boss fight.
 *
 * Mount IDs come from the FFXIV Collect API (mounts[].id).
 * Instance IDs (instanceId) match FFXIV Collect's sources[].related_id.
 * shortName is a brief human-readable boss identifier used as the column header
 * in SeriesGridView (column space is limited — keep it under ~12 chars).
 *
 * To add a new trial mount: append an entry to the appropriate expansion's
 * `bosses` array. No component changes are needed.
 *
 * Source: https://ffxivcollect.com/api/mounts
 */

export interface TrialBoss {
  /** Full fight name (shown as a tooltip in the grid). */
  name: string;
  /**
   * Short boss/fight name shown as the column header.
   * Keep under ~12 characters so it fits the grid column width.
   */
  shortName: string;
  /** FFXIV Collect instance ID for cross-referencing. */
  instanceId: number;
  /** IDs of the mount(s) that drop from this fight, in display order. */
  mountIds: number[];
}

export interface TrialExpansion {
  /** Expansion name (used as the group title and expansion badge label). */
  expansion: string;
  /** CSS class for expansion-specific theming (exp-arr / exp-hw / …). */
  expansionClass: string;
  /** Ordered list of boss fights (chronologically within the expansion). */
  bosses: TrialBoss[];
}

export const TRIAL_MOUNTS_BY_EXPANSION: TrialExpansion[] = [
  // ── A Realm Reborn ──────────────────────────────────────────────────────────
  {
    expansion: 'A Realm Reborn',
    expansionClass: 'exp-arr',
    bosses: [
      {
        name: 'The Bowl of Embers (Extreme)',
        shortName: 'Ifrit',
        instanceId: 63,
        mountIds: [22, 28], // Nightmare, Aithon
      },
      {
        name: 'The Howling Eye (Extreme)',
        shortName: 'Garuda',
        instanceId: 65,
        mountIds: [22, 29], // Nightmare, Xanthos
      },
      {
        name: 'The Navel (Extreme)',
        shortName: 'Titan',
        instanceId: 64,
        mountIds: [22, 30], // Nightmare, Gullfaxi
      },
      {
        name: 'The Whorleater (Extreme)',
        shortName: 'Leviathan',
        instanceId: 73,
        mountIds: [31], // Enbarr
      },
      {
        name: 'The Striking Tree (Extreme)',
        shortName: 'Ramuh',
        instanceId: 78,
        mountIds: [40], // Markab
      },
      {
        name: 'The Akh Afah Amphitheatre (Extreme)',
        shortName: 'Shiva',
        instanceId: 80,
        mountIds: [43], // Boreas
      },
    ],
  },

  // ── Heavensward ─────────────────────────────────────────────────────────────
  {
    expansion: 'Heavensward',
    expansionClass: 'exp-hw',
    bosses: [
      {
        name: 'The Limitless Blue (Extreme)',
        shortName: 'Bismarck',
        instanceId: 89,
        mountIds: [75], // White Lanner
      },
      {
        name: 'Thok ast Thok (Extreme)',
        shortName: 'Ravana',
        instanceId: 87,
        mountIds: [76], // Rose Lanner
      },
      {
        name: "The Minstrel's Ballad: Thordan's Reign",
        shortName: 'Thordan',
        instanceId: 91,
        mountIds: [77], // Round Lanner
      },
      {
        name: 'Containment Bay S1T7 (Extreme)',
        shortName: 'Sephirot',
        instanceId: 135,
        mountIds: [78], // Warring Lanner
      },
      {
        name: "The Minstrel's Ballad: Nidhogg's Rage",
        shortName: 'Nidhogg',
        instanceId: 170,
        mountIds: [90], // Dark Lanner
      },
      {
        name: 'Containment Bay P1T6 (Extreme)',
        shortName: 'Sophia',
        instanceId: 184,
        mountIds: [98], // Sophic Lanner
      },
      {
        name: 'Containment Bay Z1T9 (Extreme)',
        shortName: 'Zurvan',
        instanceId: 224,
        mountIds: [104], // Demonic Lanner
      },
    ],
  },

  // ── Stormblood ──────────────────────────────────────────────────────────────
  {
    expansion: 'Stormblood',
    expansionClass: 'exp-sb',
    bosses: [
      {
        name: 'The Pool of Tribute (Extreme)',
        shortName: 'Susano',
        instanceId: 244,
        mountIds: [116], // Reveling Kamuy
      },
      {
        name: 'Emanation (Extreme)',
        shortName: 'Lakshmi',
        instanceId: 264,
        mountIds: [115], // Blissful Kamuy
      },
      {
        name: "The Minstrel's Ballad: Shinryu's Domain",
        shortName: 'Shinryu',
        instanceId: 278,
        mountIds: [133], // Legendary Kamuy
      },
      {
        name: 'The Jade Stoa (Extreme)',
        shortName: 'Byakko',
        instanceId: 291,
        mountIds: [144], // Auspicious Kamuy
      },
      {
        name: 'The Great Hunt (Extreme)',
        shortName: 'Rathalos',
        instanceId: 475,
        mountIds: [161], // Rathalos mount
      },
      {
        name: "The Minstrel's Ballad: Tsukuyomi's Pain",
        shortName: 'Tsukuyomi',
        instanceId: 538,
        mountIds: [158], // Lunar Kamuy
      },
      {
        name: "Hells' Kier (Extreme)",
        shortName: 'Suzaku',
        instanceId: 597,
        mountIds: [172], // Euphonious Kamuy
      },
      {
        name: 'The Wreath of Snakes (Extreme)',
        shortName: 'Seiryu',
        instanceId: 638,
        mountIds: [182], // Hallowed Kamuy
      },
    ],
  },

  // ── Shadowbringers ──────────────────────────────────────────────────────────
  {
    expansion: 'Shadowbringers',
    expansionClass: 'exp-shb',
    bosses: [
      {
        name: 'The Dancing Plague (Extreme)',
        shortName: 'Titania',
        instanceId: 658,
        mountIds: [189], // Fae Gwiber
      },
      {
        name: 'The Crown of the Immaculate (Extreme)',
        shortName: 'Innocence',
        instanceId: 667,
        mountIds: [192], // Innocent Gwiber
      },
      {
        name: "The Minstrel's Ballad: Hades's Elegy",
        shortName: 'Hades',
        instanceId: 693,
        mountIds: [205], // Shadow Gwiber
      },
      {
        name: 'Cinder Drift (Extreme)',
        shortName: 'Ruby Weapon',
        instanceId: 718,
        mountIds: [217], // Ruby Gwiber
      },
      {
        name: 'The Seat of Sacrifice (Extreme)',
        shortName: 'Warrior of Light',
        instanceId: 739,
        mountIds: [226], // Gwiber of Light
      },
      {
        name: 'Castrum Marinum (Extreme)',
        shortName: 'Emerald Weapon',
        instanceId: 763,
        mountIds: [238], // Emerald Gwiber
      },
      {
        name: 'The Cloud Deck (Extreme)',
        shortName: 'Diamond Weapon',
        instanceId: 782,
        mountIds: [249], // Diamond Gwiber
      },
    ],
  },

  // ── Endwalker ───────────────────────────────────────────────────────────────
  {
    expansion: 'Endwalker',
    expansionClass: 'exp-ew',
    bosses: [
      {
        name: "The Minstrel's Ballad: Zodiark's Fall",
        shortName: 'Zodiark',
        instanceId: 803,
        mountIds: [261], // Lynx of Eternal Darkness
      },
      {
        name: "The Minstrel's Ballad: Hydaelyn's Call",
        shortName: 'Hydaelyn',
        instanceId: 791,
        mountIds: [262], // Lynx of Divine Light
      },
      {
        name: "The Minstrel's Ballad: Endsinger's Aria",
        shortName: 'Endsinger',
        instanceId: 846,
        mountIds: [293], // Bluefeather Lynx
      },
      {
        name: "Storm's Crown (Extreme)",
        shortName: 'Barbariccia',
        instanceId: 871,
        mountIds: [306], // Lynx of Imperious Wind
      },
      {
        name: 'Mount Ordeals (Extreme)',
        shortName: 'Rubicante',
        instanceId: 924,
        mountIds: [315], // Lynx of Righteous Fire
      },
      {
        name: 'The Voidcast Dais (Extreme)',
        shortName: 'Golbez',
        instanceId: 950,
        mountIds: [325], // Lynx of Fallen Shadow
      },
      {
        name: 'The Abyssal Fracture (Extreme)',
        shortName: 'Zeromus',
        instanceId: 965,
        mountIds: [332], // Lynx of Abyssal Grief
      },
    ],
  },

  // ── Dawntrail ───────────────────────────────────────────────────────────────
  {
    expansion: 'Dawntrail',
    expansionClass: 'exp-dt',
    bosses: [
      {
        name: 'Worqor Lar Dor (Extreme)',
        shortName: 'Valigarmanda',
        instanceId: 833,
        mountIds: [345], // Wings of Ruin
      },
      {
        name: 'Everkeep (Extreme)',
        shortName: 'Zoraal Ja',
        instanceId: 996,
        mountIds: [346], // Wings of Resolve
      },
      {
        name: "The Minstrel's Ballad: Sphene's Burden",
        shortName: 'Sphene',
        instanceId: 1017,
        mountIds: [363], // Wings of Eternity
      },
      {
        name: 'Recollection (Extreme)',
        shortName: 'Wuk Lamat',
        instanceId: 1031,
        mountIds: [389], // Wings of the Knighthood
      },
      {
        name: "The Minstrel's Ballad: Necron's Embrace",
        shortName: 'Necron',
        instanceId: 1062,
        mountIds: [407], // Wings of Death
      },
      {
        name: 'Hell on Rails (Extreme)',
        shortName: 'Doomtrain',
        instanceId: 1077,
        mountIds: [422], // Wings of Mist
      },
      {
        name: 'The Unmaking (Extreme)',
        shortName: 'Enuo',
        instanceId: 1116,
        mountIds: [444], // Wings of Nihility
      },
      {
        name: 'The Windward Wilds (Extreme)',
        shortName: 'Arkveld',
        instanceId: 1044,
        mountIds: [399], // Felyne Support Team Cart
      },
    ],
  },
];
