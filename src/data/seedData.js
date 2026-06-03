/** PORT-NEXUS Shield — fallback seed data when Claude API is unavailable */

export const DISTRICTS = {
  GATE:    { id: 'GATE',    name: 'PORT GATE',   label: 'Access Control & Identity',    color: '#00B4D8' },
  CORE:    { id: 'CORE',    name: 'TOS HUB',     label: 'Terminal Operating System',    color: '#00FFE5' },
  VAULT:   { id: 'VAULT',   name: 'MANIFESTS',   label: 'Customs & Documentation',      color: '#FFB800' },
  CLOUD:   { id: 'CLOUD',   name: 'PORT CLOUD',  label: 'Remote Infrastructure',        color: '#7B2FFF' },
  OUTPOST: { id: 'OUTPOST', name: 'QUAY CRANE',  label: 'SCADA & Crane Control',        color: '#00FF94' },
  BRIDGE:  { id: 'BRIDGE',  name: 'PORT COMMS',  label: 'Communications Hub',           color: '#00B4D8' },
};

export const RANKS = [
  { id: 1, name: 'Port Trainee',         minXp: 0,     badge: null,                aura: '#888888' },
  { id: 2, name: 'Junior Port Officer',  minXp: 1000,  badge: 'First Responder',   aura: '#00B4D8' },
  { id: 3, name: 'Port SOC Analyst',     minXp: 3000,  badge: 'Threat Spotter',    aura: '#00FF94' },
  { id: 4, name: 'Threat Hunter',        minXp: 6000,  badge: 'Shadow Tracker',    aura: '#7B2FFF' },
  { id: 5, name: 'Incident Commander',   minXp: 10000, badge: 'Crisis Controller', aura: '#FFB800' },
  { id: 6, name: 'Port Authority Chief', minXp: 15000, badge: 'Harbour Guardian',  aura: '#00FFE5' },
];

export const RESPONSE_ACTIONS = [
  'Block IP',
  'Isolate System',
  'Escalate to Tier 2',
  'Mark as False Positive',
  'Run Malware Scan',
  'Capture Forensic Image',
  'Rotate Credentials',
  'Deploy Patch',
];

export const SEED_MISSIONS = [
  {
    mission_name: 'Operation Iron Tide',
    briefing: 'Ransomware signatures detected propagating through the Terminal Operating System. Contain before encryption spreads to crane scheduling databases — Transnet 2021 lateral movement pattern active.',
    attack_type: 'Ransomware Lateral Movement',
    difficulty: 'HARD',
    district: 'CORE',
    xp_reward: 1200,
    mission_type: 'Malware Containment',
  },
  {
    mission_name: 'Operation Phantom Manifest',
    briefing: 'Bulk modifications to container manifest records in Customs & Documentation systems detected after hours. Insider data exfiltration or cargo fraud manifest tampering suspected.',
    attack_type: 'Insider Threat',
    difficulty: 'HARD',
    district: 'VAULT',
    xp_reward: 1100,
    mission_type: 'Threat Hunt',
  },
  {
    mission_name: 'Operation Ghost Crane',
    briefing: 'APT persistence indicators on Quay Crane SCADA control nodes. Unauthorised Modbus commands were issued to crane PLC systems. Hunt and eradicate before operational disruption — physical safety risk elevated.',
    attack_type: 'SCADA Intrusion',
    difficulty: 'EXPERT',
    district: 'OUTPOST',
    xp_reward: 1500,
    mission_type: 'Threat Hunt',
  },
  {
    mission_name: 'Operation Dark Portal',
    briefing: 'Credential stuffing attack overwhelming Port Gate access control systems. Multiple badge readers returning false authentications. Mitigate and restore secure perimeter access.',
    attack_type: 'Credential Attack',
    difficulty: 'MEDIUM',
    district: 'GATE',
    xp_reward: 900,
    mission_type: 'Incident Response',
  },
  {
    mission_name: 'Operation Cold Chain',
    briefing: 'Targeted spear-phishing against port customs officers via forged IMO documentation links. Credential harvest in progress — reefer manifest access at risk.',
    attack_type: 'Phishing',
    difficulty: 'MEDIUM',
    district: 'BRIDGE',
    xp_reward: 850,
    mission_type: 'Phishing Investigation',
  },
];

