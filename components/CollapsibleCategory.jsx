// components/CollapsibleCategory.jsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

// Localized creature listings with their respective nested icons
// components/CollapsibleCategory.jsx
export const creatureMeta = {
  dog: { emoji: '🐶', en: "Dog Vision", ta: "நாய் பார்வை" },
  cat: { emoji: '🐱', en: "Cat Vision", ta: "பூனை பார்வை" },
  bird: { emoji: '🦅', en: "Eagle View", ta: "கழுகு பார்வை" },
  bee: { emoji: '🐝', en: "Bee Vision (UV)", ta: "தேனீ பார்வை (புற ஊதா)" },
  snake: { emoji: '🐍', en: "Snake Heat", ta: "பாம்பு பார்வை (வெப்பம்)" },
  cow: { emoji: '🐄', en: "Cow Vision", ta: "பசு பார்வை" },
  goat: { emoji: '🐐', en: "Goat Vision", ta: "ஆடு பார்வை" },
  horse: { emoji: '🐎', en: "Horse Vision", ta: "குதிரை பார்வை" },
  mantis: { emoji: '🦞', en: "Mantis Shrimp", ta: "மண்டிஸ் இறால்" },
  cuttlefish: { emoji: '🦑', en: "Cuttlefish Polarization", ta: "கட்டில்ஃபிஷ் பார்வை" },
  chameleon: { emoji: '🦎', en: "Chameleon Panoramic", ta: "பச்சோந்தி பார்வை" }
};

export default function CollapsibleCategory({
  id,
  title,
  icon: Icon,
  themeColor,
  isOpen,
  onToggle,
  activeAnimal,
  items,
  onSelect,
  lang,
}) {
  // Custom theme color mappings
  const themeStyles = {
    purple: {
      text: "text-purple-300",
      activeBorder: "border-purple-500",
      activeText: "text-purple-400",
      hover: "hover:border-purple-500/30 hover:text-purple-400",
      iconColor: "text-purple-400",
    },
    emerald: {
      text: "text-emerald-300",
      activeBorder: "border-emerald-500",
      activeText: "text-emerald-400",
      hover: "hover:border-emerald-500/30 hover:text-emerald-400",
      iconColor: "text-emerald-400",
    },
    amber: {
      text: "text-amber-300",
      activeBorder: "border-amber-500",
      activeText: "text-amber-400",
      hover: "hover:border-amber-500/30 hover:text-amber-400",
      iconColor: "text-amber-400",
    },
  }[themeColor || "purple"];

  return (
    <div className="rounded-xl border border-purple-950/50 overflow-hidden bg-purple-950/10">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-purple-950/30 hover:bg-purple-950/50 border-b border-purple-950/40 text-xs font-black tracking-wider uppercase cursor-pointer transition-all duration-150"
      >
        <span className={`flex items-center gap-2 ${themeStyles.text}`}>
          <Icon size={13} className={themeStyles.iconColor} />
          {title}
        </span>
        {isOpen ? (
          <ChevronUp size={14} className={themeStyles.text} />
        ) : (
          <ChevronDown size={14} className={themeStyles.text} />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-2 flex flex-col gap-1.5 overflow-hidden bg-zinc-950/20"
          >
            {items.map((itemKey) => {
              const currentItem = creatureMeta[itemKey];
              const isSelected = activeAnimal === itemKey;
              return (
                <button
                  key={itemKey}
                  onClick={() => onSelect(itemKey)}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-bold transition-all duration-150 cursor-pointer bg-transparent ${
                    isSelected
                      ? `bg-gradient-to-r from-purple-600/10 to-pink-600/10 ${themeStyles.activeBorder} ${themeStyles.activeText}`
                      : `border-transparent text-zinc-400 ${themeStyles.hover}`
                  }`}
                >
                  <span className="mr-1.5">{currentItem.emoji}</span>
                  {lang === "ta" ? currentItem.ta : currentItem.en}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
