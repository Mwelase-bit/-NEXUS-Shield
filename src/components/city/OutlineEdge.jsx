import { Outlines } from '@react-three/drei';

/**
 * Thin dark silhouette outline — the "board-game piece" edge.
 * Wraps drei's Outlines (inverted hull) with project-wide defaults so
 * every object in the city shares one consistent line weight and color.
 *
 * Knobs:
 *  - thickness: world units. 0.05 reads as ~1-2px at the city camera distance.
 *    Use ~0.018 for small meshes (character limbs), ~0.05 for buildings.
 *  - color: dark slate with a blue cast — on the bright daytime palette a
 *    pure black outline reads cartoon, this reads "art directed".
 */
export const OUTLINE_COLOR = '#33404E';

export default function OutlineEdge({ thickness = 0.05, color = OUTLINE_COLOR }) {
  return <Outlines thickness={thickness} color={color} />;
}
