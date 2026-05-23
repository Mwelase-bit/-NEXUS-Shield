import { Crosshair, Loader2 } from 'lucide-react';

export default function MissionBoard({ missions, loading, district, onAccept, onGenerate }) {
  return (
    <aside className="panel left-panel slide-in">
      <div className="panel-header">
        <Crosshair size={18} />
        <h3>MISSION BOARD</h3>
        <button type="button" className="panel-btn" onClick={onGenerate} disabled={loading}>
          {loading ? <Loader2 className="spin" size={14} /> : 'REFRESH'}
        </button>
      </div>
      <p className="panel-district">District: {district}</p>
      <ul className="mission-list">
        {(missions || []).map((m, i) => (
          <li key={i} className="mission-card">
            <div className="mission-top">
              <span className="mission-type">{m.mission_type || m.attack_type}</span>
              <span className={`diff ${(m.difficulty || '').toLowerCase()}`}>{m.difficulty}</span>
            </div>
            <h4>{m.mission_name}</h4>
            <p>{m.briefing?.slice(0, 120)}...</p>
            <div className="mission-footer">
              <span className="xp-tag">+{m.xp_reward || 500} XP</span>
              <button type="button" className="nexus-btn sm" onClick={() => onAccept(m)}>
                ACCEPT
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
