import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Dynamic follow camera — pulls back when moving, subtle drift.
 */
export default function CityCamera({ targetRef, enabled = true, isMoving = false, shake = 0 }) {
  const { camera } = useThree();
  const lookAt = useRef(new THREE.Vector3());
  const desiredPos = useRef(new THREE.Vector3(14, 16, 14));
  const initialized = useRef(false);
  const shakeOffset = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!enabled || !targetRef?.current) return;

    const baseDist = isMoving ? 14 : 12;
    const height = isMoving ? 15 : 14;
    const offset = new THREE.Vector3(baseDist, height, baseDist);

    const t = targetRef.current;
    const goal = new THREE.Vector3(t.x, t.y ?? 0, t.z);
    lookAt.current.copy(goal);
    lookAt.current.y += 1.4;

    desiredPos.current.copy(goal).add(offset);

    if (shake > 0) {
      shakeOffset.current.set(
        (Math.random() - 0.5) * shake * 0.15,
        (Math.random() - 0.5) * shake * 0.1,
        (Math.random() - 0.5) * shake * 0.15
      );
      desiredPos.current.add(shakeOffset.current);
    }

    if (!initialized.current) {
      camera.position.copy(desiredPos.current);
      initialized.current = true;
    }

    const smooth = 1 - Math.exp(-3.5 * delta);
    camera.position.lerp(desiredPos.current, smooth);
    camera.lookAt(lookAt.current);

    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = isMoving ? 44 : 40;
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, smooth);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
