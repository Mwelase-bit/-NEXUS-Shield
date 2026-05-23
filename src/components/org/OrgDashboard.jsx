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
import { Play, FileText, Users, AlertOctagon } from 'lucide-react';
import { generatePhishingSim, analyzeOrgRisk } from '../../services/claude';
import { useGame } from '../../context/GameContext';

export default function OrgDashboard() {
  const { state, dispatch } = useGame();
  const { org } = state;
  const [attackType, setAttackType] = useState('Phishing');
  const [target, setTarget] = useState('all');
  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deptFilter, setDeptFilter] = useState(null);

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

  const launchSim = async () => {
    setLoading(true);
    dispatch({ type: 'AI_LOADING', loading: true });
    try {
      const sim = await generatePhishingSim({
        company: org.company,
        department: target,
        attackType,
        sophistication: 'medium',
      });
      setSimResult(sim);
      dispatch({
        type: 'ADD_SIMULATION',
        sim: { id: Date.now(), attackType, target, date: new Date().toISOString(), ...sim },
      });
    } finally {
      setLoading(false);
      dispatch({ type: 'AI_LOADING', loading: false });
    }
  };

  const filteredEmployees = deptFilter
    ? org.employees.filter((e) => e.department === deptFilter)
    : org.employees;

  const exportPdf = () => {
    const html = `
      <html><head><title>NEXUS Compliance Report</title>
      <style>body{font-family:monospace;padding:40px}h1{color:#0D1B2A}</style></head>
      <body><h1>NEXUS Shield Compliance Report</h1>
      <p>Organisation: ${org.company}</p>
      <p>Risk Score: ${org.stats.riskScore}%</p>
      <p>Simulations: ${org.stats.simulationsRun} | Pass: ${org.stats.passRate}%</p>
      <h2>Employees</h2>
      <table border="1" cellpadding="8">${org.employees.map((e) =>
        `<tr><td>${e.name}</td><td>${e.department}</td><td>${e.risk}</td><td>${e.training}</td></tr>`
      ).join('')}</table>
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
          <h1>NEXUS — Organisation Command</h1>
          <span>{org.company}</span>
        </div>
        <button
          type="button"
          className="nexus-btn ghost"
          onClick={() => {
            dispatch({ type: 'SET_SCREEN', screen: 'role' });
            dispatch({ type: 'SET_ROLE', role: null });
          }}
        >
          SWITCH ROLE
        </button>
      </header>

      <div className="org-grid">
        <section className="org-card gauge-card">
          <h3>Organisation Risk Score</h3>
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
            <div><Play size={16} /><strong>{org.stats.simulationsRun}</strong><small>Simulations</small></div>
            <div><span className="pass">{org.stats.passRate}%</span><small>Pass</small></div>
            <div><span className="fail">{org.stats.failRate}%</span><small>Fail</small></div>
          </div>
        </section>

        <section className="org-card">
          <h3>Risk Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={org.stats.riskTrend}>
              <CartesianGrid stroke="#1B3A5C" />
              <XAxis dataKey="month" tick={{ fill: '#00B4D8' }} />
              <YAxis tick={{ fill: '#00B4D8' }} />
              <Tooltip />
              <Line type="monotone" dataKey="risk" stroke="#FF2D55" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="org-card wide">
          <h3>Department Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={org.stats.departments}>
              <CartesianGrid stroke="#1B3A5C" />
              <XAxis dataKey="name" tick={{ fill: '#00B4D8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#00B4D8' }} />
              <Tooltip />
              <Bar dataKey="risk" onClick={(d) => setDeptFilter(d.name)} cursor="pointer">
                {org.stats.departments.map((e, i) => (
                  <Cell key={i} fill={e.risk > 70 ? '#FF2D55' : e.risk > 50 ? '#FFB800' : '#00FF94'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="org-card wide">
          <h3>Employee Risk Table {deptFilter && `— ${deptFilter}`}</h3>
          <table className="emp-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Dept</th>
                <th>Last Sim</th>
                <th>Result</th>
                <th>Training</th>
                <th>Risk</th>
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
                    <td className={e.result === 'FAIL' ? 'fail' : 'pass'}>{e.result}</td>
                    <td>{e.training}</td>
                    <td>
                      <span className={`risk-pill ${e.risk >= 70 ? 'critical' : ''}`}>{e.risk}</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>

        <section className="org-card">
          <h3>Simulation Control</h3>
          <label>Attack Type</label>
          <select value={attackType} onChange={(e) => setAttackType(e.target.value)}>
            {['Phishing', 'Smishing', 'Vishing', 'Pretexting'].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <label>Target</label>
          <select value={target} onChange={(e) => setTarget(e.target.value)}>
            <option value="all">All Employees</option>
            <option value="Finance">Finance</option>
            <option value="Executive">Executive</option>
            <option value="Sales">Sales</option>
          </select>
          <button type="button" className="nexus-btn primary" onClick={launchSim} disabled={loading}>
            <Play size={16} /> Launch Simulation
          </button>
          {simResult && (
            <div className="sim-preview">
              <h4>{simResult.email_subject}</h4>
              <p><strong>From:</strong> {simResult.sender_name} &lt;{simResult.sender_email}&gt;</p>
              <pre>{simResult.email_body}</pre>
              <p className="link-fake">{simResult.fake_link_text}</p>
              <ul>
                {simResult.red_flags_present?.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="org-card">
          <h3>Training Enrollment</h3>
          <ul className="enroll-list">
            {org.employees
              .filter((e) => e.result === 'FAIL')
              .map((e) => (
                <li key={e.id}>
                  <AlertOctagon size={14} className="fail" />
                  {e.name} — <em>{e.training}</em>
                </li>
              ))}
          </ul>
        </section>

        <section className="org-card">
          <h3>AI Risk Analysis</h3>
          {org.riskAnalysis ? (
            <>
              <p className="risk-level">{org.riskAnalysis.overall_risk_level}</p>
              <ul>{org.riskAnalysis.key_findings?.map((f, i) => <li key={i}>{f}</li>)}</ul>
              <h4>Recommendations</h4>
              <ul>{org.riskAnalysis.priority_recommendations?.map((r, i) => <li key={i}>{r}</li>)}</ul>
            </>
          ) : (
            <p className="muted">Loading analysis...</p>
          )}
          <button type="button" className="nexus-btn ghost" onClick={exportPdf}>
            <FileText size={16} /> Generate Compliance Report (PDF)
          </button>
        </section>
      </div>
    </div>
  );
}
