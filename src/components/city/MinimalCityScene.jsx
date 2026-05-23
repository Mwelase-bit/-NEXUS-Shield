import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { DISTRICTS } from './cityConfig';
import AvatarController from './AvatarController';
import CityCamera from './CityCamera';

/** Lightweight fallback if the full scene crashes */
export default function MinimalCityScene({ onReady, auraColor, rank, callsign, controlsEnabled }) {
  const { gl, scene } = useThree();
  const cameraTarget = useRef({ x: 0, y: 0, z: 8 });
  const readyFired = useRef(false);

  useEffect(() => {
    gl.setClearColor('#050A14');
    scene.fog = new THREE.Fog('#050A14', 20, 60);
    if (!readyFired.current) {
      readyFired.current = true;
      onReady?.();
    }
  }, [gl, scene, onReady]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[14, 16, 14]} fov={42} />
      <CityCamera targetRef={cameraTarget} enabled={controlsEnabled} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0D1B2A" />
      </mesh>
      {Object.values(DISTRICTS).map((d) => (
        <mesh key={d.id} position={[d.position[0], 2, d.position[2]]} castShadow>
          <boxGeometry args={[2, 4, 2]} />
          <meshStandardMaterial color="#1B3A5C" emissive={d.color} emissiveIntensity={0.4} />
        </mesh>
      ))}
      {controlsEnabled && (
        <AvatarController callsign={callsign} rank={rank} auraColor={auraColor} enabled />
      )}
    </>
  );
}
