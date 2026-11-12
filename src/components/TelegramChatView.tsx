import React from 'react';
import { ChevronLeft, Phone, Video, Paperclip, Mic, ArrowUp } from 'lucide-react';
import { NotificationItem } from '../types';
import { IOSKeyboard } from './IOSKeyboard';

interface TelegramChatViewProps {
  notification: NotificationItem | null;
  displayText: string;
  activeKeyChar: string | null;
  keyboardLang: 'th' | 'en';
  sentReplies: string[];
  onToggleLang: () => void;
  onKeyTap: (char: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onSend: () => void;
  onClose: () => void;
}

export const TelegramChatView: React.FC<TelegramChatViewProps> = ({
  notification,
  displayText,
  activeKeyChar,
  keyboardLang,
  sentReplies,
  onToggleLang,
  onKeyTap,
  onBackspace,
  onSpace,
  onSend,
  onClose,
}) => {
  if (!notification) return null;

  return (
    <div className="absolute inset-0 z-50 bg-[#0e1621] flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-200">
      {/* Telegram Chat Header */}
      <div className="pt-3 px-3 pb-2 bg-[#17212b] border-b border-white/10 flex items-center justify-between text-white z-10">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center text-blue-400 hover:text-blue-300 font-medium text-sm -ml-1 pr-1 active:scale-95"
          >
            <ChevronLeft size={22} />
            <span className="hidden xs:inline">Chats</span>
          </button>

          {/* Contact Avatar & Online Info */}
          {notification.avatarUrl ? (
            <img
              src={notification.avatarUrl}
              alt=""
              className="w-9 h-9 rounded-full object-cover border border-white/20 shadow-sm"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm">
              {notification.sender.charAt(0)}
            </div>
          )}

          <div className="min-w-0">
            <h4 className="text-[14px] font-semibold text-white leading-tight truncate">
              {notification.sender}
            </h4>
            <span className="text-[11px] text-[#229ED9] font-medium leading-none block">
              online
            </span>
          </div>
        </div>

        {/* Telegram Call & Video Icons */}
        <div className="flex items-center gap-3 text-white/70 pr-1">
          <button type="button" className="p-1 hover:text-white">
            <Phone size={18} />
          </button>
          <button type="button" className="p-1 hover:text-white">
            <Video size={19} />
          </button>
        </div>
      </div>

      {/* Telegram Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 bg-[radial-gradient(#182533_1px,transparent_1px)] [background-size:16px_16px]">
        {/* Incoming Telegram Message */}
        <div className="self-start max-w-[80%] bg-[#182533] border border-white/5 rounded-2xl rounded-tl-sm p-3 text-white shadow-md">
          <p className="text-[14px] leading-relaxed">{notification.message}</p>
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="text-[10px] text-white/40">{notification.time}</span>
          </div>
        </div>

        {/* Sent Replies by User */}
        {sentReplies.map((reply, i) => (
          <div
            key={i}
            className="self-end max-w-[80%] bg-[#2b5278] rounded-2xl rounded-tr-sm p-3 text-white shadow-md animate-in slide-in-from-bottom-2 duration-200"
          >
            <p className="text-[14px] leading-relaxed text-amber-100 font-medium">{reply}</p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-[10px] text-white/50">now</span>
              <span className="text-[10px] text-blue-300">✓✓</span>
            </div>
          </div>
        ))}
      </div>

      {/* Telegram Bottom Input Bar */}
      <div className="bg-[#17212b] border-t border-white/10 p-2 flex items-center gap-2">
        <button type="button" className="p-1.5 text-white/50 hover:text-white">
          <Paperclip size={18} />
        </button>

        {/* Text Input with Cursor */}
        <div className="flex-1 bg-[#242f3d] rounded-2xl px-3 py-1.5 min-h-[36px] flex items-center text-[14px] text-white">
          {displayText ? (
            <span className="text-white break-words">{displayText}</span>
          ) : (
            <span className="text-white/40">Message</span>
          )}
          <span className="w-[2px] h-[16px] bg-[#229ED9] rounded-full ml-0.5 animate-pulse" />
        </div>

        {displayText.trim() ? (
          <button
            type="button"
            onClick={onSend}
            className="w-8 h-8 rounded-full bg-[#229ED9] hover:bg-blue-500 text-white flex items-center justify-center active:scale-90 transition-all shadow-md flex-shrink-0"
          >
            <ArrowUp size={16} strokeWidth={2.8} />
          </button>
        ) : (
          <button type="button" className="p-1.5 text-white/50 hover:text-white">
            <Mic size={18} />
          </button>
        )}
      </div>

      {/* Real iOS Virtual Keyboard */}
      <div className="w-full">
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

