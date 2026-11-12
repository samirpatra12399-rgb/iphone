import React, { useState, useEffect } from 'react';
import {
  Bell,
  Sparkles,
  Smartphone,
  Maximize2,
  Volume2,
  VolumeX,
  Trash2,
  Zap,
  Clock,
  Play,
  Sliders,
  Upload,
  Edit2,
  Copy,
  Plus,
  Languages,
} from 'lucide-react';
import { AppId, NotificationItem, Wallpaper, AlertTone } from '../types';
import { APP_METADATA, AppIcon } from '../utils/appIcons';
import { PRESET_NOTIFICATIONS } from '../utils/sampleData';
import { WALLPAPERS } from '../utils/wallpapers';
import { soundManager } from '../utils/audio';
import { AvatarPicker } from './AvatarPicker';
import { BEST_AVATAR } from '../utils/avatars';
import { translateEnglishToThai } from '../utils/translator';

// 4 Realistic Full-Conversation Automation Presets
const AUTO_CONVERSATION_PRESETS = [
  {
    label: '📁 Design Files',
    incomingEn: 'Hey! Are the project design files ready?',
    replyEn: 'Yes! Sent you all the files on Telegram now.',
  },
  {
    label: '📍 Location / ETA',
    incomingEn: 'Where are you right now? We are waiting!',
    replyEn: 'On my way! Will be there in 5 minutes.',
  },
  {
    label: '🍽️ Dinner',
    incomingEn: 'Dinner is ready! Did you eat already?',
    replyEn: 'Coming right now, smells delicious!',
  },
  {
    label: '📞 Urgent Call',
    incomingEn: 'Please call me as soon as you are free!',
    replyEn: 'Calling you right now!',
  },
];

