import { NotificationItem } from '../types';
import { BEST_AVATAR, REALISTIC_AVATARS } from './avatars';

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    appId: 'telegram',
    appName: 'TELEGRAM',
    sender: 'Ananya ✨',
    message: 'Hey! Sent the project files and high-res video on Telegram 📂 Check them out when you are free!',
    time: 'now',
    timestamp: Date.now(),
    avatarUrl: BEST_AVATAR.url, // #1 Featured Best Avatar!
    unread: true,
  },
  {
    id: 'notif-2',
    appId: 'telegram',
    appName: 'TELEGRAM',
    sender: 'Tech Pioneers 🚀 (12.4k)',
    message: 'Pavel Durov: Telegram 11.2 is officially live with ultra-fast P2P calls and HD video streaming.',
    time: '3m ago',
    timestamp: Date.now() - 180000,
    avatarUrl: REALISTIC_AVATARS[11].url, // Tech Lead
    unread: true,
  },
  {
    id: 'notif-3',
    appId: 'whatsapp',
    appName: 'WHATSAPP',
    sender: 'Aarav Patel',
    message: 'Bhai Goa tickets book ho gayi! Transfer 4,500 asap 🏖️',
    time: '8m ago',
    timestamp: Date.now() - 480000,
    avatarUrl: REALISTIC_AVATARS[1].url,
    unread: true,
  },
  {
    id: 'notif-4',
    appId: 'instagram',
    appName: 'INSTAGRAM',
    sender: 'priya_verma',
    message: 'liked your story and sent a message: "Where was this clicked? Looks cinematic! 📸"',
    time: '14m ago',
    timestamp: Date.now() - 840000,
    avatarUrl: REALISTIC_AVATARS[2].url,
    unread: false,
  },
];

export const PRESET_NOTIFICATIONS: { label: string; notif: Omit<NotificationItem, 'id' | 'timestamp'> }[] = [
  {
    label: '✈️ Telegram: Voice Note',
    notif: {
      appId: 'telegram',
      appName: 'TELEGRAM',
      sender: 'Ananya ✨',
      message: '🎙️ Voice message (0:42) • "Listen to this preview when you get a minute!"',
      avatarUrl: BEST_AVATAR.url,
      time: 'now',
    },
  },
  {
    label: '📂 Telegram: File Received',
    notif: {
      appId: 'telegram',
      appName: 'TELEGRAM',
      sender: 'Design Team 🎨',
      message: '📁 final_assets_v4.zip (48.2 MB) was sent by Vikram',
      avatarUrl: REALISTIC_AVATARS[5].url,
      time: 'now',
    },
  },
  {
    label: '💚 WhatsApp: Party Plan',
    notif: {
      appId: 'whatsapp',
      appName: 'WHATSAPP',
      sender: 'Engineering Squad ⚡',
      message: 'Samir bhai party kab de raha hai? Placement celebration pending hai!',
      avatarUrl: REALISTIC_AVATARS[3].url,
      time: 'now',
    },
  },
  {
    label: '📸 Instagram: Celebrity Follow',
    notif: {
      appId: 'instagram',
      appName: 'INSTAGRAM',
      sender: 'virat.kohli',
      message: 'started following you. Tap to view their profile.',
      time: 'now',
    },
  },
  {
    label: '💳 Bank: Salary Credited',
    notif: {
      appId: 'mail',
      appName: 'HDFC BANK',
      sender: 'Salary Alerts',
      message: 'INR 1,25,000.00 credited to A/C **4120 on 12-NOV-26 by TECH CORP LTD.',
      time: 'now',
    },
  },
  {
    label: '🚗 Uber: Driver Arrived',
    notif: {
      appId: 'uber',
      appName: 'UBER',
      sender: 'Driver Arrived',
      message: 'Suresh is waiting outside in a Silver Nexon (HR 26 DQ 1024). PIN: 4821',
      avatarUrl: REALISTIC_AVATARS[15].url,
      time: 'now',
    },
  },
  {
    label: '🎵 Spotify: New Release',
    notif: {
      appId: 'spotify',
      appName: 'SPOTIFY',
      sender: 'Release Radar',
      message: 'Arijit Singh & Pritam released a new track "O Maahi (Acoustic)". Listen now.',
      time: 'now',
    },
  },
  {
    label: '💼 Slack: Urgent Review',
    notif: {
      appId: 'slack',
      appName: 'SLACK',
      sender: 'Sarah (Lead Engineer)',
      message: 'PR #142 passed all CI checks! Can you review before staging deployment?',
      avatarUrl: REALISTIC_AVATARS[16].url,
      time: 'now',
    },
  },
];
