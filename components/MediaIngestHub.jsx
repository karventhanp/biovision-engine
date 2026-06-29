'use client';
import { useRef } from 'react';
import { UploadCloud, Camera, Sparkles, HelpCircle } from 'lucide-react';

export default function MediaIngestHub({ onImageLoaded, textDict, onLiveModeTrigger }) {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = objectUrl;
    img.onload = () => {
      onImageLoaded(img);
    };
  };

  // Inline fallback labels depending on global language state passed in textDict
  const isTamil = textDict?.secure?.includes("உள்ளூர்");
  const promoTitle = isTamil ? "விந்தையான உலகைக் காணுங்கள்!" : "Uncover Hidden Realities!";
  const promoDesc = isTamil 
    ? "விலங்குகள் மற்றும் பூச்சிகள் தங்களைச் சுற்றியுள்ள வண்ணங்களை எப்படிப் பார்க்கின்றன என்பதை ஆராயுங்கள்." 
    : "Step into nature's secret spectrum. See how colors warp and shapes transform through wild eyes.";
  const promoLiveBtn = isTamil ? "நேரடி கேமரா வழியே பார்" : "Try Live Camera Mode";

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-4 p-3 sm:p-5 bg-gradient-to-br from-[#0c091f] to-[#040209] rounded-2xl border border-purple-900/20 overflow-y-auto">
      
      {/* 🔮 LEFT PANEL: INTERESTING SPOTLIGHT SHOWCASE */}
      <div className="flex-1 flex flex-col justify-between p-5 rounded-xl bg-purple-950/10 border border-purple-900/10 relative overflow-hidden backdrop-blur-sm min-h-[220px] md:min-h-0">
        {/* Subtle decorative glow circles */}
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-pink-500/5 blur-3xl pointer-events-none" />

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-wider">
            <Sparkles size={11} className="text-pink-400 animate-pulse" />
            {isTamil ? "புதிய அனுபவம்" : "Immersive Science"}
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-wide text-white bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            {promoTitle}
          </h2>
          <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
            {promoDesc}
          </p>
        </div>

        {/* Dynamic Interactive Shortcut Action Hook */}
        <div className="mt-4 pt-4 border-t border-purple-900/20">
          <button
            onClick={onLiveModeTrigger}
            className="group relative overflow-hidden flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-xs font-black uppercase text-white shadow-xl shadow-purple-500/10 transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Pulsing ring selector animation */}
            <span className="absolute inset-0 w-full h-full rounded-xl border border-white/20 animate-ping opacity-25 pointer-events-none" />
            <Camera size={14} className="group-hover:rotate-12 transition-transform duration-200" />
            {promoLiveBtn}
          </button>
        </div>
      </div>

      {/* 📂 RIGHT PANEL: HIGH-GLOW PHOTO UPLOAD BLOCK */}
      <div 
        onClick={() => fileInputRef.current.click()}
        className="flex-1 flex flex-col items-center justify-center bg-zinc-950/40 hover:bg-purple-950/10 rounded-xl border-2 border-dashed border-purple-900/40 hover:border-pink-500/40 text-center p-6 transition-all duration-300 cursor-pointer group shadow-inner relative min-h-[220px] md:min-h-0"
      >
        <div className="p-3.5 rounded-full bg-purple-900/10 text-purple-400 group-hover:text-pink-400 group-hover:bg-purple-900/20 group-hover:scale-110 transition-all duration-300 mb-4 border border-purple-800/20 shadow-md">
          <UploadCloud size={24} />
        </div>
        
        <h3 className="text-zinc-100 font-extrabold text-sm tracking-wide group-hover:text-white transition-colors">
          {textDict?.title || "Tap to Upload a Photo"}
        </h3>
        
        <p className="text-zinc-400 text-xs mt-1.5 max-w-xs px-2 leading-normal">
          {textDict?.desc || "Choose a picture to explore animal spectrums."}
        </p>
        
        <div className="mt-5 flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-zinc-500 bg-zinc-900/50 border border-zinc-800/60 px-2.5 py-1 rounded-md">
          <span>🔒 {textDict?.secure || "LOCAL GPU PROCESSING"}</span>
        </div>

        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileUpload} 
        />
      </div>

    </div>
  );
}