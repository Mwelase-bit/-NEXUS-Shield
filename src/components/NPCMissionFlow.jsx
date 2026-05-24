import { useState, useEffect, useCallback } from 'react';
import { MISSIONS } from './city/cityConfig';
import { generateMission, generateDebrief } from '../services/claude';
import { buildSeedMission } from '../data/seedData';

/**
 * Cloud Quest-style 5-step mission flow dialog panel.
 * Slides in from the right side, styled for clarity and warmth.
 */
export default function NPCMissionFlow({ npc, onAcceptSOC, onClose, onMissionComplete }) {
  const [step, setStep] = useState(0); // 0=problem, 1=learning, 2=ready-to-go
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  const mission = npc?.missionId ? MISSIONS[npc.missionId] : null;

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 350);
  }, [onClose]);

  const handleNext = () => {
    if (step === 0) {
      // Advance dialogue first
      if (dialogueIndex < mission.dialogue.length - 1) {
        setDialogueIndex((i) => i + 1);
      } else {
        setStep(1); // Move to learning step
      }
    } else if (step === 1) {
      setStep(2); // Move to launch step
    }
  };

  const handleLaunch = () => {
    handleClose();
    // Small delay before launching SOC to let panel slide out
    setTimeout(() => {
      const socMission = {
        ...buildSeedMission(mission.districtId, 'ANALYST'),
        mission_name: mission.title,
        briefing: mission.dialogue.map((d) => d.text).join(' '),
        district: mission.districtId,
        npc_context: mission,
      };
      onAcceptSOC(socMission);
    }, 400);
  };

  if (!mission || !npc) return null;

  const currentDialogue = mission.dialogue[dialogueIndex];
  const progressPct = step === 0
    ? Math.round((dialogueIndex / mission.dialogue.length) * 33)
    : step === 1 ? 66 : 85;

  return (
    <div className={`mission-flow-panel ${isClosing ? 'closing' : ''}`} role="dialog" aria-label="Mission briefing">
      {/* Header bar */}
      <div className="mfp-header">
        <div className="mfp-steps">
          {['Problem', 'Learn', 'Deploy'].map((s, i) => (
            <div key={i} className={`mfp-step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
              <div className="mfp-step-dot">{i < step ? '✓' : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>
        <button className="mfp-close" onClick={handleClose} aria-label="Close">✕</button>
      </div>

      {/* Progress bar */}
      <div className="mfp-progress-track">
        <div className="mfp-progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      {/* ── STEP 0: NPC Dialogue ── */}
      {step === 0 && (
        <div className="mfp-body">
          <div className="mfp-npc-row">
            {/* NPC portrait */}
            <div className="mfp-portrait" style={{ '--accent': npc.accentColor }}>
              <div className="mfp-portrait-head" style={{ background: npc.skinTone }} />
              <div className="mfp-portrait-body" style={{ background: npc.clothingColor }} />
              <div className="mfp-portrait-badge" style={{ background: npc.accentColor }}>
                {npc.role.slice(0, 2).toUpperCase()}
              </div>
            </div>
            {/* Dialogue text */}
            <div className="mfp-dialogue">
              <div className="mfp-npc-name">{npc.name}</div>
              <div className="mfp-npc-role">{npc.role}</div>
              <div className="mfp-speech-text">
                <span className="mfp-quote">"</span>
                {currentDialogue.text}
                <span className="mfp-quote">"</span>
              </div>
            </div>
          </div>

          <div className="mfp-mission-meta">
            <span className="mfp-difficulty" data-diff={mission.difficulty.toLowerCase()}>
              {mission.difficulty}
            </span>
            <span className="mfp-xp">+{mission.xpReward.toLocaleString()} XP</span>
          </div>

          <div className="mfp-footer">
            <button className="mfp-btn ghost" onClick={handleClose}>Not now</button>
            <button className="mfp-btn primary" onClick={handleNext} id="mfp-next-btn">
              {dialogueIndex < mission.dialogue.length - 1 ? 'Continue →' : 'Learn More →'}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 1: Learning Moment ── */}
      {step === 1 && (
        <div className="mfp-body">
          <div className="mfp-learn-header">
            <span className="mfp-learn-icon">{mission.learn.icon}</span>
            <div>
              <h2 className="mfp-learn-title">{mission.learn.title}</h2>
              <p className="mfp-learn-concept">Concept: <strong>{mission.learn.concept}</strong></p>
            </div>
          </div>

          <ul className="mfp-learn-bullets">
            {mission.learn.bullets.map((b, i) => (
              <li key={i} className="mfp-learn-bullet">
                <div className="mfp-bullet-num">{i + 1}</div>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mfp-footer">
            <button className="mfp-btn ghost" onClick={() => setStep(0)}>← Back</button>
            <button className="mfp-btn primary" onClick={handleNext} id="mfp-ready-btn">
              I'm Ready →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Launch Challenge ── */}
      {step === 2 && (
        <div className="mfp-body mfp-launch-body">
          <div className="mfp-launch-icon">🛡️</div>
          <h2 className="mfp-launch-title">Ready to Respond?</h2>
          <p className="mfp-launch-desc">
            Head to the <strong>SOC Dashboard</strong> to investigate{' '}
            <strong>{npc.name}</strong>'s incident. Analyse the logs, triage alerts, and choose the correct response actions.
          </p>

          <div className="mfp-launch-rewards">
            <div className="mfp-reward-item">
              <span className="mfp-reward-icon">⚡</span>
              <span>+{mission.xpReward.toLocaleString()} XP</span>
            </div>
            <div className="mfp-reward-item">
              <span className="mfp-reward-icon">🏅</span>
              <span>Skill badge</span>
            </div>
            <div className="mfp-reward-item">
              <span className="mfp-reward-icon">🛡️</span>
              <span>District secured</span>
            </div>
          </div>

          <div className="mfp-footer">
            <button className="mfp-btn ghost" onClick={() => setStep(1)}>← Back</button>
            <button className="mfp-btn primary launch" onClick={handleLaunch} id="mfp-launch-btn">
              🚀 Launch SOC Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
