import React, { useState } from 'react';
import { Delete, Globe, Mic, ArrowUp } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface IOSKeyboardProps {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onSend: () => void;
  activeKeyChar?: string | null;
  language?: 'th' | 'en';
  onToggleLanguage?: () => void;
}

// Thai Keyboard Layout (Standard Kedmanee layout common on iOS)
const THAI_ROWS = [
  ['ๆ', 'ไ', 'ำ', 'พ', 'ะ', 'ั', 'ี', 'ุ', 'ู', '฿'],
  ['เ', '้', '่', 'า', 'ส', 'ว', 'ง', 'ิ', 'ื'],
  ['ผ', 'ป', 'แ', 'อ', 'ห', 'ก', 'ด', 'ม'],
];

const THAI_SHIFT_ROWS = [
  ['๑', '๒', '๓', '๔', 'ู', '฿', '๕', '๖', '๗', '๘'],
  ['ฆ', 'ฏ', 'โ', 'ฌ', 'พ', 'ศ', 'ษ', 'ศ', 'ซ'],
  ['ฉ', 'ฮ', 'ฺ', '์', '?,', 'ฒ', 'ฬ', 'ฦ'],
];

// English Keyboard Layout
const EN_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

// Common quick suggestions
const THAI_SUGGESTIONS = ['สวัสดีครับ', 'ขอบคุณครับ', 'โอเคครับ'];
const EN_SUGGESTIONS = ['Okay', 'Thanks!', 'See you soon'];

