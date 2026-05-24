/** NEXUS Shield — City Configuration & Mission Narratives */

export const DISTRICTS = {
  GATE: {
    id: 'GATE',
    name: 'The Gate',
    subtitle: 'Identity & Access',
    position: [-12, 0, -8],
    approach: [-9, 0, -6],
    color: '#00B4D8',
    accent: '#00FFE5',
    groundColor: '#0D2A3A',
    tileColor: '#0A2030',
  },
  CORE: {
    id: 'CORE',
    name: 'The Core',
    subtitle: 'Data Infrastructure',
    position: [0, 0, 0],
    approach: [0, 0, 4],
    color: '#00FFE5',
    accent: '#7FFFEA',
    groundColor: '#0D2A2A',
    tileColor: '#0A2020',
  },
  VAULT: {
    id: 'VAULT',
    name: 'The Vault',
    subtitle: 'Data Protection',
    position: [12, 0, -8],
    approach: [9, 0, -5],
    color: '#FFB800',
    accent: '#FFD966',
    groundColor: '#2A200A',
    tileColor: '#201800',
  },
  CLOUD: {
    id: 'CLOUD',
    name: 'Cloud District',
    subtitle: 'Cloud Infrastructure',
    position: [-10, 0, 10],
    approach: [-7, 0, 8],
    color: '#7B2FFF',
    accent: '#B388FF',
    groundColor: '#1A0A2A',
    tileColor: '#120820',
  },
  OUTPOST: {
    id: 'OUTPOST',
    name: 'The Outpost',
    subtitle: 'Remote Endpoints',
    position: [12, 0, 10],
    approach: [9, 0, 8],
    color: '#00FF94',
    accent: '#80FFCA',
    groundColor: '#0A2A15',
    tileColor: '#082010',
  },
  BRIDGE: {
    id: 'BRIDGE',
    name: 'The Bridge',
    subtitle: 'Integration Hub',
    position: [-10, 0, 2],
    approach: [-7, 0, 2],
    color: '#FF6B35',
    accent: '#FFB39B',
    groundColor: '#2A1508',
    tileColor: '#201005',
  },
};

/** NPC definitions — one per district */
export const NPCS = {
  GATE: {
    id: 'GATE',
    name: 'Sarah Chen',
    role: 'Accounts Manager',
    districtId: 'GATE',
    outfit: 'office', // warm beige/navy
    skinTone: '#C8956C',
    clothingColor: '#1B3A5C',
    accentColor: '#00B4D8',
    position: [-10.5, 0, -5.5],
    missionId: 'phishing_sarah',
    idlePhrases: ['Everything is fine here!', 'Network is secure.', 'All clear!'],
  },
  CORE: {
    id: 'CORE',
    name: 'Dr. Amara Osei',
    role: 'Database Administrator',
    districtId: 'CORE',
    outfit: 'labcoat',
    skinTone: '#7B4F2E',
    clothingColor: '#EAF5FF',
    accentColor: '#00FFE5',
    position: [2.5, 0, 4],
    missionId: null, // no active mission yet
    idlePhrases: ['Systems nominal.', 'Database optimised.', 'All queries logged.'],
  },
  VAULT: {
    id: 'VAULT',
    name: 'Marcus Webb',
    role: 'Finance Director',
    districtId: 'VAULT',
    outfit: 'formal',
    skinTone: '#D4A574',
    clothingColor: '#2C1A4E',
    accentColor: '#FFB800',
    position: [10.5, 0, -5.5],
    missionId: 'vault_access',
    idlePhrases: ['Financial data secured.', 'Vault is locked.'],
  },
  CLOUD: {
    id: 'CLOUD',
    name: 'Zara Mokoena',
    role: 'Cloud Engineer',
    districtId: 'CLOUD',
    outfit: 'hoodie',
    skinTone: '#8B4513',
    clothingColor: '#4A0080',
    accentColor: '#7B2FFF',
    position: [-8.5, 0, 8.5],
    missionId: null,
    idlePhrases: ['Instances are healthy.', 'Auto-scaling active.', 'Cloud is clear!'],
  },
  OUTPOST: {
    id: 'OUTPOST',
    name: 'Thabo Nkosi',
    role: 'Remote Developer',
    districtId: 'OUTPOST',
    outfit: 'casual',
    skinTone: '#5C3317',
    clothingColor: '#1A3C2A',
    accentColor: '#00FF94',
    position: [10.5, 0, 8.5],
    missionId: 'rogue_device',
    idlePhrases: ['VPN connected!', 'Working remotely.', 'Endpoint is clean.'],
  },
  BRIDGE: {
    id: 'BRIDGE',
    name: 'Priya Patel',
    role: 'Integration Specialist',
    districtId: 'BRIDGE',
    outfit: 'technical',
    skinTone: '#C8956C',
    clothingColor: '#3A1A00',
    accentColor: '#FF6B35',
    position: [-8.5, 0, 2],
    missionId: null,
    idlePhrases: ['APIs are responding.', 'Pipelines flowing.', 'Integration healthy.'],
  },
};

