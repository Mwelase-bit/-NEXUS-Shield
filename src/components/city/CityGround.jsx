import { useMemo } from 'react';
import * as THREE from 'three';

function useGridTexture() {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a1420';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#1b3a5c';
    ctx.lineWidth = 1;
    const step = 32;
    for (let i = 0; i <= size; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(0, 180, 216, 0.06)';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 80, 0, Math.PI * 2);
    ctx.fill();
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 8);
    return tex;
  }, []);
}

export default function CityGround({ onPointerDown }) {
  const gridTex = useGridTexture();
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      onPointerDown={onPointerDown}
      name="city-ground"
    >
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial map={gridTex} color="#0D1B2A" metalness={0.2} roughness={0.85} />
    </mesh>
  );
}
