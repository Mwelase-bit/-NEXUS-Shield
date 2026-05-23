import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DISTRICTS } from './cityConfig';

/** Network lines with traveling pulse packets */
export default function AnimatedDataStreams() {
  const linesRef = useRef();
  const packetsRef = useRef();

  const { lineGeo, connections } = useMemo(() => {
    const nodes = [
      ...Object.values(DISTRICTS).map((d) => new THREE.Vector3(d.position[0], 1.5, d.position[2])),
      new THREE.Vector3(0, 2, 0),
    ];
    const connections = [];
    const points = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.5) {
          connections.push({ from: nodes[i], to: nodes[j] });
          points.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return { lineGeo: g, connections };
  }, []);

  const packetCount = Math.max(connections.length * 2, 1);
  const packetPositions = useMemo(() => {
    const arr = new Float32Array(packetCount * 3);
    for (let i = 0; i < packetCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [packetCount]);
  const packetProgress = useRef(
    connections.length > 0 ? connections.flatMap(() => [Math.random(), Math.random()]) : [0]
  );

  useFrame(({ clock }, delta) => {
    if (linesRef.current?.material) {
      linesRef.current.material.opacity = 0.25 + Math.sin(clock.elapsedTime * 2) * 0.1;
    }
    if (!packetsRef.current || connections.length === 0) return;

    const arr = packetsRef.current.geometry.attributes.position.array;
    let idx = 0;
    connections.forEach((conn, ci) => {
      for (let p = 0; p < 2; p++) {
        const progKey = ci * 2 + p;
        packetProgress.current[progKey] = (packetProgress.current[progKey] + delta * (0.25 + p * 0.1)) % 1;
        const t = packetProgress.current[progKey];
        arr[idx * 3] = THREE.MathUtils.lerp(conn.from.x, conn.to.x, t);
        arr[idx * 3 + 1] = THREE.MathUtils.lerp(conn.from.y, conn.to.y, t) + Math.sin(t * Math.PI) * 0.5;
        arr[idx * 3 + 2] = THREE.MathUtils.lerp(conn.from.z, conn.to.z, t);
        idx++;
      }
    });
    packetsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      <lineSegments ref={linesRef} geometry={lineGeo}>
        <lineBasicMaterial color="#00FFE5" transparent opacity={0.3} linewidth={1} />
      </lineSegments>
      <points ref={packetsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={packetCount} array={packetPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.22} color="#00FFE5" transparent opacity={0.95} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}
