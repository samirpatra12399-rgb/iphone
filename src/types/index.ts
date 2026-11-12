export type AppId = 
  | 'telegram'
  | 'imessage' 
  | 'whatsapp' 
  | 'instagram' 
  | 'snapchat' 
  | 'twitter' 
  | 'mail' 
  | 'calendar' 
  | 'uber' 
  | 'phone' 
  | 'spotify' 
  | 'slack'
  | 'custom';

export type AlertTone = 'tri-tone' | 'chord' | 'aurora' | 'popcorn' | 'note';

export interface ProfileAvatar {
  id: string;
  name: string;
  url: string;
  category: 'best' | 'female' | 'male' | 'aesthetic';
  isBest?: boolean;
}

export interface NotificationItem {
  id: string;
  appId: AppId;
  appName: string;
  sender: string;
  title?: string;
  message: string;
  time: string;
  timestamp: number;
  avatarUrl?: string;
  imageAttachment?: string;
  isRead?: boolean;
  unread?: boolean;
}

export interface StatusBarConfig {
  carrierName: string;
  batteryLevel: number;
  isCharging: boolean;
  signalBars: number; // 1 to 4
  networkType: '5G' | 'LTE' | '4G' | 'Wi-Fi';
  showWifi: boolean;
}

export interface ClockConfig {
  mode: 'live' | 'custom';
  customTime: string;
  customDate: string;
  fontStyle: 'sf-bold' | 'sf-medium' | 'sf-rounded' | 'serif' | 'mono';
  color: string;
  size: 'normal' | 'large' | 'compact';
}

export interface WidgetsConfig {
  weatherCity: string;
  weatherTemp: string;
  weatherIcon: 'sun' | 'cloud' | 'rain' | 'snow';
  activityCalories: string;
  batteryDeviceName: string;
  batteryDeviceLevel: string;
}

export interface Wallpaper {
  id: string;
  name: string;
  url: string;
  clockColor: string;
  clockFont?: string;
  isDark: boolean;
}
