import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Camera } from 'lucide-react';
import { NotificationItem } from '../types';
import { AppIcon } from '../utils/appIcons';
import { IOSKeyboard } from './IOSKeyboard';

interface QuickReplyModalProps {
  notification: NotificationItem | null;
  displayText: string;
  activeKeyChar: string | null;
  keyboardLang: 'th' | 'en';
  onToggleLang: () => void;
  onKeyTap: (char: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onSend: () => void;
  onClose: () => void;
}

export const QuickReplyModal: React.FC<QuickReplyModalProps> = ({
  notification,
  displayText,
  activeKeyChar,
  keyboardLang,
  onToggleLang,
  onKeyTap,
  onBackspace,
  onSpace,
  onSend,
  onClose,
}) => {
  if (!notification) return null;

  return (
    <div
      onClick={onClose}
      className="absolute inset-0 z-50 bg-black/60 backdrop-blur-2xl flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-200"
    >
      {/* Top Handle / Tap outside area */}
      <div className="pt-3 flex flex-col items-center">
        <div className="w-10 h-1 rounded-full bg-white/30 mb-2"></div>
      </div>

      {/* Focused Notification Card in iOS Quick Reply View */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="px-4 w-full max-w-sm mx-auto flex flex-col gap-3 my-auto"
      >
        {/* Floating Notification Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full bg-[rgba(32,32,36,0.85)] border border-white/20 rounded-[26px] p-4 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-2">
            {notification.avatarUrl ? (
              <div className="relative flex-shrink-0">
                <img
                  src={notification.avatarUrl}
                  alt=""
                  className="w-9 h-9 rounded-[22%] object-cover border border-white/20 shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 rounded-full p-[1px] bg-black">
                  <AppIcon appId={notification.appId} size={13} className="rounded-full" />
                </div>
              </div>
            ) : (
              <AppIcon appId={notification.appId} size={32} />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-white truncate block">
                  {notification.sender}
                </span>
                <span className="text-[11px] text-white/50">{notification.time}</span>
              </div>
              <span className="text-[10px] text-white/60 font-medium uppercase tracking-wider">
                {notification.appName}
              </span>
            </div>
          </div>

          <p className="text-[14px] text-white/90 leading-snug pl-1 font-normal">
            {notification.message}
          </p>

          {notification.imageAttachment && (
            <div className="mt-2 rounded-xl overflow-hidden border border-white/10 max-h-36">
              <img
                src={notification.imageAttachment}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </motion.div>

        {/* Authentic iOS Quick Reply Input Bar */}
        <div className="w-full bg-[#1c1c1e]/90 border border-white/15 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg">
          {/* iOS Camera / Attach button */}
          <button
            type="button"
            className="w-7 h-7 rounded-full bg-white/10 text-white/70 flex items-center justify-center flex-shrink-0"
          >
            <Camera size={15} />
          </button>

          {/* Message Text (Thai or English) */}
          <div className="flex-1 min-h-[24px] flex items-center px-1 text-[15px] font-normal">
            {displayText ? (
              <span className="text-white leading-tight break-words">{displayText}</span>
            ) : (
              <span className="text-white/40">iMessage</span>
            )}
            {/* Blinking iOS Cursor */}
            <span className="w-[2px] h-[18px] bg-blue-500 rounded-full ml-0.5 animate-pulse" />
          </div>

          {/* Authentic iOS Blue Circular Send Arrow */}
          <button
            type="button"
            onClick={onSend}
            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
              displayText.trim()
                ? 'bg-[#007AFF] text-white shadow-md active:scale-90'
                : 'bg-white/15 text-white/40'
            }`}
          >
            <ArrowUp size={16} strokeWidth={2.8} />
          </button>
        </div>
      </div>

      {/* Bottom: Real iOS Virtual Keyboard (Pinned to bottom of screen) */}
      <div onClick={(e) => e.stopPropagation()} className="w-full">
        <IOSKeyboard
          onKeyPress={onKeyTap}
          onBackspace={onBackspace}
          onSpace={onSpace}
          onSend={onSend}
          activeKeyChar={activeKeyChar}
          language={keyboardLang}
          onToggleLanguage={onToggleLang}
        />
      </div>
    </div>
  );
};
