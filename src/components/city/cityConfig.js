/** PORT-NEXUS Shield — City Configuration & Mission Narratives */

export const DISTRICTS = {
  GATE: {
    id: 'GATE',
    name: 'Port Gate',
    subtitle: 'Access Control & Identity',
    position: [-12, 0, -8],
    approach: [-9, 0, -6],
    color: '#00B4D8',
    accent: '#00FFE5',
    groundColor: '#0D2A3A',
    tileColor: '#7DBE6E',
  },
  CORE: {
    id: 'CORE',
    name: 'TOS Hub',
    subtitle: 'Terminal Operating System',
    position: [0, 0, 0],
    approach: [0, 0, 4],
    color: '#00FFE5',
    accent: '#7FFFEA',
    groundColor: '#0D2A2A',
    tileColor: '#85C476',
  },
  VAULT: {
    id: 'VAULT',
    name: 'Manifests',
    subtitle: 'Customs & Documentation',
    position: [12, 0, -8],
    approach: [9, 0, -5],
    color: '#FFB800',
    accent: '#FFD966',
    groundColor: '#2A200A',
    tileColor: '#93C46E',
  },
  CLOUD: {
    id: 'CLOUD',
    name: 'Port Cloud',
    subtitle: 'Remote Infrastructure',
    position: [-10, 0, 10],
    approach: [-7, 0, 8],
    color: '#7B2FFF',
    accent: '#B388FF',
    groundColor: '#1A0A2A',
    tileColor: '#79BA78',
  },
  OUTPOST: {
    id: 'OUTPOST',
    name: 'Quay Crane',
    subtitle: 'SCADA & Crane Control',
    position: [12, 0, 10],
    approach: [9, 0, 8],
    color: '#00FF94',
    accent: '#80FFCA',
    groundColor: '#0A2A15',
    tileColor: '#7FC470',
  },
  BRIDGE: {
    id: 'BRIDGE',
    name: 'Port Comms',
    subtitle: 'Communications Hub',
    position: [-10, 0, 2],
    approach: [-7, 0, 2],
    color: '#FF6B35',
    accent: '#FFB39B',
    groundColor: '#2A1508',
    tileColor: '#8AC072',
  },
};

/** Port personnel NPCs — one per zone */
export const NPCS = {
  GATE: {
    id: 'GATE',
    name: 'Sipho Dlamini',
    role: 'Gate Security Officer',
    districtId: 'GATE',
    outfit: 'office',
    skinTone: '#7B4F2E',
    clothingColor: '#1B3A5C',
    accentColor: '#00B4D8',
    position: [-10.5, 0, -5.5],
    missionId: 'port_phishing',
    idlePhrases: ['All vehicle access logs clear!', 'Badge readers nominal.', 'Gate secure.'],
  },
  CORE: {
    id: 'CORE',
    name: 'Fatima Hassan',
    role: 'TOS Systems Engineer',
    districtId: 'CORE',
    outfit: 'labcoat',
    skinTone: '#C8956C',
    clothingColor: '#EAF5FF',
    accentColor: '#00FFE5',
    position: [2.5, 0, 4],
    missionId: null,
    idlePhrases: ['TOS nominal.', 'Vessel schedules synced.', 'All berth assignments logged.'],
  },
  VAULT: {
    id: 'VAULT',
    name: 'Ivan Petrov',
    role: 'Customs Documentation Officer',
    districtId: 'VAULT',
    outfit: 'formal',
    skinTone: '#D4A574',
    clothingColor: '#2C1A4E',
    accentColor: '#FFB800',
    position: [10.5, 0, -5.5],
    missionId: 'crane_access',
    idlePhrases: ['Manifests verified.', 'Customs clearance up to date.', 'Documentation secured.'],
  },
  CLOUD: {
    id: 'CLOUD',
    name: 'Zara Mokoena',
    role: 'Cloud Infrastructure Manager',
    districtId: 'CLOUD',
    outfit: 'hoodie',
    skinTone: '#8B4513',
    clothingColor: '#4A0080',
    accentColor: '#7B2FFF',
    position: [-8.5, 0, 8.5],
    missionId: null,
    idlePhrases: ['Instances healthy.', 'Remote VPN access nominal.', 'Cloud monitoring active.'],
  },
  OUTPOST: {
    id: 'OUTPOST',
    name: 'Carlos Mendes',
    role: 'Quay Crane Operator',
    districtId: 'OUTPOST',
    outfit: 'casual',
    skinTone: '#D4A574',
    clothingColor: '#1A3C2A',
    accentColor: '#00FF94',
    position: [10.5, 0, 8.5],
    missionId: 'reefer_intrusion',
    idlePhrases: ['Crane QC-04 nominal.', 'Lift cycles logged.', 'SCADA showing green.'],
  },
  BRIDGE: {
    id: 'BRIDGE',
    name: 'Maria Santos',
    role: 'Port Communications Officer',
    districtId: 'BRIDGE',
    outfit: 'technical',
    skinTone: '#C8956C',
    clothingColor: '#3A1A00',
    accentColor: '#FF6B35',
    position: [-8.5, 0, 2],
    missionId: null,
    idlePhrases: ['VHF channels clear.', 'AIS transponders active.', 'Port comms nominal.'],
  },
};

