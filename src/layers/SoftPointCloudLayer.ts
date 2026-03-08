/**
 * A custom PointCloudLayer that renders antialiased (soft-edged) circles
 * instead of the default hard-cutoff discs.
 *
 * It overrides the fragment shader to use `smoothstep` at the circle boundary,
 * giving each dot a smooth, sub-pixel fade at the edge.
 */
import { PointCloudLayer } from "@deck.gl/layers";
import type { PointCloudLayerProps } from "@deck.gl/layers";

const SOFT_FRAGMENT_SHADER = `\
#version 300 es
#define SHADER_NAME soft-point-cloud-fragment-shader

precision highp float;

in vec4 vColor;
in vec2 unitPosition;

out vec4 fragColor;

void main(void) {
  geometry.uv = unitPosition.xy;

  float distToCenter = length(unitPosition);

  // Hard discard well outside the circle (avoid wasting blending work)
  if (distToCenter > 1.0) {
    discard;
  }

  // Smooth antialiased edge: fade alpha over the outermost ~8 % of the radius.
  // smoothstep(edge0, edge1, x) returns 0 when x <= edge0, 1 when x >= edge1.
  // We invert it so alpha is 1.0 at the centre and 0.0 at the rim.
  float edgeSoftness = 1.0 - smoothstep(0.85, 1.0, distToCenter);

  fragColor = vec4(vColor.rgb, vColor.a * edgeSoftness);
  DECKGL_FILTER_COLOR(fragColor, geometry);
}
`;

export class SoftPointCloudLayer<
  DataT = unknown,
  ExtraPropsT extends object = object,
> extends PointCloudLayer<DataT, ExtraPropsT> {
  static layerName = "SoftPointCloudLayer";

  getShaders() {
    const shaders = super.getShaders();
    return {
      ...shaders,
      fs: SOFT_FRAGMENT_SHADER,
    };
  }
}

export type { PointCloudLayerProps };