interface ControlPanelProps {
  notifications: NotificationItem[];
  onAddNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp'>) => void;
  onEditNotification: (notif: NotificationItem) => void;
  onDuplicateNotification: (notif: NotificationItem) => void;
  onDeleteNotification: (id: string) => void;
  onAddNewNotification: () => void;
  onClearAll: () => void;
  currentWallpaper: Wallpaper;
  onSelectWallpaper: (wp: Wallpaper) => void;
  onCustomWallpaperUpload: (url: string) => void;
  isFrameMode: boolean;
  onToggleFrameMode: () => void;
  onOpenEditClock: () => void;
  onOpenEditStatusBar: () => void;
  onOpenEditWidgets: () => void;
  typingCountdown?: number | null;
  onStartTypingSimulation?: (
    targetNotif: NotificationItem,
    thaiText: string,
    viewType: 'quick-reply' | 'telegram-chat',
    delaySeconds: number
  ) => void;
  onRunFullAutomation?: (params: {
    incomingData: Omit<NotificationItem, 'id' | 'timestamp'>;
    replyThaiText: string;
    viewType: 'quick-reply' | 'telegram-chat';
    countdownDelay: number;
    readingDelaySeconds?: number;
  }) => void;
  onCancelTypingSimulation?: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  notifications,
  onAddNotification,
  onEditNotification,
  onDuplicateNotification,
  onDeleteNotification,
  onAddNewNotification,
  onClearAll,
  currentWallpaper,
  onSelectWallpaper,
  onCustomWallpaperUpload,
  isFrameMode,
  onToggleFrameMode,
  onOpenEditClock,
  onOpenEditStatusBar,
  onOpenEditWidgets,
  typingCountdown = null,
  onStartTypingSimulation,
  onRunFullAutomation,
  onCancelTypingSimulation,
}) => {
  // Telegram is first and default
  const [selectedApp, setSelectedApp] = useState<AppId>('telegram');
  const [sender, setSender] = useState('Ananya ✨');
  const [message, setMessage] = useState('Hey! Did you check out the new design files?');
  const [imageUrl, setImageUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(BEST_AVATAR.url);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedTone, setSelectedTone] = useState<AlertTone>('tri-tone');
  const [volume, setVolume] = useState(85);
  const [scheduledSeconds, setScheduledSeconds] = useState<number | null>(null);
  const [customWallpaperInput, setCustomWallpaperInput] = useState('');

  // Auto-Translation to Thai States ("whatever i will type in english it will automatically convert to thai language")
  const [autoTranslateThai, setAutoTranslateThai] = useState(true);
  const [thaiTranslation, setThaiTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // Separate Thai Reply & Virtual Keyboard Simulator state
  const [replyTargetId, setReplyTargetId] = useState<string>(notifications[0]?.id || '');
  const [replyTextEnglish, setReplyTextEnglish] = useState('On my way, see you soon!');
  const [replyTextThai, setReplyTextThai] = useState('กำลังเดินทางไป แล้วเจอกันเร็วๆ นี้ครับ!');
  const [isReplyTranslating, setIsReplyTranslating] = useState(false);
  const [replyViewType, setReplyViewType] = useState<'quick-reply' | 'telegram-chat'>('quick-reply');

  useEffect(() => {
    if (!replyTargetId && notifications.length > 0) {
      setReplyTargetId(notifications[0].id);
    }
  }, [notifications, replyTargetId]);

  // Debounced translation for reply simulator text
  useEffect(() => {
    if (!replyTextEnglish.trim()) {
      setReplyTextThai('');
      return;
    }
    setIsReplyTranslating(true);
    const timer = setTimeout(async () => {
      const res = await translateEnglishToThai(replyTextEnglish);
      setReplyTextThai(res);
      setIsReplyTranslating(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [replyTextEnglish]);

  const handleTriggerTyping = (delay: number) => {
    if (!onStartTypingSimulation) return;
    const target = notifications.find((n) => n.id === replyTargetId) || notifications[0];
    if (!target) return;
    const finalThai = replyTextThai.trim() || 'สวัสดีครับ ขอบคุณมากครับ';
    onStartTypingSimulation(target, finalThai, replyViewType, delay);
  };

  // Full Conversation Automation (Incoming Message -> Pause -> Automated Thai Reply)
  const handleTriggerFullAutomation = (delaySeconds: number) => {
    if (!onRunFullAutomation) return;
    const finalIncomingMsg = autoTranslateThai && thaiTranslation.trim() ? thaiTranslation : message;
    const finalReplyThai = replyTextThai.trim() || 'ใช่แล้วครับ ขอบคุณมากครับ';

    onRunFullAutomation({
      incomingData: {
        appId: selectedApp,
        appName: APP_METADATA[selectedApp].name,
        sender: sender || APP_METADATA[selectedApp].defaultSender,
        message: finalIncomingMsg,
        imageAttachment: imageUrl ? imageUrl : undefined,
        avatarUrl: avatarUrl ? avatarUrl : undefined,
        time: 'now',
      },
      replyThaiText: finalReplyThai,
      viewType: replyViewType,
      countdownDelay: delaySeconds,
      readingDelaySeconds: 2.2,
    });
  };

  const handleApplyConversationPreset = (preset: typeof AUTO_CONVERSATION_PRESETS[0]) => {
    soundManager.playTapSound();
    setMessage(preset.incomingEn);
    setReplyTextEnglish(preset.replyEn);
  };

  // Real-time debounced English -> Thai translation
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

  const handleAppChange = (app: AppId) => {
    setSelectedApp(app);
    setSender(APP_METADATA[app].defaultSender);
    soundManager.playTapSound();
  };

  // Send Notification (supports immediate or 10s countdown delay)
  const handleSendCustom = (delay: number = 0) => {
    if (!message.trim()) return;

    // Use Thai translation if auto-translate is active, otherwise raw message
    const messageToSend = autoTranslateThai && thaiTranslation.trim() ? thaiTranslation : message;

    if (delay > 0) {
      soundManager.playTapSound();
      setScheduledSeconds(delay);
      let remaining = delay;
      const interval = setInterval(() => {
        remaining -= 1;
        setScheduledSeconds(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          setScheduledSeconds(null);
          onAddNotification({
            appId: selectedApp,
            appName: APP_METADATA[selectedApp].name,
            sender: sender || APP_METADATA[selectedApp].defaultSender,
            message: messageToSend,
            imageAttachment: imageUrl ? imageUrl : undefined,
            avatarUrl: avatarUrl ? avatarUrl : undefined,
            time: 'now',
          });
        }
      }, 1000);
    } else {
      onAddNotification({
        appId: selectedApp,
        appName: APP_METADATA[selectedApp].name,
        sender: sender || APP_METADATA[selectedApp].defaultSender,
        message: messageToSend,
        imageAttachment: imageUrl ? imageUrl : undefined,
        avatarUrl: avatarUrl ? avatarUrl : undefined,
        time: 'now',
      });
    }
  };

  const handleTriggerPreset = (preset: typeof PRESET_NOTIFICATIONS[0]) => {
    onAddNotification(preset.notif);
  };

  const handleSpamBomb = () => {
    soundManager.playTapSound();
    PRESET_NOTIFICATIONS.slice(0, 4).forEach((preset, index) => {
      setTimeout(() => {
        onAddNotification(preset.notif);
      }, index * 450);
    });
  };

  const toggleSound = () => {
    soundManager.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      soundManager.unlock();
      soundManager.playAlert();
    }
  };

  const handleToneChange = (tone: AlertTone) => {
    setSelectedTone(tone);
    soundManager.currentTone = tone;
    soundManager.unlock();
    soundManager.playAlert(tone);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundManager.volume = newVol / 100;
  };

  const handleTestChime = () => {
    soundManager.unlock();
    soundManager.playAlert(selectedTone);
  };

  const handleWallpaperFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onCustomWallpaperUpload(reader.result);
          soundManager.playTapSound();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyWallpaperUrl = () => {
    if (customWallpaperInput.trim()) {
      onCustomWallpaperUpload(customWallpaperInput.trim());
      soundManager.playTapSound();
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-[#141419]/95 backdrop-blur-2xl border border-white/10 rounded-[32px] p-5 shadow-2xl flex flex-col gap-4 text-white">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
            <Bell size={18} />
          </div>
          <div>
            <h2 className="text-[16px] font-bold tracking-tight">iOS Notification Hub</h2>
            <p className="text-[11px] text-white/50">Auto-Thai Translate & Audio Station</p>
          </div>
        </div>

        {/* Global Action Toggles */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                : 'bg-white/5 border-white/10 text-white/40'
            }`}
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button
            onClick={onToggleFrameMode}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-colors"
            title={isFrameMode ? 'Switch to Fullscreen Phone' : 'Switch to iPhone 16 Pro Frame'}
          >
            {isFrameMode ? <Maximize2 size={16} /> : <Smartphone size={16} />}
          </button>

          <button
            onClick={onClearAll}
            className="p-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-colors"
            title="Clear All Notifications"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* SEPARATE ON-SCREEN NOTIFICATIONS MANAGER (Edit & Copy live here!) */}
      <div className="bg-black/35 border border-white/10 rounded-2xl p-3.5 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white/85 uppercase tracking-wider">
              On-Screen Notifications
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-400 font-bold">
              {notifications.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onAddNewNotification}
            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 shadow-sm"
          >
            <Plus size={12} strokeWidth={2.4} />
            <span>Add New</span>
          </button>
        </div>

        {/* List of active notifications on phone with separate Edit, Copy, and Delete */}
        <div className="flex flex-col gap-1.5 max-h-[175px] overflow-y-auto p-0.5 scrollbar-none">
          {notifications.length === 0 ? (
            <div className="py-4 text-center text-xs text-white/40">
              No notifications on screen. Click "Add New" or a preset below.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {notif.avatarUrl ? (
                    <img
                      src={notif.avatarUrl}
                      alt=""
                      className="w-7 h-7 rounded-[22%] object-cover flex-shrink-0 border border-white/15"
                    />
                  ) : (
                    <AppIcon appId={notif.appId} size={28} />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                        {notif.appName}
                      </span>
                      <span className="text-[9px] text-white/40">• {notif.time}</span>
                    </div>
                    <span className="text-[12px] font-semibold text-white truncate block">
                      {notif.sender}
                    </span>
                    <span className="text-[11px] text-white/60 truncate block max-w-[165px]">
                      {notif.message}
                    </span>
                  </div>
                </div>

                {/* Edit, Copy, and Delete buttons in separate dock */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => onEditNotification(notif)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-blue-600 hover:text-white text-white/70 transition-colors"
                    title="Edit Notification (Sender, Text, Avatar)"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDuplicateNotification(notif)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-emerald-600 hover:text-white text-white/70 transition-colors"
                    title="Duplicate / Copy Notification"
                  >
                    <Copy size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteNotification(notif.id)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-red-600 hover:text-white text-white/70 transition-colors"
                    title="Delete Notification"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SEPARATE FULL CONVERSATION AUTOMATION STUDIO */}
      <div className="bg-gradient-to-b from-[#181822] to-[#121218] border border-blue-500/40 rounded-2xl p-4 flex flex-col gap-3 shadow-2xl relative overflow-hidden">
        {/* Glow badge */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-base">⚡</span>
            <div>
              <span className="text-xs font-bold text-white tracking-wide uppercase block">
                Full Conversation Automation
              </span>
              <span className="text-[10px] text-blue-300/80">
                Incoming Message ➜ 2.2s Pause ➜ Auto-Thai Reply
              </span>
            </div>
          </div>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-500/25 border border-blue-400/30 text-blue-300 uppercase tracking-wider">
            100% Automated
          </span>
        </div>

        {/* 1. Quick 1-Tap Conversation Presets */}
        <div>
          <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-1">
            Choose Conversation Scenario:
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {AUTO_CONVERSATION_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleApplyConversationPreset(preset)}
                className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all active:scale-95"
              >
                <span className="text-[11px] font-bold text-white block">{preset.label}</span>
                <span className="text-[9px] text-white/50 truncate block mt-0.5">
                  "{preset.incomingEn.slice(0, 22)}..."
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Step A: Incoming Automation Message */}
        <div className="bg-black/30 p-2.5 rounded-xl border border-white/10 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <span>Step 1: Incoming Message ({APP_METADATA[selectedApp].name})</span>
            </span>
            <span className="text-[9px] text-white/40">From: {sender}</span>
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              soundManager.playKeyboardClick();
            }}
            placeholder="Incoming message in English..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
          />
          {autoTranslateThai && thaiTranslation && (
            <div className="text-[11px] text-amber-200/90 font-medium px-1 flex items-center gap-1">
              <span className="text-[9px] text-amber-400 font-bold uppercase">🇹🇭 Thai:</span>
              <span className="truncate">{thaiTranslation}</span>
            </div>
          )}
        </div>

        {/* 3. Step B: Automated Thai Reply (Virtual Keyboard) */}
        <div className="bg-black/30 p-2.5 rounded-xl border border-white/10 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
              Step 2: Auto-Reply (Virtual Keyboard 🇹🇭)
            </span>
            {isReplyTranslating && (
              <span className="text-[9px] text-amber-400 font-bold animate-pulse">Translating...</span>
            )}
          </div>
          <input
            type="text"
            value={replyTextEnglish}
            onChange={(e) => {
              setReplyTextEnglish(e.target.value);
              soundManager.playKeyboardClick();
            }}
            placeholder="Type your reply in English (Auto Thai)..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
          />
          <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-400/20 text-xs text-blue-200 font-medium">
            <span className="text-[9px] font-bold text-blue-300 uppercase block mb-0.5">
              🇹🇭 Typed on iOS Virtual Keyboard:
            </span>
            <span>{replyTextThai || '...'}</span>
          </div>
        </div>

        {/* 4. Screen View Selector */}
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[11px] text-white/60 font-medium">Reply Screen:</span>
          <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                setReplyViewType('quick-reply');
                soundManager.playTapSound();
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                replyViewType === 'quick-reply'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Lock Screen Reply
            </button>
            <button
              type="button"
              onClick={() => {
                setReplyViewType('telegram-chat');
                soundManager.playTapSound();
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                replyViewType === 'telegram-chat'
                  ? 'bg-[#229ED9] text-white shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Telegram Chat App
            </button>
          </div>
        </div>

        {/* 5. MASTER LAUNCH BUTTONS */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/10">
          {/* In 10s Timer Button */}
          <button
            type="button"
            onClick={() => {
              if (typingCountdown !== null) {
                if (onCancelTypingSimulation) onCancelTypingSimulation();
              } else {
                handleTriggerFullAutomation(10);
              }
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-lg border ${
              typingCountdown !== null
                ? 'bg-amber-500/25 border-amber-400 text-amber-300 animate-pulse'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-blue-400/40 shadow-blue-600/30'
            }`}
            title="Starts complete automation after 10s so you can start recording or lock screen"
          >
            <Clock size={13} />
            <span>
              {typingCountdown !== null
                ? `Auto-Running in ${typingCountdown}s... (Cancel)`
                : '🎬 Run Full Automation (In 10s Timer)'}
            </span>
          </button>

          {/* Instant Launch Button */}
          <button
            type="button"
            disabled={typingCountdown !== null}
            onClick={() => handleTriggerFullAutomation(0)}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all"
            title="Runs full automation immediately"
          >
            <Play size={12} fill="white" />
            <span>Now</span>
          </button>
        </div>

        {/* Secondary: Reply Only Trigger */}
        <div className="flex items-center justify-between text-[10px] text-white/50 pt-1 border-t border-white/5">
          <span>Or test reply only on screen:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={typingCountdown !== null}
              onClick={() => handleTriggerTyping(0)}
              className="hover:text-blue-300 underline font-semibold"
            >
              Reply Now
            </button>
            <span>•</span>
            <button
              type="button"
              disabled={typingCountdown !== null}
              onClick={() => handleTriggerTyping(10)}
              className="hover:text-amber-300 underline font-semibold"
            >
              Reply in 10s
            </button>
          </div>
        </div>
      </div>

      {/* Audio Sound & Ringtones Station */}
      <div className="bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-500/20 rounded-2xl p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 size={14} />
            <span>Alert Sound</span>
          </span>
          <button
            onClick={handleTestChime}
            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
          >
            <Play size={11} fill="white" />
            <span>Test Sound</span>
          </button>
        </div>

        {/* Tone Selector */}
        <div className="grid grid-cols-5 gap-1.5">
          {(['tri-tone', 'chord', 'aurora', 'popcorn', 'note'] as AlertTone[]).map((tone) => (
            <button
              key={tone}
              type="button"
              onClick={() => handleToneChange(tone)}
              className={`py-1.5 rounded-xl border text-[11px] font-bold capitalize transition-all ${
                selectedTone === tone
                  ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {tone === 'tri-tone' ? 'Tri-Tone' : tone}
            </button>
          ))}
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-2 text-xs text-white/70">
          <span>Vol:</span>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="flex-1 accent-blue-500 cursor-pointer h-1.5"
          />
          <span className="text-[11px] font-semibold w-7 text-right">{volume}%</span>
        </div>
      </div>

      {/* Screen Elements Quick Editors */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders size={13} className="text-blue-400" />
          <span>Edit iPhone Elements</span>
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              soundManager.playTapSound();
              onOpenEditClock();
            }}
            className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white flex flex-col items-center gap-1 text-center transition-all active:scale-95"
          >
            <Clock size={15} className="text-amber-400" />
            <span>Clock & Date</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTapSound();
              onOpenEditStatusBar();
            }}
            className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white flex flex-col items-center gap-1 text-center transition-all active:scale-95"
          >
            <Smartphone size={15} className="text-emerald-400" />
            <span>Status Bar</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTapSound();
              onOpenEditWidgets();
            }}
            className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white flex flex-col items-center gap-1 text-center transition-all active:scale-95"
          >
            <Sparkles size={15} className="text-pink-400" />
            <span>Widgets</span>
          </button>
        </div>
      </div>

      {/* 1-Tap Quick Presets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-400" />
            <span>Instant Presets</span>
          </span>
          <button
            onClick={handleSpamBomb}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 transition-colors"
          >
            <Zap size={11} />
            <span>Stack Test (4x)</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {PRESET_NOTIFICATIONS.slice(0, 6).map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleTriggerPreset(preset)}
              className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 text-left text-xs font-medium text-white/90 truncate transition-all active:scale-98"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Notification Creator with Auto-Translate to Thai */}
      <div className="bg-black/30 border border-white/10 rounded-2xl p-3.5 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white/85 uppercase tracking-wider">
            Create Custom Notification
          </span>

          {/* Auto-Translate to Thai Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg text-[10px] font-bold text-amber-300 hover:bg-amber-500/25 transition-colors">
            <Languages size={12} />
            <span>Auto Thai (🇹🇭)</span>
            <input
              type="checkbox"
              checked={autoTranslateThai}
              onChange={(e) => {
                setAutoTranslateThai(e.target.checked);
                soundManager.playTapSound();
              }}
              className="rounded accent-amber-500"
            />
          </label>
        </div>

        {/* App Selector Pills (Telegram First!) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {(Object.keys(APP_METADATA) as AppId[]).map((app) => (
            <button
              key={app}
              type="button"
              onClick={() => handleAppChange(app)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedApp === app
                  ? app === 'telegram'
                    ? 'bg-[#229ED9] text-white shadow-md'
                    : 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {app === 'telegram' ? '✈️ TELEGRAM' : APP_METADATA[app].name}
            </button>
          ))}
        </div>

        {/* Profile Image Picker with 30 Realistic Avatars */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] text-white/60 font-medium">Profile Image</label>
            <button
              type="button"
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-bold"
            >
              {showAvatarPicker ? 'Hide Gallery ▴' : 'Choose from 30 Avatars ▾'}
            </button>
          </div>

          {/* Current Avatar Quick Banner */}
          <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-xl border border-white/10 mb-2">
            <img
              src={avatarUrl || BEST_AVATAR.url}
              alt="Avatar"
              className="w-8 h-8 rounded-[22%] object-cover border border-white/20 shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-semibold text-white truncate block">
                {sender || 'Selected User'}
              </span>
              <span className="text-[9px] text-white/50">
                {avatarUrl === BEST_AVATAR.url ? '⭐ #1 Best Profile Image (Ananya)' : 'Realistic Profile Avatar'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="text-[10px] px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg font-semibold text-white/80 transition-colors"
            >
              Change
            </button>
          </div>

          {/* Collapsible 30 Avatar Picker */}
          {showAvatarPicker && (
            <div className="mb-2 p-2 bg-black/40 rounded-2xl border border-white/10">
              <AvatarPicker
                selectedUrl={avatarUrl}
                onSelectAvatar={(url, suggestedName) => {
                  setAvatarUrl(url);
                  if (suggestedName) setSender(suggestedName);
                }}
              />
            </div>
          )}
        </div>

        {/* Sender Name */}
        <div>
          <label className="text-[11px] text-white/50 block mb-0.5">Sender Name / Title</label>
          <input
            type="text"
            value={sender}
            onChange={(e) => {
              setSender(e.target.value);
              soundManager.playKeyboardClick();
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
            placeholder="e.g. Ananya ✨, Telegram, Mom, Boss"
          />
        </div>

        {/* Message Content with Live Thai Translation */}
        <div>
          <div className="flex items-center justify-between mb-0.5">
            <label className="text-[11px] text-white/50">
              Message Body {autoTranslateThai ? '(Type in English → Auto Thai 🇹🇭)' : ''}
            </label>
            {isTranslating && (
              <span className="text-[10px] text-amber-400 font-bold animate-pulse">
                Translating to Thai...
              </span>
            )}
          </div>
          <textarea
            rows={2}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              soundManager.playKeyboardClick();
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500 resize-none"
            placeholder="Type message in English (automatically translates to Thai)..."
          />

          {/* Live Thai Translation Preview Box */}
          {autoTranslateThai && thaiTranslation && (
            <div className="mt-1.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-400 block">
                  🇹🇭 Thai Translation (Sent to Phone):
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
                title="Paste Thai text directly into message box"
              >
                Use Thai Text
              </button>
            </div>
          )}
        </div>

        {/* Optional Image Attachment */}
        <div>
          <label className="text-[11px] text-white/50 block mb-0.5">Photo Attachment URL (Optional)</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://... (attachment image)"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          />
        </div>

        {/* Send Buttons: Immediate & 10-Second Countdown Timer ("change 3 sec to 10 sec") */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => handleSendCustom(0)}
            className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 active:scale-98 transition-all flex items-center justify-center gap-1.5"
          >
            <Bell size={13} />
            <span>Send Now {autoTranslateThai ? '(In Thai 🇹🇭)' : ''}</span>
          </button>

          {/* 10-Second Countdown Button (Changed from 3s to 10s) */}
          <button
            onClick={() => handleSendCustom(10)}
            disabled={scheduledSeconds !== null}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold active:scale-98 transition-all flex items-center justify-center gap-1.5 ${
              scheduledSeconds !== null
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
                : 'bg-white/10 hover:bg-white/15 text-white border-white/10'
            }`}
            title="Sends notification after 10 seconds so you can prepare, lock screen, or record video"
          >
            <Clock size={13} />
            <span>{scheduledSeconds !== null ? `${scheduledSeconds}s...` : 'In 10s'}</span>
          </button>
        </div>
      </div>

      {/* Wallpaper Switcher & Custom Upload */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
            Lock Screen Wallpaper
          </span>
          <label className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer flex items-center gap-1">
            <Upload size={12} />
            <span>Upload Photo</span>
            <input type="file" accept="image/*" onChange={handleWallpaperFile} className="hidden" />
          </label>
        </div>

        <div className="grid grid-cols-6 gap-2 mb-2">
          {WALLPAPERS.map((wp) => (
            <button
              key={wp.id}
              onClick={() => onSelectWallpaper(wp)}
              className={`relative aspect-[9/16] rounded-xl overflow-hidden border transition-all ${
                currentWallpaper.id === wp.id
                  ? 'border-blue-500 ring-2 ring-blue-500/50 scale-105'
                  : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
              }`}
              title={wp.name}
            >
              <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Custom Wallpaper URL input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={customWallpaperInput}
            onChange={(e) => setCustomWallpaperInput(e.target.value)}
            placeholder="Or paste wallpaper image URL..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          />
          <button
            onClick={handleApplyWallpaperUrl}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
