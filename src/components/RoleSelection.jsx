import { Anchor, Shield } from 'lucide-react';

export default function RoleSelection({ onSelect }) {
  return (
    <div className="role-screen overlay-screen">
      <h1 className="nexus-title">PORT-NEXUS</h1>
      <p className="nexus-subtitle">Select your operational role</p>
      <div className="role-cards">
        <button type="button" className="role-card org" onClick={() => onSelect('organisation')}>
          <div className="role-icon-wrap">
            <Anchor size={48} className="role-icon" />
          </div>
          <h2>PORT AUTHORITY</h2>
          <p>Protect the terminal. Run maritime drills. Measure human risk across port operations.</p>
        </button>
        <button type="button" className="role-card analyst" onClick={() => onSelect('analyst')}>
          <div className="role-icon-wrap">
            <Shield size={48} className="role-icon" />
          </div>
          <h2>PORT SECURITY ANALYST</h2>
          <p>Build your career. Train in the cyber port. Earn your rank defending maritime infrastructure.</p>
        </button>
      </div>
    </div>
  );
}
