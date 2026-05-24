import { Suspense, useRef, useEffect, useCallback, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, ContactShadows, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import { getRankFromXp } from '../../utils/scoring';
import { DISTRICTS, getAuraColor, getDistrictApproach } from './cityConfig';
import CityGround from './CityGround';
import DistrictBuildings from './DistrictBuildings';
import AvatarController from './AvatarController';
import CityCamera from './CityCamera';
import CityNPCs from './CityNPCs';
import { CityAtmosphere, CitySparkles, HorizonGlow, DataStreamParticles, StreetLamps, CyberTrees } from './CityAtmosphere';
import CityPostProcessing from './PostProcessing';
import SceneErrorBoundary from './SceneErrorBoundary';
import ThreatPathVisualizer from './ThreatPathVisualizer';

function DestinationMarker({ target }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.elapsedTime * 3;
  });
  if (!target) return null;
  return (
    <group position={[target.x, 0, target.z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]} ref={ref}>
        <ringGeometry args={[0.3, 0.6, 28]} />
        <meshBasicMaterial color="#00FFE5" transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function CityEffect({ effect }) {
  const ref = useRef();
  const district = effect ? DISTRICTS[effect.district] : null;
  useFrame(({ clock }) => {
    if (!ref.current || !effect) return;
    const elapsed = clock.elapsedTime % 1.2;
    ref.current.scale.setScalar(1 + elapsed * 5);
    ref.current.material.opacity = Math.max(0, 0.85 - elapsed * 0.7);
  });
  if (!effect || !district) return null;
  const color = effect.type === 'shield' ? '#00FF94' : '#FF2D55';
  return (
    <mesh ref={ref} position={[district.position[0], 0.3, district.position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.5, 3, 48]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} side={THREE.DoubleSide} />
    </mesh>
  );
}

function SceneLighting() {
  return (
    <>
      {/* Warm directional from top-right (sun) */}
      <directionalLight
        position={[20, 30, 15]}
        intensity={0.9}
        color="#FFF5E0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={80}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      {/* Cool blue-purple fill from left */}
      <directionalLight position={[-15, 18, -12]} intensity={0.35} color="#6040FF" />
      {/* Central cyan point */}
      <pointLight position={[0, 10, 0]} intensity={0.45} color="#00FFE5" distance={45} />
      {/* Ambient blue-white sky bounce */}
      <ambientLight intensity={0.6} color="#C8D8F0" />
      {/* Hemisphere sky/ground */}
      <hemisphereLight args={['#2A4080', '#0B1929', 0.4]} />
    </>
  );
}

function FullCityScene({ onDistrictClick, onReady, onNPCInteract, controlsEnabled, playerPosRef, completedMissions }) {
  const { state, dispatch } = useGame();
  const { scene, gl } = useThree();
  const rank = getRankFromXp(state.xp);
  const auraColor = getAuraColor(state.aura);
  const cameraTarget = useRef({ x: 0, y: 0, z: 8 });
  const [avatarMoving, setAvatarMoving] = useState(false);
  const readyFired = useRef(false);

  const fireReady = useCallback(() => {
    if (readyFired.current) return;
    readyFired.current = true;
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    gl.setClearColor('#0B1929');
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    scene.fog = new THREE.Fog('#1A1840', 50, 100);
    fireReady();
  }, [gl, scene, fireReady]);

  const handleDistrictClick = useCallback((id) => {
    dispatch({ type: 'SET_AVATAR_TARGET', target: getDistrictApproach(id) });
    dispatch({ type: 'SET_DISTRICT', district: id });
    onDistrictClick?.(id);
  }, [dispatch, onDistrictClick]);

  const handleGroundClick = useCallback((e) => {
    e.stopPropagation();
    dispatch({ type: 'SET_AVATAR_TARGET', target: { x: e.point.x, z: e.point.z } });
  }, [dispatch]);

  const onPositionChange = useCallback((pos) => {
    cameraTarget.current = { x: pos.x, y: 0, z: pos.z };
    if (playerPosRef) playerPosRef.current = pos;
    dispatch({ type: 'SET_AVATAR_POSITION', position: pos });
  }, [dispatch, playerPosRef]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[20, 22, 20]} fov={38} near={0.1} far={200} />
      <CityCamera
        targetRef={cameraTarget}
        enabled={controlsEnabled}
        shake={state.cityEffect?.type === 'breach' ? 1 : 0}
      />

      <SceneLighting />

      {/* Background stars */}
      <Stars radius={130} depth={70} count={2000} factor={2.2} saturation={0.15} fade speed={0.15} />

      <HorizonGlow />
      <CitySparkles />

      <CityGround onPointerDown={handleGroundClick} />
      <StreetLamps />
      <CyberTrees />
      <DataStreamParticles />

      <DistrictBuildings
        selectedDistrict={state.selectedDistrict}
        onDistrictClick={handleDistrictClick}
        threatDistrict={state.threatLevel === 'RED' ? state.selectedDistrict : null}
        missionDistrict={state.activeMission?.district || null}
        completedMissions={completedMissions}
      />

      {state.role === 'analyst' && <ThreatPathVisualizer />}

      <CityNPCs
        playerPos={state.avatarPosition}
        onNPCInteract={onNPCInteract}
        completedMissions={completedMissions}
      />

      <ContactShadows position={[0, 0, 0]} opacity={0.55} scale={55} blur={2.5} far={16} resolution={256} />

      <CityEffect effect={state.cityEffect} />
      <DestinationMarker target={state.avatarTarget} />

      <AvatarController
        callsign={state.callsign}
        rank={rank}
        auraColor={auraColor}
        navigateTo={state.avatarTarget}
        onPositionChange={onPositionChange}
        onMovingChange={setAvatarMoving}
        onArrive={() => dispatch({ type: 'CLEAR_AVATAR_TARGET' })}
        enabled={controlsEnabled}
      />

      <SceneErrorBoundary fallback={null}>
        <CityPostProcessing />
      </SceneErrorBoundary>
    </>
  );
}

export default function CyberCity({
  visible,
  onDistrictClick,
  onReady,
  onNPCInteract,
  controlsEnabled = true,
  completedMissions = [],
}) {
  const readyCalled = useRef(false);

  const handleReady = useCallback(() => {
    if (readyCalled.current) return;
    readyCalled.current = true;
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    const t = setTimeout(handleReady, 4000);
    return () => clearTimeout(t);
  }, [handleReady]);

  return (
    <div className={`cyber-city-wrap ${visible ? 'visible' : ''}`}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0B1929');
          handleReady();
        }}
        style={{ touchAction: 'none' }}
      >
        <Suspense fallback={null}>
          <SceneErrorBoundary fallback={null} onError={() => {}}>
            <FullCityScene
              onDistrictClick={onDistrictClick}
              onReady={handleReady}
              onNPCInteract={onNPCInteract}
              controlsEnabled={controlsEnabled}
              completedMissions={completedMissions}
            />
          </SceneErrorBoundary>
        </Suspense>
      </Canvas>

      {/* Deep blue-purple sky vignette */}
      <div className="city-sky-gradient" aria-hidden />
      <div className="city-vignette-overlay" aria-hidden />

      {controlsEnabled && (
        <div className="city-controls-hint">
          <span><kbd>WASD</kbd> Walk</span>
          <span><kbd>Click</kbd> Ground or building</span>
          <span><kbd>E</kbd> / <kbd>Click NPC</kbd> to interact</span>
        </div>
      )}
    </div>
  );
}
