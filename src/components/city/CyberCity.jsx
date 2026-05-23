import { Suspense, useRef, useEffect, useCallback, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Stars, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import { getRankFromXp } from '../../utils/scoring';
import { DISTRICTS, getAuraColor, getDistrictApproach } from './cityConfig';
import CityGround from './CityGround';
import CityEnvironment from './CityEnvironment';
import DistrictBuildings from './DistrictBuildings';
import AvatarController from './AvatarController';
import CityCamera from './CityCamera';
import AnimatedDataStreams from './AnimatedDataStreams';
import CityProps from './CityProps';
import { CitySparkles, HazeLayers, HorizonGlow } from './CityAtmosphere';
import CityPostProcessing from './PostProcessing';
import SceneErrorBoundary from './SceneErrorBoundary';
import MinimalCityScene from './MinimalCityScene';

function DestinationMarker({ target }) {
  const ringRef = useRef();
  useFrame(({ clock }) => {
    if (ringRef.current) ringRef.current.rotation.z = clock.elapsedTime * 2.5;
  });
  if (!target) return null;
  return (
    <group position={[target.x, 0, target.z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <ringGeometry args={[0.35, 0.75, 32]} />
        <meshBasicMaterial color="#00FFE5" transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function CityEffect({ effect }) {
  const ref = useRef();
  const district = effect ? DISTRICTS[effect.district] : null;
  useFrame(({ clock }) => {
    if (!ref.current || !effect) return;
    const elapsed = (clock.elapsedTime % 1.2);
    ref.current.scale.setScalar(1 + elapsed * 5);
    ref.current.material.opacity = Math.max(0, 0.8 - elapsed * 0.65);
  });
  if (!effect || !district) return null;
  const color = effect.type === 'shield' ? '#00FFE5' : '#FF2D55';
  return (
    <mesh ref={ref} position={[district.position[0], 0.3, district.position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.5, 3, 48]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} side={THREE.DoubleSide} />
    </mesh>
  );
}

function FullCityScene({ onDistrictClick, onReady, controlsEnabled }) {
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
    gl.setClearColor('#050A14');
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    scene.fog = new THREE.Fog('#050A14', 30, 70);
    fireReady();
  }, [gl, scene, fireReady]);

  const handleDistrictClick = useCallback(
    (id) => {
      dispatch({ type: 'SET_AVATAR_TARGET', target: getDistrictApproach(id) });
      dispatch({ type: 'SET_DISTRICT', district: id });
      onDistrictClick?.(id);
    },
    [dispatch, onDistrictClick]
  );

  const handleGroundClick = useCallback(
    (e) => {
      e.stopPropagation();
      dispatch({ type: 'SET_AVATAR_TARGET', target: { x: e.point.x, z: e.point.z } });
    },
    [dispatch]
  );

  const onPositionChange = useCallback(
    (pos) => {
      cameraTarget.current = { x: pos.x, y: 0, z: pos.z };
      dispatch({ type: 'SET_AVATAR_POSITION', position: pos });
    },
    [dispatch]
  );

  return (
    <>
      <PerspectiveCamera makeDefault position={[14, 16, 14]} fov={42} near={0.1} far={150} />
      <CityCamera
        targetRef={cameraTarget}
        enabled={controlsEnabled}
        isMoving={avatarMoving}
        shake={state.cityEffect?.type === 'breach' ? 1 : 0}
      />

      <ambientLight intensity={0.45} />
      <directionalLight
        position={[18, 28, 12]}
        intensity={1.3}
        color="#cce8ff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />
      <directionalLight position={[-12, 14, -10]} intensity={0.4} color="#7B2FFF" />
      <pointLight position={[0, 8, 0]} intensity={0.5} color="#00FFE5" distance={30} />
      <hemisphereLight args={['#1a3a5c', '#050A14', 0.5]} />

      <Stars radius={100} depth={50} count={1500} factor={3} saturation={0} fade speed={0.3} />

      <HazeLayers />
      <HorizonGlow />

      <CityGround onPointerDown={handleGroundClick} />
      <CityEnvironment />
      <CityProps />
      <DistrictBuildings
        selectedDistrict={state.selectedDistrict}
        onDistrictClick={handleDistrictClick}
        threatDistrict={state.threatLevel === 'RED' ? state.selectedDistrict : null}
        missionDistrict={state.activeMission?.district || null}
      />

      <AnimatedDataStreams />
      <CitySparkles />

      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={40} blur={2} far={12} resolution={256} />

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

function SceneRouter(props) {
  const [useFallback, setUseFallback] = useState(false);
  const { state } = useGame();
  const rank = getRankFromXp(state.xp);
  const auraColor = getAuraColor(state.aura);

  if (useFallback) {
    return (
      <MinimalCityScene
        onReady={props.onReady}
        auraColor={auraColor}
        rank={rank}
        callsign={state.callsign}
        controlsEnabled={props.controlsEnabled}
      />
    );
  }

  return (
    <SceneErrorBoundary
      onError={() => setUseFallback(true)}
      fallback={
        <MinimalCityScene
          onReady={props.onReady}
          auraColor={auraColor}
          rank={rank}
          callsign={state.callsign}
          controlsEnabled={props.controlsEnabled}
        />
      }
    >
      <FullCityScene {...props} />
    </SceneErrorBoundary>
  );
}

export default function CyberCity({ visible, onDistrictClick, onReady, controlsEnabled = true }) {
  const readyCalled = useRef(false);

  const handleReady = useCallback(() => {
    if (readyCalled.current) return;
    readyCalled.current = true;
    onReady?.();
  }, [onReady]);

  // Safety: never stay on loading screen more than 4 seconds
  useEffect(() => {
    const t = setTimeout(handleReady, 4000);
    return () => clearTimeout(t);
  }, [handleReady]);

  return (
    <div className={`cyber-city-wrap ${visible ? 'visible' : ''}`}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#050A14');
          handleReady();
        }}
        style={{ touchAction: 'none' }}
      >
        <Suspense fallback={null}>
          <SceneRouter
            onDistrictClick={onDistrictClick}
            onReady={handleReady}
            controlsEnabled={controlsEnabled}
          />
        </Suspense>
      </Canvas>
      <div className="city-sky-gradient" aria-hidden />
      <div className="city-noise" aria-hidden />
      {controlsEnabled && (
        <div className="city-controls-hint">
          <span><kbd>WASD</kbd> Move</span>
          <span><kbd>Click</kbd> Ground to walk</span>
          <span><kbd>Click</kbd> District buildings</span>
        </div>
      )}
    </div>
  );
}
