import React, { useState } from 'react';
import { REALISTIC_AVATARS, BEST_AVATAR } from '../utils/avatars';
import { ProfileAvatar } from '../types';
import { Upload, Star, Check } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface AvatarPickerProps {
  selectedUrl: string;
  onSelectAvatar: (url: string, suggestedName?: string) => void;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  selectedUrl,
  onSelectAvatar,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'best' | 'female' | 'male' | 'aesthetic'>('all');
  const [customInput, setCustomInput] = useState('');

  const filtered = REALISTIC_AVATARS.filter((av) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'best') return av.isBest;
    return av.category === activeTab;
  });

  const handlePick = (avatar: ProfileAvatar) => {
    soundManager.playTapSound();
    onSelectAvatar(avatar.url, avatar.name.split(' (')[0]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          soundManager.playTapSound();
          onSelectAvatar(reader.result, 'Custom User');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = () => {
    if (customInput.trim()) {
      soundManager.playTapSound();
      onSelectAvatar(customInput.trim());
      setCustomInput('');
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All 30 Avatars' },
          { id: 'best', label: '⭐ Best Pick (#1)' },
          { id: 'female', label: 'Women' },
          { id: 'male', label: 'Men' },
          { id: 'aesthetic', label: 'Aesthetic' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id as typeof activeTab);
              soundManager.playTapSound();
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 30 Avatars Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-h-[210px] overflow-y-auto p-1 scrollbar-none bg-black/30 rounded-2xl border border-white/10">
        {filtered.map((av) => {
          const isSelected = selectedUrl === av.url;
          return (
            <button
              key={av.id}
              type="button"
              onClick={() => handlePick(av)}
              className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-500/50 scale-105 z-10'
                  : av.isBest
                  ? 'border-amber-400 ring-1 ring-amber-400/40'
                  : 'border-white/10 hover:border-white/30'
              }`}
              title={av.name}
            >
              <img
                src={av.url}
                alt={av.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />

              {/* Best Pick Star Badge on #1 */}
              {av.isBest && (
                <div className="absolute top-1 left-1 bg-amber-400 text-black text-[8px] font-extrabold px-1 rounded-full flex items-center gap-0.5 shadow-md">
                  <Star size={7} fill="currentColor" />
                  <span>#1</span>
                </div>
              )}

              {/* Selected Checkmark */}
              {isSelected && (
                <div className="absolute inset-0 bg-blue-600/35 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md">
                    <Check size={12} strokeWidth={3} />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Featured #1 Best One Highlight Banner */}
      <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500/15 via-blue-500/10 to-transparent border border-amber-400/30 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={BEST_AVATAR.url}
            alt="Best"
            className="w-8 h-8 rounded-full object-cover border border-amber-400 shadow-sm"
          />
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-amber-300 block truncate">
              ⭐ #1 Best Profile Image: {BEST_AVATAR.name}
            </span>
            <span className="text-[10px] text-white/60">Ultra-realistic portrait</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handlePick(BEST_AVATAR)}
          className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-black text-[10px] font-extrabold rounded-lg shadow-sm transition-all active:scale-95 flex-shrink-0"
        >
          Use Best
        </button>
      </div>

      {/* Upload Custom or Paste URL */}
      <div className="flex items-center gap-2 pt-1 border-t border-white/10">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Or paste any custom image link..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500 truncate"
        />
        {customInput && (
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
          >
            Apply
          </button>
        )}
        <label className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-xl cursor-pointer text-xs font-semibold text-white/90 flex items-center gap-1 flex-shrink-0">
          <Upload size={12} />
          <span>Upload</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>
    </div>
  );
};

