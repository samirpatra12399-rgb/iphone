import React, { useState, useEffect } from 'react';
import { X, Check, Trash2 } from 'lucide-react';
import {
  NotificationItem,
  StatusBarConfig,
  ClockConfig,
  WidgetsConfig,
  AppId,
} from '../types';
import { APP_METADATA } from '../utils/appIcons';
import { soundManager } from '../utils/audio';
import { AvatarPicker } from './AvatarPicker';
import { translateEnglishToThai } from '../utils/translator';

export type EditModalType =
  | { type: 'notification'; data: NotificationItem }
  | { type: 'clock'; data: ClockConfig }
  | { type: 'statusbar'; data: StatusBarConfig }
  | { type: 'widgets'; data: WidgetsConfig };

interface EditModalProps {
  modal: EditModalType | null;
  onClose: () => void;
  onSaveNotification: (notif: NotificationItem) => void;
  onDeleteNotification: (id: string) => void;
  onSaveClock: (cfg: ClockConfig) => void;
  onSaveStatusBar: (cfg: StatusBarConfig) => void;
  onSaveWidgets: (cfg: WidgetsConfig) => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  modal,
  onClose,
  onSaveNotification,
  onDeleteNotification,
  onSaveClock,
  onSaveStatusBar,
  onSaveWidgets,
}) => {
  if (!modal) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#18181f] border border-white/15 rounded-[28px] p-6 shadow-2xl text-white relative animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playTapSound();
            onClose();
          }}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        {modal.type === 'notification' && (
          <NotificationEditor
            initial={modal.data}
            onSave={(item) => {
              onSaveNotification(item);
              onClose();
            }}
            onDelete={(id) => {
              onDeleteNotification(id);
              onClose();
            }}
          />
        )}

        {modal.type === 'clock' && (
          <ClockEditor
            initial={modal.data}
            onSave={(cfg) => {
              onSaveClock(cfg);
              onClose();
            }}
          />
        )}

        {modal.type === 'statusbar' && (
          <StatusBarEditor
            initial={modal.data}
            onSave={(cfg) => {
              onSaveStatusBar(cfg);
              onClose();
            }}
          />
        )}

        {modal.type === 'widgets' && (
          <WidgetsEditor
            initial={modal.data}
            onSave={(cfg) => {
              onSaveWidgets(cfg);
              onClose();
            }}
          />
        )}
      </div>
    </div>
  );
};

