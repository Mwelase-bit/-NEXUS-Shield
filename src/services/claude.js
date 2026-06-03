/**
 * Claude API integration — claude-sonnet-4-20250514
 * Falls back to seed data on any failure. Calls /api/claude proxy only — key is never client-side.
 */

import {
  buildSeedMission,
  buildSeedDebrief,
  buildSeedPhishingSim,
  buildSeedRiskAnalysis,
  SEED_MISSIONS,
} from '../data/seedData';

const MODEL = 'claude-sonnet-4-20250514';

async function callClaude({ system, user, maxTokens = 2048, jsonMode = true }) {
  const body = {
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: user }],
  };

  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Claude proxy ${res.status}`);

  const data = await res.json();
  const text = data.content?.[0]?.text ?? data.text ?? '';
  if (jsonMode) {
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  }
  return text.trim();
}

const MISSION_SYSTEM = `You are the PORT-NEXUS Shield AI mission generator. Generate a realistic cybersecurity training mission for a port security analyst at a maritime container terminal. Return ONLY valid JSON, no markdown, no explanation. Schema: {"mission_name":"","briefing":"","attack_type":"","difficulty":"","district":"","mission_type":"","logs":[{"id":"","timestamp":"","ip":"","event":"","suspicious":boolean}],"alerts":[{"id":"","severity":"CRITICAL|HIGH|MEDIUM|LOW","source":"","destination":"","description":"","timestamp":"","correct_response":""}],"xp_reward":number}. Exactly 10 logs (mix normal/suspicious) and 5 alerts. district must be one of: GATE, CORE, VAULT, CLOUD, OUTPOST, BRIDGE. attack_type should reflect port cyber threats: Container Manifest Tampering, Quay Crane SCADA Intrusion, Ransomware Lateral Movement, Gate Credential Theft, Reefer Unit Hijack, Customs Phishing, Insider Data Exfiltration — reference the 2021 Transnet ransomware pattern where applicable. Logs and alerts must reflect maritime terminal operations (vessel berths, crane movements, manifest queries, reefer temperature checks, customs clearance, port gate badge events). correct_response must be one of: Block IP, Isolate System, Escalate to Tier 2, Mark as False Positive, Run Malware Scan, Capture Forensic Image, Rotate Credentials, Deploy Patch.`;

const EVAL_SYSTEM = `You are a senior port security analyst evaluating a junior officer's cyber incident response decision at a maritime container terminal. Reference port-specific context (TOS, SCADA, crane PLCs, manifest databases, gate systems). Be specific and educational. Return ONLY valid JSON: {"correct":boolean,"explanation":"","what_should_have_been_done":"","xp_change":number}.`;

const INTEL_SYSTEM = `You are PORT-NEXUS AI providing tactical intelligence to a port security analyst. Give a specific, educational hint about the maritime terminal threat that guides without giving the answer away. Keep it under 3 sentences. Maritime port security briefing tone — reference relevant systems (TOS, SCADA, manifest DB, crane PLC, gate control). Return plain text only, no JSON.`;

const DEBRIEF_SYSTEM = `You are a senior port authority cybersecurity mentor debriefing a junior analyst after a maritime terminal security exercise. Reference port-specific systems (TOS, SCADA, quay cranes, manifest databases, gate control, reefer units). Mention the 2021 Transnet pattern where ransomware lateral movement is involved. Be specific, encouraging, actionable. Return ONLY valid JSON: {"overall_assessment":"","decisions_review":[{"alert":"","action":"","correct":boolean,"note":""}],"strengths":[],"improvement_areas":[],"recommended_study_topics":[],"xp_summary":{"earned":number,"penalties":number,"bonus":number,"total":number}}.`;

const PHISHING_SYSTEM = `You are a port authority red team specialist creating a realistic but safe spear-phishing simulation targeting maritime terminal staff. Scenarios must reference port operations: customs documentation, IMO/SAMSA compliance notices, vessel scheduling, container manifest verification, port facility certificates. Believable but clearly a simulation when revealed. Return ONLY valid JSON: {"email_subject":"","email_body":"","sender_name":"","sender_email":"","fake_link_text":"","red_flags_present":[]}.`;

const RISK_SYSTEM = `You are a maritime port cybersecurity risk analyst providing strategic recommendations to port authority leadership. Reference OT/IT convergence risks, SCADA vulnerabilities in crane and terminal systems, supply chain threats, insider threat vectors common in container terminal operations, and regulatory obligations under IMO Maritime Cyber Risk Management guidelines. Return ONLY valid JSON: {"overall_risk_level":"","key_findings":[],"priority_recommendations":[],"estimated_risk_reduction_if_addressed":""}.`;

export async function generateMission({ rank, skills, district }) {
  try {
    const weaknesses = Object.entries(skills || {})
      .sort((a, b) => a[1] - b[1])
      .slice(0, 2)
      .map(([k]) => k);
    return await callClaude({
      system: MISSION_SYSTEM,
      user: JSON.stringify({ player_rank: rank, skill_weaknesses: weaknesses, district }),
    });
  } catch {
    return buildSeedMission(district, rank);
  }
}

export async function evaluateResponse({ alert, action, mission }) {
  try {
    return await callClaude({
      system: EVAL_SYSTEM,
      user: JSON.stringify({ alert, chosen_action: action, mission_context: mission }),
    });
  } catch {
    const correct = action === alert.correct_response;
    return {
      correct,
      explanation: correct
        ? 'Correct — this action aligns with standard SOC playbook for this alert type.'
        : `Incorrect — the recommended action was "${alert.correct_response}" for this scenario.`,
      what_should_have_been_done: alert.correct_response,
      xp_change: correct ? 300 : -200,
    };
  }
}

export async function requestIntel({ alert, mission }) {
  try {
    return await callClaude({
      system: INTEL_SYSTEM,
      user: JSON.stringify({ alert, mission_context: mission }),
      jsonMode: false,
    });
  } catch {
    return `INTEL: Focus on ${alert.severity} severity indicators — correlate source ${alert.source} with recent log anomalies before selecting containment.`;
  }
}

export async function generateDebrief({ decisions, timeTaken, score, skills }) {
  try {
    return await callClaude({
      system: DEBRIEF_SYSTEM,
      user: JSON.stringify({ decisions, time_taken: timeTaken, score, skill_profile: skills }),
    });
  } catch {
    return buildSeedDebrief(decisions);
  }
}

export async function generatePhishingSim({ company, department, attackType, sophistication }) {
  try {
    return await callClaude({
      system: PHISHING_SYSTEM,
      user: JSON.stringify({ company_name: company, department, attack_type: attackType, sophistication_level: sophistication }),
    });
  } catch {
    return buildSeedPhishingSim(company, attackType);
  }
}

export async function analyzeOrgRisk({ stats, employees }) {
  try {
    return await callClaude({
      system: RISK_SYSTEM,
      user: JSON.stringify({ simulation_results: stats, employees, repeat_offenders: employees.filter((e) => e.risk > 70) }),
    });
  } catch {
    return buildSeedRiskAnalysis();
  }
}

export function getDistrictMissions(district) {
  return SEED_MISSIONS.filter((m) => m.district === district);
}
