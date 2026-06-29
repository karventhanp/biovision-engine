// shaders/fragmentShader.js
export const fragmentShader = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uSplitPos;
  uniform float uDisplayMode; 
  uniform float uAnimalMode;  // 0=Dog, 1=Cat, 2=Bee, 3=Bird, 4=Snake, 5=Goat, 6=Cow, 7=Horse, 8=Mantis, 9=Cuttlefish, 10=Chameleon
  uniform float uFovMode;     // 0.0 = Off, 1.0 = On (Real Physical Field of View Mode)
  uniform vec2 uScaleUV; 

  vec3 sRgbToLinear(vec3 srgb) {
      return mix(pow((srgb + 0.055) / 1.055, vec3(2.4)), srgb / 12.92, lessThanEqual(srgb, vec3(0.04045)));
  }

  vec3 linearToSRgb(vec3 linear) {
      return mix(1.055 * pow(linear, vec3(1.0 / 2.4)) - 0.055, linear * 12.92, lessThanEqual(linear, vec3(0.0031308)));
  }

  // --- ANIMAL CORE SIGHT FILTERS ---
  vec3 processDogVision(vec3 r) { return clamp(vec3(dot(r, vec3(0.205, 0.795, 0.0)), dot(r, vec3(0.145, 0.855, 0.0)), dot(r, vec3(-0.008, 0.414, 0.594))), 0.0, 1.0); }
  vec3 processCatVision(vec3 r) { return clamp(vec3(dot(r, vec3(0.266, 0.733, 0.001)), dot(r, vec3(0.200, 0.800, 0.0)), dot(r, vec3(-0.010, 0.400, 0.610))) * 1.15, 0.0, 1.0); }
  vec3 processBeeVision(vec3 r) { return clamp(vec3(r.g * 0.1, r.b * 0.9, r.r * 1.4 + r.b * 0.3), 0.0, 1.0); }
  vec3 processBirdVision(vec3 r) { return clamp(pow(r, vec3(0.85)) * vec3(1.1, 1.2, 1.0), 0.0, 1.0); }
  vec3 processSnakeVision(vec3 r) { float l = dot(r, vec3(0.299, 0.587, 0.114)); return clamp(vec3(smoothstep(0.3, 0.8, l), sin(l * 3.14159), smoothstep(0.7, 0.0, l) + smoothstep(0.9, 1.0, l) * 0.5), 0.0, 1.0); }
  vec3 processPreyVision(vec3 r) { return clamp(vec3(dot(r, vec3(0.23, 0.77, 0.0)), dot(r, vec3(0.12, 0.88, 0.0)), dot(r, vec3(0.0, 0.35, 0.65))), 0.0, 1.0); }
  vec3 processCattleVision(vec3 r) { return clamp(vec3(dot(r, vec3(0.25, 0.75, 0.0)), dot(r, vec3(0.15, 0.85, 0.0)), dot(r, vec3(0.0, 0.40, 0.60))), 0.0, 1.0); }
  vec3 processMantisVision(vec3 r, vec2 uv) { vec3 v = pow(r, vec3(0.65)) * 1.3; float s = sin(uv.x * 10.0 + uv.y * 10.0) * 0.15; v.r = clamp(v.r + s, 0.0, 1.0); v.b = clamp(v.b - s * 0.5, 0.0, 1.0); v.g = clamp(v.g + abs(s), 0.0, 1.0); return v; }
  vec3 processCuttlefishVision(vec3 r, vec2 uv) { float l = dot(r, vec3(0.299, 0.587, 0.114)); float p = abs(sin(uv.x * 50.0) * cos(uv.y * 50.0)) * 0.12; float c = smoothstep(0.1, 0.9, l + p); return vec3(c * 0.9 + 0.1, c * 1.0, c * 0.8); }

  vec3 processChameleonVision(sampler2D tex, vec2 uv, vec2 scale, float forceFov) {
      vec2 d = uv - 0.5;
      float r2 = dot(d, d);
      float multiplier = (forceFov == 1.0) ? 0.95 : 0.35;
      vec2 distortedUv = 0.5 + d * (1.0 + multiplier * r2 + 0.15 * r2 * r2);
      vec2 correctedUv = (distortedUv - 0.5) * scale + 0.5;
      if (correctedUv.x < 0.0 || correctedUv.x > 1.0 || correctedUv.y < 0.0 || correctedUv.y > 1.0) {
          return vec3(0.02, 0.01, 0.05);
      }
      vec4 col = texture2D(tex, correctedUv);
      return mix(pow((col.rgb + 0.055) / 1.055, vec3(2.4)), col.rgb / 12.92, lessThanEqual(col.rgb, vec3(0.04045)));
  }

  void main() {
      vec2 correctedUv = (vUv - 0.5) * uScaleUV + 0.5;
      vec3 linearRGB;
      
      if (uAnimalMode == 10.0) {
          linearRGB = processChameleonVision(uTexture, vUv, uScaleUV, uFovMode);
      } else {
          vec4 texColor = texture2D(uTexture, correctedUv);
          linearRGB = sRgbToLinear(texColor.rgb);
      }
      
      vec3 animalLinear;
      if (uAnimalMode == 1.0) {
          animalLinear = processCatVision(linearRGB);
      } else if (uAnimalMode == 2.0) {
          animalLinear = processBeeVision(linearRGB);
      } else if (uAnimalMode == 3.0) {
          animalLinear = processBirdVision(linearRGB);
      } else if (uAnimalMode == 4.0) {
          animalLinear = processSnakeVision(linearRGB);
      } else if (uAnimalMode == 5.0 || uAnimalMode == 7.0) {
          animalLinear = processPreyVision(linearRGB); // Goat & Horse
      } else if (uAnimalMode == 6.0) {
          animalLinear = processCattleVision(linearRGB); // Cow
      } else if (uAnimalMode == 8.0) {
          animalLinear = processMantisVision(linearRGB, vUv);
      } else if (uAnimalMode == 9.0) {
          animalLinear = processCuttlefishVision(linearRGB, vUv);
      } else {
          animalLinear = processDogVision(linearRGB);
      }
      
      // --- BIOLOGICAL PHYSICAL ANGLE RESTRICTIONS ---
      if (uFovMode == 1.0) {
          // Goat (5.0) & Horse (7.0): Frontal Blind Spots
          if (uAnimalMode == 5.0 || uAnimalMode == 7.0) {
              float centerDist = abs(vUv.x - 0.5);
              float blindSpotSize = (uAnimalMode == 7.0) ? 0.08 : 0.05;
              animalLinear *= smoothstep(0.0, blindSpotSize, centerDist);
          }
          // Cow (6.0): Panoramic Narrow Vertical Angle View
          else if (uAnimalMode == 6.0) {
              animalLinear *= smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.82, vUv.y);
          }
          // Dog & Cat (0.0 / 1.0): Blurred Peripheral Focus Edge
          else if (uAnimalMode == 0.0 || uAnimalMode == 1.0) {
              float edgeMask = smoothstep(0.65, 0.45, distance(vUv, vec2(0.5)));
              animalLinear *= mix(0.3, 1.0, edgeMask);
          }
      }
      
      vec3 animalSRGB = linearToSRgb(animalLinear);

      if (uDisplayMode == 1.0) {
          gl_FragColor = texture2D(uTexture, correctedUv);
      } else if (uDisplayMode == 2.0) {
          gl_FragColor = vec4(animalSRGB, 1.0);
      } else {
          if (vUv.x > uSplitPos) {
              gl_FragColor = vec4(animalSRGB, 1.0);
          } else {
              if (abs(vUv.x - uSplitPos) < 0.003) {
                  gl_FragColor = vec4(0.06, 0.71, 1.0, 1.0); 
              } else {
                  gl_FragColor = texture2D(uTexture, correctedUv);
              }
          }
      }
  }
`;