/** Full mission narratives — Cloud Quest style 5-step flow */
export const MISSIONS = {
  phishing_sarah: {
    id: 'phishing_sarah',
    npcId: 'GATE',
    districtId: 'GATE',
    title: "Sarah's Phishing Incident",
    xpReward: 1200,
    difficulty: 'Beginner',

    // Step 1 — Problem dialogue
    dialogue: [
      {
        speaker: 'Sarah Chen',
        text: "Hi! I got an email earlier that looked like it came from our IT department. It said I needed to reset my password urgently or my account would be locked. I clicked the link and typed in my details...",
      },
      {
        speaker: 'Sarah Chen',
        text: "But now I'm not sure. The page looked a bit... off. The logo was slightly blurry and the URL didn't look quite right. Did I make a mistake? Am I in trouble?",
      },
    ],

    // Step 2 — Learning content
    learn: {
      title: "What Happened to Sarah?",
      icon: '🎣',
      bullets: [
        "Phishing emails mimic trusted senders to trick you into revealing credentials",
        "Real IT departments NEVER ask for passwords via email links",
        "The fake link led to a credential harvesting page — a clone of the real login",
        "The blurry logo and unusual URL were red flags Sarah should have spotted",
      ],
      concept: "Credential Harvesting via Phishing",
    },

    // Step 3 — SOC mission reference
    socMissionId: 'phishing_sarah_soc',

    // Step 4 — Solution debrief talking points
    solutionNotes: [
      "The email domain was 'it-support.company-helpdesk.net' — not the real company domain",
      "The login page used HTTP, not HTTPS — a major red flag",
      "The attacker's IP resolved to a known threat intelligence feed entry",
      "Resetting Sarah's password and blocking the phishing domain contained the breach",
    ],

    // Step 5 — City reaction
    cityReaction: {
      message: "Sarah's credentials have been reset and the phishing domain is blocked. The Gate is secure!",
      districtEffect: 'secured',
    },
  },

  vault_access: {
    id: 'vault_access',
    npcId: 'VAULT',
    districtId: 'VAULT',
    title: "The 3AM Access Anomaly",
    xpReward: 1500,
    difficulty: 'Intermediate',

    dialogue: [
      {
        speaker: 'Marcus Webb',
        text: "I was reviewing our security logs this morning and found something very concerning. Our financial database was accessed at 3:17am last night.",
      },
      {
        speaker: 'Marcus Webb',
        text: "None of my team should be working at that hour. The access used a legitimate account, but the activity pattern is completely abnormal — large data exports, strange query patterns. Something is very wrong.",
      },
    ],

    learn: {
      title: "After-Hours Access Anomalies",
      icon: '🕐',
      bullets: [
        "Legitimate users rarely access sensitive systems at unusual hours without prior notice",
        "Insider threats and compromised accounts often show abnormal time-based access patterns",
        "Large unexpected data exports during off-hours are a major red flag for data exfiltration",
        "User Behaviour Analytics (UBA) tools detect exactly this type of baseline deviation",
      ],
      concept: "Insider Threat / Compromised Account Detection",
    },

    socMissionId: 'vault_access_soc',

    solutionNotes: [
      "The account belonged to a former contractor whose access was never revoked",
      "Over 2.3GB of financial records were exported to an external IP address",
      "Suspending the account and preserving forensic logs were the critical first steps",
      "This is a textbook case of privilege misuse through an orphaned account",
    ],

    cityReaction: {
      message: "The suspicious account has been suspended and forensic evidence preserved. The Vault is locked down!",
      districtEffect: 'secured',
    },
  },

  rogue_device: {
    id: 'rogue_device',
    npcId: 'OUTPOST',
    districtId: 'OUTPOST',
    title: "The Unknown Device",
    xpReward: 1350,
    difficulty: 'Beginner',

    dialogue: [
      {
        speaker: 'Thabo Nkosi',
        text: "Hey, I was working from a coffee shop today and connected to the company VPN. Everything seemed fine, but IT just sent me an alert about an unknown device appearing on our internal network.",
      },
      {
        speaker: 'Thabo Nkosi',
        text: "I didn't connect anything new — it's not mine! Could someone be using the café WiFi to get onto our network? This has me really worried about what I might have exposed.",
      },
    ],

    learn: {
      title: "Rogue Devices & Public WiFi Risks",
      icon: '📡',
      bullets: [
        "Public WiFi networks can be exploited for man-in-the-middle (MitM) attacks",
        "Attackers can intercept VPN setup traffic to inject rogue devices onto corporate networks",
        "A device appearing on the network that nobody recognises is an immediate red flag",
        "All unknown devices must be isolated first — investigate second, never the other way around",
      ],
      concept: "Rogue Device Detection & MitM Attack Prevention",
    },

    socMissionId: 'rogue_device_soc',

    solutionNotes: [
      "The rogue device had a spoofed MAC address and was communicating with a known C2 server",
      "Forcing a VPN reconnection with MFA verification ensured Thabo's session was clean",
      "An endpoint scan on Thabo's machine found no malware — the attack was network-layer only",
      "Network segmentation would have limited the blast radius of this type of attack",
    ],

    cityReaction: {
      message: "The rogue device has been isolated and Thabo's connection is secured. The Outpost is defended!",
      districtEffect: 'secured',
    },
  },
};

export const ROAD_PATHS = [
  [[-12, -8], [0, 0]],
  [[0, 0], [12, -8]],
  [[0, 0], [-10, 10]],
  [[-10, 10], [12, 10]],
  [[-10, 2], [0, 0]],
  [[0, 0], [12, 10]],
  [[-12, -8], [-10, 2]],
  [[12, -8], [12, 10]],
];

export const SPAWN_POSITION = { x: 0, y: 0, z: 8 };

export function getDistrictApproach(id) {
  const d = DISTRICTS[id];
  if (!d) return { x: 0, z: 5 };
  return { x: d.approach[0], z: d.approach[2] };
}

export function getAuraColor(aura) {
  const map = {
    cyan: '#00B4D8',
    green: '#00FF94',
    purple: '#7B2FFF',
    orange: '#FFB800',
  };
  return map[aura] || '#00B4D8';
}

/** NPC approach radius — player must be within this to trigger dialogue */
export const NPC_INTERACT_RADIUS = 4.5;
