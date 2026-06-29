// components/ViewControl.jsx
'use client';

export default function ViewControl({ modeId, activeMode, icon: Icon, label, onClick }) {
  const isSelected = activeMode === modeId;
  return (
    <button 
      onClick={() => onClick(modeId)} 
      className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border text-[10px] font-bold uppercase transition-all duration-150 cursor-pointer hover:bg-purple-900/10 hover:border-purple-500/30 hover:text-purple-400 ${
        isSelected 
          ? 'bg-purple-900/20 border-purple-500 text-purple-400' 
          : 'bg-transparent border-zinc-900/60 text-zinc-500'
      }`}
    >
      <Icon size={13} /> 
      {label}
    </button>
  );
}