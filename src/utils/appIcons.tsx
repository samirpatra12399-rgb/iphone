import React from 'react';
import { AppId } from '../types';

export const APP_METADATA: Record<AppId, { name: string; defaultSender: string; color: string }> = {
  telegram: { name: 'TELEGRAM', defaultSender: 'Ananya ✨', color: '#229ED9' },
  imessage: { name: 'MESSAGES', defaultSender: 'Samir', color: '#34C759' },
  whatsapp: { name: 'WHATSAPP', defaultSender: 'Rahul', color: '#25D366' },
  instagram: { name: 'INSTAGRAM', defaultSender: 'priya_verma', color: '#E1306C' },
  snapchat: { name: 'SNAPCHAT', defaultSender: 'Rohan', color: '#FFFC00' },
  twitter: { name: 'X', defaultSender: 'Elon Musk', color: '#000000' },
  mail: { name: 'MAIL', defaultSender: 'Google Security', color: '#007AFF' },
  calendar: { name: 'CALENDAR', defaultSender: 'Meeting', color: '#FF3B30' },
  uber: { name: 'UBER', defaultSender: 'Uber Ride', color: '#000000' },
  phone: { name: 'PHONE', defaultSender: 'Mom', color: '#34C759' },
  spotify: { name: 'SPOTIFY', defaultSender: 'Weekly Mix', color: '#1DB954' },
  slack: { name: 'SLACK', defaultSender: 'Engineering Team', color: '#4A154B' },
  custom: { name: 'APP', defaultSender: 'Notification', color: '#007AFF' },
};

