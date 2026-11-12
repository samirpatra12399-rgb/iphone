import React, { useState, useRef } from 'react';
import { IPhoneShell } from './components/IPhoneShell';
import { StatusBar } from './components/StatusBar';
import { DynamicIsland } from './components/DynamicIsland';
import { LockScreenClock } from './components/LockScreenClock';
import { NotificationStack } from './components/NotificationStack';
import { LockScreenFooter } from './components/LockScreenFooter';
import { ControlPanel } from './components/ControlPanel';
import { EditModal, EditModalType } from './components/EditModal';
import { QuickReplyModal } from './components/QuickReplyModal';
import { TelegramChatView } from './components/TelegramChatView';
import {
  NotificationItem,
  Wallpaper,
  StatusBarConfig,
  ClockConfig,
  WidgetsConfig,
} from './types';
import { INITIAL_NOTIFICATIONS } from './utils/sampleData';
import { WALLPAPERS } from './utils/wallpapers';
import { BEST_AVATAR } from './utils/avatars';
import { soundManager } from './utils/audio';
import { SlidersHorizontal } from 'lucide-react';

export const App: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeIslandNotif, setActiveIslandNotif] = useState<NotificationItem | null>(null);
  const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper>(WALLPAPERS[0]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  // Default to edge-to-edge on mobile screens (< 1024px), frame mockup on desktop
  const [isFrameMode, setIsFrameMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [hideMobileTrigger, setHideMobileTrigger] = useState(false);

  // Virtual Keyboard & Thai Reply Simulation State (Controlled SEPARATELY)
  const [activeReplyView, setActiveReplyView] = useState<'quick-reply' | 'telegram-chat' | null>(null);
  const [replyTargetNotif, setReplyTargetNotif] = useState<NotificationItem | null>(null);
  const [replyDisplayText, setReplyDisplayText] = useState('');
  const [activeKeyChar, setActiveKeyChar] = useState<string | null>(null);
  const [keyboardLang, setKeyboardLang] = useState<'th' | 'en'>('th');
  const [sentReplies, setSentReplies] = useState<string[]>([]);
  const [typingCountdown, setTypingCountdown] = useState<number | null>(null);

  const simulationCancelRef = useRef(false);

  // Master End-to-End Conversation Automation (Incoming Message -> Realistic Pause -> Automated Thai Reply)
  const handleRunFullConversationAutomation = async (params: {
    incomingData: Omit<NotificationItem, 'id' | 'timestamp'>;
    replyThaiText: string;
    viewType: 'quick-reply' | 'telegram-chat';
    countdownDelay: number;
    readingDelaySeconds?: number;
  }) => {
    simulationCancelRef.current = false;
    soundManager.unlock();

    // Step 1: Initial Countdown (e.g. 10s for screen recording prep)
    if (params.countdownDelay > 0) {
      soundManager.playTapSound();
      setTypingCountdown(params.countdownDelay);
      let rem = params.countdownDelay;
      await new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          rem -= 1;
          setTypingCountdown(rem);
          if (rem <= 0 || simulationCancelRef.current) {
            clearInterval(interval);
            setTypingCountdown(null);
            resolve();
          }
        }, 1000);
      });
    }

    if (simulationCancelRef.current) return;

    // Step 2: Automation Incoming Message Arrives
    const newNotif: NotificationItem = {
      ...params.incomingData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
      unread: true,
      time: 'now',
    };

    soundManager.playAlert();
    setActiveIslandNotif(newNotif);
    setNotifications((prev) => [newNotif, ...prev]);

    // Step 3: Natural Pause (so user sees incoming notification, ~2.2s)
    const pauseMs = (params.readingDelaySeconds ?? 2.2) * 1000;
    await new Promise((r) => setTimeout(r, pauseMs));

    if (simulationCancelRef.current) return;

    // Step 4: Automated Thai Reply on Virtual Keyboard
    await executeTypingSimulation(newNotif, params.replyThaiText, params.viewType);
  };

  // Trigger typing simulation from separate Control Panel (with instant or 10s timer)
  const handleStartTypingSimulation = (
    targetNotif: NotificationItem,
    thaiText: string,
    viewType: 'quick-reply' | 'telegram-chat',
    delaySeconds: number = 0
  ) => {
    simulationCancelRef.current = false;
    soundManager.unlock();

    if (delaySeconds > 0) {
      soundManager.playTapSound();
      setTypingCountdown(delaySeconds);
      let rem = delaySeconds;
      const interval = setInterval(() => {
        rem -= 1;
        setTypingCountdown(rem);
        if (rem <= 0 || simulationCancelRef.current) {
          clearInterval(interval);
          setTypingCountdown(null);
          if (!simulationCancelRef.current) {
            executeTypingSimulation(targetNotif, thaiText, viewType);
          }
        }
      }, 1000);
    } else {
      executeTypingSimulation(targetNotif, thaiText, viewType);
    }
  };

  const handleCancelTypingSimulation = () => {
    simulationCancelRef.current = true;
    setTypingCountdown(null);
    setActiveReplyView(null);
    setReplyDisplayText('');
    setActiveKeyChar(null);
  };

  const executeTypingSimulation = async (
    targetNotif: NotificationItem,
    thaiText: string,
    viewType: 'quick-reply' | 'telegram-chat'
  ) => {
    setReplyTargetNotif(targetNotif);
    setActiveReplyView(viewType);
    setReplyDisplayText('');
    setKeyboardLang('th');

    // Wait 350ms for view slide in
    await new Promise((r) => setTimeout(r, 350));

    // Type character by character with authentic speed & iOS audio clicks
    for (let i = 0; i < thaiText.length; i++) {
      if (simulationCancelRef.current) break;
      const char = thaiText[i];
      setActiveKeyChar(char);
      soundManager.playKeyboardClick();
      setReplyDisplayText((prev) => prev + char);

      // 65ms - 130ms human timing variance
      const delay = Math.floor(Math.random() * 65) + 65;
      await new Promise((r) => setTimeout(r, delay));
      setActiveKeyChar(null);
    }

    if (simulationCancelRef.current) return;

    // Pause briefly then tap send
    await new Promise((r) => setTimeout(r, 400));
    setActiveKeyChar('ENTER');
    soundManager.playMessageSentSound();
    await new Promise((r) => setTimeout(r, 200));
    setActiveKeyChar(null);

    // Save sent reply
    setSentReplies((prev) => [...prev, thaiText]);
    const replyItem: NotificationItem = {
      id: `reply-${Date.now()}`,
      appId: targetNotif.appId,
      appName: targetNotif.appName,
      sender: `You (To ${targetNotif.sender})`,
      message: `💬 ${thaiText}`,
      time: 'now',
      timestamp: Date.now(),
      unread: false,
    };
    setNotifications((prev) => [replyItem, ...prev]);

    // Close view smoothly
    setTimeout(() => {
      if (!simulationCancelRef.current) {
        setActiveReplyView(null);
        setReplyDisplayText('');
      }
    }, 1100);
  };

  // Interactive virtual keyboard handlers (if tapped on screen)
  const handleVirtualKeyTap = (char: string) => {
    setReplyDisplayText((prev) => prev + char);
    setActiveKeyChar(char);
    setTimeout(() => setActiveKeyChar(null), 100);
  };
  const handleVirtualBackspace = () => {
    setReplyDisplayText((prev) => prev.slice(0, -1));
  };
  const handleVirtualSpace = () => {
    setReplyDisplayText((prev) => prev + ' ');
    setActiveKeyChar(' ');
    setTimeout(() => setActiveKeyChar(null), 100);
  };
  const handleVirtualSend = () => {
    if (!replyDisplayText.trim() || !replyTargetNotif) return;
    soundManager.playMessageSentSound();
    setSentReplies((prev) => [...prev, replyDisplayText]);
    const replyItem: NotificationItem = {
      id: `reply-${Date.now()}`,
      appId: replyTargetNotif.appId,
      appName: replyTargetNotif.appName,
      sender: `You (To ${replyTargetNotif.sender})`,
      message: `💬 ${replyDisplayText}`,
      time: 'now',
      timestamp: Date.now(),
      unread: false,
    };
    setNotifications((prev) => [replyItem, ...prev]);
    setTimeout(() => {
      setActiveReplyView(null);
      setReplyDisplayText('');
    }, 800);
  };

  // Status Bar State ("everything can be edit")
  const [statusBarConfig, setStatusBarConfig] = useState<StatusBarConfig>({
    carrierName: 'Jio 5G',
    batteryLevel: 88,
    isCharging: false,
    signalBars: 4,
    networkType: '5G',
    showWifi: true,
  });

  // Clock State ("everything can be edit")
  const [clockConfig, setClockConfig] = useState<ClockConfig>({
    mode: 'live',
    customTime: '09:41',
    customDate: 'Thursday, 12 November',
    fontStyle: 'sf-bold',
    color: '#ffffff',
    size: 'normal',
  });

  // Widgets State ("everything can be edit")
  const [widgetsConfig, setWidgetsConfig] = useState<WidgetsConfig>({
    weatherCity: 'Sunny',
    weatherTemp: '27°',
    weatherIcon: 'sun',
    activityCalories: '520 / 600 kcal',
    batteryDeviceName: 'AirPods Pro',
    batteryDeviceLevel: '88%',
  });

  // Active Edit Modal State
  const [editModal, setEditModal] = useState<EditModalType | null>(null);

  // Add Notification with Sound ("and also comes sound")
  const handleAddNotification = (newNotifData: Omit<NotificationItem, 'id' | 'timestamp'>) => {
    const newNotif: NotificationItem = {
      ...newNotifData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
      unread: true,
    };

    // Unlock and play authentic iOS alert sound
    soundManager.unlock();
    soundManager.playAlert();
    setActiveIslandNotif(newNotif);

    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleDuplicateNotification = (notif: NotificationItem) => {
    const clone: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      time: 'now',
      timestamp: Date.now(),
    };
    soundManager.playAlert();
    setNotifications((prev) => [clone, ...prev]);
  };

  const handleSaveNotification = (updated: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === updated.id ? updated : n))
    );
  };

  const handleDeleteNotification = (id: string) => {
    soundManager.playTrashSound();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    soundManager.playTrashSound();
    setNotifications([]);
  };

  const handleSelectWallpaper = (wp: Wallpaper) => {
    soundManager.playTapSound();
    setCurrentWallpaper(wp);
    setClockConfig((prev) => ({ ...prev, color: wp.clockColor }));
  };

  const handleCustomWallpaperUpload = (url: string) => {
    const customWp: Wallpaper = {
      id: `custom-${Date.now()}`,
      name: 'Custom Wallpaper',
      url,
      clockColor: '#ffffff',
      isDark: true,
    };
    setCurrentWallpaper(customWp);
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-white flex flex-col items-center justify-center relative overflow-x-hidden font-sf selection:bg-blue-500 selection:text-white">
      {/* Background Ambience / Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Main Layout Container */}
      <div
        className={
          isFrameMode
            ? "w-full max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-6 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 relative z-10"
            : "w-full h-full min-h-[100dvh] flex flex-col items-center justify-center relative z-10 p-0"
        }
      >
        {/* iPhone 16 Pro Device Mockup or Edge-to-Edge Screen */}
        <div className={isFrameMode ? "flex-shrink-0 relative max-w-full" : "w-full h-[100dvh] max-w-md mx-auto relative"}>
          <IPhoneShell wallpaperUrl={currentWallpaper.url} isFrameMode={isFrameMode}>
            {/* Top Status Bar (Click to edit) */}
            <StatusBar
              config={statusBarConfig}
              color={clockConfig.color}
              onEditClick={() => setEditModal({ type: 'statusbar', data: statusBarConfig })}
            />

            {/* Dynamic Island cutout with live notifications */}
            <DynamicIsland
              activeNotification={activeIslandNotif}
              onDismissNotification={() => setActiveIslandNotif(null)}
            />

            {/* Lock Screen Clock & Widgets (Click to edit) */}
            <LockScreenClock
              clockConfig={clockConfig}
              widgetsConfig={widgetsConfig}
              isUnlocked={isUnlocked}
              onToggleUnlock={() => setIsUnlocked(!isUnlocked)}
              onEditClockClick={() => setEditModal({ type: 'clock', data: clockConfig })}
              onEditWidgetsClick={() => setEditModal({ type: 'widgets', data: widgetsConfig })}
            />

            {/* Scrollable Notification Center (100% Authentic iOS Appearance: Clean & Pristine) */}
            <div className="flex-1 w-full overflow-y-auto mt-4 px-1 scrollbar-none">
              <NotificationStack
                notifications={notifications}
                onDismiss={handleDismissNotification}
                onClearAll={handleClearAll}
              />
            </div>

            {/* Lock Screen Bottom Controls (Flashlight & Camera) */}
            <LockScreenFooter />

            {/* Real iOS Virtual Keyboard Quick Reply (100% Genuine iOS, Zero Developer Buttons) */}
            {activeReplyView === 'quick-reply' && replyTargetNotif && (
              <QuickReplyModal
                notification={replyTargetNotif}
                displayText={replyDisplayText}
                activeKeyChar={activeKeyChar}
                keyboardLang={keyboardLang}
                onToggleLang={() => setKeyboardLang((l) => (l === 'th' ? 'en' : 'th'))}
                onKeyTap={handleVirtualKeyTap}
                onBackspace={handleVirtualBackspace}
                onSpace={handleVirtualSpace}
                onSend={handleVirtualSend}
                onClose={() => {
                  simulationCancelRef.current = true;
                  setActiveReplyView(null);
                }}
              />
            )}

            {/* Full Telegram Chat App Screen with Real Virtual Keyboard */}
            {activeReplyView === 'telegram-chat' && replyTargetNotif && (
              <TelegramChatView
                notification={replyTargetNotif}
                displayText={replyDisplayText}
                activeKeyChar={activeKeyChar}
                keyboardLang={keyboardLang}
                sentReplies={sentReplies}
                onToggleLang={() => setKeyboardLang((l) => (l === 'th' ? 'en' : 'th'))}
                onKeyTap={handleVirtualKeyTap}
                onBackspace={handleVirtualBackspace}
                onSpace={handleVirtualSpace}
                onSend={handleVirtualSend}
                onClose={() => {
                  simulationCancelRef.current = true;
                  setActiveReplyView(null);
                }}
              />
            )}
          </IPhoneShell>
        </div>

        {/* Floating Simulator Controls Dock (Desktop) - Edit & Duplicate Live Here! */}
        <div className="hidden lg:block w-full max-w-[440px] flex-shrink-0">
          <ControlPanel
            notifications={notifications}
            onAddNotification={handleAddNotification}
            onEditNotification={(notif) => setEditModal({ type: 'notification', data: notif })}
            onDuplicateNotification={handleDuplicateNotification}
            onDeleteNotification={handleDeleteNotification}
            typingCountdown={typingCountdown}
            onStartTypingSimulation={handleStartTypingSimulation}
            onCancelTypingSimulation={handleCancelTypingSimulation}
            onRunFullAutomation={handleRunFullConversationAutomation}
            onAddNewNotification={() =>
              setEditModal({
                type: 'notification',
                data: {
                  id: `notif-${Date.now()}`,
                  appId: 'telegram',
                  appName: 'TELEGRAM',
                  sender: 'Ananya ✨',
                  message: 'Hey! Sent you a message on Telegram ✈️',
                  time: 'now',
                  timestamp: Date.now(),
                  avatarUrl: BEST_AVATAR.url,
                  unread: true,
                },
              })
            }
            onClearAll={handleClearAll}
            currentWallpaper={currentWallpaper}
            onSelectWallpaper={handleSelectWallpaper}
            onCustomWallpaperUpload={handleCustomWallpaperUpload}
            isFrameMode={isFrameMode}
            onToggleFrameMode={() => setIsFrameMode(!isFrameMode)}
            onOpenEditClock={() => setEditModal({ type: 'clock', data: clockConfig })}
            onOpenEditStatusBar={() => setEditModal({ type: 'statusbar', data: statusBarConfig })}
            onOpenEditWidgets={() => setEditModal({ type: 'widgets', data: widgetsConfig })}
          />
        </div>
      </div>

      {/* Universal Edit Modal (For notifications, clock, statusbar, widgets) */}
      <EditModal
        modal={editModal}
        onClose={() => setEditModal(null)}
        onSaveNotification={handleSaveNotification}
        onDeleteNotification={handleDeleteNotification}
        onSaveClock={(cfg) => setClockConfig(cfg)}
        onSaveStatusBar={(cfg) => setStatusBarConfig(cfg)}
        onSaveWidgets={(cfg) => setWidgetsConfig(cfg)}
      />

      {/* Mobile Floating Drawer Trigger (iOS AssistiveTouch Style) */}
      {!hideMobileTrigger ? (
        <div className="lg:hidden fixed bottom-6 right-5 z-40 flex items-center gap-2">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="w-13 h-13 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-xl text-white flex items-center justify-center shadow-2xl border border-white/20 active:scale-95 transition-all"
            title="Open Control Panel"
          >
            <SlidersHorizontal size={20} className="text-white/90" />
          </button>
        </div>
      ) : (
        /* Discreet unhide trigger tab at top center of screen when hidden for screenshot */
        <button
          onClick={() => setHideMobileTrigger(false)}
          className="lg:hidden fixed top-1 left-1/2 -translate-x-1/2 z-50 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[10px] text-white/60 font-medium active:scale-95"
        >
          Show Controls
        </button>
      )}

      {/* Mobile Control Sheet Modal */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center p-2 sm:p-4">
          <div className="w-full max-w-md max-h-[88vh] overflow-y-auto rounded-[32px] bg-[#141419] p-3 relative shadow-2xl border border-white/15">
            {/* Top Sheet Header Bar */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
              <button
                type="button"
                onClick={() => setIsFrameMode(!isFrameMode)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white/90 transition-all"
              >
                📱 Mode: {isFrameMode ? 'Titanium Frame' : 'Fullscreen Phone'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setHideMobileTrigger(true);
                    setMobileDrawerOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-amber-300"
                  title="Hide floating button so you can screen record or screenshot"
                >
                  Hide for Screenshot
                </button>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="px-3 py-1 bg-white/15 hover:bg-white/25 rounded-full text-xs font-bold text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            <ControlPanel
              notifications={notifications}
              onAddNotification={(notif) => {
                handleAddNotification(notif);
                setMobileDrawerOpen(false);
              }}
              onEditNotification={(notif) => {
                setMobileDrawerOpen(false);
                setEditModal({ type: 'notification', data: notif });
              }}
              onDuplicateNotification={handleDuplicateNotification}
              onDeleteNotification={handleDeleteNotification}
              typingCountdown={typingCountdown}
              onStartTypingSimulation={(target, thai, view, delay) => {
                handleStartTypingSimulation(target, thai, view, delay);
                setMobileDrawerOpen(false);
              }}
              onRunFullAutomation={(params) => {
                handleRunFullConversationAutomation(params);
                setMobileDrawerOpen(false);
              }}
              onCancelTypingSimulation={handleCancelTypingSimulation}
              onAddNewNotification={() => {
                setMobileDrawerOpen(false);
                setEditModal({
                  type: 'notification',
                  data: {
                    id: `notif-${Date.now()}`,
                    appId: 'telegram',
                    appName: 'TELEGRAM',
                    sender: 'Ananya ✨',
                    message: 'Hey! Sent you a message on Telegram ✈️',
                    time: 'now',
                    timestamp: Date.now(),
                    avatarUrl: BEST_AVATAR.url,
                    unread: true,
                  },
                });
              }}
              onClearAll={handleClearAll}
              currentWallpaper={currentWallpaper}
              onSelectWallpaper={handleSelectWallpaper}
              onCustomWallpaperUpload={handleCustomWallpaperUpload}
              isFrameMode={isFrameMode}
              onToggleFrameMode={() => setIsFrameMode(!isFrameMode)}
              onOpenEditClock={() => {
                setMobileDrawerOpen(false);
                setEditModal({ type: 'clock', data: clockConfig });
              }}
              onOpenEditStatusBar={() => {
                setMobileDrawerOpen(false);
                setEditModal({ type: 'statusbar', data: statusBarConfig });
              }}
              onOpenEditWidgets={() => {
                setMobileDrawerOpen(false);
                setEditModal({ type: 'widgets', data: widgetsConfig });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
