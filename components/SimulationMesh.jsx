"use client";
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { fragmentShader } from "../shaders/fragmentShader";

const vertexShader = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`;

export default function SimulationMesh({
  imageElement,
  videoElement,
  sourceMode,
  splitPosition,
  displayMode,
  animalMode,
}) {
  const meshRef = useRef();
  const activeTexRef = useRef(null);
  const { viewport } = useThree();

  // Calculate standard cover matrix sizing coordinates
  useEffect(() => {
    let mediaWidth = 1;
    let mediaHeight = 1;

    if (sourceMode === "image" && imageElement) {
      mediaWidth = imageElement.naturalWidth || imageElement.width;
      mediaHeight = imageElement.naturalHeight || imageElement.height;
    } else if (sourceMode === "webcam" && videoElement) {
      mediaWidth = videoElement.videoWidth || 1280;
      mediaHeight = videoElement.videoHeight || 720;
    }

    const mediaAspect = mediaWidth / mediaHeight;
    const viewportAspect = viewport.width / viewport.height;

    let scaleX = 1.0;
    let scaleY = 1.0;

    if (mediaAspect > viewportAspect) {
      scaleX = viewportAspect / mediaAspect;
    } else {
      scaleY = mediaAspect / viewportAspect;
    }

    if (meshRef.current) {
      meshRef.current.material.uniforms.uScaleUV.value.set(scaleX, scaleY);
    }
  }, [
    imageElement,
    videoElement,
    sourceMode,
    viewport.width,
    viewport.height,
    displayMode,
  ]);

  useEffect(() => {
    if (meshRef.current)
      meshRef.current.material.uniforms.uSplitPos.value = splitPosition;
  }, [splitPosition]);

  useEffect(() => {
    if (meshRef.current) {
      let modeValue = 0.0;
      if (displayMode === "human") modeValue = 1.0;
      if (displayMode === "animal") modeValue = 2.0;
      meshRef.current.material.uniforms.uDisplayMode.value = modeValue;
    }
  }, [displayMode]);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uAnimalMode.value =
        animalMode === "cat" ? 1.0 : 0.0;
    }
  }, [animalMode]);

  useEffect(() => {
    if (meshRef.current) {
      let animalId = 0.0;
      if (animalMode === "cat") animalId = 1.0;
      if (animalMode === "bee") animalId = 2.0;
      if (animalMode === "bird") animalId = 3.0;
      if (animalMode === "snake") animalId = 4.0;
      if (animalMode === "goat") animalId = 5.0;
      if (animalMode === "cow") animalId = 6.0;
      if (animalMode === "horse") animalId = 7.0;
      if (animalMode === "mantis") animalId = 8.0;
      if (animalMode === "cuttlefish") animalId = 9.0;
      if (animalMode === "chameleon") animalId = 10.0;

      meshRef.current.material.uniforms.uAnimalMode.value = animalId;
    }
  }, [animalMode]);

  useEffect(() => {
    if (sourceMode === "webcam" && videoElement) {
      const videoTex = new THREE.VideoTexture(videoElement);
      videoTex.minFilter = THREE.LinearFilter;
      videoTex.magFilter = THREE.LinearFilter;
      videoTex.colorSpace = THREE.SRGBColorSpace;
      activeTexRef.current = videoTex;
      if (meshRef.current)
        meshRef.current.material.uniforms.uTexture.value = videoTex;
      return () => videoTex.dispose();
    }
    if (sourceMode === "image" && imageElement) {
      const imgTex = new THREE.Texture(imageElement);
      imgTex.needsUpdate = true;
      imgTex.minFilter = THREE.LinearFilter;
      imgTex.magFilter = THREE.LinearFilter;
      activeTexRef.current = imgTex;
      if (meshRef.current)
        meshRef.current.material.uniforms.uTexture.value = imgTex;
      return () => imgTex.dispose();
    }
  }, [imageElement, videoElement, sourceMode]);

  useFrame(() => {
    if (sourceMode === "webcam" && activeTexRef.current)
      activeTexRef.current.needsUpdate = true;
  });

  const uniforms = useRef({
    uTexture: { value: new THREE.Texture() },
    uSplitPos: { value: 0.5 },
    uDisplayMode: { value: 0.0 },
    uAnimalMode: { value: 0.0 },
    uScaleUV: { value: new THREE.Vector2(1, 1) },
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />{" "}
      {/* Stretches to cover 100% of the active container frame */}
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
