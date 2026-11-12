import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers } from 'lucide-react';
import { NotificationItem } from '../types';
import { NotificationCard } from './NotificationCard';
import { soundManager } from '../utils/audio';

interface NotificationStackProps {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationStack: React.FC<NotificationStackProps> = ({
  notifications,
  onDismiss,
  onClearAll,
}) => {
  const [isStackExpanded, setIsStackExpanded] = useState(false);
  const [isConfirmClear, setIsConfirmClear] = useState(false);

  const handleClearAllClick = () => {
    if (!isConfirmClear) {
      soundManager.playTapSound();
      setIsConfirmClear(true);
      setTimeout(() => setIsConfirmClear(false), 3000);
    } else {
      soundManager.playTrashSound();
      onClearAll();
      setIsConfirmClear(false);
    }
  };

  const toggleStack = () => {
    soundManager.playTapSound();
    setIsStackExpanded((prev) => !prev);
  };

  if (notifications.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-14 text-white/40 select-none">
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
          <Layers size={22} className="opacity-30" />
        </div>
        <p className="text-[14px] font-medium tracking-tight">No Older Notifications</p>
      </div>
    );
  }

  const isStackedView = !isStackExpanded && notifications.length > 1;

  return (
    <div className="w-full px-4 select-none pb-24">
      {/* Authentic iOS Notification Center Header */}
      <div className="flex items-center justify-between px-1 mb-2.5 text-white/70">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold tracking-tight text-white/80">
            Notification Center
          </span>
          {notifications.length > 1 && (
            <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/60 font-medium">
              {notifications.length}
            </span>
          )}
        </div>

        {/* Authentic iOS Circular Clear (✕) Button */}
        <button
          onClick={handleClearAllClick}
          className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 transition-all ${
            isConfirmClear
              ? 'bg-red-500 text-white font-semibold'
              : 'bg-white/15 hover:bg-white/25 text-white/80'
          }`}
          title="Clear Notifications"
        >
          {isConfirmClear ? <span>Clear</span> : <X size={12} strokeWidth={2.4} />}
        </button>
      </div>

      {/* Notifications List / Stack */}
      {isStackedView ? (
        <div className="relative cursor-pointer" onClick={toggleStack}>
          {notifications.slice(1, 3).map((notif, idx) => (
            <NotificationCard
              key={notif.id}
              notification={notif}
              onDismiss={onDismiss}
              isStackedUnderneath={true}
              stackIndex={idx + 1}
              onStackClick={toggleStack}
            />
          ))}

          <div className="relative z-20">
            <NotificationCard
              notification={notifications[0]}
              onDismiss={onDismiss}
            />
          </div>

          {notifications.length > 1 && (
            <div className="text-center mt-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-semibold text-white/70 border border-white/10 shadow-sm hover:bg-black/60 transition-colors">
                <span>{notifications.length - 1} more notifications</span>
                <span className="text-[9px] opacity-70">(Tap to expand)</span>
              </span>
            </div>
          )}
        </div>
      ) : (
        <AnimatePresence>
          <div className="flex flex-col gap-0.5">
            {notifications.map((notif) => (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, y: -15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, height: 0, marginBottom: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                }}
              >
                <NotificationCard
                  notification={notif}
                  onDismiss={onDismiss}
                />
              </motion.div>
            ))}

            {isStackExpanded && notifications.length > 1 && (
              <div className="text-center mt-2">
                <button
                  onClick={toggleStack}
                  className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-semibold text-white/60 border border-white/10 hover:text-white transition-colors"
                >
                  Show Less
                </button>
              </div>
            )}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};
