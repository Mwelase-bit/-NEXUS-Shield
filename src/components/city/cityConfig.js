/** District layout — positions, approach points for avatar navigation */
export const DISTRICTS = {
  GATE: {
    id: 'GATE',
    name: 'THE GATE',
    position: [-14, 0, -10],
    approach: [-11, 0, -7],
    color: '#00B4D8',
    accent: '#00FFE5',
  },
  CORE: {
    id: 'CORE',
    name: 'THE CORE',
    position: [0, 0, 0],
    approach: [0, 0, 5],
    color: '#00FFE5',
    accent: '#00B4D8',
  },
  VAULT: {
    id: 'VAULT',
    name: 'THE VAULT',
    position: [14, 0, -8],
    approach: [10, 0, -5],
    color: '#FFB800',
    accent: '#FF8C00',
  },
  CLOUD: {
    id: 'CLOUD',
    name: 'THE CLOUD',
    position: [-10, 2.5, 12],
    approach: [-7, 0, 9],
    color: '#7B2FFF',
    accent: '#B388FF',
  },
  OUTPOST: {
    id: 'OUTPOST',
    name: 'THE OUTPOST',
    position: [14, 0, 12],
    approach: [10, 0, 9],
    color: '#00FF94',
    accent: '#00B4D8',
  },
  BRIDGE: {
    id: 'BRIDGE',
    name: 'THE BRIDGE',
    position: [-12, 0, 4],
    approach: [-8, 0, 4],
    color: '#00B4D8',
    accent: '#7B2FFF',
  },
};

/** Road network nodes for visual paths */
export const ROAD_PATHS = [
  [[-14, -10], [0, 0], [14, -8]],
  [[0, 0], [-10, 12], [14, 12]],
  [[-12, 4], [0, 0], [14, 12]],
  [[-14, -10], [-12, 4]],
  [[14, -8], [14, 12]],
];

export const SPAWN_POSITION = { x: 0, y: 0, z: 8 };

export function getDistrictApproach(id) {
  const d = DISTRICTS[id];
  if (!d) return { x: 0, z: 5 };
  return { x: d.approach[0], z: d.approach[2] };
}

export function getAuraColor(aura) {
  const map = { cyan: '#00B4D8', green: '#00FF94', purple: '#7B2FFF', orange: '#FFB800' };
  return map[aura] || '#00B4D8';
}
