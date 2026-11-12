import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationItem } from '../types';
import { AppIcon } from '../utils/appIcons';
import { soundManager } from '../utils/audio';

interface DynamicIslandProps {
  activeNotification: NotificationItem | null;
  onDismissNotification?: () => void;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({
  activeNotification,
  onDismissNotification,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayNotif, setDisplayNotif] = useState<NotificationItem | null>(null);

  useEffect(() => {
    if (activeNotification) {
      setDisplayNotif(activeNotification);
      setIsExpanded(true);

      const timer = setTimeout(() => {
        setIsExpanded(false);
        if (onDismissNotification) onDismissNotification();
      }, 4200);

      return () => clearTimeout(timer);
    }
  }, [activeNotification, onDismissNotification]);

  const handleToggle = () => {
    soundManager.playTapSound();
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="absolute top-[11px] left-1/2 -translate-x-1/2 z-50 flex items-center justify-center">
      <motion.div
        layout
        onClick={handleToggle}
        initial={{ width: 124, height: 35, borderRadius: 20 }}
        animate={
          isExpanded && displayNotif
            ? { width: 356, height: 68, borderRadius: 34 }
            : { width: 124, height: 35, borderRadius: 20 }
        }
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 28,
          mass: 0.8,
        }}
        className="bg-black text-white cursor-pointer select-none relative overflow-hidden shadow-2xl flex items-center justify-between px-3"
      >
        {/* Idle camera dot (always in physical display) */}
        {!isExpanded && (
          <div className="w-full h-full flex items-center justify-between px-2">
            {/* Left mic/sensor indicator dot */}
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900/60 border border-slate-800/40"></div>
            {/* Right front-facing camera lens */}
            <div className="w-3 h-3 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800/80">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-950/80"></div>
            </div>
          </div>
        )}

        {/* Expanded Notification State */}
        <AnimatePresence>
          {isExpanded && displayNotif && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.2 }}
              className="w-full flex items-center justify-between gap-3 px-1"
            >
              {/* App Icon */}
              <div className="flex-shrink-0">
                <AppIcon appId={displayNotif.appId} size={38} className="rounded-xl" />
              </div>

              {/* Message Details */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-white truncate">
                    {displayNotif.sender}
                  </span>
                  <span className="text-[10px] text-white/50 uppercase font-medium tracking-wider">
                    {displayNotif.appName}
                  </span>
                </div>
                <p className="text-[12px] text-white/80 truncate leading-snug">
                  {displayNotif.message}
                </p>
              </div>

              {/* Little wave or dot */}
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

