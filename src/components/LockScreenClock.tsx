import React, { useState, useEffect } from 'react';
import { Lock, Sun, Cloud, CloudRain, Snowflake, Activity, BatteryCharging } from 'lucide-react';
import { motion } from 'framer-motion';
import { ClockConfig, WidgetsConfig } from '../types';
import { soundManager } from '../utils/audio';

interface LockScreenClockProps {
  clockConfig: ClockConfig;
  widgetsConfig: WidgetsConfig;
  isUnlocked: boolean;
  onToggleUnlock: () => void;
  onEditClockClick?: () => void;
  onEditWidgetsClick?: () => void;
}

export const LockScreenClock: React.FC<LockScreenClockProps> = ({
  clockConfig,
  widgetsConfig,
  isUnlocked,
  onToggleUnlock,
  onEditClockClick,
  onEditWidgetsClick,
}) => {
  const [liveHours, setLiveHours] = useState('12');
  const [liveMins, setLiveMins] = useState('00');
  const [liveDate, setLiveDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setLiveHours(now.getHours().toString().padStart(2, '0'));
      setLiveMins(now.getMinutes().toString().padStart(2, '0'));
      setLiveDate(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const displayTime =
    clockConfig.mode === 'custom'
      ? clockConfig.customTime
      : `${liveHours}:${liveMins}`;

  const displayDate =
    clockConfig.mode === 'custom' && clockConfig.customDate
      ? clockConfig.customDate
      : liveDate;

  // Font styling selector
  let fontClass = 'font-sf font-extrabold tracking-[-0.04em]';
  if (clockConfig.fontStyle === 'sf-medium') fontClass = 'font-sf font-semibold tracking-[-0.02em]';
  if (clockConfig.fontStyle === 'sf-rounded') fontClass = 'font-sf font-black tracking-[-0.03em] rounded-numbers';
  if (clockConfig.fontStyle === 'serif') fontClass = 'font-serif font-bold italic tracking-tight';
  if (clockConfig.fontStyle === 'mono') fontClass = 'font-mono font-bold tracking-widest';

  const handleLockClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playLockSound();
    onToggleUnlock();
  };

  const renderWeatherIcon = () => {
    switch (widgetsConfig.weatherIcon) {
      case 'cloud':
        return <Cloud size={14} className="text-slate-300" />;
      case 'rain':
        return <CloudRain size={14} className="text-blue-300" />;
      case 'snow':
        return <Snowflake size={14} className="text-cyan-200" />;
      case 'sun':
      default:
        return <Sun size={14} className="text-amber-300" />;
    }
  };

  return (
    <div
      style={{ color: clockConfig.color }}
      className="w-full flex flex-col items-center pt-4 select-none z-30 transition-colors duration-300"
    >
      {/* Lock Icon */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleLockClick}
        className="mb-1 p-1 cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
        title="Tap to unlock / lock"
      >
        <motion.div
          animate={isUnlocked ? { y: -2, rotate: -15 } : { y: 0, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          <Lock size={19} strokeWidth={2.4} />
        </motion.div>
      </motion.button>

      {/* Date */}
      <div
        onClick={onEditClockClick}
        className="text-[17px] font-medium tracking-tight opacity-90 drop-shadow-md cursor-pointer"
        title="Click to customize date"
      >
        {displayDate}
      </div>

      {/* Giant Clock Numbers */}
      <div
        onClick={onEditClockClick}
        className={`text-[82px] leading-[0.92] drop-shadow-lg my-1 cursor-pointer ${fontClass}`}
        title="Click to edit Clock (Time, Font, Color)"
      >
        {displayTime}
      </div>

      {/* iOS Lock Screen Widgets Row */}
      <div
        onClick={onEditWidgetsClick}
        className="flex items-center gap-2 mt-2 px-3.5 py-1.5 rounded-2xl bg-black/25 hover:bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-xs font-medium shadow-sm cursor-pointer transition-all active:scale-98"
        title="Click to edit Widgets (Weather, Fitness, Battery)"
      >
        {/* Weather */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-white/15">
          {renderWeatherIcon()}
          <span>{widgetsConfig.weatherTemp} {widgetsConfig.weatherCity}</span>
        </div>

        {/* Fitness Rings */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-white/15">
          <Activity size={14} className="text-rose-400" />
          <span>{widgetsConfig.activityCalories}</span>
        </div>

        {/* Battery Device */}
        <div className="flex items-center gap-1.5">
          <BatteryCharging size={14} className="text-emerald-400" />
          <span>{widgetsConfig.batteryDeviceLevel}</span>
        </div>
      </div>
    </div>
  );
};
