import { RANKS } from '../data/seedData';

export const XP_BY_SEVERITY = {
  CRITICAL: 500,
  HIGH: 300,
  MEDIUM: 150,
  LOW: 75,
};

export function getRankFromXp(xp) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.minXp) rank = r;
  }
  return rank;
}

export function getNextRank(xp) {
  const current = getRankFromXp(xp);
  const idx = RANKS.findIndex((r) => r.id === current.id);
  return RANKS[idx + 1] || null;
}

export function rankProgress(xp) {
  const current = getRankFromXp(xp);
  const next = getNextRank(xp);
  if (!next) return 100;
  const range = next.minXp - current.minXp;
  const progress = xp - current.minXp;
  return Math.min(100, Math.round((progress / range) * 100));
}

export function evaluateXpChange(severity, correct) {
  if (correct) return XP_BY_SEVERITY[severity] || 100;
  return -200;
}

export function updateSkill(skills, alert, correct) {
  const next = { ...skills };
  const delta = correct ? 4 : -2;
  const desc = (alert?.description || '').toLowerCase();
  if (desc.includes('phish') || desc.includes('login')) next.phishing = clamp(next.phishing + delta);
  else if (desc.includes('log') || desc.includes('account')) next.logs = clamp(next.logs + delta);
  else if (desc.includes('apt') || desc.includes('beacon')) next.hunting = clamp(next.hunting + delta);
  else if (desc.includes('ransom') || desc.includes('malware') || desc.includes('binary')) next.malware = clamp(next.malware + delta);
  else if (desc.includes('traffic') || desc.includes('outbound') || desc.includes('ddos')) next.network = clamp(next.network + delta);
  else next.incident = clamp(next.incident + delta);
  return next;
}

function clamp(v) {
  return Math.max(0, Math.min(100, v));
}

export function computeMissionBonus({ allCorrect, noHints, timeRemaining, firstTimeType, missionTypesCompleted, type }) {
  let bonus = 0;
  if (allCorrect && noHints) bonus += 1000;
  if (timeRemaining > 0) bonus += timeRemaining * 10;
  if (firstTimeType && !missionTypesCompleted.includes(type)) bonus += 250;
  return bonus;
}
