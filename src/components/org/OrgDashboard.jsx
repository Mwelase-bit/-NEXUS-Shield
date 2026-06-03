import { useEffect, useState, useRef } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Play, FileText, Users, AlertOctagon, Scale, ShieldAlert, CheckCircle2, RotateCw, RefreshCw, Anchor } from 'lucide-react';
import { generatePhishingSim, analyzeOrgRisk } from '../../services/claude';
import { useGame } from '../../context/GameContext';

function SystemNarratorConsole() {
  const [narratives, setNarratives] = useState([
    { type: 'DETECTING', text: 'Scanning TOS Hub database nodes for anomalies...', timestamp: '07:32:00', badge: 'detect' },
    { type: 'NARRATING', text: 'AI Analyst: Port operations operating at nominal latency. 312 active entities verified.', timestamp: '07:32:04', badge: 'narrate' },
    { type: 'RESPONDING', text: 'Auto-Shield: Continuous integrity checks active. System secure.', timestamp: '07:32:10', badge: 'respond' }
  ]);
  const consoleEndRef = useRef(null);

  const scenarioIndex = useRef(0);
  const phaseIndex = useRef(0);

  const scenarios = [
    [
      { type: 'DETECTING', text: '[TELEMETRY] Anomalous credential stuffing flagged on Port Gate network card.', badge: 'detect' },
      { type: 'NARRATING', text: '[AI NARRATIVE] Multiple rapid badging failures on reader-02-dct suggest active badge credential harvesting targeting Durban Port Gate.', badge: 'narrate' },
      { type: 'RESPONDING', text: '[AUTONOMOUS ACTION] Applied temporary IP ban on external routing gate, notified gate supervisor to inspect physical credentials.', badge: 'respond' }
    ],
    [
      { type: 'DETECTING', text: '[TELEMETRY] Outbound C2 beacon detected on SCADA VLAN originating from Quay Crane QC-04 controller.', badge: 'detect' },
      { type: 'NARRATING', text: '[AI NARRATIVE] The beacon payload matches known lateral movement patterns observed in the 2021 Transnet ransomware attack.', badge: 'narrate' },
      { type: 'RESPONDING', text: '[AUTONOMOUS ACTION] Isolated the Quay Crane SCADA subnet via virtual router ACL. Enforced privilege verification.', badge: 'respond' }
    ],
    [
      { type: 'DETECTING', text: '[TELEMETRY] Out-of-hours manifest database query initiated from Customs account (m.santos).', badge: 'detect' },
      { type: 'NARRATING', text: '[AI NARRATIVE] Unscheduled database queries target container cargo release flags — possible customs fraud manifest tampering.', badge: 'narrate' },
      { type: 'RESPONDING', text: '[AUTONOMOUS ACTION] Enforced immediate MFA authentication challenge and locked cargo release privileges pending supervisor approval.', badge: 'respond' }
    ],
    [
      { type: 'DETECTING', text: '[TELEMETRY] Port Cloud Storage API endpoint overwhelmed with backup deletion commands.', badge: 'detect' },
      { type: 'NARRATING', text: '[AI NARRATIVE] Attacker attempting backup erasure to increase ransomware leverage. High severity attack vector.', badge: 'narrate' },
      { type: 'RESPONDING', text: '[AUTONOMOUS ACTION] Triggered immutable backup lock. Switched storage nodes to read-only failover state.', badge: 'respond' }
    ]
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const currentScenario = scenarios[scenarioIndex.current];
      const step = currentScenario[phaseIndex.current];

      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      setNarratives((prev) => [
        ...prev.slice(-8),
        { ...step, timestamp: timeStr }
      ]);

      if (phaseIndex.current < 2) {
        phaseIndex.current += 1;
      } else {
        phaseIndex.current = 0;
        scenarioIndex.current = (scenarioIndex.current + 1) % scenarios.length;
      }
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [narratives]);

  return (
    <div className="system-narrator-console">
      <div className="console-title-row">
        <span className="console-title blink-slow">AUTONOMOUS CYBER INTELLIGENCE FEED (ACCIS)</span>
        <span className="live-tag">LIVE FEED</span>
      </div>
      <div className="console-body">
        {narratives.map((n, idx) => (
          <div key={idx} className={`console-row ${n.badge}`}>
            <span className="time">{n.timestamp}</span>
            <span className={`badge ${n.badge}`}>{n.type}</span>
            <span className="text">{n.text}</span>
          </div>
        ))}
        <div ref={consoleEndRef} />
      </div>
    </div>
  );
}

