import { useMemo } from 'react';
import * as THREE from 'three';
import { DISTRICTS, ROAD_PATHS } from './cityConfig';

/**
 * "Game board" ground texture — one non-repeating map across the whole plane:
 * radial navy gradient (lit center → dark edge) so the play area reads as a
 * polished board, with a two-level tile grid (fine lines + brighter majors).
 */
function useIsometricGroundTexture() {
  return useMemo(() => {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const c = size / 2;

    // Radial base — light warm concrete, slightly lit at center (daytime)
    const base = ctx.createRadialGradient(c, c, 0, c, c, size * 0.72);
    base.addColorStop(0, '#DCE1E7');
    base.addColorStop(0.5, '#CFD5DC');
    base.addColorStop(0.85, '#BFC6CF');
    base.addColorStop(1, '#B2BAC4');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);

    // Alternating paver tiles — 32 cells across the 80-unit plane (2.5u tiles)
    const cells = 32;
    const tileSize = size / cells;
    for (let row = 0; row < cells; row++) {
      for (let col = 0; col < cells; col++) {
        const isAlt = (row + col) % 2 === 0;
        ctx.fillStyle = isAlt ? 'rgba(255,255,255,0.05)' : 'rgba(60,80,100,0.04)';
        ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
      }
    }

    // Fine paver seams
    ctx.strokeStyle = 'rgba(70,90,110,0.10)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= cells; i++) {
      const p = i * tileSize;
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(size, p); ctx.stroke();
    }

    // Major seams every 4 tiles — large-scale plaza structure
    ctx.strokeStyle = 'rgba(70,90,110,0.14)';
    ctx.lineWidth = 2;
    for (let i = 0; i <= cells; i += 4) {
      const p = i * tileSize;
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(size, p); ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.anisotropy = 4;
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
    // Curb / shoulder
    ctx.fillStyle = '#A6ADB6';
    ctx.fillRect(0, 0, w, h);
    // Asphalt surface — mid gray, clearly darker than the pale plaza
    ctx.fillStyle = '#8B929C';
    ctx.fillRect(8, 0, w - 16, h);
    // White dashed center line (classic Cloud Quest road)
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    const dashLen = 40, gapLen = 32;
    for (let y = 0; y < h; y += dashLen + gapLen) {
      ctx.fillRect(w / 2 - 3, y, 6, dashLen);
    }
    // Solid white edge lines
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillRect(10, 0, 3, h);
    ctx.fillRect(w - 13, 0, 3, h);
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

/** Grass lawn patch around each district */
function DistrictGround({ district }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[district.position[0], 0.01, district.position[2]]} receiveShadow>
      <circleGeometry args={[5, 32]} />
      <meshStandardMaterial color={district.tileColor} roughness={0.95} />
    </mesh>
  );
}

/** Central plaza — elevated platform with decorative rings */
function CentralPlaza() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[6.5, 48]} />
        <meshStandardMaterial color="#E3E7EC" roughness={0.85} />
      </mesh>
      {[4.5, 5.5].map((r, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[r - 0.08, r, 48]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.5 - i * 0.15} />
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
        {/* Matte daytime concrete — texture carries all the color */}
        <meshStandardMaterial
          map={gridTex}
          color="#FFFFFF"
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* Plaza rim — subtle white boundary marking the play area */}
      <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <mesh>
          <ringGeometry args={[26.7, 27.0, 96]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.45} />
        </mesh>
      </group>

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
