import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Isometric offset: 45° horizontal, ~35° elevation
const ISO_OFFSET = new THREE.Vector3(20, 22, 20);

// Higher = snappier follow. 3.2 gives an ease-out settle without lag on WASD.
const FOLLOW_LAMBDA = 3.2;

/**
 * Smooth isometric follow camera.
 * - Frame-rate independent exponential damping (ease-out) toward the player.
 * - Subtle idle drift on the camera position (not the look-at target), which
 *   produces a slow parallax "breathing" when the player stands still.
 */
export default function CityCamera({ targetRef, shake = 0 }) {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const initialized = useRef(false);
  const drift = useRef(new THREE.Vector3());

  useFrame(({ clock }, delta) => {
    if (!targetRef?.current) return;

    const t = targetRef.current;
    const target = new THREE.Vector3(t.x ?? 0, 0, t.z ?? 0);
    const time = clock.elapsedTime;

    // Idle drift — incommensurate frequencies so the path never visibly loops
    drift.current.set(
      Math.sin(time * 0.21) * 0.35,
      Math.sin(time * 0.33) * 0.15,
      Math.cos(time * 0.16) * 0.35
    );

    const desiredPos = target.clone().add(ISO_OFFSET).add(drift.current);

    // Shake on breach
    if (shake > 0) {
      desiredPos.x += (Math.random() - 0.5) * shake * 0.12;
      desiredPos.y += (Math.random() - 0.5) * shake * 0.08;
    }

    if (!initialized.current) {
      camera.position.copy(desiredPos);
      currentLookAt.current.copy(target);
      camera.lookAt(target);
      initialized.current = true;
      return;
    }

    camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredPos.x, FOLLOW_LAMBDA, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredPos.y, FOLLOW_LAMBDA, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredPos.z, FOLLOW_LAMBDA, delta);

    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, target.x, FOLLOW_LAMBDA, delta);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, target.z, FOLLOW_LAMBDA, delta);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
