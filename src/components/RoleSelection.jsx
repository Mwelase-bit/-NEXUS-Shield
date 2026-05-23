import { Building2, Shield } from 'lucide-react';

export default function RoleSelection({ onSelect }) {
  return (
    <div className="role-screen overlay-screen">
      <h1 className="nexus-title">NEXUS SHIELD</h1>
      <p className="nexus-subtitle">Select your operational role</p>
      <div className="role-cards">
        <button type="button" className="role-card org" onClick={() => onSelect('organisation')}>
          <div className="role-icon-wrap">
            <Building2 size={48} className="role-icon" />
          </div>
          <h2>ORGANISATION</h2>
          <p>Protect your people. Run simulations. Measure human risk.</p>
        </button>
        <button type="button" className="role-card analyst" onClick={() => onSelect('analyst')}>
          <div className="role-icon-wrap">
            <Shield size={48} className="role-icon" />
          </div>
          <h2>ANALYST</h2>
          <p>Build your career. Train in the cyber city. Earn your rank.</p>
        </button>
      </div>
    </div>
  );
}
