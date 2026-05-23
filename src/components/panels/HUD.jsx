import { getRankFromXp } from '../../utils/scoring';

export default function HUD({ state }) {
  const rank = getRankFromXp(state.xp);
  return (
    <header className="hud-top">
      <div className="hud-block">
        <span className="hud-label">CALLSIGN</span>
        <span className="hud-value">{state.callsign || 'ANALYST'}</span>
      </div>
      <div className="hud-block">
        <span className="hud-label">RANK</span>
        <span className="hud-value rank">{rank.name}</span>
      </div>
      <div className={`hud-threat threat-${state.threatLevel}`}>
        THREAT: {state.threatLevel}
      </div>
      {state.activeMission && (
        <div className="hud-block mission-name">
          <span className="hud-label">MISSION</span>
          <span className="hud-value">{state.activeMission.mission_name}</span>
        </div>
      )}
      <div className="hud-block">
        <span className="hud-label">SESSION XP</span>
        <span className="hud-value xp">+{state.sessionXp}</span>
      </div>
      {state.missionMode && (
        <div className="hud-timer">
          ⏱ {Math.floor(state.missionTimeLeft / 60)}:{String(state.missionTimeLeft % 60).padStart(2, '0')}
        </div>
      )}
      <div className="hud-bars">
        <div className="bar-wrap">
          <span>HEALTH</span>
          <div className="bar health"><div style={{ width: `${state.health}%` }} /></div>
        </div>
        <div className="bar-wrap">
          <span>SHIELD</span>
          <div className="bar shield"><div style={{ width: `${state.shield}%` }} /></div>
        </div>
      </div>
    </header>
  );
}
