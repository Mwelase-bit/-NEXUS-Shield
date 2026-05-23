import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { AlertTriangle, Terminal, Radio, Brain } from 'lucide-react';
import { RESPONSE_ACTIONS } from '../../data/seedData';
import { evaluateResponse, requestIntel } from '../../services/claude';
import { evaluateXpChange } from '../../utils/scoring';

function buildTraffic(threatLevel, tick) {
  const base = threatLevel === 'RED' ? 85 : threatLevel === 'ORANGE' ? 65 : threatLevel === 'YELLOW' ? 45 : 25;
  return Array.from({ length: 24 }, (_, i) => ({
    t: `${i}:00`,
    traffic: base + Math.sin(i + tick) * 15 + (i > 18 && threatLevel !== 'GREEN' ? 30 : 0),
  }));
}

export default function SOCDashboard({
  mission,
  threatLevel,
  selectedAlert,
  onSelectAlert,
  onResponse,
  onClose,
  aiLoading,
  setAiLoading,
  onIntel,
}) {
  const [logs, setLogs] = useState(mission?.logs || []);
  const [feedback, setFeedback] = useState(null);
  const [intel, setIntel] = useState(null);
  const [tick, setTick] = useState(0);

  const traffic = useMemo(() => buildTraffic(threatLevel, tick), [threatLevel, tick]);
  const lineColor = threatLevel === 'RED' ? '#FF2D55' : threatLevel === 'YELLOW' ? '#FFB800' : '#00FF94';

  const tagLog = (id, suspicious) => {
    setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, tagged: suspicious ? 'suspicious' : 'clear' } : l)));
  };

  const handleResponse = async (action) => {
    if (!selectedAlert) return;
    setAiLoading(true);
    setFeedback(null);
    try {
      const result = await evaluateResponse({
        alert: selectedAlert,
        action,
        mission,
      });
      const xp = result.xp_change ?? evaluateXpChange(selectedAlert.severity, result.correct);
      setFeedback({ ...result, xp });
      onResponse(selectedAlert, action, { ...result, xp_change: xp });
    } finally {
      setAiLoading(false);
    }
  };

  const handleIntel = async () => {
    if (!selectedAlert) return;
    setAiLoading(true);
    try {
      const hint = await requestIntel({ alert: selectedAlert, mission });
      setIntel(hint);
      onIntel?.();
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="soc-dashboard">
      <div className="soc-header">
        <h2>{mission?.mission_name}</h2>
        <button type="button" className="nexus-btn ghost" onClick={onClose}>
          EXIT MISSION
        </button>
      </div>
      <div className="soc-grid">
        <div className="soc-panel traffic-panel">
          <h4><Radio size={14} /> LIVE NETWORK TRAFFIC</h4>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={traffic}>
              <CartesianGrid stroke="#1B3A5C" strokeDasharray="3 3" />
              <XAxis dataKey="t" tick={{ fill: '#00B4D8', fontSize: 9 }} />
              <YAxis tick={{ fill: '#00B4D8', fontSize: 9 }} />
              <Tooltip contentStyle={{ background: '#0D1B2A', border: '1px solid #00B4D8' }} />
              <Line type="monotone" dataKey="traffic" stroke={lineColor} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="soc-panel logs-panel">
          <h4><Terminal size={14} /> SYSTEM LOG FEED</h4>
          <div className="log-scroll">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`log-line ${log.suspicious ? 'suspicious' : ''} ${log.tagged || ''}`}
              >
                <span className="log-ts">{log.timestamp}</span>
                <span className="log-ip">{log.ip}</span>
                <span>{log.event}</span>
                <div className="log-actions">
                  <button type="button" onClick={() => tagLog(log.id, true)}>FLAG</button>
                  <button type="button" onClick={() => tagLog(log.id, false)}>CLEAR</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="soc-panel alerts-panel">
          <h4><AlertTriangle size={14} /> ALERT QUEUE</h4>
          <ul className="alert-list">
            {(mission?.alerts || []).map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  className={`alert-item ${selectedAlert?.id === a.id ? 'active' : ''}`}
                  onClick={() => onSelectAlert(a)}
                >
                  <span className={`sev ${a.severity}`}>{a.severity}</span>
                  <span className="alert-desc">{a.description}</span>
                  <small>{a.timestamp}</small>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="soc-panel response-panel">
          <h4>RESPONSE CONSOLE</h4>
          {selectedAlert ? (
            <>
              <div className="alert-detail">
                <p><strong>{selectedAlert.severity}</strong> — {selectedAlert.description}</p>
                <p>Source: {selectedAlert.source} → {selectedAlert.destination}</p>
              </div>
              <div className="response-actions">
                {RESPONSE_ACTIONS.map((act) => (
                  <button key={act} type="button" className="nexus-btn sm" onClick={() => handleResponse(act)}>
                    {act}
                  </button>
                ))}
              </div>
              {feedback && (
                <div className={`feedback ${feedback.correct ? 'ok' : 'fail'}`}>
                  <p>{feedback.explanation}</p>
                  {!feedback.correct && <p className="hint">Should have: {feedback.what_should_have_been_done}</p>}
                  <span>XP: {feedback.xp > 0 ? '+' : ''}{feedback.xp}</span>
                </div>
              )}
            </>
          ) : (
            <p className="muted">Select an alert to respond</p>
          )}
        </div>

        <div className="soc-panel intel-panel">
          <h4><Brain size={14} /> AI INTEL</h4>
          <button type="button" className="nexus-btn primary" onClick={handleIntel} disabled={!selectedAlert || aiLoading}>
            REQUEST INTEL FROM NEXUS AI (-100 XP)
          </button>
          {intel && <div className="intel-transmission">{intel}</div>}
        </div>
      </div>
    </div>
  );
}
