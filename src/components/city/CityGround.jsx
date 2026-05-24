import { useMemo } from 'react';
import * as THREE from 'three';
import { DISTRICTS, ROAD_PATHS } from './cityConfig';

/** Isometric-style textured tile grid */
function useIsometricGroundTexture() {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Base — deep blue-navy
    ctx.fillStyle = '#0B1929';
    ctx.fillRect(0, 0, size, size);

    // Tile grid — subtle alternating tiles
    const tileSize = 64;
    for (let row = 0; row < size / tileSize; row++) {
      for (let col = 0; col < size / tileSize; col++) {
        const isAlt = (row + col) % 2 === 0;
        ctx.fillStyle = isAlt ? 'rgba(0,180,216,0.04)' : 'rgba(0,0,0,0.06)';
        ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
      }
    }

    // Grid lines
    ctx.strokeStyle = 'rgba(0,180,216,0.12)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= size; i += tileSize) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    return tex;
  }, []);
}

/** Road tile texture — light path with center glow line */
function useRoadTexture() {
  return useMemo(() => {
    const w = 128, h = 512;
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0D2A3D';
    ctx.fillRect(0, 0, w, h);
    // Road surface
    ctx.fillStyle = '#0F2235';
    ctx.fillRect(8, 0, w - 16, h);
    // Center glow line
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.5, 'rgba(0,255,229,0.5)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(w / 2 - 3, 0, 6, h);
    // Edge lines
    ctx.fillStyle = 'rgba(0,180,216,0.3)';
    ctx.fillRect(10, 0, 2, h);
    ctx.fillRect(w - 12, 0, 2, h);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 4);
    return tex;
  }, []);
}

function Road({ from, to }) {
  const roadTex = useRoadTexture();
  const mid = [(from[0] + to[0]) / 2, 0.02, (from[1] + to[1]) / 2];
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const len = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);

  return (
    <group position={mid} rotation={[0, angle, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.8, len]} />
        <meshStandardMaterial map={roadTex} color="#FFFFFF" transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

/** Grass/ground patch around districts */
function DistrictGround({ district }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[district.position[0], 0.01, district.position[2]]}>
      <circleGeometry args={[5, 32]} />
      <meshStandardMaterial
        color={district.tileColor}
        transparent
        opacity={0.85}
        roughness={0.9}
      />
    </mesh>
  );
}

/** Central plaza — elevated platform with decorative rings */
function CentralPlaza() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[6.5, 48]} />
        <meshStandardMaterial color="#0D1E30" emissive="#00B4D8" emissiveIntensity={0.06} />
      </mesh>
      {[4.5, 5.5].map((r, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[r - 0.08, r, 48]} />
          <meshBasicMaterial color="#00B4D8" transparent opacity={0.2 - i * 0.06} />
        </mesh>
      ))}
    </group>
  );
}

export default function CityGround({ onPointerDown }) {
  const gridTex = useIsometricGroundTexture();

  return (
    <group>
      {/* Main ground plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onPointerDown={onPointerDown}
        name="city-ground"
      >
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial
          map={gridTex}
          color="#AADDFF"
          roughness={0.95}
          metalness={0.0}
        />
      </mesh>

      {/* Per-district ground patches */}
      {Object.values(DISTRICTS).map((d) => (
        <DistrictGround key={d.id} district={d} />
      ))}

      {/* Roads */}
      {ROAD_PATHS.map(([from, to], i) => (
        <Road key={i} from={from} to={to} />
      ))}

      {/* Central plaza */}
      <CentralPlaza />
    </group>
  );
}
