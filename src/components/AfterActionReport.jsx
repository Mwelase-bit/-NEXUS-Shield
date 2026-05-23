import { useEffect } from 'react';
import { Share2, Trophy } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const SKILL_LABELS = [
  { key: 'phishing', label: 'Phishing' },
  { key: 'logs', label: 'Logs' },
  { key: 'hunting', label: 'Hunt' },
  { key: 'incident', label: 'IR' },
  { key: 'network', label: 'Net' },
  { key: 'malware', label: 'Malware' },
];

export default function AfterActionReport({
  debrief,
  skills,
  rankUp,
  newRank,
  callsign,
  xp,
  onContinue,
  onClearRankUp,
}) {
  useEffect(() => {
    if (rankUp) {
      const t = setTimeout(onClearRankUp, 4000);
      return () => clearTimeout(t);
    }
  }, [rankUp, onClearRankUp]);

  const radarData = SKILL_LABELS.map(({ key, label }) => ({
    skill: label,
    value: skills[key] || 0,
  }));

  const share = () => {
    const text = `NEXUS Shield — ${callsign} | ${newRank?.name || 'Analyst'} | ${xp} XP`;
    navigator.clipboard?.writeText(text);
    alert('Share card copied to clipboard!');
  };

  return (
    <div className="aar-overlay">
      {rankUp && (
        <div className="rank-up-cinematic">
          <div className="rank-flash" />
          <h1 className="rank-up-text">RANK UP</h1>
          <p>{newRank?.name}</p>
          <div className="rank-badge-glow">★ {newRank?.badge}</div>
          <div className="particles" />
        </div>
      )}
      <div className="aar-panel slide-in">
        <h2>AFTER ACTION REPORT</h2>
        <p className="aar-summary">{debrief?.overall_assessment}</p>

        <div className="aar-grid">
          <div className="aar-section">
            <h4>Decision Timeline</h4>
            <ul className="decision-list">
              {(debrief?.decisions_review || []).map((d, i) => (
                <li key={i} className={d.correct ? 'ok' : 'fail'}>
                  <span>{d.alert}</span>
                  <span>{d.action}</span>
                  <span>{d.correct ? '✓' : '✗'}</span>
                  <p>{d.note}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="aar-section">
            <h4>Updated Skills</h4>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1B3A5C" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#00FFE5', fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="value" stroke="#00FFE5" fill="#7B2FFF" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="xp-breakdown">
              <Trophy size={16} />
              <span>XP: +{debrief?.xp_summary?.total ?? 0}</span>
            </div>
          </div>
        </div>

        <div className="aar-columns">
          <div>
            <h4>Strengths</h4>
            <ul>{(debrief?.strengths || []).map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
          <div>
            <h4>Improve</h4>
            <ul>{(debrief?.improvement_areas || []).map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
          <div>
            <h4>Study Topics</h4>
            <ul>{(debrief?.recommended_study_topics || []).map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
        </div>

        <div className="aar-actions">
          <button type="button" className="nexus-btn primary" onClick={onContinue}>
            RETURN TO CITY
          </button>
          <button type="button" className="nexus-btn ghost" onClick={share}>
            <Share2 size={16} /> SHARE CARD
          </button>
        </div>
      </div>
    </div>
  );
}
