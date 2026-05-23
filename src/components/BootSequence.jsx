import { useState, useEffect } from 'react';

const LINES = [
  'NEXUS SHIELD INITIALISING...',
  'LOADING THREAT DATABASE... OK',
  'CONNECTING TO CLAUDE AI ENGINE... OK',
  'CALIBRATING SIMULATION CORE... OK',
  'SCANNING ORGANISATION PROFILE... OK',
  'CYBERSHIELD TRAINING ENVIRONMENT... READY',
  'ANALYST ACCESS GRANTED',
];

export default function BootSequence({ onComplete }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const line = LINES[lineIndex];
    if (charIndex < line.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), 50);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      if (lineIndex < LINES.length - 1) {
        setLineIndex((i) => i + 1);
        setCharIndex(0);
      } else {
        setDone(true);
        setTimeout(onComplete, 800);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [lineIndex, charIndex, done, onComplete]);

  return (
    <div className={`boot-screen ${done ? 'fade-out' : ''}`}>
      <div className="boot-terminal">
        {LINES.slice(0, lineIndex).map((l, i) => (
          <div key={i} className="boot-line complete">{l}</div>
        ))}
        <div className="boot-line active">
          {LINES[lineIndex]?.slice(0, charIndex)}
          <span className="boot-cursor">█</span>
        </div>
      </div>
    </div>
  );
}
