// app/page.js
'use client';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sliders, Eye, EyeOff, Columns2, Image as ImageIcon, Video, Cat, RefreshCw, Feather, Bug } from 'lucide-react';
import { translations } from '../data/translations';
import CollapsibleCategory from '../components/CollapsibleCategory';
import ViewControl from '../components/ViewControl';
import MediaIngestHub from '../components/MediaIngestHub';
import SingleCanvasView from '../components/view/SingleCanvasView';
import SideBySideView from '../components/view/SideBySideView';

export default function Home() {
  const [lang, setLang] = useState('en');
  const [sourceMode, setSourceMode] = useState('image');
  const [displayMode, setDisplayMode] = useState('split');
  const [animalMode, setAnimalMode] = useState('dog');
  const [imageElement, setImageElement] = useState(null);
  const [videoElement, setVideoElement] = useState(null);

  const [floatingEffects, setFloatingEffects] = useState([]);
  const [openPanels, setOpenPanels] = useState({ mammals: true, birds: false, crawlies: false });

  const asideRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const t = translations[lang];

  const togglePanel = (panelId) => {
    setOpenPanels(prev => ({ ...prev, [panelId]: !prev[panelId] }));
  };

  const startWebcam = async () => {
    setImageElement(null);
    setVideoElement(null);
    try {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => setVideoElement(videoRef.current))
              .catch(err => console.error(err));
          }
        };
      }
    } catch (err) {
      setSourceMode('image');
    }
  };

  useEffect(() => {
    if (sourceMode === 'webcam') startWebcam();
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, [sourceMode]);

  const handleAnimalSwitch = (mode) => {
    setAnimalMode(mode);

    // Completely updated router map for all 10 creatures
    const emojiMap = {
      dog: '🐶', cat: '🐱', bird: '🦅', bee: '🐝', snake: '🐍',
      goat: '🐐', cow: '🐄', horse: '🐎', mantis: '🦞', cuttlefish: '🦑', chameleon: '🦎'
    };

    if (asideRef.current) {
      const rect = asideRef.current.getBoundingClientRect();
      setFloatingEffects([]);
      setTimeout(() => {
        setFloatingEffects([{
          id: Date.now() + Math.random(),
          emoji: emojiMap[mode] || '🐶', // Correctly grabs our marine/lizard icons now
          x: rect.width / 2,
          y: rect.height / 2,
          scale: 4.5,
        }]);
      }, 10);
    }
  };

  const dynamicCreatureLabel = () => {
    const pureNames = {
      en: { dog: "Dog", cat: "Cat", bird: "Bird", bee: "Bee", snake: "Snake" },
      ta: { dog: "நாய்", cat: "பூனை", bird: "பறவை", bee: "தேனீ", snake: "பாம்பு" }
    };
    const activeLabel = pureNames[lang][animalMode];
    return lang === 'ta' ? `${activeLabel}${t.onlySuffix}` : `${t.onlyPrefix}${activeLabel}`;
  };

  const categoryConfig = [
    {
      id: 'mammals',
      title: t.categories.mammals,
      icon: Cat,
      themeColor: 'purple',
      items: ['dog', 'cat', 'cow', 'goat', 'horse'] // Removed 'bull' from here
    },
    {
      id: 'birds',
      title: t.categories.birds,
      icon: Feather,
      themeColor: 'emerald',
      items: ['bird']
    },
    {
      id: 'crawlies',
      title: t.categories.crawlies,
      icon: Bug,
      themeColor: 'amber',
      items: ['bee', 'snake', 'mantis', 'cuttlefish', 'chameleon'] // Registered here
    }
  ];

  return (
    <main className="min-h-screen lg:h-screen w-screen bg-[#05030d] text-zinc-100 flex flex-col p-3 md:p-5 select-none font-sans antialiased overflow-x-hidden overflow-y-auto lg:overflow-hidden relative">

      {/* HEADER SECTION */}
      <header className="flex flex-col sm:flex-row items-center justify-between border-b border-purple-950/20 pb-3 mb-4 shrink-0 gap-3 w-full">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 flex items-center justify-center text-white text-lg shadow-xl shadow-purple-500/10 border border-purple-500/20">👁️</div>
          <div>
            <h1 className="text-2xl font-black tracking-wide text-white uppercase bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">உயிரோவியம்</h1>
            <p className="text-[10px] font-mono tracking-widest uppercase text-purple-400/80 font-bold mt-0.5">{t.tagline}</p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* 🔥 ACCENT HOVER LANGUAGE TOGGLE TRACK */}
          <div className="flex bg-zinc-950/80 p-0.5 rounded-xl border border-purple-900/30 shadow-lg relative group transition-all duration-300 hover:border-purple-500/40">
            <button
              onClick={() => setLang('en')}
              className={`flex items-center gap-1 px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all duration-200 cursor-pointer ${lang === 'en'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-purple-950/20'
                }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('ta')}
              className={`flex items-center gap-1 px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all duration-200 cursor-pointer ${lang === 'ta'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-pink-500/20'
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-purple-950/20'
                }`}
            >
              தமிழ்
            </button>
          </div>

          <div className="flex bg-purple-950/20 p-1 rounded-xl border border-purple-900/30 shadow-inner">
            <button onClick={() => setSourceMode('image')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase cursor-pointer ${sourceMode === 'image' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'text-zinc-400'}`}><ImageIcon size={13} /> {t.photo}</button>
            <button onClick={() => setSourceMode('webcam')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase cursor-pointer ${sourceMode === 'webcam' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'text-zinc-400'}`}><Video size={13} /> {t.video}</button>
          </div>
        </div>
      </header>

      {/* WORKSPACE MIDDLE PANELS */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 items-stretch min-h-0 w-full">
        <aside ref={asideRef} className="relative w-full lg:w-64 bg-purple-950/5 p-3 rounded-2xl border border-purple-900/20 flex flex-col gap-4 shrink-0 backdrop-blur-sm overflow-y-auto scrollbar-none">
          <AnimatePresence>
            {floatingEffects.map(p => (
              <motion.div key={p.id} initial={{ opacity: 0, scale: 0.4, x: p.x, y: p.y, translateX: "-50%", translateY: "-50%" }} animate={{ opacity: [0, 1, 0.9, 0], scale: [0.5, 1.2, 1.0], y: p.y - 70 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} onAnimationComplete={() => setFloatingEffects([])} className="absolute left-0 top-0 text-5xl pointer-events-none select-none z-40 flex items-center justify-center"><span className="filter drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]">{p.emoji}</span></motion.div>
            ))}
          </AnimatePresence>

          <div className="space-y-3">
            {categoryConfig.map((cat) => (
              <CollapsibleCategory
                key={cat.id}
                id={cat.id}
                title={cat.title}
                icon={cat.icon}
                themeColor={cat.themeColor}
                isOpen={openPanels[cat.id]}
                onToggle={togglePanel}
                activeAnimal={animalMode}
                items={cat.items}
                onSelect={handleAnimalSwitch}
                lang={lang}
              />
            ))}
          </div>

          {/* DEDUPLICATED MODULAR BUTTON GRID ENGINE */}
          <div className="space-y-2 pt-3 border-t border-purple-900/20 mt-auto">
            <h3 className="text-[10px] font-bold tracking-wider text-purple-400/80 uppercase px-1">{t.layoutTitle}</h3>
            <div className="grid grid-cols-2 gap-1.5">
              <ViewControl modeId="split" activeMode={displayMode} icon={Sliders} label={t.split} onClick={setDisplayMode} />
              <ViewControl modeId="side-by-side" activeMode={displayMode} icon={Columns2} label={t.sideBySide} onClick={setDisplayMode} />
              <ViewControl modeId="human" activeMode={displayMode} icon={Eye} label={t.human} onClick={setDisplayMode} />
              <ViewControl modeId="animal" activeMode={displayMode} icon={EyeOff} label={dynamicCreatureLabel()} onClick={setDisplayMode} />
            </div>
          </div>
        </aside>

        {/* View Stage */}
        <section className="flex-1 flex flex-col justify-between min-h-0 space-y-3">
          <video ref={videoRef} playsInline muted className="hidden" />
          <div className="flex-1 min-h-[340px] md:min-h-0 w-full relative rounded-2xl border border-purple-900/10 bg-purple-950/5 overflow-hidden flex items-center justify-center p-1">
            {sourceMode === 'image' && !imageElement ? (
              <div className="w-full h-full">
                <MediaIngestHub
                  textDict={t.upload}
                  onImageLoaded={(img) => setImageElement(img)}
                  onLiveModeTrigger={() => setSourceMode('webcam')} // Instantly triggers webcam state on tap
                />
              </div>
            ) : (
              (imageElement || videoElement) && (
                <div className="w-full h-full flex items-center justify-center">
                  {displayMode === 'side-by-side' ? (
                    <SideBySideView
                      imageElement={imageElement}
                      videoElement={videoElement}
                      sourceMode={sourceMode}
                      animalMode={animalMode}
                      lang={lang} // Passed active language context down
                    />
                  ) : (
                    <SingleCanvasView
                      imageElement={imageElement}
                      videoElement={videoElement}
                      sourceMode={sourceMode}
                      displayMode={displayMode}
                      animalMode={animalMode}
                      lang={lang} // Passed active language context down
                    />
                  )}
                </div>
              )
            )}
          </div>

          {(imageElement || videoElement) && (
            <div className="p-3 bg-purple-950/10 border border-purple-900/20 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3 backdrop-blur-md">
              <div className="text-zinc-300 text-xs tracking-wide font-medium"><p>{t.tips[animalMode]}</p></div>
              {imageElement && sourceMode === 'image' && (
                <button onClick={() => setImageElement(null)} className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-[10px] font-bold text-zinc-400 hover:text-pink-400 border border-purple-900/30 px-4 py-2 rounded-xl bg-purple-950/40 cursor-pointer"><RefreshCw size={10} /> {t.swapPhoto}</button>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}