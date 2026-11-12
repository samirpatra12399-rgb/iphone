import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Trash2, Send } from 'lucide-react';
import { NotificationItem } from '../types';
import { AppIcon } from '../utils/appIcons';
import { soundManager } from '../utils/audio';

interface NotificationCardProps {
  notification: NotificationItem;
  onDismiss: (id: string) => void;
  isStackedUnderneath?: boolean;
  stackIndex?: number;
  onStackClick?: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onDismiss,
  isStackedUnderneath = false,
  stackIndex = 0,
  onStackClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quickReplyText, setQuickReplyText] = useState('');
  const [isReplied, setIsReplied] = useState(false);

  const x = useMotionValue(0);

  // Background action buttons reveal opacity & transforms
  const clearButtonOpacity = useTransform(x, [-140, -40, 0], [1, 0.7, 0]);
  const clearButtonScale = useTransform(x, [-140, -60, 0], [1, 0.9, 0.5]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -110) {
      soundManager.playTrashSound();
      onDismiss(notification.id);
    } else if (info.offset.x > 90) {
      soundManager.playTapSound();
      setIsExpanded(true);
    }
  };

  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playTrashSound();
    onDismiss(notification.id);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickReplyText.trim()) return;
    soundManager.playAlert();
    setIsReplied(true);
    setTimeout(() => {
      setIsExpanded(false);
      onDismiss(notification.id);
    }, 1200);
  };

  const handleReplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuickReplyText(e.target.value);
    soundManager.playKeyboardClick();
  };

  // Stacked underneath layer
  if (isStackedUnderneath) {
    const scale = 1 - stackIndex * 0.05;
    const translateY = stackIndex * 10;
    const opacity = 1 - stackIndex * 0.22;

    return (
      <div
        onClick={onStackClick}
        style={{
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity,
          zIndex: 10 - stackIndex,
        }}
        className="w-full absolute top-0 left-0 bg-[rgba(32,32,36,0.72)] backdrop-blur-2xl border border-white/12 rounded-[24px] p-3.5 shadow-ios-card cursor-pointer pointer-events-none transition-all duration-300"
      >
        <div className="flex items-center gap-3 opacity-80">
          {notification.avatarUrl ? (
            <div className="relative flex-shrink-0">
              <img
                src={notification.avatarUrl}
                alt=""
                className="w-[36px] h-[36px] rounded-[22%] object-cover shadow-sm flex-shrink-0 border border-white/15"
              />
              <div className="absolute -bottom-1 -right-1 rounded-full p-[1px] bg-black shadow-sm">
                <AppIcon appId={notification.appId} size={13} className="rounded-full" />
              </div>
            </div>
          ) : (
            <AppIcon appId={notification.appId} size={36} />
          )}
          <div className="flex-1 truncate">
            <div className="text-[14px] font-semibold text-white truncate">
              {notification.sender}
            </div>
            <div className="text-[12px] text-white/70 truncate">
              {notification.message}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-[24px] mb-2.5">
      {/* Background Reveal Actions (Revealed when swiped left - authentic iOS style) */}
      <motion.div
        style={{ opacity: clearButtonOpacity }}
        className="absolute inset-y-0 right-0 flex items-center pr-1.5 z-0"
      >
        <div className="flex items-center gap-1.5">
          {/* Options button (authentic iOS grey) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              soundManager.playTapSound();
              setIsExpanded((prev) => !prev);
            }}
            className="w-[62px] h-[64px] rounded-[18px] bg-slate-700/80 backdrop-blur-md flex flex-col items-center justify-center text-white/90 text-[11px] font-medium shadow-md active:scale-95 transition-transform"
          >
            <span>Options</span>
          </button>

          {/* Clear button (authentic iOS red) */}
          <motion.button
            style={{ scale: clearButtonScale }}
            onClick={handleClearClick}
            className="w-[64px] h-[64px] rounded-[18px] bg-[#FF3B30] flex flex-col items-center justify-center text-white text-[11px] font-medium shadow-md active:scale-95 transition-transform"
          >
            <Trash2 size={17} />
            <span className="mt-0.5">Clear</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Foreground Draggable Card (100% Authentic iOS Appearance: Clean & Pristine) */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -145, right: 60 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        style={{ x }}
        onClick={() => {
          soundManager.playTapSound();
          setIsExpanded((prev) => !prev);
        }}
        className="relative z-10 w-full bg-[rgba(32,32,36,0.72)] hover:bg-[rgba(42,42,46,0.80)] backdrop-blur-2xl border border-white/15 rounded-[24px] p-3.5 shadow-ios-card cursor-pointer transition-colors select-none"
      >
        {/* Top Header Row: Icon/Avatar with App Badge, App Name, Time */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {notification.avatarUrl ? (
              <div className="relative flex-shrink-0">
                <img
                  src={notification.avatarUrl}
                  alt=""
                  className="w-[38px] h-[38px] rounded-[22%] object-cover shadow-sm border border-white/15"
                />
                <div className="absolute -bottom-1 -right-1 rounded-full p-[1px] bg-black/90 shadow-md">
                  <AppIcon appId={notification.appId} size={15} className="rounded-full" />
                </div>
              </div>
            ) : (
              <AppIcon appId={notification.appId} size={38} />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-white/60 tracking-wider uppercase">
                  {notification.appName}
                </span>
                <span className="text-[11px] text-white/40">•</span>
                <span className="text-[11px] text-white/60">{notification.time}</span>
              </div>
              <div className="text-[15px] font-semibold text-white tracking-tight truncate mt-[-1px]">
                {notification.sender}
              </div>
            </div>
          </div>
        </div>

        {/* Message Body */}
        <div className="mt-1 pl-[46px]">
          <p
            className={`text-[14px] text-white/90 leading-snug font-normal ${
              isExpanded ? '' : 'line-clamp-2'
            }`}
          >
            {notification.message}
          </p>

          {/* Optional Image Attachment */}
          {notification.imageAttachment && (
            <div className="mt-2.5 rounded-xl overflow-hidden border border-white/10 max-h-40">
              <img
                src={notification.imageAttachment}
                alt="Attachment"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Expandable Quick Reply Form */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="mt-3 pt-3 border-t border-white/10 pl-[46px]"
            >
              {isReplied ? (
                <div className="py-1 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                  <span>✓ Reply sent to {notification.sender}</span>
                </div>
              ) : (
                <form onSubmit={handleSendReply} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={quickReplyText}
                    onChange={handleReplyChange}
                    placeholder={`Reply to ${notification.sender}...`}
                    className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-xl text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors active:scale-95"
                  >
                    <span>Reply</span>
                    <Send size={11} />
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