export const AppIcon: React.FC<{ appId: AppId; size?: number; className?: string }> = ({
  appId,
  size = 38,
  className = '',
}) => {
  const currentDay = new Date().getDate();

  switch (appId) {
    case 'telegram':
      return (
        <div
          style={{ width: size, height: size }}
          className={`rounded-[22%] bg-gradient-to-b from-[#2AABEE] to-[#229ED9] flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0 ${className}`}
        >
          <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="none">
            <path
              d="M21.5 3.5L2.5 10.8C1.2 11.3 1.2 12.1 2.3 12.4L7.2 13.9L18.5 6.8C19 6.5 19.5 6.7 19.1 7.1L9.9 15.4H9.8L9.5 19.8C9.9 19.8 10.1 19.6 10.3 19.4L12.4 17.4L16.8 20.6C17.6 21.1 18.2 20.8 18.4 19.8L22.2 4.9C22.5 3.7 21.7 3.1 21.5 3.5Z"
              fill="white"
            />
          </svg>
        </div>
      );

    case 'imessage':
      return (
        <div
          style={{ width: size, height: size }}
          className={`rounded-[22%] bg-gradient-to-b from-[#4CD964] to-[#2ecc71] flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0 ${className}`}
        >
          <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
            <path
              d="M20 11.5C20 15.6421 16.4183 19 12 19C10.5905 19 9.26622 18.6622 8.11874 18.0673L4 19.5L5.43714 15.6562C4.54226 14.4447 4 13.0336 4 11.5C4 7.35786 7.58172 4 12 4C16.4183 4 20 7.35786 20 11.5Z"
              fill="white"
            />
          </svg>
        </div>
      );

    case 'whatsapp':
      return (
        <div
          style={{ width: size, height: size }}
          className={`rounded-[22%] bg-[#25D366] flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0 ${className}`}
        >
          <svg width={size * 0.64} height={size * 0.64} viewBox="0 0 24 24" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.48 2 2 6.48 2 12C2 13.85 2.5 15.58 3.39 17.07L2.05 22L7.09 20.68C8.54 21.52 10.22 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.5 15.2C16.3 15.7 15.2 16.2 14.7 16.3C14.3 16.4 13.7 16.4 12.1 15.7C10.1 14.8 8.8 12.8 8.7 12.6C8.6 12.5 7.9 11.5 7.9 10.5C7.9 9.5 8.4 9 8.6 8.8C8.8 8.6 9.1 8.5 9.3 8.5C9.4 8.5 9.5 8.5 9.6 8.5C9.8 8.5 9.9 8.6 10.1 8.9C10.3 9.4 10.8 10.5 10.8 10.6C10.9 10.7 10.9 10.9 10.8 11.1C10.7 11.3 10.6 11.4 10.5 11.6C10.3 11.8 10.2 11.9 10 12.1C9.8 12.3 9.7 12.4 9.9 12.7C10.1 13 10.8 14.1 11.8 15C13.1 16.1 14.1 16.5 14.5 16.7C14.8 16.8 15 16.8 15.2 16.6C15.4 16.3 15.9 15.7 16.1 15.4C16.3 15.1 16.5 15.2 16.7 15.3C17 15.4 18.2 16 18.4 16.1C18.6 16.2 18.8 16.3 18.8 16.4C18.8 16.5 18.8 17.1 18.6 17.6C18.3 18.2 17.2 18.7 16.7 18.8C16.3 18.9 15.7 18.9 14.1 18.2"
              fill="white"
            />
          </svg>
        </div>
      );

    case 'instagram':
      return (
        <div
          style={{ width: size, height: size }}
          className={`rounded-[22%] bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0 ${className}`}
        >
          <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </div>
      );

    case 'snapchat':
      return (
        <div
          style={{ width: size, height: size }}
          className={`rounded-[22%] bg-[#FFFC00] flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0 ${className}`}
        >
          <svg width={size * 0.66} height={size * 0.66} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3C8.69 3 6 5.69 6 9C6 11.21 7.21 13.13 9 14.16V15.5C8.33 15.75 7.5 16 6.5 16C5.5 16 4.75 16.5 4.5 17C4.25 17.5 5 18 6 18C7 18 8 17.5 9 17.5C10 17.5 10.5 18 12 18C13.5 18 14 17.5 15 17.5C16 17.5 17 18 18 18C19 18 19.75 17.5 19.5 17C19.25 16.5 18.5 16 17.5 16C16.5 16 15.67 15.75 15 15.5V14.16C16.79 13.13 18 11.21 18 9C18 5.69 15.31 3 12 3Z"
              fill="white"
              stroke="#000000"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'twitter':
      return (
        <div
          style={{ width: size, height: size }}
          className={`rounded-[22%] bg-black flex items-center justify-center shadow-sm overflow-hidden border border-white/10 flex-shrink-0 ${className}`}
        >
          <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="white">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
      );

    case 'mail':
      return (
        <div
          style={{ width: size, height: size }}
          className={`rounded-[22%] bg-gradient-to-b from-[#4fa5f5] to-[#007AFF] flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0 ${className}`}
        >
          <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="16" rx="2" fill="white" />
            <path d="M22 6L12 13L2 6" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );

    case 'calendar':
      return (
        <div
          style={{ width: size, height: size }}
          className={`rounded-[22%] bg-white flex flex-col items-center justify-between shadow-sm overflow-hidden border border-slate-200 flex-shrink-0 ${className}`}
        >
          <div className="w-full bg-[#FF3B30] text-[8px] font-bold text-white text-center py-[1px] tracking-tight">
            {new Date().toLocaleString('en-US', { weekday: 'short' }).toUpperCase()}
          </div>
          <div className="text-[17px] font-bold text-slate-800 leading-none pb-1">
            {currentDay}
          </div>
        </div>
      );

    case 'uber':
      return (
        <div
          style={{ width: size, height: size }}
          className={`rounded-[22%] bg-black flex items-center justify-center shadow-sm overflow-hidden border border-white/10 flex-shrink-0 ${className}`}
        >
          <span className="text-white font-extrabold text-[11px] tracking-tight">Uber</span>
        </div>
      );

    case 'phone':
      return (
        <div
          style={{ width: size, height: size }}
          className={`rounded-[22%] bg-gradient-to-b from-[#34C759] to-[#28a745] flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0 ${className}`}
        >
          <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="white">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
        </div>
      );

    case 'spotify':
      return (
        <div
          style={{ width: size, height: size }}
          className={`rounded-[22%] bg-[#121212] flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0 ${className}`}
        >
          <svg width={size * 0.64} height={size * 0.64} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#1DB954" />
            <path d="M7 9.5C10.5 8.5 14.5 9 17.5 10.8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M7.8 12.3C10.7 11.5 14 11.9 16.5 13.4" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M8.5 15C10.8 14.4 13.5 14.7 15.5 15.9" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'slack':
      return (
        <div
          style={{ width: size, height: size }}
          className={`rounded-[22%] bg-[#4A154B] flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0 ${className}`}
        >
          <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
            <path d="M5.5 10.5C4.67 10.5 4 9.83 4 9C4 8.17 4.67 7.5 5.5 7.5H7.5V10.5H5.5Z" fill="#36C5F0" />
            <path d="M9 4C9 4.83 8.33 5.5 7.5 5.5C6.67 5.5 6 4.83 6 4C6 3.17 6.67 2.5 7.5 2.5C8.33 2.5 9 3.17 9 4V4Z" fill="#36C5F0" />
            <path d="M10.5 5.5C10.5 4.67 9.83 4 9 4C8.17 4 7.5 4.67 7.5 5.5V7.5H10.5V5.5Z" fill="#2EB67D" />
            <path d="M15.5 9C15.5 9.83 14.83 10.5 14 10.5C13.17 10.5 12.5 9.83 12.5 9C12.5 8.17 13.17 7.5 14 7.5C14.83 7.5 15.5 8.17 15.5 9Z" fill="#ECB22E" />
            <path d="M14 13.5C14.83 13.5 15.5 14.17 15.5 15C15.5 15.83 14.83 16.5 14 16.5H12V13.5H14Z" fill="#E01E5A" />
          </svg>
        </div>
      );

    default:
      return (
        <div
          style={{ width: size, height: size }}
          className={`rounded-[22%] bg-slate-700 flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0 ${className}`}
        >
          <span className="text-white font-bold text-xs">iOS</span>
        </div>
      );
  }
};

