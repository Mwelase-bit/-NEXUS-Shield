/** NEXUS Shield — fallback seed data when Claude API is unavailable */

export const DISTRICTS = {
  GATE: { id: 'GATE', name: 'THE GATE', label: 'Email & Web Gateway', color: '#00B4D8' },
  CORE: { id: 'CORE', name: 'THE CORE', label: 'Servers & Databases', color: '#00FFE5' },
  VAULT: { id: 'VAULT', name: 'THE VAULT', label: 'Sensitive Data Storage', color: '#FFB800' },
  CLOUD: { id: 'CLOUD', name: 'THE CLOUD DISTRICT', label: 'Cloud Infrastructure', color: '#7B2FFF' },
  OUTPOST: { id: 'OUTPOST', name: 'THE OUTPOST', label: 'Remote Endpoints', color: '#00FF94' },
  BRIDGE: { id: 'BRIDGE', name: 'THE BRIDGE', label: 'Third-Party Integrations', color: '#00B4D8' },
};

export const RANKS = [
  { id: 1, name: 'Script Kiddie', minXp: 0, badge: null, aura: '#888888' },
  { id: 2, name: 'Junior Analyst', minXp: 1000, badge: 'First Responder', aura: '#00B4D8' },
  { id: 3, name: 'SOC Analyst', minXp: 3000, badge: 'Threat Spotter', aura: '#00FF94' },
  { id: 4, name: 'Threat Hunter', minXp: 6000, badge: 'Shadow Tracker', aura: '#7B2FFF' },
  { id: 5, name: 'Incident Commander', minXp: 10000, badge: 'Crisis Controller', aura: '#FFB800' },
  { id: 6, name: 'Elite Defender', minXp: 15000, badge: 'City Guardian', aura: '#00FFE5' },
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
    mission_name: 'Operation Phantom Signal',
    briefing: 'Ransomware signatures detected propagating through core file servers. Contain before encryption spreads.',
    attack_type: 'Ransomware',
    difficulty: 'HARD',
    district: 'CORE',
    xp_reward: 1200,
    mission_type: 'Malware Containment',
  },
  {
    mission_name: 'Operation Dark Mirror',
    briefing: 'Anomalous bulk egress from The Vault suggests insider data exfiltration. Identify and stop the leak.',
    attack_type: 'Insider Threat',
    difficulty: 'HARD',
    district: 'VAULT',
    xp_reward: 1100,
    mission_type: 'Threat Hunt',
  },
  {
    mission_name: 'Operation Ghost Protocol',
    briefing: 'APT persistence indicators on remote outpost endpoints. Hunt and eradicate footholds.',
    attack_type: 'APT',
    difficulty: 'EXPERT',
    district: 'OUTPOST',
    xp_reward: 1500,
    mission_type: 'Threat Hunt',
  },
  {
    mission_name: 'Operation Flood Gate',
    briefing: 'DDoS traffic overwhelming email and web gateway. Mitigate and restore service.',
    attack_type: 'DDoS',
    difficulty: 'MEDIUM',
    district: 'GATE',
    xp_reward: 900,
    mission_type: 'Incident Response',
  },
  {
    mission_name: 'Operation Social Spike',
    briefing: 'Targeted phishing against executive accounts via third-party integration bridge.',
    attack_type: 'Phishing',
    difficulty: 'MEDIUM',
    district: 'BRIDGE',
    xp_reward: 850,
    mission_type: 'Phishing Investigation',
  },
];

