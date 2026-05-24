import { useMemo, useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { AlertTriangle, Terminal, Radio, Brain, Eye, Compass, ShieldAlert, RotateCcw } from 'lucide-react';
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
  const [activeAITab, setActiveAITab] = useState('narrate'); // 'sense', 'narrate', 'predict', 'shield'

  // SENSE real-time Kafka simulation logs
  const [kafkaLogs, setKafkaLogs] = useState([]);
  
  // PREDICT Layer: 3 Threat Prediction Cards with Active Timers
  const [predictions, setPredictions] = useState([
    { id: 'p1', target: 'VAULT', tech: 'T1021 (Lateral Movement)', conf: 89, time: 38, triggered: false },
    { id: 'p2', target: 'CORE', tech: 'T1486 (Data Encryption)', conf: 74, time: 75, triggered: false },
    { id: 'p3', target: 'OUTPOST', tech: 'T1048 (Data Exfiltration)', conf: 65, time: 110, triggered: false },
  ]);

  // SHIELD Layer: Active Containments & Override Log
  const [shieldLogs, setShieldLogs] = useState([
    { id: 1, action: 'API Rate Limiting Enforced', reason: 'High frequency requests detected on GATE endpoint', time: '09:02:11', status: 'ACTIVE' },
  ]);
  const [overrideTriggered, setOverrideTriggered] = useState(false);

  const traffic = useMemo(() => buildTraffic(threatLevel, tick), [threatLevel, tick]);
  const lineColor = threatLevel === 'RED' ? '#FF2D55' : threatLevel === 'YELLOW' ? '#FFB800' : '#00FF94';

  const tagLog = (id, suspicious) => {
    setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, tagged: suspicious ? 'suspicious' : 'clear' } : l)));
  };

  // 1. Simulating real-time telemetry (SENSE layer Kafka streams)
  useEffect(() => {
    const nodes = ['CORE-DB-01', 'GATEWAY-02', 'VAULT-FS-04', 'OUTPOST-PC-07', 'CLOUD-API-PRIMARY'];
    const pydanticValidators = ['PydanticSchema::Valid', 'PydanticSchema::Sanitized'];
    const events = [
      'Successful authentication attempt', 'Database connection established', 'Query completed on HR_SCHEMA',
      'Anomalous TCP port probe detected', 'File access requested on /etc/shadow', 'MFA token validated'
    ];

    const intId = setInterval(() => {
      const ts = new Date().toLocaleTimeString();
      const node = nodes[Math.floor(Math.random() * nodes.length)];
      const check = pydanticValidators[Math.floor(Math.random() * pydanticValidators.length)];
      const event = events[Math.floor(Math.random() * events.length)];
      const isSuspicious = event.includes('Anomalous') || event.includes('shadow');

      const logStr = `[KAFKA_STREAM] [${ts}] node=${node} val=${check} msg="${event}" suspicious=${isSuspicious}`;
      setKafkaLogs((prev) => [logStr, ...prev].slice(0, 18));
      setTick((t) => t + 1);
    }, 1800);

    return () => clearInterval(intId);
  }, []);

  // 2. Countdowns for PREDICT cards and automatic SHIELD triggers
  useEffect(() => {
    const timer = setInterval(() => {
      setPredictions((prev) =>
        prev.map((p) => {
          if (p.time <= 0) {
            if (!p.triggered) {
              // Trigger SHIELD autonomous containment!
              const ts = new Date().toLocaleTimeString();
              const newShieldLog = {
                id: Date.now(),
                action: `Autonomous ${p.target} Isolation (SHIELD Executed)`,
                reason: `GNN confidence score (${p.conf}%) hit breach threshold. Attacker routing route: ${p.tech}.`,
                time: ts,
                status: 'ISOLATED',
                cardId: p.id,
              };
              setShieldLogs((logs) => [newShieldLog, ...logs]);
              // Move AI view directly to shield panel to alert the user
              setActiveAITab('shield');
              return { ...p, time: 0, triggered: true };
            }
            return p;
          }
          return { ...p, time: p.time - 1 };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  // Reverse shield autonomous containment (One-Click Analyst Override)
  const handleOverride = (logId) => {
    setOverrideTriggered(true);
    setShieldLogs((prev) =>
      prev.map((log) => (log.id === logId ? { ...log, status: 'REVERSED (OVERRIDDEN)', reason: 'Analyst manual override authorized.' } : log))
    );
    // Reset prediction card timer
    setPredictions((prev) =>
      prev.map((p) => {
        const matchingLog = shieldLogs.find((l) => l.id === logId);
        if (matchingLog && p.id === matchingLog.cardId) {
          return { ...p, time: 60, triggered: false };
        }
        return p;
      })
    );
    setTimeout(() => setOverrideTriggered(false), 2000);
  };

  // Generate plain-English narrative dynamically based on district and threat state
  const attackNarrative = useMemo(() => {
    const active = mission?.district || 'CORE';
    return {
      description: `GNN Threat Path mapping indicates a multi-stage attack lifecycle initiated in THE GATE via spear-phishing (MITRE T1566).`,
      lateral: `The threat agent has successfully executed malicious payloads (T1059) and is currently leveraging local credentials to perform Lateral Movement (T1021) targeting ${active}.`,
      forecast: `NEXUS ML Models predict a high likelihood of lateral route progression to THE VAULT within minutes. GNN baseline correlation identifies anomalous SMB file access anomalies originating from source node.`,
    };
  }, [mission]);

  return (
    <div className="soc-dashboard">
      <div className="soc-header">
        <h2>{mission?.mission_name} — Cyber Security SOC Command</h2>
        <button type="button" className="nexus-btn ghost" onClick={onClose}>
          EXIT MISSION
        </button>
      </div>

      <div className="soc-layout-split">
        {/* Left Column: Standard SOC Controls */}
        <div className="soc-left-controls">
          <div className="soc-grid-inside">
            <div className="soc-panel traffic-panel">
              <h4><Radio size={14} /> LIVE NETWORK TRAFFIC (SIEM / XDR MONITOR)</h4>
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={traffic}>
                  <CartesianGrid stroke="#1B3A5C" strokeDasharray="3 3" />
                  <XAxis dataKey="t" tick={{ fill: '#00B4D8', fontSize: 8 }} />
                  <YAxis tick={{ fill: '#00B4D8', fontSize: 8 }} />
                  <Tooltip contentStyle={{ background: '#0D1B2A', border: '1px solid #00B4D8' }} />
                  <Line type="monotone" dataKey="traffic" stroke={lineColor} strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="soc-panel alerts-panel">
              <h4><AlertTriangle size={14} /> ACTIVE ALERT QUEUE</h4>
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

            <div className="soc-panel logs-panel">
              <h4><Terminal size={14} /> LOCAL AGENT ENDPOINT LOG FEED</h4>
              <div className="log-scroll">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`log-line ${log.suspicious ? 'suspicious' : ''} ${log.tagged || ''}`}
                  >
                    <span className="log-ts">{log.timestamp}</span>
                    <span className="log-ip">{log.ip}</span>
                    <span className="log-text">{log.event}</span>
                    <div className="log-actions">
                      <button type="button" className="flag-btn" onClick={() => tagLog(log.id, true)}>FLAG</button>
                      <button type="button" className="clear-btn" onClick={() => tagLog(log.id, false)}>CLEAR</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="soc-panel response-panel">
              <h4>RESPONSE PLAYBOOK CONSOLE</h4>
              {selectedAlert ? (
                <>
                  <div className="alert-detail">
                    <p><strong>{selectedAlert.severity}</strong> — {selectedAlert.description}</p>
                    <p className="ip-details">Source: {selectedAlert.source} ➔ {selectedAlert.destination}</p>
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
                      {!feedback.correct && <p className="hint">Recommended play: {feedback.what_should_have_been_done}</p>}
                      <span className="xp-change">XP: {feedback.xp > 0 ? '+' : ''}{feedback.xp}</span>
                    </div>
                  )}
                </>
              ) : (
                <p className="muted">Select an alert to initiate standard responses</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Advanced AI Threat Intelligence (SENSE, NARRATE, PREDICT, SHIELD) */}
        <div className="soc-right-intel">
          <div className="soc-panel intel-hub-panel">
            <div className="intel-hub-header">
              <Brain size={18} className="brain-glow" />
              <h3>NEXUS ADVANCED AI PLATFORM</h3>
            </div>

            {/* Sub-tabs for SENSE, NARRATE, PREDICT, SHIELD */}
            <div className="intel-tabs">
              <button
                type="button"
                className={activeAITab === 'sense' ? 'active' : ''}
                onClick={() => setActiveAITab('sense')}
              >
                <Eye size={12} /> SENSE
              </button>
              <button
                type="button"
                className={activeAITab === 'narrate' ? 'active' : ''}
                onClick={() => setActiveAITab('narrate')}
              >
                <Compass size={12} /> NARRATE
              </button>
              <button
                type="button"
                className={activeAITab === 'predict' ? 'active' : ''}
                onClick={() => setActiveAITab('predict')}
              >
                <Radio size={12} className="live-signal" /> PREDICT
              </button>
              <button
                type="button"
                className={activeAITab === 'shield' ? 'active' : ''}
                onClick={() => setActiveAITab('shield')}
              >
                <ShieldAlert size={12} /> SHIELD
              </button>
            </div>

            {/* Tab Body */}
            <div className="intel-tab-content">
              {activeAITab === 'sense' && (
                <div className="tab-sense-view">
                  <div className="telemetry-log-header">
                    <span>Apache Kafka Ingestion Event Stream</span>
                    <span className="pydantic-tag">Pydantic Schema Validation Active</span>
                  </div>
                  <div className="kafka-terminal-feed">
                    {kafkaLogs.length === 0 && <p className="muted">Initialising Kafka socket streams...</p>}
                    {kafkaLogs.map((l, i) => (
                      <p key={i} className="kafka-line">{l}</p>
                    ))}
                  </div>
                </div>
              )}

              {activeAITab === 'narrate' && (
                <div className="tab-narrate-view text-narrative">
                  <h4>Plain-English GNN Incident Story</h4>
                  <p className="narrative-p">{attackNarrative.description}</p>
                  <p className="narrative-p font-cyan">{attackNarrative.lateral}</p>
                  <p className="narrative-p font-orange">{attackNarrative.forecast}</p>
                  <div className="mitre-matrix-mini">
                    <span className="mitre-cell active">Initial Access</span>
                    <span className="mitre-cell active">Execution</span>
                    <span className="mitre-cell active">Persistence</span>
                    <span className="mitre-cell active">Lateral Movement</span>
                    <span className="mitre-cell predict">Data Exfiltration</span>
                  </div>
                </div>
              )}

              {activeAITab === 'predict' && (
                <div className="tab-predict-view">
                  <div className="tab-info-header">
                    <span>GNN Lateral Threat Route Predictions</span>
                    <span className="live-pill">REAL-TIME ML FEED</span>
                  </div>
                  <div className="predictions-deck">
                    {predictions.map((p) => (
                      <div key={p.id} className={`prediction-card ${p.triggered ? 'critical-containment' : ''}`}>
                        <div className="card-top">
                          <span className="target-district">🎯 TARGET: THE {p.target}</span>
                          <span className="confidence-pill">{p.conf}% Conf</span>
                        </div>
                        <p className="tech-desc">Attack Path: {p.tech}</p>
                        
                        {p.time > 0 ? (
                          <div className="countdown-wrap">
                            <span className="timer-icon">⏱</span>
                            <span className="time-remaining">EST. TIME TO BREACH: {Math.floor(p.time / 60)}:{String(p.time % 60).padStart(2, '0')}</span>
                          </div>
                        ) : (
                          <div className="containment-triggered">
                            <ShieldAlert size={14} />
                            <span>AUTONOMOUS SHIELD CONTAINMENT FIRED</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeAITab === 'shield' && (
                <div className="tab-shield-view">
                  <div className="containment-header">
                    <span>Autonomous Security Orchestration (SOAR)</span>
                    <span className="latency-metric">Avg Latency: &lt; 2.4s</span>
                  </div>

                  <div className="shield-actions-list">
                    {shieldLogs.map((log) => (
                      <div key={log.id} className="shield-action-log glass-panel">
                        <div className="log-top">
                          <span className="action-name">{log.action}</span>
                          <span className={`action-status-badge ${log.status.toLowerCase().replace(' ', '-')}`}>
                            {log.status}
                          </span>
                        </div>
                        <p className="action-reason"><strong>AI Reason:</strong> {log.reason}</p>
                        <div className="log-footer">
                          <small>Timestamp: {log.time}</small>
                          {log.status === 'ISOLATED' && (
                            <button
                              type="button"
                              className="nexus-btn accent sm flex-align"
                              onClick={() => handleOverride(log.id)}
                            >
                              <RotateCcw size={12} /> ONE-CLICK ANALYST OVERRIDE
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Standard Claude Interactive Hints */}
            <div className="soc-intel-footer m-t-15">
              <button type="button" className="nexus-btn primary full-width font-sm" onClick={handleIntel} disabled={!selectedAlert || aiLoading}>
                REQUEST MISSION DEBRIEF HINT FROM CLAUDE (-100 XP)
              </button>
              {intel && <div className="intel-transmission m-t-10">{intel}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
