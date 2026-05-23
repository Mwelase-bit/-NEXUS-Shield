/**
 * Claude API integration — claude-sonnet-4-20250514
 * Falls back to seed data on any failure. Works via env key or /api proxy.
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
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const proxyUrl = import.meta.env.VITE_CLAUDE_PROXY_URL || '/api/claude';

  const body = {
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: user }],
  };

  const headers = {
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01',
  };
  if (apiKey) headers['x-api-key'] = apiKey;

  const endpoints = apiKey
    ? ['https://api.anthropic.com/v1/messages']
    : [proxyUrl, 'https://api.anthropic.com/v1/messages'];

  let lastError;
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        lastError = new Error(`Claude API ${res.status}`);
        continue;
      }
      const data = await res.json();
      const text = data.content?.[0]?.text ?? data.text ?? '';
      if (jsonMode) {
        const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleaned);
      }
      return text.trim();
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError || new Error('Claude unavailable');
}

const MISSION_SYSTEM = `You are the NEXUS Shield AI mission generator. Generate a realistic cybersecurity training mission for a SOC analyst. Return ONLY valid JSON, no markdown, no explanation. Schema: {"mission_name":"","briefing":"","attack_type":"","difficulty":"","district":"","mission_type":"","logs":[{"id":"","timestamp":"","ip":"","event":"","suspicious":boolean}],"alerts":[{"id":"","severity":"CRITICAL|HIGH|MEDIUM|LOW","source":"","destination":"","description":"","timestamp":"","correct_response":""}],"xp_reward":number}. Exactly 10 logs (mix normal/suspicious) and 5 alerts. correct_response must be one of: Block IP, Isolate System, Escalate to Tier 2, Mark as False Positive, Run Malware Scan, Capture Forensic Image, Rotate Credentials, Deploy Patch.`;

const EVAL_SYSTEM = `You are a senior SOC analyst evaluating a junior analyst's incident response decision. Be specific and educational. Return ONLY valid JSON: {"correct":boolean,"explanation":"","what_should_have_been_done":"","xp_change":number}.`;

const INTEL_SYSTEM = `You are NEXUS AI providing tactical intelligence to a SOC analyst. Give a specific, educational hint that guides without giving the answer away. Keep it under 3 sentences. Intelligence briefing tone. Return plain text only, no JSON.`;

const DEBRIEF_SYSTEM = `You are a senior cybersecurity mentor debriefing a junior analyst after a training exercise. Be specific, encouraging, actionable. Return ONLY valid JSON: {"overall_assessment":"","decisions_review":[{"alert":"","action":"","correct":boolean,"note":""}],"strengths":[],"improvement_areas":[],"recommended_study_topics":[],"xp_summary":{"earned":number,"penalties":number,"bonus":number,"total":number}}.`;

const PHISHING_SYSTEM = `You are a cybersecurity red team specialist creating a realistic but safe phishing simulation for employee security awareness training. Believable but clearly a simulation when revealed. Return ONLY valid JSON: {"email_subject":"","email_body":"","sender_name":"","sender_email":"","fake_link_text":"","red_flags_present":[]}.`;

const RISK_SYSTEM = `You are a cybersecurity risk analyst providing strategic recommendations. Return ONLY valid JSON: {"overall_risk_level":"","key_findings":[],"priority_recommendations":[],"estimated_risk_reduction_if_addressed":""}.`;

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