export const SEED_LOGS = [
  { id: 'l1', timestamp: '2026-05-23 08:00:12', ip: '10.0.1.45', event: 'Scheduled backup completed successfully', suspicious: false },
  { id: 'l2', timestamp: '2026-05-23 08:14:33', ip: '10.0.2.18', event: 'User login: jsmith@corp.local', suspicious: false },
  { id: 'l3', timestamp: '2026-05-23 08:22:01', ip: '10.0.1.12', event: 'System update KB5023451 applied', suspicious: false },
  { id: 'l4', timestamp: '2026-05-23 08:31:44', ip: '10.0.3.7', event: 'Database query executed on HR_DB', suspicious: false },
  { id: 'l5', timestamp: '2026-05-23 08:45:19', ip: '10.0.4.22', event: 'File access: /finance/reports/Q1.pdf', suspicious: false },
  { id: 'l6', timestamp: '2026-05-23 02:17:55', ip: '185.220.101.45', event: 'Login from unusual geography (TOR exit node)', suspicious: true },
  { id: 'l7', timestamp: '2026-05-23 02:34:12', ip: '10.0.5.88', event: 'Large data transfer 4.2GB outbound at 02:34', suspicious: true },
  { id: 'l8', timestamp: '2026-05-23 03:01:08', ip: '10.0.2.99', event: 'Antivirus service disabled by LOCAL\\svc_backup', suspicious: true },
  { id: 'l9', timestamp: '2026-05-23 03:15:44', ip: '10.0.1.1', event: 'New admin account created: sysadmin_temp', suspicious: true },
  { id: 'l10', timestamp: '2026-05-23 03:22:31', ip: '10.0.6.14', event: 'Outbound connection to 198.51.100.77:4444', suspicious: true },
];

export const SEED_ALERTS = [
  {
    id: 'a1',
    severity: 'CRITICAL',
    source: 'CORP-FS-01',
    destination: '10.0.2.50',
    description: 'Ransomware binary detected on CORP-FS-01',
    timestamp: '2026-05-23 09:12:44',
    correct_response: 'Isolate System',
  },
  {
    id: 'a2',
    severity: 'HIGH',
    source: '185.220.101.45',
    destination: '10.0.1.45',
    description: 'Multiple failed login attempts from 185.220.101.45',
    timestamp: '2026-05-23 09:08:22',
    correct_response: 'Block IP',
  },
  {
    id: 'a3',
    severity: 'MEDIUM',
    source: '10.0.6.14',
    destination: 'unknown-c2.evil-domain.net',
    description: 'Unusual outbound traffic to unrecognised domain',
    timestamp: '2026-05-23 09:05:11',
    correct_response: 'Block IP',
  },
  {
    id: 'a4',
    severity: 'LOW',
    source: '10.0.3.22',
    destination: 'HR_DB',
    description: 'User account accessed outside business hours',
    timestamp: '2026-05-23 08:52:33',
    correct_response: 'Escalate to Tier 2',
  },
  {
    id: 'a5',
    severity: 'LOW',
    source: 'backup-svc',
    destination: 'DB-PRIMARY',
    description: 'Database backup service authenticating at 23:17',
    timestamp: '2026-05-23 23:17:01',
    correct_response: 'Mark as False Positive',
  },
];

export const SEED_THREAT_FEED = [
  { id: 't1', time: '09:00:01', message: 'DNS query resolved: mail.corp.local', level: 'normal' },
  { id: 't2', time: '09:00:15', message: 'TLS handshake completed gateway-01', level: 'normal' },
  { id: 't3', time: '09:01:22', message: 'SYN flood detected on GATE interface', level: 'warning' },
  { id: 't4', time: '09:02:08', message: 'Certificate renewal: api.corp.local', level: 'normal' },
  { id: 't5', time: '09:03:44', message: 'Anomalous SMB traffic CORE→VAULT', level: 'critical' },
  { id: 't6', time: '09:04:12', message: 'User MFA success: analyst@corp.local', level: 'normal' },
  { id: 't7', time: '09:05:33', message: 'Outbound beacon 10.0.6.14:4444', level: 'critical' },
  { id: 't8', time: '09:06:01', message: 'Cloud sync completed OUTPOST-07', level: 'normal' },
];

