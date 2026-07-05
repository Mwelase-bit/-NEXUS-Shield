import { Bloom, BrightnessContrast, EffectComposer, HueSaturation, N8AO, Vignette } from '@react-three/postprocessing';

/**
 * Art-directed post stack. Chromatic aberration stays out (breaks some GPUs/drivers).
 * Order matters: AO grounds the geometry first, bloom lifts the neon,
 * then the grade + vignette tighten the palette.
 *
 * Tuning knobs (daytime Cloud Quest look):
 *  - N8AO intensity (1.8) / aoRadius (1.6): soft contact shading on the pale
 *    concrete. Remove N8AO entirely if a low-end GPU struggles.
 *  - Bloom luminanceThreshold (0.8): daytime scenes barely bloom — only the
 *    hottest emissives (scanner, crown) get a halo. Lower toward 0.5 for more glow.
 *  - HueSaturation saturation (0.08) + contrast (0.05): gentle "chosen palette" grade.
 *  - Vignette darkness (0.35): kept light so the sky stays bright.
 */
export default function CityPostProcessing({ enabled = true }) {
  if (!enabled) return null;
  return (
    <EffectComposer multisampling={0}>
      <N8AO
        halfRes
        quality="performance"
        aoRadius={1.6}
        intensity={1.8}
        distanceFalloff={1.2}
        color="#2A3542"
      />
      <Bloom
        intensity={0.35}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.3}
        mipmapBlur
        radius={0.6}
      />
      <HueSaturation saturation={0.08} />
      <BrightnessContrast contrast={0.05} />
      <Vignette eskil={false} offset={0.3} darkness={0.35} />
    </EffectComposer>
  );
}
