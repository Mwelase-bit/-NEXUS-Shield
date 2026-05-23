const DISTRICTS = [
  { id: 'GATE', x: 12, y: 72 },
  { id: 'CORE', x: 50, y: 50 },
  { id: 'VAULT', x: 82, y: 68 },
  { id: 'CLOUD', x: 22, y: 22 },
  { id: 'OUTPOST', x: 82, y: 18 },
  { id: 'BRIDGE', x: 18, y: 42 },
];

/** Map world coords (-22..22) to minimap 0-100 */
function worldToMap(x, z) {
  return {
    x: ((x + 22) / 44) * 100,
    y: ((z + 22) / 44) * 100,
  };
}

export default function Minimap({ selected, avatarPosition }) {
  const player = avatarPosition
    ? worldToMap(avatarPosition.x, avatarPosition.z)
    : { x: 50, y: 55 };

  return (
    <div className="minimap">
      <span className="minimap-label">CITY MAP</span>
      <svg viewBox="0 0 100 100" className="minimap-svg">
        <defs>
          <radialGradient id="mapGlow">
            <stop offset="0%" stopColor="#00B4D8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#050A14" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="#0D1B2A" rx="4" />
        <circle cx="50" cy="50" r="35" fill="url(#mapGlow)" />
        {/* Roads */}
        <path d="M12,72 L50,50 L82,68 M50,50 L22,22 M50,50 L82,18 M18,42 L50,50" stroke="#1B3A5C" strokeWidth="1.5" fill="none" />
        {DISTRICTS.map((d) => (
          <g key={d.id}>
            <rect
              x={d.x - 5}
              y={d.y - 5}
              width="10"
              height="10"
              fill={selected === d.id ? '#00FFE5' : '#1B3A5C'}
              stroke={selected === d.id ? '#00FFE5' : '#00B4D8'}
              strokeWidth={selected === d.id ? 1.5 : 0.5}
              rx="2"
            />
            <text x={d.x} y={d.y + 11} textAnchor="middle" fontSize="3.5" fill="#00B4D8" fontFamily="monospace">
              {d.id.slice(0, 3)}
            </text>
          </g>
        ))}
        <circle cx={player.x} cy={player.y} r="3" fill="#00FF94" className="player-dot">
          <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx={player.x} cy={player.y} r="5" fill="none" stroke="#00FF94" strokeWidth="0.5" opacity="0.6" />
      </svg>
    </div>
  );
}