export const SEED_ORG_EMPLOYEES = [
  { id: 'e1', name: 'Thabo Mokoena', department: 'Finance', lastSim: '2026-05-20', result: 'FAIL', training: 'Enrolled', risk: 78 },
  { id: 'e2', name: 'Sarah van der Berg', department: 'HR', lastSim: '2026-05-21', result: 'PASS', training: 'Complete', risk: 22 },
  { id: 'e3', name: 'James Naidoo', department: 'IT', lastSim: '2026-05-22', result: 'PASS', training: 'N/A', risk: 15 },
  { id: 'e4', name: 'Lindiwe Dlamini', department: 'Executive', lastSim: '2026-05-19', result: 'FAIL', training: 'In Progress', risk: 85 },
  { id: 'e5', name: 'Pieter Botha', department: 'Sales', lastSim: '2026-05-18', result: 'FAIL', training: 'Enrolled', risk: 72 },
  { id: 'e6', name: 'Nomsa Khumalo', department: 'Operations', lastSim: '2026-05-22', result: 'PASS', training: 'Complete', risk: 28 },
];

export const SEED_ORG_STATS = {
  riskScore: 58,
  totalEmployees: 248,
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
    { name: 'Executive', risk: 82 },
    { name: 'Finance', risk: 71 },
    { name: 'Sales', risk: 65 },
    { name: 'HR', risk: 45 },
    { name: 'IT', risk: 28 },
    { name: 'Operations', risk: 38 },
  ],
};

export const INITIAL_SKILLS = {
  phishing: 35,
  logs: 40,
  hunting: 30,
  incident: 45,
  network: 38,
  malware: 32,
};

export const AURA_COLORS = {
  cyan: '#00B4D8',
  green: '#00FF94',
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
    overall_assessment: `You completed the exercise with ${correct}/${total} correct decisions. Solid foundation — tighten response timing on critical alerts.`,
    decisions_review: decisions.map((d) => ({
      alert: d.alertDescription || 'Alert',
      action: d.action,
      correct: d.correct,
      note: d.explanation || (d.correct ? 'Appropriate response.' : 'Review SOC playbooks for this scenario.'),
    })),
    strengths: ['Alert prioritisation', 'Log correlation awareness'],
    improvement_areas: ['Faster isolation on CRITICAL severity', 'Reduce false positive escalations'],
    recommended_study_topics: ['Ransomware containment', 'TOR exit node blocking'],
    xp_summary: { earned: 450, penalties: 0, bonus: 0, total: 450 },
  };
}

export function buildSeedPhishingSim(company = 'Acme Corp', attackType = 'Phishing') {
  return {
    email_subject: `[ACTION REQUIRED] ${company} Security Policy Update`,
    email_body: `Dear Team Member,\n\nOur IT department requires immediate verification of your credentials due to a scheduled security migration.\n\nPlease click the link below within 24 hours to avoid account suspension.\n\nRegards,\nIT Security Team`,
    sender_name: 'IT Security',
    sender_email: 'security-noreply@acme-corp-secure.net',
    fake_link_text: 'Verify Account Now',
    red_flags_present: [
      'Sender domain does not match official company domain',
      'Urgency language pressuring immediate action',
      'Generic greeting without your name',
      'Link URL differs from displayed text',
    ],
  };
}

export function buildSeedRiskAnalysis() {
  return {
    overall_risk_level: 'ELEVATED',
    key_findings: [
      'Executive department shows 82% average risk — highest in organisation',
      '33% fail rate on phishing simulations exceeds industry benchmark',
      '3 repeat offenders require mandatory remedial training',
    ],
    priority_recommendations: [
      'Launch targeted phishing simulation for Executive within 7 days',
      'Auto-enroll all FAIL results in CyberShield phishing module',
      'Implement quarterly simulation cadence for Finance and Sales',
    ],
    estimated_risk_reduction_if_addressed: '35-42% within 90 days',
  };
}
