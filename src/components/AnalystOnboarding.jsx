import { useState } from 'react';
import { AURA_COLORS } from '../data/seedData';

export default function AnalystOnboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [callsign, setCallsign] = useState('');
  const [aura, setAura] = useState('cyan');

  if (step === 2) {
    return (
      <div className="onboard-cinematic overlay-screen">
        <div className="cinematic-drop">
          <div className="drop-character" style={{ '--aura': AURA_COLORS[aura] }} />
        </div>
        <div className="cinematic-text">
          <p className="coach-msg">
            Welcome, <strong>{callsign}</strong>. The city needs a defender.
          </p>
          <button type="button" className="nexus-btn primary" onClick={() => onComplete({ callsign, aura })}>
            ENTER CYBER CITY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="onboard-screen overlay-screen">
      <h2>ANALYST ONBOARDING</h2>
      {step === 0 && (
        <>
          <label className="field-label">CALLSIGN</label>
          <input
            className="nexus-input"
            value={callsign}
            onChange={(e) => setCallsign(e.target.value)}
            placeholder="Enter your callsign"
            maxLength={20}
          />
          <button
            type="button"
            className="nexus-btn primary"
            disabled={!callsign.trim()}
            onClick={() => setStep(1)}
          >
            CONTINUE
          </button>
        </>
      )}
      {step === 1 && (
        <>
          <label className="field-label">SELECT AURA SIGNATURE</label>
          <div className="aura-picker">
            {Object.entries(AURA_COLORS).map(([key, color]) => (
              <button
                key={key}
                type="button"
                className={`aura-swatch ${aura === key ? 'active' : ''}`}
                style={{ '--swatch': color }}
                onClick={() => setAura(key)}
              />
            ))}
          </div>
          <button type="button" className="nexus-btn primary" onClick={() => setStep(2)}>
            LAUNCH INTRO
          </button>
        </>
      )}
    </div>
  );
}
