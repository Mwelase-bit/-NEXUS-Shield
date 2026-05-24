import { getRankFromXp } from '../../utils/scoring';
import { Shield, Target, Activity, Award } from 'lucide-react';

export default function HUD({ state }) {
  const rank = getRankFromXp(state.xp);
  
  // Find highest and lowest skills for progress meters
  const skillEntries = Object.entries(state.skills || {});
  const highestSkill = skillEntries.reduce((max, s) => s[1] > max[1] ? s : max, ['', 0]);
  const lowestSkill = skillEntries.reduce((min, s) => s[1] < min[1] ? s : min, ['', 100]);

  const skillNameMap = {
    phishing: 'Phishing Defense',
    logs: 'Log Correlation',
    hunting: 'Threat Hunting',
    incident: 'Incident Triage',
    network: 'Network Hardening',
    malware: 'Malware Isolation',
  };

  return (
    <header className="hud-top glass-panel animate-fade-in">
      {/* Profile & Rank Block */}
      <div className="hud-section profile-block">
        <div className="hud-avatar-ring" style={{ '--aura': state.aura }}>
          <Shield className="hud-avatar-icon" />
        </div>
        <div className="hud-identity">
          <span className="hud-label">CALLSIGN</span>
          <span className="hud-value callsign">{state.callsign || 'SEC-ANALYST'}</span>
          <span className="rank-badge">{rank.name}</span>
        </div>
      </div>

      {/* Quest / Objective Board */}
      <div className="hud-section quest-card">
        <div className="quest-header">
          <Target size={14} className="cyan-text pulse-fast" />
          <span>ACTIVE OBJECTIVE</span>
        </div>
        {state.activeMission ? (
          <div className="quest-body">
            <strong>{state.activeMission.mission_name}</strong>
            <p className="truncated-briefing">{state.activeMission.briefing}</p>
          </div>
        ) : (
          <div className="quest-body">
            <strong>Explore & Locate Threats</strong>
            <p className="truncated-briefing">Use WASD/Click to navigate. Approach and talk to NPCs with quest tags.</p>
          </div>
        )}
      </div>

      {/* GNN Status Radar */}
      <div className="hud-section threat-status">
        <div className="threat-header">
          <Activity size={14} className={`threat-icon threat-${state.threatLevel}`} />
          <span>GNN PATH FORECASTER</span>
        </div>
        <div className="threat-body">
          <span className={`threat-indicator-pill threat-${state.threatLevel}`}>
            SYSTEMS: {state.threatLevel === 'GREEN' ? 'NOMINAL' : 'ALERT RESOLUTION REQUIRED'}
          </span>
          <div className="gnn-radar-wrap">
            <div className={`radar-scanner ${state.threatLevel}`} />
            <small>Active Path Tracking: 8 nodes</small>
          </div>
        </div>
      </div>

      {/* Skills Tracker & XP */}
      <div className="hud-section stats-block">
        <div className="xp-metric">
          <span className="hud-label">SESSION XP</span>
          <span className="hud-value xp">+{state.sessionXp} XP</span>
        </div>
        
        <div className="skill-meter-row">
          <div className="skill-meter">
            <span className="skill-tag">PRIMARY: {skillNameMap[highestSkill[0]] || 'Incident'}</span>
            <div className="meter-bar"><div className="fill green" style={{ width: `${highestSkill[1]}%` }} /></div>
          </div>
          <div className="skill-meter">
            <span className="skill-tag">TRAINING: {skillNameMap[lowestSkill[0]] || 'Phishing'}</span>
            <div className="meter-bar"><div className="fill orange" style={{ width: `${lowestSkill[1]}%` }} /></div>
          </div>
        </div>
      </div>

      {/* In-Game Timer and Core Metrics */}
      {state.missionMode && (
        <div className="hud-mission-timer animate-pulse-red">
          <span className="timer-label">BREACH TIMEOUT</span>
          <span className="timer-value">
            ⏱ {Math.floor(state.missionTimeLeft / 60)}:{String(state.missionTimeLeft % 60).padStart(2, '0')}
          </span>
          
          <div className="bars-overlay">
            <div className="bar-line">
              <span>SYSTEM CORES</span>
              <div className="mini-bar health"><div style={{ width: `${state.health}%` }} /></div>
            </div>
            <div className="bar-line">
              <span>FIREWALL SHIELDS</span>
              <div className="mini-bar shield"><div style={{ width: `${state.shield}%` }} /></div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