export const SEED_LOGS = [
  { id: 'l1',  timestamp: '2026-05-23 06:00:12', ip: '10.10.1.45',      event: 'Vessel MV ATLANTIC VOYAGER berthed at Quay 7 — TOS berth assignment logged',             suspicious: false },
  { id: 'l2',  timestamp: '2026-05-23 06:14:33', ip: '10.10.2.18',      event: 'Customs officer login: j.nkosi@dct.portsa.co.za — shift start',                          suspicious: false },
  { id: 'l3',  timestamp: '2026-05-23 06:22:01', ip: '10.10.1.12',      event: 'TOS update: container MSCU4501234 manifest cleared customs — release authorised',         suspicious: false },
  { id: 'l4',  timestamp: '2026-05-23 06:31:44', ip: '10.10.3.7',       event: 'Quay Crane QC-04 lift cycle completed — 47 moves/hr nominal productivity',               suspicious: false },
  { id: 'l5',  timestamp: '2026-05-23 06:45:19', ip: '10.10.4.22',      event: 'Reefer unit REEFER-112 temperature check: 4.2°C — within certified range',               suspicious: false },
  { id: 'l6',  timestamp: '2026-05-23 02:17:55', ip: '185.220.101.45',  event: 'TOS login attempt from unregistered external IP — matches known TOR exit node',           suspicious: true  },
  { id: 'l7',  timestamp: '2026-05-23 02:34:12', ip: '10.10.5.88',      event: 'Bulk manifest export 4.2 GB outbound at 02:34 — outside port business hours',            suspicious: true  },
  { id: 'l8',  timestamp: '2026-05-23 03:01:08', ip: '10.10.2.99',      event: 'SCADA firewall service disabled on crane controller QC-04 by LOCAL\\svc_tos',             suspicious: true  },
  { id: 'l9',  timestamp: '2026-05-23 03:15:44', ip: '10.10.1.1',       event: 'New TOS admin account created: sysadmin_temp — unscheduled, no change ticket',           suspicious: true  },
  { id: 'l10', timestamp: '2026-05-23 03:22:31', ip: '10.10.6.14',      event: 'Outbound C2 beacon to 198.51.100.77:4444 from SCADA network segment',                    suspicious: true  },
];

export const SEED_ALERTS = [
  {
    id: 'a1',
    severity: 'CRITICAL',
    source: 'TOS-SERVER-01',
    destination: '10.10.2.50',
    description: 'Ransomware binary detected on Terminal Operating System server TOS-SERVER-01 — Transnet pattern match',
    timestamp: '2026-05-23 09:12:44',
    correct_response: 'Isolate System',
  },
  {
    id: 'a2',
    severity: 'HIGH',
    source: '185.220.101.45',
    destination: '10.10.1.45',
    description: 'Multiple failed TOS login attempts from TOR exit node 185.220.101.45 — possible credential stuffing',
    timestamp: '2026-05-23 09:08:22',
    correct_response: 'Block IP',
  },
  {
    id: 'a3',
    severity: 'MEDIUM',
    source: '10.10.6.14',
    destination: 'unknown-c2.darknet.onion',
    description: 'Outbound C2 beacon from SCADA network segment to unrecognised external domain',
    timestamp: '2026-05-23 09:05:11',
    correct_response: 'Block IP',
  },
  {
    id: 'a4',
    severity: 'LOW',
    source: '10.10.3.22',
    destination: 'MANIFEST-DB',
    description: 'Customs officer account accessed manifest database at 03:17 — outside shift hours',
    timestamp: '2026-05-23 08:52:33',
    correct_response: 'Escalate to Tier 2',
  },
  {
    id: 'a5',
    severity: 'LOW',
    source: 'backup-svc',
    destination: 'TOS-DB-PRIMARY',
    description: 'Scheduled TOS database backup authenticating at 23:17 — within maintenance window',
    timestamp: '2026-05-23 23:17:01',
    correct_response: 'Mark as False Positive',
  },
];

export const SEED_THREAT_FEED = [
  { id: 't1', time: '06:00:01', message: 'Vessel MV CAPE AGULHAS ETD updated in port scheduling system',                    level: 'normal'   },
  { id: 't2', time: '06:00:15', message: 'TLS handshake completed gate-reader-01.dct.portsa',                               level: 'normal'   },
  { id: 't3', time: '06:01:22', message: 'SYN flood detected on PORT GATE access control network interface',                level: 'warning'  },
  { id: 't4', time: '06:02:08', message: 'Crane QC-04 PLC bridge certificate renewal completed — nominal',                  level: 'normal'   },
  { id: 't5', time: '06:03:44', message: 'Anomalous SMB traffic TOS-HUB → MANIFESTS — possible lateral movement',          level: 'critical' },
  { id: 't6', time: '06:04:12', message: 'MFA success: customs.officer@dct.portsa.co.za — shift login verified',           level: 'normal'   },
  { id: 't7', time: '06:05:33', message: 'SCADA beacon 10.10.6.14:4444 — QUAY CRANE network segment compromised',          level: 'critical' },
  { id: 't8', time: '06:06:01', message: 'Reefer manifest sync completed REEFER-ZONE-B — 312 units nominal',               level: 'normal'   },
];

export const SEED_ORG_EMPLOYEES = [
  { id: 'e1', name: 'Sipho Dlamini',   department: 'Gate Security',         lastSim: '2026-05-20', result: 'FAIL', training: 'Enrolled',     risk: 78 },
  { id: 'e2', name: 'Fatima Hassan',   department: 'TOS Operations',        lastSim: '2026-05-21', result: 'PASS', training: 'Complete',     risk: 22 },
  { id: 'e3', name: 'James Naidoo',    department: 'IT Security',           lastSim: '2026-05-22', result: 'PASS', training: 'N/A',          risk: 15 },
  { id: 'e4', name: 'Lindiwe Dlamini', department: 'Port Administration',   lastSim: '2026-05-19', result: 'FAIL', training: 'In Progress',  risk: 85 },
  { id: 'e5', name: 'Carlos Mendes',   department: 'Crane Operations',      lastSim: '2026-05-18', result: 'FAIL', training: 'Enrolled',     risk: 72 },
  { id: 'e6', name: 'Maria Santos',    department: 'Customs & Documentation',lastSim: '2026-05-22', result: 'PASS', training: 'Complete',     risk: 28 },
];

