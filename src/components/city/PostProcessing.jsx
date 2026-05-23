import { Bloom, EffectComposer } from '@react-three/postprocessing';

/** Safe bloom only — chromatic aberration removed (breaks some GPUs/drivers) */
export default function CityPostProcessing({ enabled = true }) {
  if (!enabled) return null;
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={0.85}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.5}
      />
    </EffectComposer>
  );
}