// ========================================================
// 1. Notification Editor
// ========================================================
const NotificationEditor: React.FC<{
  initial: NotificationItem;
  onSave: (notif: NotificationItem) => void;
  onDelete: (id: string) => void;
}> = ({ initial, onSave, onDelete }) => {
  const [appId, setAppId] = useState<AppId>(initial.appId);
  const [sender, setSender] = useState(initial.sender);
  const [message, setMessage] = useState(initial.message);
  const [time, setTime] = useState(initial.time);
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl || '');
  const [imageAttachment, setImageAttachment] = useState(initial.imageAttachment || '');
  const [autoTranslateThai, setAutoTranslateThai] = useState(true);
  const [thaiTranslation, setThaiTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // Debounced translation hook
  useEffect(() => {
    if (!message.trim()) {
      setThaiTranslation('');
      return;
    }
    setIsTranslating(true);
    const timer = setTimeout(async () => {
      const result = await translateEnglishToThai(message);
      setThaiTranslation(result);
      setIsTranslating(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [message]);

  const handleSave = () => {
    soundManager.playAlert();
    const finalMessage = autoTranslateThai && thaiTranslation.trim() ? thaiTranslation : message.trim();
    onSave({
      ...initial,
      appId,
      appName: APP_METADATA[appId]?.name || 'APP',
      sender: sender.trim() || 'Sender',
      message: finalMessage,
      time: time.trim() || 'now',
      avatarUrl: avatarUrl.trim() || undefined,
      imageAttachment: imageAttachment.trim() || undefined,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold">Edit Notification</h3>

      {/* App Choice */}
      <div>
        <label className="text-xs text-white/60 block mb-1.5 font-medium">Select App</label>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {(Object.keys(APP_METADATA) as AppId[]).map((app) => (
            <button
              key={app}
              type="button"
              onClick={() => {
                setAppId(app);
                soundManager.playTapSound();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                appId === app
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              {APP_METADATA[app].name}
            </button>
          ))}
        </div>
      </div>

      {/* Sender & Time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-white/60 block mb-1 font-medium">Sender Name</label>
          <input
            type="text"
            value={sender}
            onChange={(e) => {
              setSender(e.target.value);
              soundManager.playKeyboardClick();
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-xs text-white/60 block mb-1 font-medium">Timestamp</label>
          <input
            type="text"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              soundManager.playKeyboardClick();
            }}
            placeholder="e.g. now, 5m ago"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Message with Auto-Translate */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-white/60 font-medium">
            Message Text {autoTranslateThai ? '(Type in English → Auto Thai 🇹🇭)' : ''}
          </label>
          <div className="flex items-center gap-2">
            {isTranslating && (
              <span className="text-[10px] text-amber-400 font-bold animate-pulse">
                Translating...
              </span>
            )}
            <button
              type="button"
              onClick={() => setAutoTranslateThai(!autoTranslateThai)}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                autoTranslateThai
                  ? 'bg-amber-400/20 border-amber-400/40 text-amber-300'
                  : 'bg-white/5 border-white/10 text-white/40'
              }`}
            >
              🇹🇭 Thai Auto-Translate: {autoTranslateThai ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            soundManager.playKeyboardClick();
          }}
          placeholder="Type message in English..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
        />

        {/* Live Thai Translation Preview */}
        {autoTranslateThai && thaiTranslation && (
          <div className="mt-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-400 block">
                🇹🇭 Thai Translation (Saved to Phone):
              </span>
              <p className="text-xs font-semibold text-amber-200 mt-0.5 leading-snug">
                {thaiTranslation}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setMessage(thaiTranslation);
                soundManager.playTapSound();
              }}
              className="text-[9px] font-bold px-2 py-0.5 bg-amber-400/25 hover:bg-amber-400/35 text-amber-300 rounded-md whitespace-nowrap flex-shrink-0"
            >
              Use Thai Text
            </button>
          </div>
        )}
      </div>

      {/* 30 Realistic Profile Photos Gallery */}
      <div>
        <label className="text-xs text-white/60 block mb-1 font-medium">
          Choose Profile Image (30 Real Avatars or Upload)
        </label>
        <AvatarPicker
          selectedUrl={avatarUrl}
          onSelectAvatar={(url, suggestedName) => {
            setAvatarUrl(url);
            if (suggestedName && (!sender || sender === 'Sender' || sender === 'New Contact')) {
              setSender(suggestedName);
            }
          }}
        />
      </div>

      {/* Optional Image Attachment */}
      <div>
        <label className="text-xs text-white/60 block mb-1 font-medium">Image Attachment URL (Optional)</label>
        <input
          type="text"
          value={imageAttachment}
          onChange={(e) => setImageAttachment(e.target.value)}
          placeholder="https://... (attachment photo)"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-1">
        <button
          type="button"
          onClick={() => onDelete(initial.id)}
          className="px-4 py-2 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Trash2 size={13} />
          <span>Delete</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
        >
          <Check size={14} />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};

// ========================================================
// 2. Clock & Date Editor
// ========================================================
const ClockEditor: React.FC<{
  initial: ClockConfig;
  onSave: (cfg: ClockConfig) => void;
}> = ({ initial, onSave }) => {
  const [mode, setMode] = useState<'live' | 'custom'>(initial.mode);
  const [customTime, setCustomTime] = useState(initial.customTime || '09:41');
  const [customDate, setCustomDate] = useState(initial.customDate || 'Thursday, 12 November');
  const [fontStyle, setFontStyle] = useState(initial.fontStyle);
  const [color, setColor] = useState(initial.color);

  const colors = ['#ffffff', '#fde047', '#93c5fd', '#f472b6', '#a7f3d0', '#fed7aa', '#e2e8f0'];

  const handleSave = () => {
    soundManager.playTapSound();
    onSave({
      mode,
      customTime,
      customDate,
      fontStyle,
      color,
      size: initial.size,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold">Customize Clock & Date</h3>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-xl border border-white/10">
        <button
          type="button"
          onClick={() => {
            setMode('live');
            soundManager.playTapSound();
          }}
          className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'live' ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-white'
          }`}
        >
          Live Current Time
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('custom');
            soundManager.playTapSound();
          }}
          className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'custom' ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-white'
          }`}
        >
          Custom Time (09:41)
        </button>
      </div>

      {mode === 'custom' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-white/60 block mb-1 font-medium">Time (HH:MM)</label>
            <input
              type="text"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              placeholder="09:41"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
            />
          </div>
          <div>
            <label className="text-xs text-white/60 block mb-1 font-medium">Date Text</label>
            <input
              type="text"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              placeholder="Thursday, 12 November"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* Font Family / Thickness */}
      <div>
        <label className="text-xs text-white/60 block mb-1.5 font-medium">Typography Style</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'sf-bold', label: 'SF Bold' },
            { id: 'sf-medium', label: 'SF Clean' },
            { id: 'sf-rounded', label: 'SF Heavy' },
            { id: 'serif', label: 'Serif Chic' },
            { id: 'mono', label: 'Digital' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setFontStyle(f.id as ClockConfig['fontStyle']);
                soundManager.playTapSound();
              }}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                fontStyle === f.id
                  ? 'bg-blue-600/30 border-blue-500 text-white'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color Palette */}
      <div>
        <label className="text-xs text-white/60 block mb-1.5 font-medium">Clock Color</label>
        <div className="flex items-center gap-2">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setColor(c);
                soundManager.playTapSound();
              }}
              style={{ backgroundColor: c }}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                color === c ? 'border-blue-500 scale-110 shadow-md' : 'border-transparent'
              }`}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-0"
            title="Custom Color"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="mt-2 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
      >
        <Check size={14} />
        <span>Apply Clock Changes</span>
      </button>
    </div>
  );
};

// ========================================================
// 3. Status Bar Editor
// ========================================================
const StatusBarEditor: React.FC<{
  initial: StatusBarConfig;
  onSave: (cfg: StatusBarConfig) => void;
}> = ({ initial, onSave }) => {
  const [carrierName, setCarrierName] = useState(initial.carrierName);
  const [batteryLevel, setBatteryLevel] = useState(initial.batteryLevel);
  const [isCharging, setIsCharging] = useState(initial.isCharging);
  const [signalBars, setSignalBars] = useState(initial.signalBars);
  const [networkType, setNetworkType] = useState(initial.networkType);
  const [showWifi, setShowWifi] = useState(initial.showWifi);

  const handleSave = () => {
    soundManager.playTapSound();
    onSave({
      carrierName,
      batteryLevel,
      isCharging,
      signalBars,
      networkType,
      showWifi,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold">Edit Status Bar</h3>

      {/* Carrier Name */}
      <div>
        <label className="text-xs text-white/60 block mb-1 font-medium">Carrier Name</label>
        <input
          type="text"
          value={carrierName}
          onChange={(e) => setCarrierName(e.target.value)}
          placeholder="e.g. Jio 5G, Airtel, Samir's Phone"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Battery Percentage Slider & Charging Toggle */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-white/60 font-medium">Battery Level ({batteryLevel}%)</label>
          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-emerald-400">
            <input
              type="checkbox"
              checked={isCharging}
              onChange={(e) => setIsCharging(e.target.checked)}
              className="rounded"
            />
            <span>Charging ⚡</span>
          </label>
        </div>
        <input
          type="range"
          min={1}
          max={100}
          value={batteryLevel}
          onChange={(e) => setBatteryLevel(Number(e.target.value))}
          className="w-full accent-blue-500 cursor-pointer"
        />
      </div>

      {/* Cellular Signal Strength */}
      <div>
        <label className="text-xs text-white/60 block mb-1 font-medium">Signal Bars (1 to 4)</label>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((bars) => (
            <button
              key={bars}
              type="button"
              onClick={() => {
                setSignalBars(bars);
                soundManager.playTapSound();
              }}
              className={`py-1.5 rounded-xl border text-xs font-bold transition-all ${
                signalBars === bars
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {bars} Bars
            </button>
          ))}
        </div>
      </div>

      {/* Network Type */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-white/60 block mb-1 font-medium">Network Badge</label>
          <select
            value={networkType}
            onChange={(e) => setNetworkType(e.target.value as StatusBarConfig['networkType'])}
            className="w-full bg-[#1f1f28] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="5G">5G</option>
            <option value="LTE">LTE</option>
            <option value="4G">4G</option>
            <option value="">None</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-white/60 block mb-1 font-medium">Wi-Fi Icon</label>
          <button
            type="button"
            onClick={() => {
              setShowWifi(!showWifi);
              soundManager.playTapSound();
            }}
            className={`w-full py-2 rounded-xl border text-xs font-semibold transition-all ${
              showWifi
                ? 'bg-blue-600/30 border-blue-500 text-white'
                : 'bg-white/5 border-white/10 text-white/60'
            }`}
          >
            {showWifi ? 'Wi-Fi: ON' : 'Wi-Fi: OFF'}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="mt-2 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
      >
        <Check size={14} />
        <span>Save Status Bar</span>
      </button>
    </div>
  );
};

// ========================================================
// 4. Widgets Editor
// ========================================================
const WidgetsEditor: React.FC<{
  initial: WidgetsConfig;
  onSave: (cfg: WidgetsConfig) => void;
}> = ({ initial, onSave }) => {
  const [weatherCity, setWeatherCity] = useState(initial.weatherCity);
  const [weatherTemp, setWeatherTemp] = useState(initial.weatherTemp);
  const [weatherIcon, setWeatherIcon] = useState(initial.weatherIcon);
  const [activityCalories, setActivityCalories] = useState(initial.activityCalories);
  const [batteryDeviceLevel, setBatteryDeviceLevel] = useState(initial.batteryDeviceLevel);

  const handleSave = () => {
    soundManager.playTapSound();
    onSave({
      weatherCity,
      weatherTemp,
      weatherIcon,
      activityCalories,
      batteryDeviceName: initial.batteryDeviceName,
      batteryDeviceLevel,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold">Edit Lock Screen Widgets</h3>

      {/* Weather Widget */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-white/60 block mb-1 font-medium">City / Condition</label>
          <input
            type="text"
            value={weatherCity}
            onChange={(e) => setWeatherCity(e.target.value)}
            placeholder="Sunny, Delhi, London"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-xs text-white/60 block mb-1 font-medium">Temperature</label>
          <input
            type="text"
            value={weatherTemp}
            onChange={(e) => setWeatherTemp(e.target.value)}
            placeholder="28°"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Weather Icon */}
      <div>
        <label className="text-xs text-white/60 block mb-1 font-medium">Weather Condition Icon</label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'sun', label: 'Sunny ☀️' },
            { id: 'cloud', label: 'Cloudy ☁️' },
            { id: 'rain', label: 'Rain 🌧️' },
            { id: 'snow', label: 'Snow ❄️' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setWeatherIcon(item.id as WidgetsConfig['weatherIcon']);
                soundManager.playTapSound();
              }}
              className={`py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                weatherIcon === item.id
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fitness & Battery Widget */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-white/60 block mb-1 font-medium">Activity Ring Text</label>
          <input
            type="text"
            value={activityCalories}
            onChange={(e) => setActivityCalories(e.target.value)}
            placeholder="540 / 600 kcal"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-xs text-white/60 block mb-1 font-medium">Battery Widget Text</label>
          <input
            type="text"
            value={batteryDeviceLevel}
            onChange={(e) => setBatteryDeviceLevel(e.target.value)}
            placeholder="AirPods 95%"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="mt-2 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
      >
        <Check size={14} />
        <span>Save Widgets</span>
      </button>
    </div>
  );
};