export default function OrgDashboard() {
  const { state, dispatch } = useGame();
  const { org } = state;
  const [activeTab, setActiveTab] = useState('Detecting'); // 'Detecting' | 'Narrating' | 'Predicting' | 'Responding'
  const [drillType, setDrillType] = useState('Phishing Campaign');
  const [targetDept, setTargetDept] = useState('all');
  const [loading, setLoading] = useState(false);
  const [deptFilter, setDeptFilter] = useState(null);

  // Legal Authorisation Gate Modal State
  const [showLegalGate, setShowLegalGate] = useState(false);
  const [legalChecks, setLegalChecks] = useState({
    mandate: false,
    popiaResidency: false,
    popiaMinimise: false,
    ccmaGuarantees: false,
  });
  const [adminSignature, setAdminSignature] = useState('');
  const [gateError, setGateError] = useState('');

  // Active Simulation State
  const [activeDrill, setActiveDrill] = useState(null); // { type, phase, logs }
  const [drillLogs, setDrillLogs] = useState([]);
  const [drillPhase, setDrillPhase] = useState(0); // 0 = idle, 1 = ingest, 2 = exploit, 3 = containment, 4 = complete

  // RBAC crane command demo state
  const [craneResult, setCraneResult] = useState(null);
  const [craneLoading, setCraneLoading] = useState(false);

  // AI Defensive Retraining Model State
  const [recalibrating, setRecalibrating] = useState(false);
  const [modelMetrics, setModelMetrics] = useState({
    gnnAccuracy: 94.2,
    gnnDrift: 0.02,
    transformerAcc: 95.8,
    isolationAcc: 92.1,
  });

  useEffect(() => {
    (async () => {
      dispatch({ type: 'AI_LOADING', loading: true });
      try {
        const analysis = await analyzeOrgRisk({ stats: org.stats, employees: org.employees });
        dispatch({ type: 'SET_ORG', org: { riskAnalysis: analysis } });
      } finally {
        dispatch({ type: 'AI_LOADING', loading: false });
      }
    })();
  }, []);

  const handleOpenGate = () => {
    setShowLegalGate(true);
  };

  const handleLaunchSim = async () => {
    // 1. Verify signatures and checkboxes
    if (!legalChecks.mandate || !legalChecks.popiaResidency || !legalChecks.popiaMinimise || !legalChecks.ccmaGuarantees) {
      setGateError('AUTHORISATION FAILED: All legal checklists must be satisfied.');
      return;
    }
    if (adminSignature.trim().length < 4) {
      setGateError('AUTHORISATION FAILED: Full Administrator Digital Signature is required.');
      return;
    }

    setGateError('');
    setShowLegalGate(false);
    setLoading(true);
    dispatch({ type: 'AI_LOADING', loading: true });

    try {
      let simDetails = {};
      if (drillType === 'Phishing Campaign') {
        const sim = await generatePhishingSim({
          company: org.company,
          department: targetDept,
          attackType: 'Phishing',
          sophistication: 'medium',
        });
        simDetails = sim;
      } else {
        // Fallback or mock data for other simulations
        simDetails = {
          email_subject: `[PORT-NEXUS DRILL] ${drillType} — ${targetDept === 'all' ? 'Entire Terminal' : targetDept}`,
          email_body: `This is an authorised PORT-NEXUS simulation exercise targeting ${targetDept === 'all' ? 'entire terminal' : targetDept} systems. Drill type: ${drillType}.`,
          sender_name: 'PORT-NEXUS Simulation Core',
          sender_email: 'sec-ops@port-nexus.dct',
          fake_link_text: 'Review Terminal Drill Parameters',
          red_flags_present: ['Authorised mandate hash active', 'Sandboxed port drill container — no real systems affected'],
        };
      }

      dispatch({
        type: 'ADD_SIMULATION',
        sim: { id: Date.now(), attackType: drillType, target: targetDept, date: new Date().toISOString(), ...simDetails },
      });

      // Launch simulated Phase progress board
      setActiveDrill({ type: drillType, details: simDetails });
      setDrillPhase(1);
      setDrillLogs(['[INGEST] Connecting PORT-NEXUS event stream to terminal telemetry broker... OK', '[INGEST] Validating port schema — TOS, SCADA, Gate, Manifest nodes: VALIDATED']);
    } finally {
      setLoading(false);
      dispatch({ type: 'AI_LOADING', loading: false });
    }
  };

  // Animate the Simulation Board phase progression
  useEffect(() => {
    if (!activeDrill || drillPhase === 0 || drillPhase >= 4) return;

    const phaseLogs = {
      1: [
        '[INGEST] Connecting to port telemetry node streams (TOS, SCADA, Gate)...',
        '[SENSE] GNN loading maritime topology baseline — berths, cranes, manifest nodes...',
        '[SENSE] Port baseline check: NOMINAL — 312 staff entities, 6 zone nodes mapped'
      ],
      2: [
        `[ATTACK] Injecting simulated ${activeDrill.type} vectors into port sandbox environment...`,
        `[ATTACK] Attacker pivoting: TOS-SERVER-01 → SCADA VLAN → QC-04 Crane PLC (T1021 lateral)`,
        `[ATTACK] Kill-chain mapped against MITRE ATT&CK ICS: T1566 → T1059 → T1486 DETECTED`
      ],
      3: [
        `[CONTAINMENT] GNN route confidence threshold exceeded — Transnet pattern signature matched.`,
        `[SHIELD] Triggering autonomous SCADA segment isolation (Redis socket block)... SUCCESS`,
        `[SHIELD] Manifest DB audit log committed to immutable audit table — integrity preserved: OK`,
        `[SHIELD] MTTD: 1.8 s — MTTR: 2.4 s — IMO MSC-FAL.1/Circ.3 response SLA met.`
      ]
    };

    const timer = setTimeout(() => {
      const nextPhase = drillPhase + 1;
      setDrillPhase(nextPhase);
      setDrillLogs((prev) => [...prev, ...phaseLogs[drillPhase]]);
      if (nextPhase === 4) {
        setDrillLogs((prev) => [...prev, `[COMPLETE] Simulation drill concluded. Remediating report created.`]);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [activeDrill, drillPhase]);

  const handleRecalibrate = () => {
    setRecalibrating(true);
    setTimeout(() => {
      setRecalibrating(false);
      setModelMetrics({
        gnnAccuracy: 96.8,
        gnnDrift: 0.01,
        transformerAcc: 97.4,
        isolationAcc: 94.6,
      });
    }, 3000);
  };

  const handleCraneCommand = async (role) => {
    setCraneLoading(true);
    setCraneResult(null);
    try {
      const res = await fetch('/api/crane-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-role': role },
        body: '{}',
      });
      const data = await res.json();
      setCraneResult({ status: res.status, ...data });
    } catch {
      setCraneResult({ status: 500, error: 'Network error' });
    } finally {
      setCraneLoading(false);
    }
  };

  const filteredEmployees = deptFilter
    ? org.employees.filter((e) => e.department === deptFilter)
    : org.employees;

  const exportPdf = () => {
    const html = `
      <html><head><title>PORT-NEXUS Compliance Report</title>
      <style>body{font-family:monospace;padding:40px;background:#030712;color:#E5E7EB;}h1{color:#38BDF8;border-bottom:1px solid #1E293B;padding-bottom:10px;}table{width:100%;border-collapse:collapse;margin:20px 0;}th,td{border:1px solid #334155;padding:12px;text-align:left;}th{background:#0F172A;color:#38BDF8;}</style></head>
      <body><h1>PORT-NEXUS Maritime Cyber Resilience Report</h1>
      <p>Port Authority: ${org.company}</p>
      <p>Data Residency Verification: South African Jurisdiction (Active) — POPIA Compliant</p>
      <p>IMO Cyber Risk Management Compliance: MSC-FAL.1/Circ.3 (Active)</p>
      <p>Overall Terminal Risk Score: ${org.stats.riskScore}%</p>
      <p>Completed Security Drills: ${org.stats.simulationsRun} | Average pass rate: ${org.stats.passRate}%</p>
      <h2>Port Staff Risk & Training Matrix</h2>
      <table><thead><tr><th>Name</th><th>Department</th><th>Simulation Outcome</th><th>Training Status</th><th>Risk Rating</th></tr></thead>
      <tbody>${org.employees.map((e) =>
        `<tr><td>${e.name}</td><td>${e.department}</td><td>${e.result}</td><td>${e.training}</td><td>${e.risk}%</td></tr>`
      ).join('')}</tbody></table>
      </body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html);
    w.print();
  };

  const riskColor = org.stats.riskScore > 70 ? '#FF2D55' : org.stats.riskScore > 45 ? '#FFB800' : '#00FF94';

  return (
    <div className="org-dashboard">
      <header className="org-header">
        <div>
          <h1>PORT-NEXUS — Port Authority Command</h1>
          <span className="co-tag">{org.company}</span>
        </div>
        <div className="org-header-actions">
          <span className="popia-badge green"><CheckCircle2 size={12} /> POPIA COMPLIANT</span>
          <button
            type="button"
            className="nexus-btn ghost"
            onClick={() => {
              dispatch({ type: 'SET_SCREEN', screen: 'login' });
              dispatch({ type: 'SET_ROLE', role: null });
            }}
          >
            LOG OUT SYSTEM
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="org-tabs">
        <button
          type="button"
          className={`org-tab-btn ${activeTab === 'Detecting' ? 'active' : ''}`}
          onClick={() => setActiveTab('Detecting')}
        >
          DETECTING
        </button>
        <button
          type="button"
          className={`org-tab-btn ${activeTab === 'Narrating' ? 'active' : ''}`}
          onClick={() => setActiveTab('Narrating')}
        >
          NARRATING
        </button>
        <button
          type="button"
          className={`org-tab-btn ${activeTab === 'Predicting' ? 'active' : ''}`}
          onClick={() => setActiveTab('Predicting')}
        >
          PREDICTING
        </button>
        <button
          type="button"
          className={`org-tab-btn ${activeTab === 'Responding' ? 'active' : ''}`}
          onClick={() => setActiveTab('Responding')}
        >
          RESPONDING
        </button>
      </div>

      {activeTab === 'Detecting' && (
        <div className="org-grid">
          {/* Risk Gauge Card */}
          <section className="org-card gauge-card">
            <h3>Terminal Risk Index</h3>
            <div className="risk-gauge" style={{ '--risk-color': riskColor }}>
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1B3A5C" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={riskColor}
                  strokeWidth="10"
                  strokeDasharray={`${org.stats.riskScore * 3.14} 314`}
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <span className="gauge-value">{org.stats.riskScore}%</span>
            </div>
            <div className="org-stats-row">
              <div><Users size={16} /><strong>{org.stats.totalEmployees}</strong><small>Port Staff</small></div>
              <div><Play size={16} /><strong>{org.stats.simulationsRun}</strong><small>Drills Run</small></div>
              <div><span className="pass">{org.stats.passRate}%</span><small>Pass Rate</small></div>
              <div><span className="fail">{org.stats.failRate}%</span><small>Fail Rate</small></div>
            </div>
          </section>

          {/* Anomaly Live Alerts Feed */}
          <section className="org-card">
            <h3>System Anomaly Live Alerts</h3>
            <div className="drill-console" style={{ height: '180px' }}>
              <p className="console-line" style={{ color: '#00FFE5' }}>[DETECT] 07:36:01 - Anomaly score spike on TOS-SERVER-01: 94.2%</p>
              <p className="console-line" style={{ color: '#FFB800' }}>[WARN] 07:36:12 - Suspicious LDAP queries from Outpost Crane sub-controller</p>
              <p className="console-line" style={{ color: '#FF2A54' }}>[CRIT] 07:36:25 - Multiple failed SSH attempts on Gate Access Control readers</p>
              <p className="console-line" style={{ color: '#64748B' }}>[INFO] 07:36:34 - Automatic baseline calibration check: Nominal</p>
              <p className="console-line" style={{ color: '#00FFE5' }}>[DETECT] 07:36:45 - Large volume outbound queries on manifest database (4.2GB)</p>
            </div>
          </section>

          {/* Department Card */}
          <section className="org-card wide">
            <h3>Terminal Department Risk Exposure (Click to filter staff records)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={org.stats.departments}>
                <CartesianGrid stroke="rgba(255, 255, 255, 0.04)" />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748B' }} />
                <Tooltip />
                <Bar dataKey="risk" onClick={(d) => setDeptFilter(d.name)} cursor="pointer">
                  {org.stats.departments.map((e, i) => (
                    <Cell key={i} fill={e.risk > 70 ? '#EF4444' : e.risk > 50 ? '#F59E0B' : '#10B981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </section>

          {/* Employee Records Card */}
          <section className="org-card wide">
            <h3>Port Staff Risk Exposure Table {deptFilter && `— ${deptFilter}`}</h3>
            <div className="table-header-filter">
              <small>Showing records in compliance with South African POPIA data subject rights.</small>
              {deptFilter && <button onClick={() => setDeptFilter(null)}>Clear filter</button>}
            </div>
            <table className="emp-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Department</th>
                  <th>Last Sim Date</th>
                  <th>Sim Outcome</th>
                  <th>Training Program</th>
                  <th>Risk Exposure</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees
                  .sort((a, b) => b.risk - a.risk)
                  .map((e) => (
                    <tr key={e.id} className={e.risk >= 70 ? 'high-risk' : ''}>
                      <td>{e.name}</td>
                      <td>{e.department}</td>
                      <td>{e.lastSim}</td>
                      <td className={e.result === 'FAIL' ? 'fail-tag' : 'pass-tag'}>{e.result}</td>
                      <td>{e.training}</td>
                      <td>
                        <span className={`risk-pill ${e.risk >= 70 ? 'critical' : ''}`}>{e.risk}%</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </section>
        </div>
      )}

      {activeTab === 'Narrating' && (
        <div className="org-grid">
          {/* AI Strategic Risk Report Card */}
          <section className="org-card">
            <h3>AI Strategic Compliance & Risk Outlook</h3>
            {org.riskAnalysis ? (
              <div className="risk-analysis-text">
                <p className="risk-level-tag">Risk Outlook: {org.riskAnalysis.overall_risk_level}</p>
                <ul className="bullet-insights">
                  {org.riskAnalysis.key_findings?.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
                <h4>Priority Actions</h4>
                <ul className="bullet-insights">
                  {org.riskAnalysis.priority_recommendations?.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            ) : (
              <p className="muted">Fetching strategic risk outlook...</p>
            )}
          </section>

          {/* Compliance Auditor */}
          <section className="org-card">
            <h3>Compliance Auditor & PDF Export</h3>
            <p className="muted" style={{ fontSize: '0.8rem', lineHeight: '1.5', marginBottom: '1rem' }}>
              Verify corporate mandates and download an official IMO MSC-FAL.1/Circ.3 compliance audit report.
            </p>
            <div className="model-stat-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
              <span>Data Residency</span>
              <strong className="green-text">South Africa (Active)</strong>
            </div>
            <div className="model-stat-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
              <span>POPIA Standards</span>
              <strong className="green-text">Compliant</strong>
            </div>
            <button type="button" className="nexus-btn primary full-width m-t-15" onClick={exportPdf}>
              <FileText size={16} /> Export IMO / POPIA Compliance Audit PDF
            </button>
          </section>

          {/* Live ACCIS Anomaly Ticker */}
          <section className="org-card wide">
            <SystemNarratorConsole />
          </section>
        </div>
      )}

      {activeTab === 'Predicting' && (
        <div className="org-grid">
          {/* AI Retraining & Defensive Performance Card */}
          <section className="org-card">
            <h3>AI Defensive Retraining Loop</h3>
            <div className="retraining-grid">
              <div className="model-stat-row">
                <span>Graph Neural Network Accuracy</span>
                <strong className="green-text">{modelMetrics.gnnAccuracy}%</strong>
              </div>
              <div className="model-stat-row">
                <span>GNN Topology drift</span>
                <strong className="cyan-text">{modelMetrics.gnnDrift}</strong>
              </div>
              <div className="model-stat-row">
                <span>Behavioural Sequence Model Acc</span>
                <strong className="green-text">{modelMetrics.transformerAcc}%</strong>
              </div>
              <div className="model-stat-row">
                <span>Unsupervised Isolation Forest Acc</span>
                <strong className="green-text">{modelMetrics.isolationAcc}%</strong>
              </div>
            </div>
            
            <button type="button" className="nexus-btn primary full-width m-t-15" onClick={handleRecalibrate} disabled={recalibrating}>
              <RefreshCw size={14} className={recalibrating ? 'animate-spin' : ''} /> 
              {recalibrating ? 'Running Model Retro Loops...' : 'Recalibrate AI Defensive Models'}
            </button>
          </section>

          {/* Risk History Timeline */}
          <section className="org-card">
            <h3>Risk History & Forecast Timeline</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={org.stats.riskTrend}>
                <CartesianGrid stroke="rgba(255, 255, 255, 0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#64748B' }} />
                <YAxis tick={{ fill: '#64748B' }} />
                <Tooltip />
                <Line type="monotone" dataKey="risk" stroke="#38BDF8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </section>

          {/* Predictive Threat Forecasting Matrix */}
          <section className="org-card wide">
            <h3>Predictive Threat Forecasting Matrix</h3>
            <table className="emp-table" style={{ marginTop: '0.5rem' }}>
              <thead>
                <tr>
                  <th>Threat Vector</th>
                  <th>Target Subsystem</th>
                  <th>Forecasted Probability</th>
                  <th>Projected Severity</th>
                  <th>Impact Scope</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Spear-Phishing Campaign</td>
                  <td>Customs & Documentation</td>
                  <td style={{ color: '#FFB800', fontWeight: '700' }}>82% (Critical Drift)</td>
                  <td style={{ color: '#FFB800' }}>Medium-High</td>
                  <td>Port Administration & Cargo Clearance</td>
                </tr>
                <tr>
                  <td>Quay Crane Modbus SCADA Hijack</td>
                  <td>Crane PLC Control Subnet</td>
                  <td style={{ color: '#EF4444', fontWeight: '700' }}>65% (Transnet 2021 Pattern)</td>
                  <td style={{ color: '#EF4444' }}>Critical</td>
                  <td>Crane Operations & Vessel Berthing</td>
                </tr>
                <tr>
                  <td>Credential Stuffing / Gate Readers</td>
                  <td>Gate Identity Server</td>
                  <td style={{ color: '#10B981', fontWeight: '700' }}>24% (Low Anomaly)</td>
                  <td style={{ color: '#10B981' }}>Low-Medium</td>
                  <td>Physical Gate Access Controls</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      )}

      {activeTab === 'Responding' && (
        <div className="org-grid">
          {/* Simulation Control Card */}
          <section className="org-card">
            <h3>Launch Port Security Simulation Drill</h3>

            <div className="form-group">
              <label>Drill / Attack Vector Selection</label>
              <select value={drillType} onChange={(e) => setDrillType(e.target.value)}>
                {['Phishing Campaign', 'SCADA Intrusion Drill', 'Ransomware Containment', 'Manifest Tampering Sim', 'Threat Hunt'].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Target Operational Scope</label>
              <select value={targetDept} onChange={(e) => setTargetDept(e.target.value)}>
                <option value="all">Entire Terminal</option>
                <option value="Customs">Customs & Documentation</option>
                <option value="Port Admin">Port Administration</option>
                <option value="Crane Ops">Crane Operations</option>
              </select>
            </div>

            <button type="button" className="nexus-btn primary" onClick={handleOpenGate} disabled={loading}>
              <Play size={16} /> Initialise Authorization Check
            </button>
          </section>

          {/* SCADA Isolation (RBAC Control) */}
          <section className="org-card">
            <h3>SCADA Isolation (RBAC Control)</h3>
            <p className="muted" style={{ marginBottom: 12, fontSize: '0.78rem', lineHeight: '1.4' }}>
              Only **Security Analyst** or **Port Administrator** roles can trigger halts on SCADA VLANs.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button type="button" className="nexus-btn sm primary" onClick={() => handleCraneCommand('Security Analyst')} disabled={craneLoading}>
                Halt as Security Analyst (Succeed)
              </button>
              <button type="button" className="nexus-btn sm ghost" onClick={() => handleCraneCommand('Crane Operator')} disabled={craneLoading}>
                Halt as Crane Operator (Deny)
              </button>
              <button type="button" className="nexus-btn sm ghost" onClick={() => handleCraneCommand('Port Administrator')} disabled={craneLoading}>
                Halt as Port Admin (Succeed)
              </button>
            </div>
            {craneLoading && <p className="muted" style={{ fontSize: '0.7rem', marginTop: '6px' }}>Sending request...</p>}
            {craneResult && (
              <div className={`security-alert ${craneResult.status === 200 ? 'pass' : 'fail'}`} style={{ marginTop: 8, padding: '4px 8px', fontSize: '0.75rem' }}>
                <strong>HTTP {craneResult.status}</strong>
                {craneResult.status === 200 ? ' - SUCCEEDED' : ' - DENIED'}
              </div>
            )}
          </section>

          {/* Active Simulation board (Phase indicators) */}
          <section className="org-card wide">
            <h3>Active Simulation Dashboard</h3>
            {activeDrill ? (
              <div className="active-drill-panel">
                <div className="drill-meta">
                  <span>Active: <strong>{activeDrill.type}</strong> (Scope: {targetDept})</span>
                  <span className="drill-status blink">EXECUTING PIPELINE</span>
                </div>
                
                {/* Phase timeline indicators */}
                <div className="drill-phases">
                  <div className={`phase-step ${drillPhase >= 1 ? 'active' : ''} ${drillPhase === 1 ? 'current' : ''}`}>
                    <span className="step-num">1</span>
                    <span className="step-name">INGEST</span>
                  </div>
                  <div className={`phase-step ${drillPhase >= 2 ? 'active' : ''} ${drillPhase === 2 ? 'current' : ''}`}>
                    <span className="step-num">2</span>
                    <span className="step-name">EXPLOIT</span>
                  </div>
                  <div className={`phase-step ${drillPhase >= 3 ? 'active' : ''} ${drillPhase === 3 ? 'current' : ''}`}>
                    <span className="step-num">3</span>
                    <span className="step-name">CONTAIN</span>
                  </div>
                  <div className={`phase-step ${drillPhase >= 4 ? 'active' : ''} ${drillPhase === 4 ? 'current' : ''}`}>
                    <span className="step-num">4</span>
                    <span className="step-name">COMPLETE</span>
                  </div>
                </div>

                {/* Execution scrolling logs */}
                <div className="drill-console">
                  {drillLogs.map((log, i) => (
                    <p key={i} className="console-line">{log}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-drill muted">
                <ShieldAlert size={36} />
                <p>No drills actively executing. Authorise and launch a simulation to see the phase tracker board.</p>
              </div>
            )}
          </section>
        </div>
      )}

      {/* Campaign Authorisation Gate Modal (POPIA & Cybercrimes Mandate Check) */}
      {showLegalGate && (
        <div className="legal-gate-modal-backdrop">
          <div className="legal-gate-modal glass-panel animate-zoom-in">
            <div className="modal-header">
              <Scale size={20} className="green-text" />
              <h3>POPIA & Cybercrimes Act Mandate Gate</h3>
            </div>
            <p className="modal-instruction">
              Under South African law (Cybercrimes Act 19 of 2020) and IMO MSC-FAL.1/Circ.3, written authorisation must be verified before initiating cybersecurity diagnostics or simulated maritime phishing.
            </p>

            {gateError && (
              <div className="security-alert fail">
                <AlertOctagon size={16} />
                <span>{gateError}</span>
              </div>
            )}

            <div className="legal-checks-list">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={legalChecks.mandate}
                  onChange={(e) => setLegalChecks({ ...legalChecks, mandate: e.target.checked })}
                />
                <div className="check-text">
                  <strong>Active Corporate written mandate exists</strong>
                  <small>Mandate Hash reference check: MD5::f4a2b9d99c30e7ea (VALID)</small>
                </div>
              </label>

              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={legalChecks.popiaResidency}
                  onChange={(e) => setLegalChecks({ ...legalChecks, popiaResidency: e.target.checked })}
                />
                <div className="check-text">
                  <strong>POPIA South African Data Residency Guarantee</strong>
                  <small>No employee simulation record is transferred outside South African jurisdiction.</small>
                </div>
              </label>

              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={legalChecks.popiaMinimise}
                  onChange={(e) => setLegalChecks({ ...legalChecks, popiaMinimise: e.target.checked })}
                />
                <div className="check-text">
                  <strong>POPIA Data Minimisation Principle</strong>
                  <small>Only names, departments, and simulated metrics required for security training are processed.</small>
                </div>
              </label>

              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={legalChecks.ccmaGuarantees}
                  onChange={(e) => setLegalChecks({ ...legalChecks, ccmaGuarantees: e.target.checked })}
                />
                <div className="check-text">
                  <strong>CCMA / Employment Law safe-guards</strong>
                  <small>Simulation scores are classified strictly as training data; cannot justify disciplinary actions.</small>
                </div>
              </label>
            </div>

            <div className="form-group m-t-15">
              <label>Administrator Digital Signature</label>
              <input
                type="text"
                placeholder="Full Name (e.g. Thabo Mokoena)"
                value={adminSignature}
                onChange={(e) => setAdminSignature(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="nexus-btn primary" onClick={handleLaunchSim}>
                Verify Mandate & Launch Drill
              </button>
              <button type="button" className="nexus-btn ghost" onClick={() => setShowLegalGate(false)}>
                Cancel Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
