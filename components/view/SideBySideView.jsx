'use client';
import { Canvas } from '@react-three/fiber';
import SimulationMesh from '../SimulationMesh';
import { creatureMeta } from '../CollapsibleCategory';

export default function SideBySideView({ imageElement, videoElement, sourceMode, animalMode, lang }) {
  const humanLabel = lang === 'ta' ? "மனித பார்வை" : "Human Vision";
  
  // DYNAMIC LOOKUP
  const meta = creatureMeta[animalMode];
  const activeAnimalLabel = meta ? (lang === 'ta' ? meta.ta : meta.en) : animalMode;

  return (
    <div className="w-full h-full grid grid-cols-2 gap-2 p-1 bg-zinc-950/20 rounded-xl">
      <div className="w-full h-full relative border border-zinc-900 rounded-lg overflow-hidden bg-[#030108]">
        <div className="absolute left-2.5 top-2.5 z-10 bg-black/70 border border-zinc-800 text-[9px] uppercase font-extrabold text-zinc-300 px-2 py-0.5 rounded shadow">{humanLabel}</div>
        <Canvas camera={{ position: [0, 0, 1] }}>
          <SimulationMesh imageElement={imageElement} videoElement={videoElement} sourceMode={sourceMode} splitPosition={1.0} displayMode="human" animalMode={animalMode} />
        </Canvas>
      </div>

      <div className="w-full h-full relative border border-purple-950/40 rounded-lg overflow-hidden bg-[#030108]">
        <div className="absolute left-2.5 top-2.5 z-10 bg-purple-950/80 border border-purple-500/30 text-[9px] uppercase font-extrabold text-purple-300 px-2 py-0.5 rounded shadow">{activeAnimalLabel}</div>
        <Canvas camera={{ position: [0, 0, 1] }}>
          <SimulationMesh imageElement={imageElement} videoElement={videoElement} sourceMode={sourceMode} splitPosition={0.0} displayMode="animal" animalMode={animalMode} />
        </Canvas>
      </div>
    </div>
  );
}