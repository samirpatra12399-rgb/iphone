import React, { useState, useEffect } from 'react';
import { Wifi, Zap } from 'lucide-react';
import { StatusBarConfig } from '../types';

interface StatusBarProps {
  config: StatusBarConfig;
  currentTimeStr?: string;
  color?: string;
  onEditClick?: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  config,
  currentTimeStr,
  color = '#ffffff',
  onEditClick,
}) => {
  const [liveTime, setLiveTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setLiveTime(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const displayTime = currentTimeStr || liveTime;

  // Determine battery color
  let batteryFillColor = 'bg-current';
  if (config.isCharging) {
    batteryFillColor = 'bg-emerald-400';
  } else if (config.batteryLevel <= 20) {
    batteryFillColor = 'bg-red-500';
  } else if (config.batteryLevel <= 30) {
    batteryFillColor = 'bg-amber-400';
  }

  return (
    <div
      onClick={onEditClick}
      style={{ color }}
      className="w-full flex items-center justify-between px-7 pt-3 pb-1 select-none text-[14px] font-semibold tracking-tight z-40 relative group cursor-pointer"
      title="Click to edit Status Bar (Carrier, Battery, Signal, 5G)"
    >
      {/* Left: Time or Carrier */}
      <div className="flex items-center gap-1.5 pl-1">
        <span>{displayTime}</span>
        {config.carrierName && (
          <span className="text-[11px] font-medium opacity-70 ml-1">
            {config.carrierName}
          </span>
        )}
      </div>

      {/* Right: Signal, Network, Wi-Fi, Battery */}
      <div className="flex items-center gap-2 pr-1">
        {/* Cellular Signal Bars (1 to 4) */}
        <div className="flex items-end gap-[2px] h-[11px]" title={`Signal: ${config.signalBars}/4`}>
          <div className={`w-[3px] h-[4px] rounded-[0.5px] ${config.signalBars >= 1 ? 'bg-current' : 'opacity-25 bg-current'}`}></div>
          <div className={`w-[3px] h-[6px] rounded-[0.5px] ${config.signalBars >= 2 ? 'bg-current' : 'opacity-25 bg-current'}`}></div>
          <div className={`w-[3px] h-[9px] rounded-[0.5px] ${config.signalBars >= 3 ? 'bg-current' : 'opacity-25 bg-current'}`}></div>
          <div className={`w-[3px] h-[11px] rounded-[0.5px] ${config.signalBars >= 4 ? 'bg-current' : 'opacity-25 bg-current'}`}></div>
        </div>

        {/* Network Badge (5G / LTE / 4G) */}
        {config.networkType && (
          <span className="text-[11px] font-bold tracking-tight opacity-95">
            {config.networkType}
          </span>
        )}

        {/* Wi-Fi Icon */}
        {config.showWifi && (
          <Wifi size={14} strokeWidth={2.5} className="opacity-95" />
        )}

        {/* Battery Container */}
        <div className="flex items-center gap-[2px]" title={`Battery: ${config.batteryLevel}%`}>
          {/* Percentage text */}
          <span className="text-[11px] font-bold mr-0.5 opacity-90">
            {config.batteryLevel}%
          </span>

          <div className="relative w-[23px] h-[12px] rounded-[4px] border border-current p-[1.5px] flex items-center">
            {/* Battery fill */}
            <div
              style={{ width: `${Math.min(100, Math.max(8, config.batteryLevel))}%` }}
              className={`h-full rounded-[2px] transition-all duration-300 ${batteryFillColor} flex items-center justify-center`}
            >
              {config.isCharging && (
                <Zap size={9} className="text-black fill-black" />
              )}
            </div>
          </div>
          {/* Battery tip */}
          <div className="w-[1.5px] h-[4.5px] bg-current rounded-r-[1px] opacity-80"></div>
        </div>
      </div>
    </div>
  );
};
