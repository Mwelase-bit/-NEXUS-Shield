import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Smooth isometric-style follow camera.
 * Uses OrthographicCamera — set from the Canvas gl prop.
 * Smooth lerp (0.05) follows the player.
 */
export default function CityCamera({ targetRef, enabled = true, shake = 0 }) {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const initialized = useRef(false);

  // Isometric offset: 45° horizontal, ~35° elevation
  const ISO_OFFSET = new THREE.Vector3(20, 22, 20);

  useFrame((_, delta) => {
    if (!targetRef?.current) return;

    const t = targetRef.current;
    const target = new THREE.Vector3(t.x ?? 0, 0, t.z ?? 0);

    const desiredPos = target.clone().add(ISO_OFFSET);

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
    }

    // Smooth lerp factor — 0.05 is Cloud Quest's feel
    const lerpFactor = Math.min(1, delta * 6);
    camera.position.lerp(desiredPos, lerpFactor * 0.5);
    currentLookAt.current.lerp(target, lerpFactor * 0.5);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