export const IOSKeyboard: React.FC<IOSKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onSpace,
  onSend,
  activeKeyChar = null,
  language = 'th',
  onToggleLanguage,
}) => {
  const [isShift, setIsShift] = useState(false);
  const [isNumbers, setIsNumbers] = useState(false);
  const [localLang, setLocalLang] = useState<'th' | 'en'>(language);

  const currentLang = onToggleLanguage ? language : localLang;

  const handleCharClick = (char: string) => {
    soundManager.playKeyboardClick();
    onKeyPress(isShift ? char.toUpperCase() : char.toLowerCase());
    if (isShift) setIsShift(false);
  };

  const handleBackspaceClick = () => {
    soundManager.playKeyboardClick();
    onBackspace();
  };

  const handleSpaceClick = () => {
    soundManager.playKeyboardClick();
    onSpace();
  };

  const handleShiftToggle = () => {
    soundManager.playKeyboardClick();
    setIsShift(!isShift);
  };

  const handleLangToggle = () => {
    soundManager.playKeyboardClick();
    if (onToggleLanguage) {
      onToggleLanguage();
    } else {
      setLocalLang((prev) => (prev === 'th' ? 'en' : 'th'));
    }
  };

  const handleSuggestionClick = (text: string) => {
    soundManager.playKeyboardClick();
    // Input each character or word
    for (const char of text) {
      onKeyPress(char);
    }
    onSpace();
  };

  // Determine active keys
  const rows =
    currentLang === 'th'
      ? isShift
        ? THAI_SHIFT_ROWS
        : THAI_ROWS
      : EN_ROWS;

  const suggestions = currentLang === 'th' ? THAI_SUGGESTIONS : EN_SUGGESTIONS;

  return (
    <div className="w-full bg-[#1e1e20]/95 backdrop-blur-2xl border-t border-white/10 pt-1.5 pb-3 px-1 select-none flex flex-col gap-1.5 animate-in slide-in-from-bottom duration-200">
      {/* Predictive Text Suggestions Bar */}
      <div className="flex items-center justify-around border-b border-white/10 pb-1 px-2 text-[13px] text-white/80 font-medium h-7">
        {suggestions.map((sugg, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSuggestionClick(sugg)}
            className="flex-1 text-center py-0.5 hover:bg-white/10 rounded-md transition-colors truncate px-1 text-xs"
          >
            "{sugg}"
          </button>
        ))}
      </div>

      {/* Row 1 */}
      <div className="flex items-center justify-center gap-[5px] w-full px-0.5">
        {rows[0].map((k) => {
          const displayChar = isShift && currentLang === 'en' ? k.toUpperCase() : k;
          const isPressed = activeKeyChar === displayChar || activeKeyChar === displayChar.toLowerCase();
          return (
            <button
              key={k}
              type="button"
              onClick={() => handleCharClick(displayChar)}
              className={`flex-1 h-[42px] max-w-[36px] rounded-[6px] font-sans font-medium text-[17px] flex items-center justify-center transition-all ${
                isPressed
                  ? 'bg-blue-500 text-white scale-110 shadow-lg shadow-blue-500/50 -translate-y-1 z-20 ring-2 ring-white'
                  : 'bg-[#55555a]/75 hover:bg-[#68686e] active:bg-[#888890] text-white shadow-[0_1px_0_rgba(0,0,0,0.4)]'
              }`}
            >
              {displayChar}
            </button>
          );
        })}
      </div>

      {/* Row 2 */}
      <div className="flex items-center justify-center gap-[5px] w-full px-2">
        {rows[1].map((k) => {
          const displayChar = isShift && currentLang === 'en' ? k.toUpperCase() : k;
          const isPressed = activeKeyChar === displayChar || activeKeyChar === displayChar.toLowerCase();
          return (
            <button
              key={k}
              type="button"
              onClick={() => handleCharClick(displayChar)}
              className={`flex-1 h-[42px] max-w-[36px] rounded-[6px] font-sans font-medium text-[17px] flex items-center justify-center transition-all ${
                isPressed
                  ? 'bg-blue-500 text-white scale-110 shadow-lg shadow-blue-500/50 -translate-y-1 z-20 ring-2 ring-white'
                  : 'bg-[#55555a]/75 hover:bg-[#68686e] active:bg-[#888890] text-white shadow-[0_1px_0_rgba(0,0,0,0.4)]'
              }`}
            >
              {displayChar}
            </button>
          );
        })}
      </div>

      {/* Row 3 (with Shift & Backspace) */}
      <div className="flex items-center justify-center gap-[5px] w-full px-0.5">
        {/* Shift Key */}
        <button
          type="button"
          onClick={handleShiftToggle}
          className={`w-[42px] h-[42px] rounded-[6px] flex items-center justify-center transition-all shadow-[0_1px_0_rgba(0,0,0,0.4)] ${
            isShift ? 'bg-white text-black' : 'bg-[#3b3b3f]/90 text-white/80 hover:bg-[#4a4a4f]'
          }`}
          title="Shift"
        >
          <ArrowUp size={18} strokeWidth={2.4} />
        </button>

        {rows[2].map((k) => {
          const displayChar = isShift && currentLang === 'en' ? k.toUpperCase() : k;
          const isPressed = activeKeyChar === displayChar || activeKeyChar === displayChar.toLowerCase();
          return (
            <button
              key={k}
              type="button"
              onClick={() => handleCharClick(displayChar)}
              className={`flex-1 h-[42px] max-w-[36px] rounded-[6px] font-sans font-medium text-[17px] flex items-center justify-center transition-all ${
                isPressed
                  ? 'bg-blue-500 text-white scale-110 shadow-lg shadow-blue-500/50 -translate-y-1 z-20 ring-2 ring-white'
                  : 'bg-[#55555a]/75 hover:bg-[#68686e] active:bg-[#888890] text-white shadow-[0_1px_0_rgba(0,0,0,0.4)]'
              }`}
            >
              {displayChar}
            </button>
          );
        })}

        {/* Backspace Key */}
        <button
          type="button"
          onClick={handleBackspaceClick}
          className="w-[42px] h-[42px] rounded-[6px] bg-[#3b3b3f]/90 hover:bg-[#4a4a4f] text-white/80 flex items-center justify-center shadow-[0_1px_0_rgba(0,0,0,0.4)] active:scale-95 transition-all"
          title="Delete"
        >
          <Delete size={18} strokeWidth={2.2} />
        </button>
      </div>

      {/* Bottom Row (123, Globe, Mic, Space, Send) */}
      <div className="flex items-center justify-between gap-[5px] w-full px-1 pt-0.5">
        {/* Numbers Toggle */}
        <button
          type="button"
          onClick={() => {
            soundManager.playKeyboardClick();
            setIsNumbers(!isNumbers);
          }}
          className="w-[40px] h-[42px] rounded-[6px] bg-[#3b3b3f]/90 text-white font-medium text-xs flex items-center justify-center shadow-[0_1px_0_rgba(0,0,0,0.4)]"
        >
          {isNumbers ? 'ABC' : '123'}
        </button>

        {/* Language Switcher (Globe) */}
        <button
          type="button"
          onClick={handleLangToggle}
          className="w-[38px] h-[42px] rounded-[6px] bg-[#3b3b3f]/90 text-white flex flex-col items-center justify-center shadow-[0_1px_0_rgba(0,0,0,0.4)]"
          title={`Switch language (Currently ${currentLang.toUpperCase()})`}
        >
          <Globe size={15} />
          <span className="text-[9px] font-bold text-amber-300">
            {currentLang === 'th' ? 'ไทย' : 'EN'}
          </span>
        </button>

        {/* Spacebar */}
        <button
          type="button"
          onClick={handleSpaceClick}
          className={`flex-1 h-[42px] rounded-[6px] font-sans text-xs flex items-center justify-center transition-all ${
            activeKeyChar === ' '
              ? 'bg-blue-500 text-white shadow-lg ring-2 ring-white'
              : 'bg-[#55555a]/75 hover:bg-[#68686e] active:bg-[#888890] text-white/70 shadow-[0_1px_0_rgba(0,0,0,0.4)]'
          }`}
        >
          {currentLang === 'th' ? 'วรรค (space)' : 'space'}
        </button>

        {/* Dictation / Mic */}
        <button
          type="button"
          onClick={() => soundManager.playTapSound()}
          className="w-[36px] h-[42px] rounded-[6px] bg-[#3b3b3f]/90 text-white/80 flex items-center justify-center shadow-[0_1px_0_rgba(0,0,0,0.4)]"
          title="Dictation"
        >
          <Mic size={15} />
        </button>

        {/* Blue Return / Send Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playMessageSentSound();
            onSend();
          }}
          className={`px-4 h-[42px] rounded-[6px] font-semibold text-xs flex items-center justify-center shadow-lg transition-all active:scale-95 ${
            activeKeyChar === 'ENTER'
              ? 'bg-emerald-500 text-white scale-105'
              : 'bg-[#007AFF] hover:bg-[#0069d9] text-white'
          }`}
        >
          {currentLang === 'th' ? 'ส่ง' : 'Send'}
        </button>
      </div>
    </div>
  );
};

