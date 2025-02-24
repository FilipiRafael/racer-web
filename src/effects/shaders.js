export const MotionBlurShader = {
  uniforms: {
    tDiffuse: { value: null },
    strength: { value: 0.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float strength;
    varying vec2 vUv;

    float rand(vec2 co) {
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
      vec2 dir = normalize(vUv - vec2(0.5));
      float dist = length(vUv - vec2(0.5));
      float blur = max(dist - 0.1, 0.0) * strength * 0.5;

      vec4 sum = vec4(0.0);
      for(int i = 0; i < 12; i++) {
        float offset = float(i) * 0.004 * blur;
        vec2 pos = vUv + dir * offset;
        sum += texture2D(tDiffuse, pos);
      }
      gl_FragColor = sum / 12.0;
    }
  `,
};
