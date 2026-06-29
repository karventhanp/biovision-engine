'use client';
import { Canvas } from '@react-three/fiber';
import { useState, useRef, useEffect } from 'react';
import SimulationMesh from '../SimulationMesh';

export default function SingleCanvasView({ imageElement, videoElement, sourceMode, displayMode, animalMode, lang }) {
  const [splitPos, setSplitPos] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const humanLabel = lang === 'ta' ? "மனித பார்வை" : "Human Vision";
  
  const animalLabelMap = {
    dog: { en: "Dog Vision", ta: "நாய் பார்வை" },
    cat: { en: "Cat Vision", ta: "பூனை பார்வை" },
    bird: { en: "Eagle View", ta: "கழுகு பார்வை" },
    bee: { en: "Bee Vision (UV)", ta: "தேனீ பார்வை (புற ஊதா)" },
    snake: { en: "Snake Heat", ta: "பாம்பு பார்வை (வெப்பம்)" },
    cow: { en: "Cow Vision", ta: "பசு பார்வை" },
    goat: { en: "Goat Vision", ta: "ஆடு பார்வை" },
    horse: { en: "Horse Vision", ta: "குதிரை பார்வை" },
    mantis: { en: "Mantis Shrimp", ta: "மண்டிஸ் இறால்" },
    cuttlefish: { en: "Cuttlefish Polarization", ta: "கட்டில்ஃபிஷ் பார்வை" },
    chameleon: { en: "Chameleon Panoramic", ta: "பச்சோந்தி பார்வை" }
  };

  const activeAnimalLabel = animalLabelMap[animalMode] 
    ? (lang === 'ta' ? animalLabelMap[animalMode].ta : animalLabelMap[animalMode].en)
    : animalMode;

  const updateSplitPosition = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    setSplitPos(Math.max(0.0, Math.min(1.0, x)));
  };

  return (
    <div 
      ref={containerRef}
      onPointerDown={(e) => { if(displayMode === 'split') { setIsDragging(true); updateSplitPosition(e.clientX); e.currentTarget.setPointerCapture(e.pointerId); } }}
      onPointerMove={(e) => { if(isDragging && displayMode === 'split') updateSplitPosition(e.clientX); }}
      onPointerUp={(e) => { setIsDragging(false); if(displayMode === 'split') e.currentTarget.releasePointerCapture(e.pointerId); }}
      className={`w-full h-full relative overflow-hidden select-none ${displayMode === 'split' ? 'cursor-ew-resize' : 'cursor-default'}`}
    >
      <Canvas camera={{ position: [0, 0, 1] }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <SimulationMesh imageElement={imageElement} videoElement={videoElement} sourceMode={sourceMode} splitPosition={splitPos} displayMode={displayMode} animalMode={animalMode} />
      </Canvas>

      {displayMode === 'split' && (
        <>
          <div className="absolute left-3 top-3 bg-black/70 backdrop-blur-sm border border-zinc-800 text-[10px] uppercase font-bold text-zinc-300 px-2 py-1 rounded shadow pointer-events-none">{humanLabel}</div>
          <div className="absolute right-3 top-3 bg-purple-950/80 backdrop-blur-sm border border-purple-500/40 text-[10px] uppercase font-bold text-purple-300 px-2 py-1 rounded shadow pointer-events-none">{activeAnimalLabel}</div>
          <div className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 pointer-events-none" style={{ left: `${splitPos * 100}%` }}>
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg border border-white/50">↔</div>
          </div>
        </>
      )}
    </div>
  );
}