import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Award } from 'lucide-react';
import { getRankFromXp, rankProgress } from '../../utils/scoring';

const SKILL_LABELS = [
  { key: 'phishing', label: 'Phishing' },
  { key: 'logs', label: 'Log Analysis' },
  { key: 'hunting', label: 'Threat Hunt' },
  { key: 'incident', label: 'Incident Resp.' },
  { key: 'network', label: 'Network Sec.' },
  { key: 'malware', label: 'Malware' },
];

export default function AnalystProfile({ state }) {
  const rank = getRankFromXp(state.xp);
  const progress = rankProgress(state.xp);
  const radarData = SKILL_LABELS.map(({ key, label }) => ({
    skill: label,
    value: state.skills[key] || 0,
  }));

  return (
    <aside className="panel right-panel slide-in">
      <div className="panel-header">
        <Award size={18} />
        <h3>ANALYST PROFILE</h3>
      </div>
      <div className="profile-avatar" style={{ '--aura': state.aura }}>
        <div className="avatar-figure" />
        <span>{state.callsign}</span>
      </div>
      <div className="rank-block">
        <span>{rank.name}</span>
        <div className="progress-bar"><div style={{ width: `${progress}%` }} /></div>
        <small>{state.xp} XP</small>
      </div>
      <div className="radar-wrap">
        <ResponsiveContainer width="100%" height={180}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#1B3A5C" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: '#00B4D8', fontSize: 9 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Skills" dataKey="value" stroke="#00FFE5" fill="#00B4D8" fillOpacity={0.35} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="badges-row">
        {state.badges.length === 0 && <span className="muted">No badges yet</span>}
        {state.badges.map((b) => (
          <div key={b} className="badge-icon" title={b}>
            ★
          </div>
        ))}
      </div>
    </aside>
  );
}