/** Full NPC mission narratives — port-themed */
export const MISSIONS = {
  port_phishing: {
    id: 'port_phishing',
    npcId: 'GATE',
    districtId: 'GATE',
    title: "The SAMSA Credential Scam",
    xpReward: 1200,
    difficulty: 'Beginner',

    dialogue: [
      {
        speaker: 'Sipho Dlamini',
        text: "I received an email this morning from what looked like SAMSA — the South African Maritime Safety Authority. It said I needed to verify my port access credentials urgently for an IMO compliance audit. I clicked the link and entered my badge login details...",
      },
      {
        speaker: 'Sipho Dlamini',
        text: "But the page looked slightly off. The SAMSA logo had the wrong watermark and the URL showed 'samsa-gov-za.net' instead of 'samsa.org.za'. I think I gave my credentials to a fake site. Could attackers use this to access our gate control systems?",
      },
    ],

    learn: {
      title: "Spear-Phishing Targeting Port Staff",
      icon: '⚓',
      bullets: [
        "Port staff are high-value targets — attackers craft maritime-specific lures using SAMSA, IMO, and IMDG notices",
        "Legitimate authorities like SAMSA never request credential verification via email links",
        "A cloned page with a slightly wrong domain (samsa-gov-za.net vs samsa.org.za) is classic credential harvesting",
        "Gate system credentials can unlock vehicle and vessel access — the blast radius is severe",
      ],
      concept: "Spear-Phishing & Maritime Social Engineering",
    },

    socMissionId: 'port_phishing_soc',

    solutionNotes: [
      "The sender domain 'samsa-gov-za.net' is not the official SAMSA domain (samsa.org.za) — a typosquat",
      "The phishing page collected Sipho's gate system credentials over HTTP with a self-signed certificate",
      "Immediately rotating Sipho's credentials and auditing recent gate access logs contained the breach",
      "Multi-factor authentication on gate systems would have prevented credential replay even after phishing success",
    ],

    cityReaction: {
      message: "Sipho's credentials have been rotated and the phishing domain is blocked. Port Gate access is secured!",
      districtEffect: 'secured',
    },
  },

  crane_access: {
    id: 'crane_access',
    npcId: 'VAULT',
    districtId: 'VAULT',
    title: "The 3AM Manifest Anomaly",
    xpReward: 1500,
    difficulty: 'Intermediate',

    dialogue: [
      {
        speaker: 'Ivan Petrov',
        text: "I was reviewing the database access logs this morning and found something deeply concerning. Our customs manifest database was accessed at 3:17am by an account I don't recognise — and no one is scheduled to work nights this week.",
      },
      {
        speaker: 'Ivan Petrov',
        text: "The account ran bulk export queries on thousands of container records — contents, declared values, shipper details. Over 4 gigabytes left our network. This is exactly the data needed for cargo fraud or container substitution. Something is very wrong.",
      },
    ],

    learn: {
      title: "After-Hours Manifest Database Exfiltration",
      icon: '📦',
      bullets: [
        "Manifest databases contain high-value data: container contents, declared values, shipper details — prime targets for cargo fraud",
        "Compromised or orphaned customs accounts are routinely exploited for after-hours bulk data theft",
        "Bulk export queries at off-hours are a key indicator of data exfiltration for manifest tampering or mis-declaration",
        "User Behaviour Analytics tuned to port shift patterns can detect exactly this type of baseline deviation",
      ],
      concept: "Insider Threat / Compromised Account in Maritime Logistics",
    },

    socMissionId: 'crane_access_soc',

    solutionNotes: [
      "The account belonged to a former logistics contractor — access was never revoked after contract expiry",
      "Over 15,000 container manifest records were exported to an external IP registered in a known threat actor cluster",
      "Suspending the account and preserving database audit logs were the critical first steps",
      "This follows the Transnet 2021 pattern: IT compromise enabling operational disruption via data integrity attacks",
    ],

    cityReaction: {
      message: "The compromised account is suspended and forensic logs preserved. Manifest integrity is restored!",
      districtEffect: 'secured',
    },
  },

  reefer_intrusion: {
    id: 'reefer_intrusion',
    npcId: 'OUTPOST',
    districtId: 'OUTPOST',
    title: "The Phantom Crane Command",
    xpReward: 1350,
    difficulty: 'Beginner',

    dialogue: [
      {
        speaker: 'Carlos Mendes',
        text: "I was on a scheduled break when I got a critical alert from the crane monitoring dashboard. Crane QC-04 had received a lift command that wasn't in my shift schedule — and the crane started moving. I hadn't authorised anything.",
      },
      {
        speaker: 'Carlos Mendes',
        text: "I hit the physical emergency stop in time. IT is saying an unknown device appeared on the SCADA network segment right before the unauthorised command was issued. What is happening to my crane? Could someone take control remotely?",
      },
    ],

    learn: {
      title: "Rogue SCADA Commands & OT/IT Network Intrusion",
      icon: '🏗️',
      bullets: [
        "Quay crane SCADA systems increasingly connect to IT networks — creating exploitable attack surfaces attackers can pivot through",
        "An unauthorised device injecting Modbus/PLC commands onto the SCADA network poses immediate physical safety risk",
        "The Transnet 2021 ransomware attack demonstrated how IT/OT convergence can halt entire port operations",
        "Isolate the SCADA segment first — a crane moving under attacker control can damage cargo, vessels, and workers",
      ],
      concept: "OT/IT Convergence Attack & SCADA Network Intrusion",
    },

    socMissionId: 'reefer_intrusion_soc',

    solutionNotes: [
      "The rogue device used a spoofed crane controller MAC address and injected Modbus commands via the SCADA VLAN",
      "Network segmentation between the IT and OT/SCADA VLANs would have prevented lateral movement to crane systems",
      "The initial vector was a phishing email opened on a PC connected to the same flat network as the crane PLCs",
      "Physical emergency stops are the last line of defence — digital SCADA network isolation must come first",
    ],

    cityReaction: {
      message: "The rogue device is isolated and crane QC-04 is back under authorised control. SCADA network secured!",
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
    cyan:   '#00B4D8',
    green:  '#00FF94',
    purple: '#7B2FFF',
    orange: '#FFB800',
  };
  return map[aura] || '#00B4D8';
}

/** NPC approach radius — player must be within this to trigger dialogue */
export const NPC_INTERACT_RADIUS = 4.5;