export const SEED_ORG_STATS = {
  riskScore: 58,
  totalEmployees: 312,
  simulationsRun: 412,
  passRate: 67,
  failRate: 33,
  riskTrend: [
    { month: 'Jan', risk: 72 },
    { month: 'Feb', risk: 68 },
    { month: 'Mar', risk: 65 },
    { month: 'Apr', risk: 61 },
    { month: 'May', risk: 58 },
  ],
  departments: [
    { name: 'Port Admin',   risk: 82 },
    { name: 'Gate Security',risk: 71 },
    { name: 'Crane Ops',    risk: 65 },
    { name: 'Customs',      risk: 45 },
    { name: 'IT Security',  risk: 28 },
    { name: 'TOS Ops',      risk: 38 },
  ],
};

export const INITIAL_SKILLS = {
  phishing:  35,
  logs:      40,
  hunting:   30,
  incident:  45,
  network:   38,
  malware:   32,
};

export const AURA_COLORS = {
  cyan:   '#00B4D8',
  green:  '#00FF94',
  purple: '#7B2FFF',
  orange: '#FFB800',
};

export function buildSeedMission(district = 'CORE', rank = 1) {
  const base = SEED_MISSIONS.find((m) => m.district === district) || SEED_MISSIONS[0];
  return {
    ...base,
    district,
    logs: [...SEED_LOGS],
    alerts: SEED_ALERTS.map((a) => ({ ...a })),
    difficulty: rank >= 4 ? 'HARD' : rank >= 2 ? 'MEDIUM' : 'EASY',
  };
}

export function buildSeedDebrief(decisions = []) {
  const correct = decisions.filter((d) => d.correct).length;
  const total = decisions.length || 1;
  return {
    overall_assessment: `You completed the port security exercise with ${correct}/${total} correct decisions. Solid foundation — tighten response timing on CRITICAL TOS and SCADA alerts.`,
    decisions_review: decisions.map((d) => ({
      alert: d.alertDescription || 'Alert',
      action: d.action,
      correct: d.correct,
      note: d.explanation || (d.correct ? 'Appropriate response.' : 'Review port SOC playbooks for this scenario.'),
    })),
    strengths: ['Alert prioritisation', 'Log correlation in TOS environment'],
    improvement_areas: ['Faster isolation on CRITICAL SCADA severity', 'Reduce false positive escalations on routine vessel activity'],
    recommended_study_topics: ['Ransomware containment in OT/IT converged networks', 'SCADA network segmentation', 'Maritime supply chain threat vectors'],
    xp_summary: { earned: 450, penalties: 0, bonus: 0, total: 450 },
  };
}

export function buildSeedPhishingSim(company = 'Durban Container Terminal', attackType = 'Phishing') {
  return {
    email_subject: `[URGENT] ${company} — IMO Compliance Credential Verification`,
    email_body: `Dear Port Operations Staff,\n\nThe South African Maritime Safety Authority requires immediate verification of your port access credentials due to a scheduled IMO compliance audit.\n\nPlease click the link below within 24 hours to avoid suspension of your port facility certificate.\n\nRegards,\nSAMSA Compliance Office`,
    sender_name: 'SAMSA Compliance',
    sender_email: 'compliance@samsa-gov-za.net',
    fake_link_text: 'Verify Port Credentials Now',
    red_flags_present: [
      'Sender domain "samsa-gov-za.net" does not match official SAMSA domain (samsa.org.za)',
      'Urgency language pressuring immediate credential entry within 24 hours',
      'SAMSA never requests password verification via email link — always via secure portal',
      'Hovering over the link reveals a different URL from the displayed text',
    ],
  };
}

export function buildSeedRiskAnalysis() {
  return {
    overall_risk_level: 'ELEVATED',
    key_findings: [
      'Port Administration department shows 82% average risk — highest exposure in the terminal',
      '33% fail rate on phishing simulations; customs staff are prime spear-phishing targets using IMO/SAMSA lures',
      'Crane Operations personnel lack OT/IT convergence security awareness — 3 repeat offenders identified',
    ],
    priority_recommendations: [
      'Launch targeted spear-phishing simulation for Port Administration and Customs within 7 days',
      'Auto-enroll FAIL results in PORT-NEXUS maritime cyber awareness module immediately',
      'Implement quarterly simulation cadence for Gate Security and Crane Operations — align with IMO MSC-FAL.1/Circ.3',
    ],
    estimated_risk_reduction_if_addressed: '35-42% within 90 days',
  };
}
