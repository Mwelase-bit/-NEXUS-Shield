import { useEffect, useState } from 'react';
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
import { Play, FileText, Users, AlertOctagon, Scale, ShieldAlert, CheckCircle2, RotateCw, RefreshCw } from 'lucide-react';
import { generatePhishingSim, analyzeOrgRisk } from '../../services/claude';
import { useGame } from '../../context/GameContext';

export default function OrgDashboard() {
  const { state, dispatch } = useGame();
  const { org } = state;
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
          email_subject: `[SIMULATION NOTICE] Internal ${drillType} Initiated`,
          email_body: `This is a test notification for the internal ${drillType} simulated exercise. Core target: ${targetDept} networks.`,
          sender_name: 'NEXUS Simulation Core',
          sender_email: 'sec-ops@nexus.org',
          fake_link_text: 'Review Target Parameters',
          red_flags_present: ['Authorised mandate hash active', 'Mock cyber drill container'],
        };
      }

      dispatch({
        type: 'ADD_SIMULATION',
        sim: { id: Date.now(), attackType: drillType, target: targetDept, date: new Date().toISOString(), ...simDetails },
      });

      // Launch simulated Phase progress board
      setActiveDrill({ type: drillType, details: simDetails });
      setDrillPhase(1);
      setDrillLogs(['[INGEST] Connecting API event stream to Apache Kafka... OK', '[INGEST] Validating Pydantic schema schemas... VALIDATED']);
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
        '[INGEST] Listening to telemetry node streams...',
        '[SENSE] GNN loading topological baseline map...',
        '[SENSE] Baseline check: NOMINAL'
      ],
      2: [
        `[ATTACK] Injecting simulated ${activeDrill.type} vectors into sandbox environment...`,
        `[ATTACK] Attacker performing credential brute-force attempts T1110...`,
        `[ATTACK] Attack mapping against MITRE ATT&CK kill-chain: DETECTED`
      ],
      3: [
        `[CONTAINMENT] GNN route forecast confidence threshold exceeded.`,
        `[SHIELD] Triggering autonomous threat isolation (Redis socket block)... SUCCESS`,
        `[SHIELD] Content audit log committed to immutable PostgreSQL audit table: OK`,
        `[SHIELD] Mean Time to Detect (MTTD): 1.8 seconds. Mean Time to Respond (MTTR): 2.4 seconds.`
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

  const filteredEmployees = deptFilter
    ? org.employees.filter((e) => e.department === deptFilter)
    : org.employees;

  const exportPdf = () => {
    const html = `
      <html><head><title>NEXUS Compliance Report</title>
      <style>body{font-family:monospace;padding:40px;background:#030712;color:#E5E7EB;}h1{color:#38BDF8;border-bottom:1px solid #1E293B;padding-bottom:10px;}table{width:100%;border-collapse:collapse;margin:20px 0;}th,td{border:1px solid #334155;padding:12px;text-align:left;}th{background:#0F172A;color:#38BDF8;}</style></head>
      <body><h1>NEXUS Cyber Resilience Compliance Report</h1>
      <p>Organisation: ${org.company}</p>
      <p>Data Residency Verification: South African Jurisdiction (Active)</p>
      <p>Overall Corporate Risk Score: ${org.stats.riskScore}%</p>
      <p>Completed Security Drills: ${org.stats.simulationsRun} | Average pass rate: ${org.stats.passRate}%</p>
      <h2>Employee Risk & Training Matrix</h2>
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
          <h1>NEXUS — Corporate Resilience Command</h1>
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

      <div className="org-grid">
        {/* Risk Gauge Card */}
        <section className="org-card gauge-card">
          <h3>Corporate Risk Index</h3>
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
            <div><Users size={16} /><strong>{org.stats.totalEmployees}</strong><small>Employees</small></div>
            <div><Play size={16} /><strong>{org.stats.simulationsRun}</strong><small>Drills Run</small></div>
            <div><span className="pass">{org.stats.passRate}%</span><small>Pass Rate</small></div>
            <div><span className="fail">{org.stats.failRate}%</span><small>Fail Rate</small></div>
          </div>
        </section>

        {/* Risk History Timeline */}
        <section className="org-card">
          <h3>Risk History Timeline</h3>
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

        {/* Department Card */}
        <section className="org-card wide">
          <h3>Department Risk Exposure (Click to filter employee records)</h3>
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

        {/* Simulation Control Card */}
        <section className="org-card">
          <h3>Launch Security Simulation Drill</h3>
          
          <div className="form-group">
            <label>Drill / Attack Vector Selection</label>
            <select value={drillType} onChange={(e) => setDrillType(e.target.value)}>
              {['Phishing Campaign', 'Ransomware Drill', 'Penetration Test', 'Vulnerability Assessment', 'Threat Hunt'].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Target Infrastructure Scope</label>
            <select value={targetDept} onChange={(e) => setTargetDept(e.target.value)}>
              <option value="all">Entire Enterprise</option>
              <option value="Finance">Finance Department</option>
              <option value="Executive">Executive Operations</option>
              <option value="Sales">Sales Systems</option>
            </select>
          </div>

          <button type="button" className="nexus-btn primary" onClick={handleOpenGate} disabled={loading}>
            <Play size={16} /> Initialise Authorization Check
          </button>
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

        {/* AI Retraining & Defensive Performance Card */}
        <section className="org-card">
          <h3>AI Defensive Retraining Loop</h3>
          <div className="retraining-grid">
            <div className="model-stat-row">
              <span>Graph Neural Network Accuracy</span>
              <strong className="green-text">{modelMetrics.gnnAccuracy}%</strong>
            </div>
            <div className="model-stat-row">
              <span>GNN Topology statistical drift</span>
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

        {/* AI Strategic Risk Report Card */}
        <section className="org-card">
          <h3>AI Compliance & Strategic Insight</h3>
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
          <button type="button" className="nexus-btn ghost full-width m-t-15" onClick={exportPdf}>
            <FileText size={16} /> Export POPIA Compliance Audit PDF
          </button>
        </section>

        {/* Employee Records Card */}
        <section className="org-card wide">
          <h3>Employee Risk Exposure Table {deptFilter && `— ${deptFilter}`}</h3>
          <div className="table-header-filter">
            <small>Showing record database in compliance with South African data subject rights.</small>
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

      {/* Campaign Authorisation Gate Modal (POPIA & Cybercrimes Mandate Check) */}
      {showLegalGate && (
        <div className="legal-gate-modal-backdrop">
          <div className="legal-gate-modal glass-panel animate-zoom-in">
            <div className="modal-header">
              <Scale size={20} className="green-text" />
              <h3>POPIA & Cybercrimes Act Mandate Gate</h3>
            </div>
            <p className="modal-instruction">
              Under South African law (Cybercrimes Act 19 of 2020), written authorization must be verified and cataloged before initiating cybersecurity diagnostics or simulated phishing.
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
